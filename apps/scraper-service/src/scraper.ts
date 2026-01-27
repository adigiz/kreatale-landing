import puppeteer from "puppeteer";
import { db } from "./db";
import { leads } from "./schema";

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
    searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(category.searchTerm)}/@${coordinates.lat},${coordinates.lng},${coordinates.zoom}z`;
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
        const addressLine = lines.find(l => 
          (l.includes('Jl.') || l.includes('St.') || l.includes('Road') || 
           l.includes('RT.') || l.includes('Ave') || l.includes('Street')) &&
          !l.includes('Open') && !l.includes('Closes')
        ) || null;

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

    // Save to DB
    let savedCount = 0;
    for (const result of results) {
      if (!result.businessName || result.businessName.length < 2) continue;

      try {
        await db.insert(leads).values({
          businessName: result.businessName,
          address: result.address,
          phone: result.phone,
          rating: result.rating,
          reviewCount: result.reviewCount ? parseInt(result.reviewCount) : 0,
          googleMapsUrl: result.googleMapsUrl,
          locationId: location.id,
          categoryId: category.id,
          status: "new",
          isNewListing: (parseInt(result.reviewCount || "999") || 999) <= 5,
        });
        savedCount++;
      } catch (e) {
        // Likely duplicate, skip
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
