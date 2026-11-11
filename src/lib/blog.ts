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
  category?: string;
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
    category: post.category || undefined,
  };
}
