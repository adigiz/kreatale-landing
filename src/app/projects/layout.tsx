import type { Metadata } from "next";

interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Our Projects | Kreatale Web Development Agency",
  description:
    "Explore Kreatale's portfolio of successful web development projects that help businesses bring their vision to life through technology.",
  keywords: [
    "Kreatale",
    "web development projects",
    "portfolio",
    "business technology solutions",
    "custom websites",
    "Next.js agency",
  ],
  openGraph: {
    title: "Our Projects | Kreatale Web Development Agency",
    description:
      "Showcasing our portfolio of web development projects that turn ideas into reality.",
    url: "https://kreatale.com/projects",
    siteName: "Kreatale",
    images: [
      {
        url: "https://kreatale.com/og-image-projects.png",
        width: 1200,
        height: 630,
        alt: "Kreatale Web Development Projects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://kreatale.com/projects",
  },
};

export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  return <main className="min-h-screen">{children}</main>;
}
