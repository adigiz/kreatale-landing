import type { Metadata } from "next";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedProjectsData = projectsData as ProjectsDatabase;
  const project = typedProjectsData[slug];

  if (!project) {
    return {
      title: "Project Not Found | Kreatale",
      description: "The project you're looking for doesn't exist.",
    };
  }

  const isEnglish = locale === "en";
  const title = `${project.title} | ${
    isEnglish ? "Project" : "Proyek"
  } - Kreatale`;
  const description = project.subtitle || project.title;

  const projectUrl = `${baseUrl}/${locale}/projects/${slug}`;
  const languages: Record<string, string> = {
    en: `${baseUrl}/en/projects/${slug}`,
    id: `${baseUrl}/id/projects/${slug}`,
    "x-default": `${baseUrl}/en/projects/${slug}`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: projectUrl,
      siteName: "Kreatale",
      images: [
        {
          url: project.heroImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${project.title} - Kreatale Project`,
        },
      ],
      locale: isEnglish ? "en_US" : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.heroImage || "/og-image.png"],
    },
    alternates: {
      canonical: projectUrl,
      languages,
    },
  };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedProjectsData = projectsData as ProjectsDatabase;
  const project = typedProjectsData[slug];

  if (!project) {
    return <>{children}</>;
  }

  const projectUrl = `${baseUrl}/${locale}/projects/${slug}`;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.subtitle,
    url: projectUrl,
    creator: {
      "@type": "Organization",
      name: "Kreatale",
    },
    dateCreated: project.duration,
    image: project.heroImage ? `${baseUrl}${project.heroImage}` : undefined,
    aggregateRating: project.demoUrl
      ? {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      {children}
    </>
  );
}
