import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/cms/queries/projects";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);

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

  // Create comprehensive meta description (150-160 characters)
  const techStack = (project.techStacks as string[])
    .slice(0, 2)
    .join(isEnglish ? " and " : " dan ");

  const description = isEnglish
    ? `${project.subtitle}. Explore ${
        project.title
      }, a web development project by Kreatale. Built with ${techStack}. View case study${
        project.demoUrl ? " and live demo" : ""
      }.`
    : `${project.subtitle}. Jelajahi ${
        project.title
      }, proyek pengembangan web oleh Kreatale. Dibangun dengan ${techStack}. Lihat studi kasus${
        project.demoUrl ? " dan demo langsung" : ""
      }.`;

  // Ensure it's between 150-160 characters
  const trimmedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  const projectUrl = `${baseUrl}/${locale}/projects/${slug}`;
  const languages: Record<string, string> = {
    en: `${baseUrl}/en/projects/${slug}`,
    id: `${baseUrl}/id/projects/${slug}`,
    "x-default": `${baseUrl}/en/projects/${slug}`,
  };

  return {
    title,
    description: trimmedDescription,
    openGraph: {
      title,
      description: trimmedDescription,
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
      description: trimmedDescription,
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
  const project = await getProjectBySlug(slug);

  if (!project) {
    return <>{children}</>;
  }

  const projectUrl = `${baseUrl}/${locale}/projects/${slug}`;

  // Create the same comprehensive description for structured data
  const isEnglish = locale === "en";
  const techStack = (project.techStacks as string[])
    .slice(0, 2)
    .join(isEnglish ? " and " : " dan ");

  const description = isEnglish
    ? `${project.subtitle}. Explore ${
        project.title
      }, a web development project by Kreatale. Built with ${techStack}. View case study${
        project.demoUrl ? " and live demo" : ""
      }.`
    : `${project.subtitle}. Jelajahi ${
        project.title
      }, proyek pengembangan web oleh Kreatale. Dibangun dengan ${techStack}. Lihat studi kasus${
        project.demoUrl ? " dan demo langsung" : ""
      }.`;

  const trimmedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: trimmedDescription,
    url: projectUrl,
    creator: {
      "@type": "Organization",
      name: "Kreatale",
      url: baseUrl,
    },
    dateCreated: project.duration,
    image: project.heroImage ? `${baseUrl}${project.heroImage}` : undefined,
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
