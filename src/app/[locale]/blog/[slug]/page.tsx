import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RedesignPage from "@/redesign/RedesignPage";
import { blogPostPage } from "@/redesign/blog";
import postTemplate from "@/redesign/generated/blog-post";
import blogTemplate from "@/redesign/generated/blog";
import { getPublishedPosts, getPostBySlug } from "@/lib/cms/queries/posts";
import { transformCmsPostToBlogPost, type BlogPost } from "@/lib/blog";

const baseUrl = "https://kreatale.com";

export const revalidate = 60;
// Allow dynamic params not in generateStaticParams (for new posts created after build)
export const dynamicParams = true;

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
      title: "Post not found",
    };
  }

  const title = post.title;
  const description = post.excerpt || post.title;
  const publishedTime = post.publishedDate || post.createdAt;
  const modifiedTime = post.updatedAt;

  return {
    // the blog layout sets its own title, so add the brand here
    title: { absolute: `${title} | Kreatale` },
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      siteName: "Kreatale",
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
    },
    // translated posts have their own slugs, so each post only declares itself
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: { [locale]: `${baseUrl}/${locale}/blog/${slug}` },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
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
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage || `${baseUrl}/${locale}/blog/${slug}/opengraph-image`,
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

  let more: BlogPost[] = [];
  try {
    more = (await getPublishedPosts(locale))
      .map(transformCmsPostToBlogPost)
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related posts:", error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <RedesignPage
        page={blogPostPage(
          postTemplate,
          post,
          more,
          blogTemplate.covers,
          blogTemplate.featuredCover || "",
          locale,
        )}
        locale={locale}
        id="blog-post"
      />
    </>
  );
}
