import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const locales = ["en", "id"];
const baseUrl = "https://kreatale.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Kreatale | Web Development & Digital Solutions Agency"
    : "Kreatale | Agen Pengembangan Web & Solusi Digital";
  const description = isEnglish
    ? "Kreatale is a web development agency that builds fast, modern, and scalable websites & apps. We help businesses grow with custom solutions, clean design, and top-tier code."
    : "Kreatale adalah agensi pengembangan web yang membangun website & aplikasi yang cepat, modern, dan scalable. Kami membantu bisnis tumbuh dengan solusi custom, desain bersih, dan kode berkualitas tinggi.";

  // Generate hreflang URLs for current path
  // For base layout, we'll use the home page paths
  const languages: Record<string, string> = {
    en: `${baseUrl}/en`,
    id: `${baseUrl}/id`,
    "x-default": `${baseUrl}/en`,
  };

  return {
    title,
    description,
    keywords: isEnglish
      ? [
          "web development agency",
          "website design",
          "custom web apps",
          "Next.js development",
          "React development",
          "UI/UX design",
          "digital solutions",
          "Indonesia web development",
        ]
      : [
          "agensi pengembangan web",
          "desain website",
          "aplikasi web custom",
          "pengembangan Next.js",
          "pengembangan React",
          "desain UI/UX",
          "solusi digital",
          "pengembangan web Indonesia",
        ],
    authors: [{ name: "Kreatale" }],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale - Web Development Agency",
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
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = {};
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kreatale",
    url: baseUrl,
    logo: `${baseUrl}/kreatale-logo-primary.svg`,
    description:
      locale === "en"
        ? "Web development agency that builds fast, modern, and scalable websites & apps"
        : "Agensi pengembangan web yang membangun website & aplikasi yang cepat, modern, dan scalable",
    sameAs: [
      "https://www.instagram.com/kreatale",
      "https://www.tiktok.com/@kreatale",
      "https://www.linkedin.com/company/kreatale",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["en", "id"],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      ratingCount: "2",
      reviewCount: "2",
    },
  };

  return (
    <html lang={locale}>
      <head>
        <link
          rel="preload"
          href="/banner.jpg"
          as="image"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
