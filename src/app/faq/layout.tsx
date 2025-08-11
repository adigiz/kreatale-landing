import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kreatale.com"),
  title: "FAQ - Frequently Asked Questions | Kreatale",
  description:
    "Find answers to common questions about Kreatale's web development services, project process, timeline, and what makes us different from other agencies.",
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Kreatale",
    description:
      "Find answers to common questions about Kreatale's web development services, project process, timeline, and what makes us different from other agencies.",
    type: "website",
    url: "https://kreatale.com/faq",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kreatale FAQ - Frequently Asked Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions | Kreatale",
    description:
      "Find answers to common questions about Kreatale's web development services, project process, timeline, and what makes us different from other agencies.",
    images: ["/og-image.png"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
