import { db, roles } from "../db";
import { eq } from "drizzle-orm";

export async function getAllRoles() {
  return await db.select().from(roles).orderBy(roles.name);
}

export async function getRoleByName(name: string) {
  const [role] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);

  return role || null;
}

export async function updateRolePermissions(
  name: string,
  permissions: string[]
) {
  const [role] = await db
    .update(roles)
    .set({ permissions, updatedAt: new Date() })
    .where(eq(roles.name, name))
    .returning();

  return role || null;
}
