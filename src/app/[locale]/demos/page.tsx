import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getStaticPublishedDemoSites } from "@/lib/demos/static-demos";
import DemoSiteCards, { type DemoCardItem } from "./DemoSiteCards";

const baseUrl = "https://kreatale.com";

type DemoConfig = {
  websiteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
};

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demos" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/demos`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/demos`,
      languages: {
        en: `${baseUrl}/en/demos`,
        id: `${baseUrl}/id/demos`,
        "x-default": `${baseUrl}/en/demos`,
      },
    },
  };
}

export default async function DemosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tDemos = await getTranslations({ locale, namespace: "demos" });

  const rows = getStaticPublishedDemoSites();

  const items: DemoCardItem[] = rows.map(({ demoSite }) => {
    const config = demoSite.config as DemoConfig;
    const title =
      config.websiteName?.trim() ||
      config.heroTitle?.trim() ||
      slugToTitle(demoSite.slug);
    const subtitle =
      config.heroSubtitle?.trim() || tDemos("defaultSubtitle");
    const rawImage = config.heroImage?.trim();
    const imageSrc =
      rawImage && rawImage.length > 0 ? rawImage : "/og-image.png";

    return {
      slug: demoSite.slug,
      templateId: demoSite.templateId,
      title,
      subtitle,
      imageSrc,
    };
  });

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
        name: tDemos("pageTitle"),
        item: `${baseUrl}/${locale}/demos`,
      },
    ],
  };

  const pageTitle = tDemos("pageTitle");
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
      <div className="min-h-screen bg-gradient-to-b from-violet-50/40 to-white">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {otherWords && `${otherWords} `}
              <span className="text-blue-600">{lastWord}</span>
            </h1>
            <p className="text-xl text-gray-600">{tDemos("pageDescription")}</p>
          </div>
        </section>

        <DemoSiteCards items={items} locale={locale} />
      </div>
    </>
  );
}
