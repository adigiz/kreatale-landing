import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kreatale.com"),
  title: "Our Services - Web Development, Mobile Apps & Training | Kreatale",
  description:
    "Discover Kreatale's comprehensive digital services including website development, web applications, mobile apps, and IT training. Expert solutions for modern businesses.",
  openGraph: {
    title: "Our Services - Web Development, Mobile Apps & Training | Kreatale",
    description:
      "Discover Kreatale's comprehensive digital services including website development, web applications, mobile apps, and IT training. Expert solutions for modern businesses.",
    type: "website",
    url: "https://kreatale.com/services",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kreatale Services - Web Development, Mobile Apps & Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services - Web Development, Mobile Apps & Training | Kreatale",
    description:
      "Discover Kreatale's comprehensive digital services including website development, web applications, mobile apps, and IT training.",
    images: ["/og-image.png"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
