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
    ? "Blog | Kreatale"
    : "Blog | Kreatale";
  const description = isEnglish
    ? "Read our latest articles about web development, digital solutions, and technology insights."
    : "Baca artikel terbaru kami tentang pengembangan web, solusi digital, dan wawasan teknologi.";

  const languages: Record<string, string> = {
    en: `${baseUrl}/en/blog`,
    id: `${baseUrl}/id/blog`,
    "x-default": `${baseUrl}/en/blog`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale Blog",
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
      canonical: `${baseUrl}/${locale}/blog`,
      languages,
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}








