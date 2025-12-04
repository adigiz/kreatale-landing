import type { Post } from "./cms/db/schema";

export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  publishedDate?: string;
  author?: string;
}

// Transform CMS post to BlogPost format
export function transformCmsPostToBlogPost(
  postData: {
    post: Post;
    author: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  }
): BlogPost {
  const { post, author } = postData;

  return {
    id: post.id,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || undefined,
    featuredImage: post.featuredImage || undefined,
    publishedDate: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    author: author?.name || author?.email || undefined,
  };
}

export function formatBlogDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getBlogPostUrl(slug: string, locale: string = "en"): string {
  return `/${locale}/blog/${slug}`;
}

export function getBlogListingUrl(locale: string = "en"): string {
  return `/${locale}/blog`;
}

