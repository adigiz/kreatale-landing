import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/cms/queries/users";
import UserEditor from "@/components/cms/UserEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = session.user.role as string;
  if (role !== "super_admin" && role !== "admin") {
    redirect(`/${locale}/admin/users`);
  }

  const user = await getUserById(id);

  if (!user) {
    redirect(`/${locale}/admin/users`);
  }

  // Remove password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...safeUser } = user;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/users`}>
            <ArrowLeft className="size-4" />
            Back to Users
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Edit User</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit user account and permissions
          </p>
        </div>
      </div>
      <div className="border-b" />
      <UserEditor userId={id} initialUser={safeUser} />
    </div>
  );
}

