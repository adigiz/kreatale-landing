import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Our Projects | Portfolio - Kreatale"
    : "Proyek Kami | Portfolio - Kreatale";
  // Use translation from next-intl
  const description = t("pageDescription") || t("description");

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/projects`,
    id: `${baseUrl}/id/projects`,
    "x-default": `${baseUrl}/en/projects`,
  };

  return {
    title: {
      default: title,
      absolute: title,
    },
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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
