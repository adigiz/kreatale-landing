import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kreatale.com"),
  title: "Kreatale | Web Development & Digital Solutions Agency",
  description:
    "Kreatale is a web development agency that builds fast, modern, and scalable websites & apps. We help businesses grow with custom solutions, clean design, and top-tier code.",
  keywords: [
    "web development agency",
    "website design",
    "custom web apps",
    "Next.js development",
    "React development",
    "UI/UX design",
    "digital solutions",
    "Indonesia web development",
  ],
  authors: [{ name: "Kreatale" }],

  openGraph: {
    title: "Kreatale | Web Development & Digital Solutions Agency",
    description:
      "We create high-performance websites, web apps, and digital solutions tailored to your business needs.",
    url: "https://kreatale.com",
    siteName: "Kreatale",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kreatale - Web Development Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreatale | Web Development & Digital Solutions Agency",
    description:
      "We create high-performance websites, web apps, and digital solutions tailored to your business needs.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://kreatale.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
