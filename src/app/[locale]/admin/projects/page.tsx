import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import { getAllProjects } from "@/lib/cms/queries/projects";
import ProjectsContent from "./components/ProjectsContent";

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const searchParamsData = await searchParams;
  const allProjects = await getAllProjects();

  // Serialize for client component
  const serializedProjects = allProjects.map((p) => ({
    ...p,
    techStacks: (p.techStacks as string[]) || [],
    translations: (p.translations ?? {}) as
      | { id?: { title?: string; subtitle?: string; sections?: Record<string, { title: string; content: string[] }> } }
      | undefined,
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));

  return (
    <ProjectsContent
      projects={serializedProjects}
      locale={locale}
      initialSearch={searchParamsData.search}
      initialStatus={searchParamsData.status}
    />
  );
}
