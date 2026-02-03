import puppeteer from "puppeteer";
import { db } from "./db";
import { leads, locations } from "./schema";
import { eq } from "drizzle-orm";

interface Location {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  searchTerm: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<{ city: string | null, state: string | null, country: string | null, district: string | null, postcode: string | null }> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: {
        'User-Agent': 'KreataleScraper/1.0 (contact@kreatale.com)',
        'Accept-Language': 'id,en;q=0.9'
      }
    });
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    const addr = data.address;
    
    // In Indonesia, cities can be 'city', 'town', or 'municipality'
    // State is 'state' or 'region'
    // District is 'suburb', 'city_district', or 'village'
    return {
      city: addr.city || addr.town || addr.municipality || addr.county || null,
      state: addr.state || addr.region || null,
      country: addr.country || "Indonesia",
      district: addr.suburb || addr.village || addr.neighbourhood || addr.city_district || null,
      postcode: addr.postcode || null
    };
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return { city: null, state: null, country: "Indonesia", district: null, postcode: null };
  }
}

export async function scrapeCategoryInLocation(
  location: Location,
  category: Category,
  coordinates?: { lat: number; lng: number; zoom: number }
) {
  const browser = await puppeteer.launch({
    headless: true, // Set to false for debugging
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.setViewport({ width: 1920, height: 1080 });

  let searchUrl;
  if (coordinates) {
    // Zoom level maps to "z" parameter: 15z is roughly neighborhood level
    const zoomLevel = coordinates.zoom || 15;
    searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(category.searchTerm)}/@${coordinates.lat},${coordinates.lng},${zoomLevel}z`;
  } else {
    const query = `${category.searchTerm} in ${location.name}`;
    searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  }

  try {
    console.log(`Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // Handle cookie consent if present
    try {
      const consentButton = await page.$('button[aria-label="Accept all"]');
      if (consentButton) {
        await consentButton.click();
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      // No consent dialog
    }

    // Wait for results feed
    console.log("Waiting for results...");
    await page.waitForSelector("div[role='feed']", { timeout: 30000 });

    // Scroll to load more results
    await autoScroll(page);

    // Parse results from list view
    console.log("Parsing results...");
    const results = await page.evaluate(() => {
      // Target the article elements which contain all the business info
      const articles = document.querySelectorAll('div[role="article"]');
      
      const data: {
        businessName: string;
        rating: string | null;
        reviewCount: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        googleMapsUrl: string | null;
      }[] = [];

      articles.forEach((article) => {
        const ariaLabel = article.getAttribute("aria-label");
        if (!ariaLabel) return;

        // Get the link
        const link = article.querySelector('a.hfpxzc');
        const href = link?.getAttribute("href") || null;

        // Rating - in span with class MW4etd
        const ratingEl = article.querySelector('.MW4etd');
        const rating = ratingEl?.textContent?.trim() || null;

        // Review count - in span with class UY7F9 (contains "(53)")
        const reviewEl = article.querySelector('.UY7F9');
        const reviewText = reviewEl?.textContent?.trim() || "";
        const reviewMatch = reviewText.match(/\((\d+(?:,\d+)*)\)/);
        const reviewCount = reviewMatch ? reviewMatch[1].replace(/,/g, "") : null;

        // Phone - in span with class UsdlK
        const phoneEl = article.querySelector('.UsdlK');
        const phone = phoneEl?.textContent?.trim() || null;

        // Website - in a tag with aria-label containing "website"
        const websiteEl = article.querySelector('a[aria-label*="website"]');
        const website = websiteEl?.getAttribute("href") || null;

        // Address - look for text with street indicators or commas
        const textContent = (article as HTMLElement).innerText;
        const lines = textContent.split('\n').filter(l => l.trim());
        // Address usually contains "Jl." or street-like patterns
        let addressLine = lines.find(l => 
          (l.includes('Jl.') || l.includes('St.') || l.includes('Road') || 
           l.includes('RT.') || l.includes('Ave') || l.includes('Street')) &&
          !l.includes('Open') && !l.includes('Closes')
        ) || null;

        if (addressLine && addressLine.includes('·')) {
            addressLine = addressLine.split('·').pop()?.trim() || addressLine;
        }

        data.push({
          businessName: ariaLabel,
          rating,
          reviewCount,
          phone,
          website,
          address: addressLine,
          googleMapsUrl: href,
        });
      });

      return data;
    });

    console.log(`Found ${results.length} results`);

    // Log first result for debugging
    if (results.length > 0) {
      console.log("Sample result:", JSON.stringify(results[0], null, 2));
    }


    // Determine Location ID
    let targetLocationId = location.id;

    if (location.id === "custom_map" && coordinates) {
       console.log("Determining location from Coordinates (Nominatim Reverse Geocode)...");
       
       try {
           const geoData = await reverseGeocode(coordinates.lat, coordinates.lng);
           
           if (geoData.city) {
              const slug = geoData.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              
              const [existing] = await db.select().from(locations).where(eq(locations.slug, slug));
              
              if (existing) {
                targetLocationId = existing.id;
                if (!existing.state && geoData.state) {
                   await db.update(locations).set({ state: geoData.state }).where(eq(locations.id, existing.id));
                }
                console.log(`Using existing location: ${existing.name}`);
              } else {
                const [newLoc] = await db.insert(locations).values({
                  name: geoData.city,
                  slug: slug,
                  country: geoData.country || "Indonesia",
                  state: geoData.state
                }).returning();
                targetLocationId = newLoc.id;
                console.log(`Created new location: ${newLoc.name}`);
              }
           } else {
              console.log("Could not resolve city from reverse geocoding.");
              // Fallback to name-based if impossible
              targetLocationId = null as any;
           }

       } catch (err) {
           console.error("Error determining location:", err);
       }
    }

    // Resolve location details for ALL leads in this scrape if coordinates provided
    let globalGeoData = coordinates ? await reverseGeocode(coordinates.lat, coordinates.lng) : null;

    // Save to DB
    let savedCount = 0;
    for (const result of results) {
      if (!result.businessName || result.businessName.length < 2) continue;

      // Extract details for Lead - Fallback parsing if we don't have globalGeoData
      let leadCity = globalGeoData?.city || null;
      let leadState = globalGeoData?.state || null;
      let leadDistrict = globalGeoData?.district || null;
      let leadPostal = globalGeoData?.postcode || null;
      let leadCountry = globalGeoData?.country || "Indonesia";

      if (result.address && !globalGeoData) {
         const parts = result.address.split(",").map(p => p.trim());
         for (const p of parts) {
            if (p.toLowerCase() === "indonesia") leadCountry = "Indonesia";
            if (/^\d{5}$/.test(p)) leadPostal = p;
            if (p.toLowerCase().startsWith("kec.") || p.toLowerCase().includes("kecamatan")) {
               leadDistrict = p.replace(/kec\.|kecamatan/i, "").trim();
            }
            if (p.toLowerCase().startsWith("kota ") || p.toLowerCase().startsWith("kabupaten ") || p.toLowerCase().startsWith("kab ")) {
               leadCity = p.replace(/kota |kabupaten |kab /i, "").trim();
            }
             const lowerP = p.toLowerCase();
             if (
                lowerP.includes("jawa") || lowerP.includes("sumatera") || lowerP.includes("kalimantan") || 
                lowerP.includes("sulawesi") || lowerP.includes("papua") || lowerP.includes("bali") || 
                lowerP.includes("jakarta") || lowerP.includes("banten") || lowerP.includes("nusa tenggara")
             ) {
                leadState = p.replace(/\d+/g, "").trim();
             }
         }
      }

      try {
        await db.insert(leads).values({
          businessName: result.businessName,
          address: result.address,
          phone: result.phone,
          website: result.website,
          rating: result.rating,
          reviewCount: result.reviewCount ? parseInt(result.reviewCount) : 0,
          googleMapsUrl: result.googleMapsUrl,
          locationId: targetLocationId,
          categoryId: category.id,
          status: "new",
          isNewListing: (parseInt(result.reviewCount || "999") || 999) <= 5,
          // New Fields
          city: leadCity,
          district: leadDistrict,
          state: leadState,
          postalCode: leadPostal,
          country: leadCountry
        });
        savedCount++;
      } catch (e: any) {
        if (e.code === '23505') continue; 
        console.error(`Failed to save lead:`, e.message);
      }
    }

    console.log(`Saved ${savedCount} new leads to database`);

  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
}

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    const wrapper = document.querySelector("div[role='feed']");
    if (!wrapper) return;

    for (let i = 0; i < 5; i++) {
      wrapper.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, 1000));
    }
  });
}
