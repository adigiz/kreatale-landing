import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import ProjectEditor from "@/components/cms/ProjectEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/projects`}>
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Create New Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new project entry
        </p>
      </div>
      <ProjectEditor />
    </div>
  );
}
