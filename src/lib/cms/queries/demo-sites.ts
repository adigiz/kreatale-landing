
import { db } from "@/lib/cms/db";
import { demoSites } from "@/lib/cms/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllDemoSites() {
  try {
    const results = await db
      .select()
      .from(demoSites)
      .orderBy(desc(demoSites.createdAt));
    
    return results;
  } catch (error) {
    console.error("Error fetching demo sites:", error);
    return [];
  }
}

export async function getDemoSiteById(id: string) {
  try {
    const result = await db
      .select()
      .from(demoSites)
      .where(eq(demoSites.id, id))
      .limit(1);

    return result[0];
  } catch (error) {
    console.error(`Error fetching demo site ${id}:`, error);
    return null;
  }
}

export async function getDemoSiteBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(demoSites)
      .where(eq(demoSites.slug, slug))
      .limit(1);

    return result[0];
  } catch (error) {
    console.error(`Error fetching demo site slug ${slug}:`, error);
    return null;
  }
}
