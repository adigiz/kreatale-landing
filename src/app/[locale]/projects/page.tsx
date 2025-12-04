import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { sortProjects } from "@/lib/utils";
import ProjectCards from "./ProjectCards";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = sortProjects(Object.entries(typedProjectsData));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Projects</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore our portfolio of innovative digital solutions crafted for
            businesses across various industries
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <ProjectCards projects={projects} locale={locale} />
    </div>
  );
}
