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
  const t = messages?.default?.about || {};

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "About Us | Kreatale - Web Development Agency"
    : "Tentang Kami | Kreatale - Agen Pengembangan Web";
  const description = isEnglish
    ? t.description ||
      "We are a passionate team of developers, designers, and digital strategists dedicated to creating innovative solutions that drive business growth."
    : t.description ||
      "Kami adalah tim yang passionate terdiri dari developer, designer, dan digital strategist yang berdedikasi untuk menciptakan solusi inovatif yang mendorong pertumbuhan bisnis.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/about`,
    id: `${baseUrl}/id/about`,
    "x-default": `${baseUrl}/en/about`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/about`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - About Us",
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
      canonical: `${baseUrl}/${locale}/about`,
      languages,
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

