import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata, SEO } from "@/redesign/metadata";
import "../globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
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
  // Defaults for every page; each page sets its own title/description via pageMetadata().
  const home = pageMetadata("home", locale);
  return {
    ...home,
    metadataBase: new URL(baseUrl),
    title: { default: SEO.home[locale === "id" ? "id" : "en"].title, template: "%s | Kreatale" },
    authors: [{ name: "Kreatale" }],
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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kreatale",
    url: baseUrl,
    logo: `${baseUrl}/kreatale-logo-primary.svg`,
    description: SEO.home[locale === "id" ? "id" : "en"].description,
    email: "info@kreatale.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressCountry: "ID",
    },
    sameAs: [
      "https://www.instagram.com/kreatale",
      "https://www.tiktok.com/@kreatale",
      "https://www.linkedin.com/company/kreatale",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@kreatale.com",
      availableLanguage: ["en", "id"],
    },
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} ${jakarta.variable} font-sans antialiased`}
      >
        {/* The redesigned pages bring their own header and footer and need no client-side
            translations. Toasts live in the admin layout, so public pages don't download them. */}
        {children}
      </body>
    </html>
  );
}
