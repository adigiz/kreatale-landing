import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import DeleteUserButton from "./DeleteUserButton";
import { getAllUsers } from "@/lib/cms/queries/users";

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = session.user.role as string;
  if (role !== "super_admin" && role !== "admin") {
    redirect(`/${locale}/admin`);
  }

  const searchParamsData = await searchParams;
  const allUsersData = await getAllUsers();
  // Remove password hashes for display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allUsers = allUsersData.map(({ passwordHash, ...user }) => user);

  // Filter by search if provided
  let users = allUsers;
  if (searchParamsData.search) {
    const searchLower = searchParamsData.search.toLowerCase();
    users = allUsers.filter(
      (u: { email: string; name: string | null }) =>
        u.email.toLowerCase().includes(searchLower) ||
        u.name?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage CMS users and permissions
          </p>
        </div>
        {role === "super_admin" && (
          <Button asChild>
            <Link href={`/${locale}/admin/users/new`}>
              <Plus className="size-4" />
              New User
            </Link>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <form
          className="flex-1"
          action={async (formData) => {
            "use server";
            const search = formData.get("search") as string;
            redirect(
              `/${locale}/admin/users?search=${encodeURIComponent(
                search || ""
              )}`
            );
          }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Search users..."
              defaultValue={searchParamsData.search}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Role
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(
                  (user: {
                    id: string;
                    email: string;
                    name: string | null;
                    role: string;
                    createdAt: Date | string;
                  }) => (
                    <tr
                      key={user.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={user.name}
                            email={user.email}
                            size="sm"
                          />
                          <div className="text-sm font-medium text-foreground">
                            {user.name || "—"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium capitalize">
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.createdAt instanceof Date
                          ? user.createdAt.toLocaleDateString()
                          : new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(role === "super_admin" || role === "admin") && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/${locale}/admin/users/${user.id}`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                          )}
                          {role === "super_admin" &&
                            user.id !== session.user.id && (
                              <DeleteUserButton
                                userId={user.id}
                                locale={locale}
                              />
                            )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


