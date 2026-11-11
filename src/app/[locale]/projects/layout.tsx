import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPublishedProjects } from "@/lib/cms/queries/projects";
import { dbProjectsToSortedEntries } from "@/lib/utils";

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

/** /projects still uses the old site's design: its header, footer and translated copy. */
export default async function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages = {};
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Error loading messages:", error);
  }
  let projects: ReturnType<typeof dbProjectsToSortedEntries> = [];
  try {
    projects = dbProjectsToSortedEntries(await getPublishedProjects());
  } catch (error) {
    console.error("Error loading projects for the header:", error);
  }
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header projects={projects} />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
