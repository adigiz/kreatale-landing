import type { Metadata } from "next";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await import(`../../../messages/${locale}.json`).catch(
    () => null
  );
  const t = messages?.default?.portfolio || {};

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Our Projects | Portfolio - Kreatale"
    : "Proyek Kami | Portfolio - Kreatale";
  const description = isEnglish
    ? t.description ||
      "Explore our latest projects and see how we've helped businesses achieve their digital goals."
    : t.description ||
      "Jelajahi proyek terbaru kami dan lihat bagaimana kami membantu bisnis mencapai tujuan digital mereka.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/projects`,
    id: `${baseUrl}/id/projects`,
    "x-default": `${baseUrl}/en/projects`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/projects`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image-projects.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - Our Projects",
        },
      ],
      locale: isEnglish ? "en_US" : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image-projects.png"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/projects`,
      languages,
    },
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

