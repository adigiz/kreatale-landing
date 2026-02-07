
import { db } from "../src/lib/cms/db/client";
import { leads } from "../src/lib/cms/db/schema";
import { like, or } from "drizzle-orm";

async function checkKoreanLeads() {
  console.log("Searching for leads with Korean location data...");
  const results = await db.select().from(leads).where(
    or(
      like(leads.city, "%청주%"),
      like(leads.state, "%청주%"),
      like(leads.country, "%대한민국%"),
      like(leads.country, "%Korea%")
    )
  );

  console.log(`Found ${results.length} leads.`);
  results.forEach(l => {
    console.log(`\nID: ${l.id}`);
    console.log(`Business: ${l.businessName}`);
    console.log(`Google Maps URL: ${l.googleMapsUrl}`);
    console.log(`Parsed Data: City=${l.city}, District=${l.district}, State=${l.state}, Country=${l.country}`);
    console.log(`Created At: ${l.createdAt}`);
  });
  process.exit(0);
}

checkKoreanLeads().catch(console.error);
