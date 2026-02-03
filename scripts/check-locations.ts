
import { db } from "../src/lib/cms/db";
import { locations } from "../src/lib/cms/db/schema";
import { desc } from "drizzle-orm";

async function checkLocations() {
  console.log("Fetching locations...");
  const locs = await db.select().from(locations).orderBy(desc(locations.id));
  
  console.log(`Found ${locs.length} locations:`);
  locs.forEach(l => {
    console.log(`- [${l.id}] ${l.name} (${l.slug})`);
  });
  
  process.exit(0);
}

checkLocations().catch(err => {
  console.error(err);
  process.exit(1);
});
