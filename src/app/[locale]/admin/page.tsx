import { getSession } from "@/lib/cms/auth/config";
import { db, posts, projects, media } from "@/lib/cms/db";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, FolderKanban, Image, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  // Get counts
  const [postsCount] = await db.select({ count: count() }).from(posts);
  const [projectsCount] = await db.select({ count: count() }).from(projects);
  const [mediaCount] = await db.select({ count: count() }).from(media);
  const [publishedPostsCount] = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.status, "published"));

  const stats = [
    {
      name: "Total Posts",
      value: postsCount.count,
      icon: FileText,
      href: `/${locale}/admin/posts`,
    },
    {
      name: "Published Posts",
      value: publishedPostsCount.count,
      icon: Eye,
      href: `/${locale}/admin/posts?status=published`,
    },
    {
      name: "Projects",
      value: projectsCount.count,
      icon: FolderKanban,
      href: `/${locale}/admin/projects`,
    },
    {
      name: "Media Files",
      value: mediaCount.count,
      icon: Image,
      href: `/${locale}/admin/media`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-md border bg-muted p-2">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/${locale}/admin/posts/new`}>Create New Post</Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/projects/new`}>
              Create New Project
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/admin/media`}>Upload Media</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
