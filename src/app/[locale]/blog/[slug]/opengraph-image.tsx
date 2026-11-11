import { OG_CONTENT_TYPE, OG_SIZE, pageCard, postCard } from "@/redesign/og";
import { getPostBySlug } from "@/lib/cms/queries/posts";
import { blogCategoryLabel } from "@/lib/blogCategories";
import { shortDate } from "@/redesign/blog";

export const alt = "Kreatale blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const result = await getPostBySlug(slug, locale);
    if (result && result.post.status === "published") {
      const { post } = result;
      return postCard({
        title: post.title,
        category: blogCategoryLabel(post.category, locale),
        date: shortDate((post.publishedAt || post.createdAt).toISOString(), locale),
      });
    }
  } catch {
    // fall through to the generic blog card
  }
  return locale === "id"
    ? pageCard({ lines: ["Catatan dari", "studio"], sticker: "Blog Kreatale" })
    : pageCard({ lines: ["Notes from", "the studio"], sticker: "Kreatale blog" });
}
