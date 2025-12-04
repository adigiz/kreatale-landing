import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { sortProjects } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import ProjectCards from "./ProjectCards";

const baseUrl = "https://kreatale.com";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Use next-intl's getTranslations for server components
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tPortfolio = await getTranslations({ locale, namespace: "portfolio" });

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = sortProjects(Object.entries(typedProjectsData));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tPortfolio("pageTitle") || tPortfolio("title"),
        item: `${baseUrl}/${locale}/projects`,
      },
    ],
  };

  const pageTitle = tPortfolio("pageTitle") || tPortfolio("title");
  const pageDescription =
    tPortfolio("pageDescription") || tPortfolio("description");

  // Split title for styling - last word gets blue color
  const titleWords = pageTitle.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const otherWords = titleWords.slice(0, -1).join(" ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {otherWords && `${otherWords} `}
              <span className="text-blue-600">{lastWord}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">{pageDescription}</p>
          </div>
        </section>

        {/* Projects Grid */}
        <ProjectCards projects={projects} locale={locale} />
      </div>
    </>
  );
}
