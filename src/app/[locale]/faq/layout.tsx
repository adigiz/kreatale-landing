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
  const t = messages?.default?.faq || {};

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "FAQ | Frequently Asked Questions - Kreatale"
    : "FAQ | Pertanyaan yang Sering Diajukan - Kreatale";
  const description = isEnglish
    ? t.description ||
      "Find answers to common questions about our services and processes."
    : t.description ||
      "Temukan jawaban untuk pertanyaan umum tentang layanan dan proses kami.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/faq`,
    id: `${baseUrl}/id/faq`,
    "x-default": `${baseUrl}/en/faq`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/faq`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - FAQ",
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
      canonical: `${baseUrl}/${locale}/faq`,
      languages,
    },
  };
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

