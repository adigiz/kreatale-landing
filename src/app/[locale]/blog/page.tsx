import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/plasmic-cms";
import { transformPlasmicRowToBlogPost, formatBlogDate, getBlogPostUrl } from "@/lib/blog";

const baseUrl = "https://kreatale.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const title = `${t("title")} | Kreatale`;
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog`,
      siteName: "Kreatale",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kreatale Blog",
        },
      ],
      locale: locale === "en" ? "en_US" : "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        id: `${baseUrl}/id/blog`,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  let blogPosts = [];
  try {
    // Fetch blog posts with locale parameter for Plasmic's localization system
    const rows = await getAllBlogPosts(locale);
    blogPosts = rows.map(transformPlasmicRowToBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // If MODEL_ID is not set, show empty state with helpful message
    if (error instanceof Error && error.message.includes("PLASMIC_CMS_MODEL_ID")) {
      return (
        <main className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                <strong>{t("setupRequired")}:</strong> {t("setupMessage")}
              </p>
            </div>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-600 mb-12 text-lg">
          {t("description")}
        </p>

        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t("noPosts")}</p>
            <p className="text-gray-400 mt-2">
              {t("noPostsDescription")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={getBlogPostUrl(post.slug, locale)}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {post.featuredImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {post.publishedDate && (
                      <span>{formatBlogDate(post.publishedDate)}</span>
                    )}
                    {post.author && <span>{t("by")} {post.author}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

