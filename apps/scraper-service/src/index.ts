import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { scrapeCategoryInLocation } from "./scraper";
import { db } from "./db";
import { locations, categories } from "./schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.post("/scrape", async (req, res) => {
  const { locationId, categoryId, lat, lng, zoom } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: "Missing categoryId" });
  }

  // Location validation (optional if coordinates provided)
  let location;
  if (locationId) {
    [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId));
  } else if (!lat || !lng) {
     return res.status(400).json({ error: "Missing locationId or coordinates" });
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category || (locationId && !location)) {
    return res.status(404).json({ error: "Location or Category not found" });
  }

  const locationName = location ? location.name : `Coordinates: ${lat},${lng}`;
  console.log(`Starting scrape for ${category.name} in ${locationName}`);

  // Start background job
  scrapeCategoryInLocation(location || { id: "custom_map", name: "Custom Area" }, category, { lat, lng, zoom }).catch((err) => {
    console.error("Scraping failed:", err);
  });

  return res.json({
    status: "started",
    message: `Scraping started for ${category.name} in ${locationName}`,
  });
});

app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
