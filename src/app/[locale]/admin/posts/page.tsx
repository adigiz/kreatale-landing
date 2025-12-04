import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Edit } from "lucide-react";
import { getAllPosts } from "@/lib/cms/queries/posts";
import { Button } from "@/components/ui/button";
import DeletePostButton from "./DeletePostButton";

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const searchParamsData = await searchParams;
  const allPosts = await getAllPosts();

  // Filter posts by status if provided
  let posts = allPosts;
  if (searchParamsData.status) {
    posts = allPosts.filter((p) => p.post.status === searchParamsData.status);
  }

  // Filter by search if provided
  if (searchParamsData.search) {
    const searchLower = searchParamsData.search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.post.title.toLowerCase().includes(searchLower) ||
        p.post.excerpt?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your blog posts
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`}>
            <Plus className="size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <form
          className="flex-1"
          action={async (formData) => {
            "use server";
            const search = formData.get("search") as string;
            redirect(
              `/${locale}/admin/posts?search=${encodeURIComponent(
                search || ""
              )}`
            );
          }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Search posts..."
              defaultValue={searchParamsData.search}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Button
            variant={!searchParamsData.status ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/${locale}/admin/posts`}>All</Link>
          </Button>
          <Button
            variant={
              searchParamsData.status === "draft" ? "default" : "outline"
            }
            size="sm"
            asChild
          >
            <Link href={`/${locale}/admin/posts?status=draft`}>Drafts</Link>
          </Button>
          <Button
            variant={
              searchParamsData.status === "published" ? "default" : "outline"
            }
            size="sm"
            asChild
          >
            <Link href={`/${locale}/admin/posts?status=published`}>
              Published
            </Link>
          </Button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Author
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Locale
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No posts found
                  </td>
                </tr>
              ) : (
                posts.map(({ post, author }) => (
                  <tr
                    key={post.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="text-sm font-medium text-foreground">
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className="text-sm text-muted-foreground truncate max-w-md mt-1">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {author?.name || author?.email || "Unknown"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium">
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {post.locale}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/${locale}/admin/posts/${post.id}`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <DeletePostButton postId={post.id} locale={locale} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
