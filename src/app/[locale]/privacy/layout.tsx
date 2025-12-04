import type { Metadata } from "next";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Privacy Policy | Kreatale"
    : "Kebijakan Privasi | Kreatale";
  const description = isEnglish
    ? "Read Kreatale's Privacy Policy to understand how we collect, use, and protect your personal information."
    : "Baca Kebijakan Privasi Kreatale untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/privacy`,
    id: `${baseUrl}/id/privacy`,
    "x-default": `${baseUrl}/en/privacy`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/privacy`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - Privacy Policy",
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
      canonical: `${baseUrl}/${locale}/privacy`,
      languages,
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

