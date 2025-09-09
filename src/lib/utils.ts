import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Custom project sorting order
 * Projects are sorted in this specific order, with any remaining projects at the end
 */
export const PROJECT_SORT_ORDER = [
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
export function sortProjects<T extends Record<string, any>>(
  projects: [string, T][]
): [string, T][] {
  return projects.sort(([slugA], [slugB]) => {
    const indexA = PROJECT_SORT_ORDER.indexOf(slugA as any);
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
