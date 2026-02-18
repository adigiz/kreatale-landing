/**
 * Slug helpers for demo routes. Detail and category URLs use the actual slug
 * from data (pkg.slug, dest.name, etc.) when present; otherwise a normalized
 * slug is derived for backwards compatibility.
 */

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Use actual slug from data when present; otherwise derive from title. */
export function getPackageSlug(pkg: { slug?: string; title: string } | undefined): string {
  if (!pkg) return "";
  if (pkg.slug != null && pkg.slug !== "") return pkg.slug;
  return slugify(pkg.title);
}

/** Use actual slug from data when present; otherwise derive from name. For destinations (e.g. cars). */
export function getDestinationSlug(dest: { slug?: string; name: string } | undefined): string {
  if (!dest) return "";
  if (dest.slug != null && dest.slug !== "") return dest.slug;
  return slugify(dest.name);
}
