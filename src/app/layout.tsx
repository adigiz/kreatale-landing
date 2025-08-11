import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

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
  other: {
    "theme-color": "#0061FF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/banner.webp" as="image" type="image/webp" />
        <link
          rel="preload"
          href="/current-project.png"
          as="image"
          type="image/png"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.pixabay.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0061FF" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
