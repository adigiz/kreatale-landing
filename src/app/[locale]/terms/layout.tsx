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
    ? "Terms of Service | Kreatale"
    : "Syarat Layanan | Kreatale";
  const description = isEnglish
    ? "Read Kreatale's Terms of Service to understand the terms and conditions for using our services."
    : "Baca Syarat Layanan Kreatale untuk memahami syarat dan ketentuan penggunaan layanan kami.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/terms`,
    id: `${baseUrl}/id/terms`,
    "x-default": `${baseUrl}/en/terms`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/terms`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - Terms of Service",
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
      canonical: `${baseUrl}/${locale}/terms`,
      languages,
    },
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
