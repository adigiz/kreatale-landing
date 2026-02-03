
import { db } from "../src/lib/cms/db";
import { leads, locations } from "../src/lib/cms/db/schema";
import { sql } from "drizzle-orm";

async function wipeData() {
  console.log("Wiping leads and locations...");
  try {
    await db.delete(leads);
    console.log("Leads deleted.");
    await db.delete(locations);
    console.log("Locations deleted.");
    console.log("Data wipe completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to wipe data:", error);
    process.exit(1);
  }
}

wipeData();
