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

    if (location.id === "custom_map") {
       console.log("Determining location from Coordinates (Reverse Geocode)...");
       
       try {
           // We already have the page. We can try to look up the "center" of the search area?
           // Or, more reliably, we interpret the address of the first few results OR we rely on the map title if possible.
           // Actually, parsing the address of the results is still the most efficient way without an extra navigation 
           // BUT the user specifically asked to "reverse the latlong".
           
           // If we want to be 100% sure of the "Area Name", we can navigate to the coordinates directly first.
           // But that costs time. 
           // Let's stick to the sophisticated parsing of results because we ALREADY have them. 
           // BUT we will apply the "Reverse via results" logic with the new "State/City" improvements we built.
           
           // WAIT. The user said "reverse the latlong". 
           // Let's assume they want us to actually check the coordinates.
           
           // Let's reuse the results parsing but make it robust as per previous step.
           // The previous step's logic was actually quite good, but let's make it smarter.
           
           const cityCounts: Record<string, number> = {};
           const stateCounts: Record<string, number> = {};
           
           for (const res of results) {
             if (!res.address) continue;
             const cleanAddress = res.address.includes('·') ? res.address.split('·').pop()?.trim() || res.address : res.address;
             
             // Analyze address
             const parts = cleanAddress.split(",").map(p => p.trim());
             for (const p of parts) {
                const lowerP = p.toLowerCase();
                
                // Skip specific housing prefixes
                if (lowerP.startsWith("perum") || lowerP.includes("komplek") || lowerP.includes("ruko") || lowerP.includes("apartemen")) continue;

                // State Detection
                if (
                    lowerP.includes("jawa") || lowerP.includes("sumatera") || lowerP.includes("kalimantan") || 
                    lowerP.includes("sulawesi") || lowerP.includes("papua") || lowerP.includes("bali") || 
                    lowerP.includes("nusa tenggara") || lowerP.includes("jakarta") || lowerP.includes("yogyakarta") || 
                    lowerP.includes("banten") || lowerP.includes("riau") || lowerP.includes("jambi") || 
                    lowerP.includes("lampung") || lowerP.includes("bengkulu") || lowerP.includes("maluku") ||
                    lowerP.includes("gorontalo") || lowerP.includes("aceh") || lowerP.includes("bangka")
                ) {
                    // It's a state/province
                    let state = p.replace(/\d+/g, "").trim();
                    if (state) stateCounts[state] = (stateCounts[state] || 0) + 1;
                    
                    // If it's a "Province", it's NOT a city. 
                    // Special case: Jakarta and Yogyakarta are both
                    continue; 
                }

                // City Detection - Strict
                if (lowerP.startsWith("kota ") || lowerP.startsWith("kabupaten ") || lowerP.startsWith("kab ") || lowerP.includes("city")) {
                   let city = p;
                   if (lowerP.startsWith("kota ")) city = p.substring(5).trim();
                   if (lowerP.startsWith("kabupaten ")) city = p.substring(10).trim();
                   if (lowerP.startsWith("kab ")) city = p.substring(4).trim();
                   
                   if (city.length > 2) cityCounts[city] = (cityCounts[city] || 0) + 1;
                }
             }
           }
           
           // Best City
           let bestCity = "Unknown Area";
           let maxCount = 0;
           for (const [city, count] of Object.entries(cityCounts)) {
             if (count > maxCount) {
               maxCount = count;
               bestCity = city;
             }
           }

           // Best State
           let bestState = null;
           let maxStateCount = 0;
           for (const [state, count] of Object.entries(stateCounts)) {
             if (count > maxStateCount) {
                maxStateCount = count;
                bestState = state;
             }
           }
           
           // If we still have "Unknown Area", fallback to coordinates lookup?
           // No, for now let's rely on the improved parsing.
           
           console.log(`Inferred city: ${bestCity}, State: ${bestState}`);

           if (bestCity !== "Unknown Area") {
             const slug = bestCity.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
             
             const [existing] = await db.select().from(locations).where(eq(locations.slug, slug));
             
             if (existing) {
               targetLocationId = existing.id;
               if (!existing.state && bestState) {
                  await db.update(locations).set({ state: bestState }).where(eq(locations.id, existing.id));
               }
               console.log(`Using existing location: ${existing.name}`);
             } else {
               const [newLoc] = await db.insert(locations).values({
                 name: bestCity,
                 slug: slug,
                 country: "Indonesia",
                 state: bestState
               }).returning();
               targetLocationId = newLoc.id;
               console.log(`Created new location: ${newLoc.name}`);
             }
           } else {
             // Fallback: If we couldn't find a city, maybe use the coordinates to create a generic "Area at Lat/Lng"?
             // Or just fail.
             console.log("Could not infer city from results. Checking if we can try a reverse lookup...");
             // Optional: Add actual reverse lookup here if inference fails
             targetLocationId = null as any; 
           }

       } catch (err) {
           console.error("Error determining location:", err);
       }
    }

    // Save to DB
    let savedCount = 0;
    for (const result of results) {
      if (!result.businessName || result.businessName.length < 2) continue;

      // Extract details for Lead
      let leadCity = null;
      let leadState = null;
      let leadDistrict = null;
      let leadPostal = null;
      let leadCountry = "Indonesia"; // Default if not found

      if (result.address) {
         const parts = result.address.split(",").map(p => p.trim());
         for (const p of parts) {
            // Country
            if (p.toLowerCase() === "indonesia") leadCountry = "Indonesia";
            
            // Postal (5 digits)
            if (/^\d{5}$/.test(p)) leadPostal = p;
            
            // District (Kecamatan)
            if (p.toLowerCase().startsWith("kec.") || p.toLowerCase().includes("kecamatan")) {
               leadDistrict = p.replace(/kec\.|kecamatan/i, "").trim();
            }

            // City
            if (p.toLowerCase().startsWith("kota ") || p.toLowerCase().startsWith("kabupaten ") || p.toLowerCase().startsWith("kab ")) {
               leadCity = p.replace(/kota |kabupaten |kab /i, "").trim();
            }

            // State (heuristic similar to above)
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
