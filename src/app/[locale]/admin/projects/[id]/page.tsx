import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getProjectById } from "@/lib/cms/queries/projects";
import ProjectEditor from "@/components/cms/ProjectEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const project = await getProjectById(id);

  if (!project) {
    redirect(`/${locale}/admin/projects`);
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
        <h1 className="text-2xl font-semibold text-foreground">Edit Project</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit your project entry
        </p>
      </div>
      <ProjectEditor project={project} />
    </div>
  );
}
