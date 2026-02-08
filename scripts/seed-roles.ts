import { db, roles } from "../src/lib/cms/db";
import { ROLE_PERMISSIONS } from "../src/lib/cms/permissions";

async function seed() {
  const entries = Object.entries(ROLE_PERMISSIONS);

  console.log(`\nSeeding ${entries.length} roles...\n`);

  for (const [roleName, permissions] of entries) {
    console.log(`  Role: ${roleName} (${permissions.length} permissions)`);

    await db
      .insert(roles)
      .values({
        name: roleName,
        permissions,
      })
      .onConflictDoUpdate({
        target: roles.name,
        set: {
          permissions,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`\nSuccessfully seeded ${entries.length} roles!\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
