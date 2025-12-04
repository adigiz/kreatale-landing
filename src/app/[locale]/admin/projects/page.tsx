import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Edit } from "lucide-react";
import Image from "next/image";
import { getAllProjects } from "@/lib/cms/queries/projects";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage({
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
  const allProjects = await getAllProjects();

  // Filter projects by status if provided
  let projects = allProjects;
  if (searchParamsData.status) {
    projects = allProjects.filter((p) => p.status === searchParamsData.status);
  }

  // Filter by search if provided
  if (searchParamsData.search) {
    const searchLower = searchParamsData.search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.subtitle?.toLowerCase().includes(searchLower) ||
        p.client?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your projects
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/projects/new`}>
            <Plus className="size-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <form className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <Link href={`/${locale}/admin/projects`}>All</Link>
          </Button>
          <Button
            variant={
              searchParamsData.status === "draft" ? "default" : "outline"
            }
            size="sm"
            asChild
          >
            <Link href={`/${locale}/admin/projects?status=draft`}>Drafts</Link>
          </Button>
          <Button
            variant={
              searchParamsData.status === "published" ? "default" : "outline"
            }
            size="sm"
            asChild
          >
            <Link href={`/${locale}/admin/projects?status=published`}>
              Published
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border bg-card overflow-hidden hover:bg-accent transition-colors"
            >
              {project.heroImage && (
                <div className="aspect-video bg-muted relative">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-base text-foreground mb-1">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.subtitle}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium">
                    {project.status}
                  </span>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${locale}/admin/projects/${project.id}`}>
                      <Edit className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
