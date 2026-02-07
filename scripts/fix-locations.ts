
import { db } from "../src/lib/cms/db/client";
import { leads, locations } from "../src/lib/cms/db/schema";
import { eq, or, like } from "drizzle-orm";

async function reverseGeocodeIndonesian(lat: number, lng: number) {
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
    
    return {
      city: addr.city || addr.town || addr.municipality || addr.county || null,
      state: addr.state || addr.region || null,
      country: addr.country || "Indonesia",
      district: addr.suburb || addr.village || addr.neighbourhood || addr.city_district || null,
      postcode: addr.postcode || null
    };
  } catch (err) {
    console.error(`Reverse geocoding failed for ${lat},${lng}:`, err);
    return null;
  }
}

async function fixLocationsAndLeads() {
  console.log("--- Fixing Locations Table ---");
  const problematicLocs = await db.select().from(locations).where(
    or(
      like(locations.name, "%청주%"),
      like(locations.name, "%대한민국%"),
      like(locations.slug, "")
    )
  );

  console.log(`Found ${problematicLocs.length} locations to fix.`);

  for (const loc of problematicLocs) {
    console.log(`Repairing location: ${loc.name} (${loc.id})`);
    
    // We'll hardcode this specific one to Jakarta Pusat if it's the one we found
    if (loc.name === "청주시" || loc.id === "fd700a6d-aeb4-487f-88ec-bddce1983cfd") {
       await db.update(locations).set({
         name: "Jakarta Pusat",
         slug: "jakarta-pusat",
         country: "Indonesia",
         state: "DKI Jakarta"
       }).where(eq(locations.id, loc.id));
       console.log(`Updated location ${loc.id} to Jakarta Pusat`);
    }
  }

  console.log("\n--- Fixing Leads Table ---");
  const problematicLeads = await db.select().from(leads).where(
    or(
      like(leads.city, "%청주%"),
      like(leads.state, "%청주%"),
      like(leads.country, "%대한민국%"),
      like(leads.country, "%Korea%")
    )
  );

  console.log(`Found ${problematicLeads.length} leads to fix.`);

  for (const lead of problematicLeads) {
    if (!lead.googleMapsUrl) continue;

    const latMatch = lead.googleMapsUrl.match(/!3d(-?\d+\.\d+)/);
    const lngMatch = lead.googleMapsUrl.match(/!4d(-?\d+\.\d+)/);

    if (!latMatch || !lngMatch) continue;

    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);

    const geoData = await reverseGeocodeIndonesian(lat, lng);

    if (geoData) {
      await db.update(leads).set({
        city: geoData.city,
        state: geoData.state,
        district: geoData.district,
        postalCode: geoData.postcode,
        country: geoData.country,
        updatedAt: new Date()
      }).where(eq(leads.id, lead.id));
      
      console.log(`Updated lead ${lead.businessName} -> ${geoData.city}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\nRepair complete!");
  process.exit(0);
}

fixLocationsAndLeads().catch(console.error);
