import type { Metadata } from "next";
import Hero from "../components/Hero";
import Service from "../components/Service";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import ContactForm from "../components/ContactForm";
import Testimonials from "../components/Testimonials";

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
    title,
    description,
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

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Hero />
      <Portfolio />
      <Service />
      <About />
      <ContactForm />
      <Testimonials />
    </main>
  );
}
