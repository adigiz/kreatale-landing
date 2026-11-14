import { redirect } from "next/navigation";
import { db, previewTokens, posts, type Post } from "@/lib/cms/db";
import { eq, and, gt } from "drizzle-orm";
import RedesignPage from "@/redesign/RedesignPage";
import { blogPostPage } from "@/redesign/blog";
import postTemplate from "@/redesign/generated/blog-post";
import blogTemplate from "@/redesign/generated/blog";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  // Validate preview token
  const [previewToken] = await db
    .select()
    .from(previewTokens)
    .where(
      and(
        eq(previewTokens.token, token),
        gt(previewTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!previewToken) {
    redirect(`/${locale}`);
  }

  // Only blog posts have previews now (the project editor was removed).
  let content: Post | null = null;
  if (previewToken.contentType === "post" && previewToken.contentId) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, previewToken.contentId))
      .limit(1);
    content = post ?? null;
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview Not Available
          </h1>
          <p className="text-gray-600">Content not found or not yet saved.</p>
        </div>
      </div>
    );
  }

  // same layout as the published article; the editor shows it in a device-sized frame
  const post = content;
  const page = blogPostPage(
    postTemplate,
    {
      id: post.id,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      featuredImage: post.featuredImage || undefined,
      publishedDate: (post.publishedAt || post.createdAt).toISOString(),
      category: post.category || undefined,
    },
    [],
    blogTemplate.covers,
    blogTemplate.featuredCover || "",
    post.locale || locale,
  );
  return <RedesignPage page={page} locale={locale} id="post-preview" />;
}
