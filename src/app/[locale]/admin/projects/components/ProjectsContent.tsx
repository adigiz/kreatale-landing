"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  LayoutGrid,
  LayoutList,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationData {
  title?: string;
  subtitle?: string;
  sections?: Record<string, { title: string; content: string[] }>;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  country: string | null;
  client: string | null;
  duration: string | null;
  timeline: string | null;
  heroImage: string | null;
  portfolioImage: string | null;
  projectType: string | null;
  techStacks: string[];
  translations?: { id?: TranslationData };
  demoUrl: string | null;
  locale: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function hasIdTranslation(project: Project): boolean {
  const t = project.translations?.id;
  if (!t) return false;
  return !!(
    t.title ||
    t.subtitle ||
    (t.sections && Object.keys(t.sections).length > 0)
  );
}

function LanguageBadges({ project }: { project: Project }) {
  const hasId = hasIdTranslation(project);
  return (
    <div className="flex gap-1">
      <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
        EN
      </span>
      {hasId && (
        <span className="text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
          ID
        </span>
      )}
    </div>
  );
}

interface ProjectsContentProps {
  projects: Project[];
  locale: string;
  initialSearch?: string;
  initialStatus?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
  published: "bg-green-100 text-green-700 border-green-200",
  archived: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function ProjectsContent({
  projects: allProjects,
  locale,
  initialSearch,
  initialStatus,
}: ProjectsContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState(initialSearch || "");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");

  // Client-side filtering
  let projects = allProjects;

  if (statusFilter) {
    projects = projects.filter((p) => p.status === statusFilter);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.subtitle?.toLowerCase().includes(searchLower) ||
        p.client?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search, Filters, and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={!statusFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("draft")}
          >
            Drafts
          </Button>
          <Button
            variant={statusFilter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("published")}
          >
            Published
          </Button>
          <div className="border-l border-border ml-1 pl-2 flex gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <LayoutList className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 rounded-lg border bg-card">
          No projects found
        </div>
      ) : viewMode === "grid" ? (
        <ProjectsGrid projects={projects} locale={locale} />
      ) : (
        <ProjectsTable projects={projects} locale={locale} />
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        Showing {projects.length} of {allProjects.length} projects
      </p>
    </div>
  );
}

function ProjectsGrid({
  projects,
  locale,
}: {
  projects: Project[];
  locale: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/${locale}/admin/projects/${project.id}`}
          className="rounded-lg border bg-card overflow-hidden hover:bg-accent/50 transition-colors group"
        >
          {project.heroImage ? (
            <div className="aspect-video bg-muted relative">
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-base text-foreground mb-1 group-hover:text-accent-foreground transition-colors">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {project.subtitle}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusColors[project.status] || ""}`}
                >
                  {project.status}
                </span>
                <LanguageBadges project={project} />
              </div>
              {project.client && (
                <span className="text-xs text-muted-foreground truncate ml-2">
                  {project.client}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProjectsTable({
  projects,
  locale,
}: {
  projects: Project[];
  locale: string;
}) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Project
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground hidden md:table-cell">
                Client
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground hidden md:table-cell">
                Country
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground hidden sm:table-cell">
                Type
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground hidden sm:table-cell">
                Lang
              </th>
              <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground hidden lg:table-cell">
                Updated
              </th>
              <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {project.heroImage ? (
                      <div className="relative size-10 rounded-md overflow-hidden border border-input shrink-0">
                        <Image
                          src={project.heroImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="size-10 rounded-md bg-muted border border-input shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">
                          N/A
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {project.title}
                      </p>
                      {project.subtitle && (
                        <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                  {project.client || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                  {project.country || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {project.projectType || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusColors[project.status] || ""}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <LanguageBadges project={project} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                  {new Date(project.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {project.demoUrl && isSafeUrl(project.demoUrl) && (
                      <Button variant="ghost" size="icon" className="size-7" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Demo"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      asChild
                    >
                      <Link
                        href={`/${locale}/admin/projects/${project.id}`}
                        title="Edit"
                      >
                        <Edit className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
