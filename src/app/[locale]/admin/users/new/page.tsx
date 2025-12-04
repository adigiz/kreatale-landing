import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import UserEditor from "@/components/cms/UserEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewUserPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = session.user.role as string;
  if (role !== "super_admin") {
    redirect(`/${locale}/admin/users`);
  }

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
          <h1 className="text-2xl font-semibold text-foreground">
            Create New User
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new CMS user account
          </p>
        </div>
      </div>
      <div className="border-b" />
      <UserEditor />
    </div>
  );
}
