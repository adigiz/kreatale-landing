import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kreatale.com"),
  title: "About Us - Kreatale Digital Agency | Web Development & Design",
  description:
    "Learn about Kreatale, a digital agency founded in 2017. We turn ideas into digital reality with expert web development, mobile apps, and innovative digital solutions.",
  openGraph: {
    title: "About Us - Kreatale Digital Agency | Web Development & Design",
    description:
      "Learn about Kreatale, a digital agency founded in 2017. We turn ideas into digital reality with expert web development, mobile apps, and innovative digital solutions.",
    type: "website",
    url: "https://kreatale.com/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Kreatale - Digital Agency Story & Values",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Kreatale Digital Agency | Web Development & Design",
    description:
      "Learn about Kreatale, a digital agency founded in 2017. We turn ideas into digital reality with expert web development, mobile apps, and innovative digital solutions.",
    images: ["/og-image.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
