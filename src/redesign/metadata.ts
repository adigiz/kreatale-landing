import type { Metadata } from "next";

export const BASE_URL = "https://kreatale.com";

/**
 * Titles and descriptions for every page, in one place.
 * Titles get " | Kreatale" from the root layout's template (home sets its own in full).
 * Social images come from the opengraph-image files next to each route, so none are set here.
 */
export const SEO = {
  home: {
    path: "",
    en: {
      title: "Kreatale · Websites and apps for big ideas",
      description:
        "Kreatale is a web and app studio in Jakarta. We design and build websites, online stores and apps on WordPress, Shopify, Next.js or custom code, and look after them after launch.",
    },
    id: {
      title: "Kreatale · Website dan aplikasi untuk ide besar",
      description:
        "Kreatale adalah studio web dan aplikasi di Jakarta. Kami merancang dan membangun website, toko online, dan aplikasi dengan WordPress, Shopify, Next.js, atau kode custom, dan tetap merawatnya setelah diluncurkan.",
    },
  },
  work: {
    path: "/work",
    en: {
      title: "Work",
      description:
        "Websites, online stores and apps we've designed and built for gaming cafés, clinics, jewellers, startups and more, in Australia, Europe, Japan, the US and Indonesia.",
    },
    id: {
      title: "Karya",
      description:
        "Website, toko online, dan aplikasi yang kami rancang dan bangun untuk kafe gaming, klinik, toko perhiasan, startup, dan lainnya, di Australia, Eropa, Jepang, AS, dan Indonesia.",
    },
  },
  gala: {
    path: "/work/gala-esports",
    en: {
      title: "Gala Esports case study",
      description:
        "How we redesigned and rebuilt the website for Gala Esports, a chain of gaming cafés in Australia, so it's faster and easier to find.",
    },
    id: {
      title: "Studi kasus Gala Esports",
      description:
        "Bagaimana kami mendesain ulang dan membangun kembali website Gala Esports, jaringan kafe gaming di Australia, agar lebih cepat dan mudah ditemukan.",
    },
  },
  services: {
    path: "/services",
    en: {
      title: "What we do",
      description:
        "Websites, online stores, web apps, mobile apps, SEO and care plans. WordPress, Shopify, Next.js or custom code, chosen for what your business actually needs.",
    },
    id: {
      title: "Layanan kami",
      description:
        "Website, toko online, aplikasi web, aplikasi mobile, SEO, dan paket perawatan. WordPress, Shopify, Next.js, atau kode custom, dipilih sesuai kebutuhan bisnis Anda.",
    },
  },
  about: {
    path: "/about",
    en: {
      title: "About",
      description:
        "Kreatale is a small web and app studio in Jakarta. Since 2024 we've built websites, shops and apps for clients in Australia, the Netherlands, Japan, the US and Indonesia.",
    },
    id: {
      title: "Tentang kami",
      description:
        "Kreatale adalah studio web dan aplikasi kecil di Jakarta. Sejak 2024 kami membangun website, toko online, dan aplikasi untuk klien di Australia, Belanda, Jepang, AS, dan Indonesia.",
    },
  },
  contact: {
    path: "/contact",
    en: {
      title: "Contact",
      description:
        "Tell us what you're planning. We reply within one business day with questions, ideas and next steps, on WhatsApp or at info@kreatale.com.",
    },
    id: {
      title: "Kontak",
      description:
        "Ceritakan rencana Anda. Kami membalas dalam satu hari kerja dengan pertanyaan, ide, dan langkah selanjutnya, lewat WhatsApp atau info@kreatale.com.",
    },
  },
  blog: {
    path: "/blog",
    en: {
      title: "Blog",
      description:
        "Guides and stories about building websites, online stores and apps, from the people who build them.",
    },
    id: {
      title: "Blog",
      description:
        "Panduan dan cerita tentang membangun website, toko online, dan aplikasi, dari orang-orang yang membangunnya.",
    },
  },
  faq: {
    path: "/faq",
    en: {
      title: "FAQ",
      description:
        "Answers to what people ask before, during and after a website or app project: platforms, ownership, communication, support and how to get started.",
    },
    id: {
      title: "FAQ",
      description:
        "Jawaban atas pertanyaan yang sering muncul sebelum, selama, dan setelah proyek website atau aplikasi: platform, kepemilikan, komunikasi, dukungan, dan cara memulai.",
    },
  },
  privacy: {
    path: "/privacy",
    en: {
      title: "Privacy policy",
      description:
        "How Kreatale collects, uses and protects the information you share through this website and our services.",
    },
    id: {
      title: "Kebijakan privasi",
      description:
        "Cara Kreatale mengumpulkan, menggunakan, dan melindungi informasi yang Anda bagikan melalui website dan layanan kami.",
    },
  },
  terms: {
    path: "/terms",
    en: {
      title: "Terms of service",
      description:
        "The terms for using the Kreatale website and working with us on websites, online stores and apps.",
    },
    id: {
      title: "Syarat layanan",
      description:
        "Ketentuan penggunaan website Kreatale dan kerja sama dengan kami untuk website, toko online, dan aplikasi.",
    },
  },
} as const;

export type SeoPage = keyof typeof SEO;

/** Full metadata for a page: title, description, canonical, hreflang, Open Graph and Twitter. */
export function pageMetadata(page: SeoPage, locale: string): Metadata {
  const entry = SEO[page];
  const copy = locale === "id" ? entry.id : entry.en;
  const url = `${BASE_URL}/${locale}${entry.path}`;
  // only the blog index exists in Indonesian; the other /id pages redirect to /en
  const bilingual = page === "blog";
  return {
    title: page === "home" ? { absolute: copy.title } : copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: bilingual
        ? {
            en: `${BASE_URL}/en${entry.path}`,
            id: `${BASE_URL}/id${entry.path}`,
            "x-default": `${BASE_URL}/en${entry.path}`,
          }
        : { en: url, "x-default": url },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName: "Kreatale",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}

/** For pages that have their own generateMetadata. */
export const metadataFor =
  (page: SeoPage) =>
  async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> =>
    pageMetadata(page, (await params).locale);
