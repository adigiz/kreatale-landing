/** Blog post categories. Used by the post editor, the CMS API and the blog filters. */
export const BLOG_CATEGORIES = [
  { id: "web", label: "Websites", labelId: "Website" },
  { id: "shop", label: "Online stores", labelId: "Toko online" },
  { id: "apps", label: "Apps", labelId: "Aplikasi" },
  { id: "seo", label: "Marketing & SEO", labelId: "Pemasaran & SEO" },
  { id: "business", label: "Business & tech", labelId: "Bisnis & teknologi" },
  { id: "studio", label: "Behind the scenes", labelId: "Di balik layar" },
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]["id"];

export const BLOG_CATEGORY_IDS = BLOG_CATEGORIES.map((c) => c.id) as [
  BlogCategoryId,
  ...BlogCategoryId[],
];

export function blogCategoryLabel(id?: string | null, locale = "en") {
  const c = BLOG_CATEGORIES.find((c) => c.id === id);
  return c && (locale === "id" ? c.labelId : c.label);
}
