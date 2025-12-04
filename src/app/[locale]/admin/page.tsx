import { getSession } from "@/lib/cms/auth/config";
import { db, posts, projects, media, contacts } from "@/lib/cms/db";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, FolderKanban, Image, Eye, Mail } from "lucide-react";
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

  // Get contacts count (handle case where table doesn't exist yet)
  let contactsCount = { count: 0 };
  let unreadContactsCount = { count: 0 };
  try {
    [contactsCount] = await db.select({ count: count() }).from(contacts);
    [unreadContactsCount] = await db
      .select({ count: count() })
      .from(contacts)
      .where(eq(contacts.read, "false"));
  } catch (error) {
    // Table doesn't exist yet - will be created after migration
    console.warn(
      "Contacts table not found. Run 'npm run db:push' to create it."
    );
  }

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
    {
      name: "Inquiry",
      value: contactsCount.count,
      icon: Mail,
      href: `/${locale}/admin/contacts`,
      badge:
        unreadContactsCount.count > 0 ? unreadContactsCount.count : undefined,
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
              className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors relative"
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
                <div className="rounded-md border bg-muted p-2 relative">
                  <Icon className="size-4 text-muted-foreground" />
                  {stat.badge && stat.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stat.badge}
                    </span>
                  )}
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
