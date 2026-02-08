import "server-only";

import { unstable_cache } from "next/cache";
import { getRoleByName } from "./queries/roles";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from "./permissions";

/**
 * Fetch effective permissions for a role from the DB with caching.
 * Falls back to hardcoded ROLE_PERMISSIONS if the DB has no entry.
 * super_admin always gets all permissions regardless of DB state.
 *
 * This function is server-only and must NOT be imported from client components.
 */
export const getEffectivePermissions = unstable_cache(
  async (roleName: string): Promise<string[]> => {
    // super_admin is immutable -- always has all permissions
    if (roleName === "super_admin") {
      return ALL_PERMISSIONS.slice();
    }

    try {
      const role = await getRoleByName(roleName);

      if (role && Array.isArray(role.permissions)) {
        // Filter to only include valid permissions (guard against stale data)
        const validPermissions = (role.permissions as string[]).filter((p) =>
          ALL_PERMISSIONS.includes(p as typeof ALL_PERMISSIONS[number])
        );
        return validPermissions;
      }
    } catch {
      // DB unavailable -- fall through to hardcoded
    }

    // Fallback to hardcoded defaults
    return ROLE_PERMISSIONS[roleName] || [];
  },
  ["role-permissions"],
  { tags: ["roles"], revalidate: 300 } // cache for 5 minutes, invalidated on update
);
