
"use server";

import { db } from "@/lib/cms/db";
import { demoSites, type NewDemoSite } from "@/lib/cms/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/cms/auth/config";
import { hasPermission, PERMISSIONS, type UserRole } from "@/lib/cms/permissions";
import { getDemoSiteById } from "@/lib/cms/queries/demo-sites";

export async function deleteDemoSite(id: string) {
  const session = await requireAuth();
  const role = session.user.role as UserRole;
  const userId = session.user.id;

  if (!hasPermission(role, PERMISSIONS.DEMO_SITES_DELETE)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  // Check ownership if not admin
  if (role !== "super_admin" && role !== "admin") {
    const existingSite = await getDemoSiteById(id);
    if (!existingSite || existingSite.demoSite.authorId !== userId) {
      throw new Error("Forbidden: You can only delete your own demo sites");
    }
  }

  try {
    await db.delete(demoSites).where(eq(demoSites.id, id));
    revalidatePath("/(locale)/admin/demos", "page");
  } catch (error) {
    console.error("Error deleting demo site:", error);
    throw new Error("Failed to delete demo site");
  }
}

export async function createDemoSite(data: NewDemoSite) {
  const session = await requireAuth();
  const role = session.user.role as UserRole;

  if (!hasPermission(role, PERMISSIONS.DEMO_SITES_CREATE)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  try {
    // Assign current user as author
    const siteData = {
      ...data,
      authorId: session.user.id,
    };

    const [newSite] = await db.insert(demoSites).values(siteData).returning();
    revalidatePath("/(locale)/admin/demos", "page");
    return newSite;
  } catch (error) {
    console.error("Error creating demo site:", error);
    // @ts-ignore
    if (error.code === '23505') { // Unique violation for slug
         throw new Error("Slug might be taken");
    }
    throw new Error("Failed to create demo site.");
  }
}

export async function updateDemoSite(id: string, data: Partial<NewDemoSite>) {
  const session = await requireAuth();
  const role = session.user.role as UserRole;
  const userId = session.user.id;

  if (!hasPermission(role, PERMISSIONS.DEMO_SITES_UPDATE)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  // Check ownership if not admin
  if (role !== "super_admin" && role !== "admin") {
    const existingSite = await getDemoSiteById(id);
    if (!existingSite || existingSite.demoSite.authorId !== userId) {
      throw new Error("Forbidden: You can only update your own demo sites");
    }
  }

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
