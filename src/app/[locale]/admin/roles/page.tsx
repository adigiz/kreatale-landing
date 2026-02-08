import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getAllRoles } from "@/lib/cms/queries/roles";
import RolesContent from "./components/RolesContent";

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

  const allRoles = await getAllRoles();

  // Serialize dates for client component
  const serializedRoles = allRoles.map((r) => ({
    ...r,
    permissions: (r.permissions as string[]) || [],
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  }));

  return (
    <RolesContent
      roles={serializedRoles}
      currentUserRole={role}
    />
  );
}
