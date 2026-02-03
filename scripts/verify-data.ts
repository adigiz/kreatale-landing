
import { db } from "../src/lib/cms/db";
import { leads, locations } from "../src/lib/cms/db/schema";
import { desc } from "drizzle-orm";

async function verifyData() {
  console.log("--- Verifying Locations ---");
  const locs = await db.select().from(locations);
  console.table(locs.map(l => ({
    id: l.id,
    name: l.name,
    state: l.state,
    country: l.country
  })));

  console.log("\n--- Verifying Leads (Latest 5) ---");
  const latestLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5);
  
  if (latestLeads.length === 0) {
    console.log("No leads found yet.");
  } else {
    latestLeads.forEach(l => {
      console.log(`\nBusiness: ${l.businessName}`);
      console.log(`Address: ${l.address}`);
      console.log(`Parsed -> City: ${l.city}, District: ${l.district}, State: ${l.state}, Postal: ${l.postalCode}, Country: ${l.country}`);
    });
  }
  process.exit(0);
}

verifyData().catch(console.error);
