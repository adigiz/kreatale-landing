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
  const t = messages?.default?.services || {};

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Our Services | Kreatale - Web Development & Digital Solutions"
    : "Layanan Kami | Kreatale - Pengembangan Web & Solusi Digital";
  const description = isEnglish
    ? t.hero?.description ||
      "From concept to deployment, we provide comprehensive digital services that help businesses grow and succeed online."
    : t.hero?.description ||
      "Dari konsep hingga deployment, kami menyediakan layanan digital yang komprehensif yang membantu bisnis tumbuh dan sukses secara online.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/services`,
    id: `${baseUrl}/id/services`,
    "x-default": `${baseUrl}/en/services`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/services`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - Our Services",
        },
      ],
      locale: isEnglish ? "en_US" : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages,
    },
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

