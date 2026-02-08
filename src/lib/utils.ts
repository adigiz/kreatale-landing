import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProjectData, PortfolioProject } from "./types";
import type { Project } from "./cms/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a DB project row into a [slug, ProjectData] tuple
 */
export function dbProjectToProjectData(
  project: Project
): [string, ProjectData] {
  return [
    project.slug,
    {
      title: project.title,
      subtitle: project.subtitle || "",
      country: project.country || "",
      client: project.client || "",
      duration: project.duration || "",
      timeline: project.timeline || "",
      heroImage: project.heroImage || "",
      images: (project.images as string[]) || [],
      techStacks: (project.techStacks as string[]) || [],
      sections:
        (project.sections as Record<
          string,
          { title: string; content: string[] }
        >) || {},
      demoUrl: project.demoUrl || undefined,
      portfolioImage: project.portfolioImage || undefined,
      projectType: project.projectType || undefined,
    },
  ];
}

/**
 * Converts DB project rows into sorted [slug, ProjectData][] tuples
 */
export function dbProjectsToSortedEntries(
  dbProjects: Project[]
): [string, ProjectData][] {
  const entries = dbProjects.map(dbProjectToProjectData);
  return sortProjects(entries);
}

/**
 * Converts DB project rows into sorted PortfolioProject array (for homepage marquee)
 */
export function dbProjectsToPortfolioProjects(
  dbProjects: Project[],
  locale: string
): PortfolioProject[] {
  const sortedEntries = dbProjectsToSortedEntries(dbProjects);
  return sortedEntries.map(([slug, data]) => ({
    title: data.title,
    description: data.projectType || "Web Development",
    country: data.country || "Unknown",
    image: data.portfolioImage || data.heroImage || "/portfolio-1.webp",
    link: `/${locale}/projects/${slug}`,
    slug,
  }));
}

/**
 * Custom project sorting order
 * Projects are sorted in this specific order, with any remaining projects at the end
 */
export const PROJECT_SORT_ORDER = [
  "gala-esports",
  "gala-club",
  "max-up",
  "study-gorilla",
  "sy-grace",
  "zushino",
  "kei-truck-hub",
  "noproblem-digital",
  "land-sale-expert",
  "element-commercial",
  "allora-diamonds",
  "rizz-solutions",
  "activenet",
  "plumbing",
  "gemoedje",
  "neon",
  "pescheck",
  "ayobareng",
  "car-rental",
  "clinic",
  "jdm-vs-euro",
] as const;

/**
 * Sorts projects according to the predefined order
 * @param projects - Array of project entries [slug, data]
 * @returns Sorted array of project entries
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortProjects<T extends Record<string, any>>(
  projects: [string, T][]
): [string, T][] {
  return projects.sort(([slugA], [slugB]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const indexA = PROJECT_SORT_ORDER.indexOf(slugA as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const indexB = PROJECT_SORT_ORDER.indexOf(slugB as any);

    // If both projects are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one project is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither project is in the order array, maintain original order
    return 0;
  });
}
