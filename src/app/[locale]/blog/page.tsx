import RedesignPage from "@/redesign/RedesignPage";
import { blogIndexPage } from "@/redesign/blog";
import blogTemplate from "@/redesign/generated/blog";
import { getPublishedPosts } from "@/lib/cms/queries/posts";
import { transformCmsPostToBlogPost, type BlogPost } from "@/lib/blog";


// Revalidate every 60 seconds, but also allow on-demand revalidation
export const revalidate = 60;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let blogPosts: BlogPost[] = [];
  try {
    const posts = await getPublishedPosts(locale);
    blogPosts = posts.map(transformCmsPostToBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <RedesignPage
      page={blogIndexPage(blogTemplate, blogPosts, locale)}
      locale={locale}
      id="blog"
    />
  );
}
