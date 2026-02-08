import type { Metadata } from "next";
import Hero from "../components/Hero";
import Service from "../components/Service";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import ContactForm from "../components/ContactForm";
import Testimonials from "../components/Testimonials";
import { getPublishedProjects } from "@/lib/cms/queries/projects";
import { dbProjectsToPortfolioProjects } from "@/lib/utils";
import { getAboutStats, getCountriesFromProjects } from "@/lib/aboutData";

const baseUrl = "https://kreatale.com";

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

  const languages: Record<string, string> = {
    en: `${baseUrl}/en`,
    id: `${baseUrl}/id`,
    "x-default": `${baseUrl}/en`,
  };

  return {
    title: {
      default: title,
      absolute: title,
    },
    description,
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dbProjects = await getPublishedProjects();
  const portfolioProjects = dbProjectsToPortfolioProjects(dbProjects, locale);

  // Build a simple record for aboutData helpers
  const projectRecord = Object.fromEntries(
    dbProjects.map((p) => [p.slug, { country: p.country || "" }])
  );
  const aboutStats = getAboutStats(projectRecord);
  const countries = getCountriesFromProjects(projectRecord);

  return (
    <main style={{ minHeight: "100vh" }}>
      <Hero />
      <Service />
      <Portfolio projects={portfolioProjects} />
      <About aboutStats={aboutStats} countries={countries} />
      <ContactForm />
      <Testimonials />
    </main>
  );
}
