import { PlasmicCMSRow } from "./plasmic-cms";

export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  identifier: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  publishedDate?: string;
  author?: string;
}

export function transformPlasmicRowToBlogPost(row: PlasmicCMSRow): BlogPost {
  return {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    identifier: row.identifier,
    title: (row.data.title as string) || "",
    slug: (row.data.slug as string) || "",
    content: (row.data.content as string) || "",
    excerpt: (row.data.excerpt as string) || "",
    featuredImage: (row.data.featuredImage as string) || "",
    publishedDate: (row.data.publishedDate as string) || row.createdAt,
    author: (row.data.author as string) || "",
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

