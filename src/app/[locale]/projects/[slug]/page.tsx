import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/cms/queries/projects";
import { dbProjectToProjectData } from "@/lib/utils";
import ProjectDetail from "./ProjectDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const [, projectData] = dbProjectToProjectData(project);

  return <ProjectDetail project={projectData} />;
}
