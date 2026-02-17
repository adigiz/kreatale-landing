/**
 * Ensures the "sales" role in the database has MEDIA_CREATE permission
 * (required for demo image upload). Run after deploying permission changes
 * so DB-backed roles stay in sync.
 *
 * Usage: npm run update-sales-role
 */
import { config } from "dotenv";
import { db, roles } from "../src/lib/cms/db";
import { getRoleByName, updateRolePermissions } from "../src/lib/cms/queries/roles";
import { PERMISSIONS, ROLE_PERMISSIONS } from "../src/lib/cms/permissions";

config({ path: ".env.local" });

const SALES_ROLE_NAME = "sales";

async function main() {
  const existing = await getRoleByName(SALES_ROLE_NAME);

  if (existing && Array.isArray(existing.permissions)) {
    const perms = existing.permissions as string[];
    if (perms.includes(PERMISSIONS.MEDIA_CREATE)) {
      console.log("Sales role already has media:create. Nothing to do.");
      process.exit(0);
    }
    const updated = [...perms, PERMISSIONS.MEDIA_CREATE];
    await updateRolePermissions(SALES_ROLE_NAME, updated);
    console.log("Updated sales role: added media:create. Permissions count:", updated.length);
  } else {
    // Role missing in DB: create it with default sales permissions (from code)
    const defaultPermissions = ROLE_PERMISSIONS[SALES_ROLE_NAME] ?? [
      PERMISSIONS.CONTACTS_READ,
      PERMISSIONS.CONTACTS_UPDATE,
      PERMISSIONS.LEADS_CREATE,
      PERMISSIONS.LEADS_READ,
      PERMISSIONS.LEADS_UPDATE,
      PERMISSIONS.LEADS_DELETE,
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.MEDIA_CREATE,
      PERMISSIONS.DEMO_SITES_CREATE,
      PERMISSIONS.DEMO_SITES_READ,
      PERMISSIONS.DEMO_SITES_UPDATE,
      PERMISSIONS.DEMO_SITES_DELETE,
    ];
    await db.insert(roles).values({
      name: SALES_ROLE_NAME,
      permissions: defaultPermissions,
    });
    console.log("Created sales role in DB with default permissions (including media:create).");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
