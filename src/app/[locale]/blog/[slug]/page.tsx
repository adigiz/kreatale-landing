import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getPublishedPosts, getPostBySlug } from "@/lib/cms/queries/posts";
import {
  transformCmsPostToBlogPost,
  formatBlogDate,
  getBlogListingUrl,
  type BlogPost,
} from "@/lib/blog";

const baseUrl = "https://kreatale.com";

export const revalidate = 60;

export async function generateStaticParams() {
  const locales = ["en", "id"];
  const allParams: Array<{ locale: string; slug: string }> = [];

  try {
    for (const locale of locales) {
      const posts = await getPublishedPosts(locale);
      const blogPosts = posts.map(transformCmsPostToBlogPost);

      for (const post of blogPosts) {
        if (post.slug) {
          allParams.push({
            locale,
            slug: post.slug,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
  }

  return allParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  let post: BlogPost | null = null;
  try {
    const result = await getPostBySlug(slug, locale);

    // Only show published posts
    if (result && result.post.status === "published") {
      post = transformCmsPostToBlogPost(result);
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  if (!post) {
    return {
      title: "Post Not Found | Kreatale Blog",
    };
  }

  const title = `${post.title} | Kreatale Blog`;
  const description = post.excerpt || post.title;
  const publishedTime = post.publishedDate || post.createdAt;
  const modifiedTime = post.updatedAt;

  // For alternate locales, try to find the same post by slug in other locales
  const alternateSlugs: Record<string, string> = {
    [locale]: slug,
  };

  const otherLocales = ["en", "id"].filter((l) => l !== locale);
  for (const altLocale of otherLocales) {
    try {
      const altResult = await getPostBySlug(slug, altLocale);
      if (altResult && altResult.post.status === "published") {
        alternateSlugs[altLocale] = altResult.post.slug;
      } else {
        alternateSlugs[altLocale] = slug;
      }
    } catch {
      alternateSlugs[altLocale] = slug;
    }
  }

  return {
    title,
    description,
    keywords: post.excerpt
      ? [post.title, ...post.excerpt.split(" ").slice(0, 5)]
      : [post.title],
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      siteName: "Kreatale",
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: "Kreatale Blog",
            },
          ],
      locale: locale === "en" ? "en_US" : "id_ID",
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : ["/og-image.png"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        en: `${baseUrl}/en/blog/${alternateSlugs.en || slug}`,
        id: `${baseUrl}/id/blog/${alternateSlugs.id || slug}`,
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  let post: BlogPost | null = null;
  try {
    const result = await getPostBySlug(slug, locale);

    // Only show published posts
    if (result && result.post.status === "published") {
      post = transformCmsPostToBlogPost(result);
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage || `${baseUrl}/og-image.png`,
    datePublished: post.publishedDate || post.createdAt,
    dateModified: post.updatedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : {
          "@type": "Organization",
          name: "Kreatale",
        },
    publisher: {
      "@type": "Organization",
      name: "Kreatale",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/kreatale-logo-primary.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <div className="max-w-4xl mx-auto">
        <Link
          href={getBlogListingUrl(locale)}
          className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
        >
          {t("backToBlog")}
        </Link>

        <article itemScope itemType="https://schema.org/BlogPosting">
          {post.featuredImage && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                quality={80}
              />
            </div>
          )}

          <header className="mb-8">
            <h1
              itemProp="headline"
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              {post.publishedDate && (
                <time itemProp="datePublished" dateTime={post.publishedDate}>
                  {formatBlogDate(post.publishedDate)}
                </time>
              )}
              {post.author && (
                <span
                  itemProp="author"
                  className="before:content-['•'] before:mr-4"
                >
                  By {post.author}
                </span>
              )}
            </div>
          </header>

          <div
            itemProp="articleBody"
            className="blog-content text-gray-800 leading-relaxed space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </main>
  );
}
