import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getAllRoles } from "@/lib/cms/queries/roles";
import { ROLE_PERMISSIONS, ALL_PERMISSIONS } from "@/lib/cms/permissions";
import RolesContent from "./components/RolesContent";

const STANDARD_ROLE_NAMES = ["super_admin", "admin", "editor", "author", "sales", "viewer"] as const;

export default async function RolesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = (session.user as { role: string }).role;

  // Only super_admin and admin can access this page
  if (role !== "super_admin" && role !== "admin") {
    redirect(`/${locale}/admin`);
  }

  const dbRoles = await getAllRoles();
  const dbRolesByName = new Map(dbRoles.map((r) => [r.name, r]));

  // Always show all standard roles: from DB when present, else code defaults (so super_admin can manage from admin)
  const now = new Date();
  const mergedRoles = STANDARD_ROLE_NAMES.map((name) => {
    const fromDb = dbRolesByName.get(name);
    if (fromDb) {
      return {
        ...fromDb,
        permissions: (fromDb.permissions as string[]) || [],
        createdAt: new Date(fromDb.createdAt),
        updatedAt: new Date(fromDb.updatedAt),
      };
    }
    // Not in DB: use code defaults so they appear in the UI and can be saved (creates row)
    const permissions = name === "super_admin"
      ? [...ALL_PERMISSIONS]
      : (ROLE_PERMISSIONS[name] ?? []);
    return {
      id: `default-${name}`,
      name,
      permissions,
      createdAt: now,
      updatedAt: now,
    };
  });

  return (
    <RolesContent
      roles={mergedRoles}
      currentUserRole={role}
    />
  );
}
