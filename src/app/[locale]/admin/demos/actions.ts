
"use server";

import { db } from "@/lib/cms/db";
import { demoSites, type NewDemoSite } from "@/lib/cms/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteDemoSite(id: string) {
  try {
    await db.delete(demoSites).where(eq(demoSites.id, id));
    revalidatePath("/(locale)/admin/demos", "page");
  } catch (error) {
    console.error("Error deleting demo site:", error);
    throw new Error("Failed to delete demo site");
  }
}

export async function createDemoSite(data: NewDemoSite) {
  try {
    const [newSite] = await db.insert(demoSites).values(data).returning();
    revalidatePath("/(locale)/admin/demos", "page");
    return newSite;
  } catch (error) {
    console.error("Error creating demo site:", error);
    throw new Error("Failed to create demo site. Slug might be taken.");
  }
}

export async function updateDemoSite(id: string, data: Partial<NewDemoSite>) {
  try {
    const [updatedSite] = await db
      .update(demoSites)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(demoSites.id, id))
      .returning();
    
    revalidatePath("/(locale)/admin/demos", "page");
    revalidatePath(`/(locale)/admin/demos/${id}`, "page");
    return updatedSite;
  } catch (error) {
    console.error("Error updating demo site:", error);
    throw new Error("Failed to update demo site");
  }
}
