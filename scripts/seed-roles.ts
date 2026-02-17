/**
 * Syncs role permissions from code (ROLE_PERMISSIONS) into the database.
 * Use this when you first set up RBAC or when you change default permissions
 * in src/lib/cms/permissions.ts so the DB stays the source of truth.
 *
 * - Inserts any role that doesn't exist.
 * - Updates existing roles to match ROLE_PERMISSIONS (overwrites DB value with code default).
 *
 * Usage: npm run seed-roles
 */
import { config } from "dotenv";
import { db, roles } from "../src/lib/cms/db";
import { getRoleByName, updateRolePermissions } from "../src/lib/cms/queries/roles";
import { ROLE_PERMISSIONS } from "../src/lib/cms/permissions";

config({ path: ".env.local" });

// Roles we manage in code (exclude super_admin - it's special and not stored in roles table for permissions)
const ROLE_NAMES = ["admin", "editor", "author", "sales", "viewer"] as const;

async function main() {
  for (const name of ROLE_NAMES) {
    const defaultPermissions = ROLE_PERMISSIONS[name] ?? [];
    const existing = await getRoleByName(name);

    if (existing) {
      await updateRolePermissions(name, defaultPermissions);
      console.log(`Updated role "${name}" with ${defaultPermissions.length} permissions.`);
    } else {
      await db.insert(roles).values({
        name,
        permissions: defaultPermissions,
      });
      console.log(`Created role "${name}" with ${defaultPermissions.length} permissions.`);
    }
  }

  console.log("Done. Roles in DB are now in sync with ROLE_PERMISSIONS in code.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
