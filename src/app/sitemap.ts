import { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/cms/queries/projects";
import { getPublishedPosts } from "@/lib/cms/queries/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kreatale.com";
  const currentDate = new Date().toISOString();
  const locales = ["en", "id"]; // Available locales

  // The site pages are English only (/id redirects to /en), so each is listed once
  const page = (
    path: string,
    changeFrequency: "weekly" | "monthly" | "yearly",
    priority: number,
  ) => ({
    url: `${baseUrl}/en${path}`,
    lastModified: currentDate,
    changeFrequency,
    priority,
  });
  const staticPages = [
    page("", "weekly", 1),
    page("/work", "weekly", 0.9),
    page("/work/gala-esports", "monthly", 0.8),
    page("/services", "monthly", 0.8),
    page("/about", "monthly", 0.8),
    page("/contact", "monthly", 0.8),
    page("/faq", "monthly", 0.7),
    page("/projects", "weekly", 0.7),
    page("/privacy", "yearly", 0.3),
    page("/terms", "yearly", 0.3),
    // the blog is the one part written in both languages
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: { en: `${baseUrl}/en/blog`, id: `${baseUrl}/id/blog`, "x-default": `${baseUrl}/en/blog` },
      },
    })),
  ];

  // Blog posts are written per language, so each one is listed under its own locale
  const blogPages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      for (const { post } of await getPublishedPosts(locale)) {
        blogPages.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt?.toISOString() || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    } catch (err) {
      console.warn("Sitemap: could not fetch posts (e.g. build without DB):", err);
    }
  }

  // Dynamic project pages from database (skip when DB unavailable at build time)
  let dbProjects: Awaited<ReturnType<typeof getPublishedProjects>> = [];
  try {
    dbProjects = await getPublishedProjects();
  } catch (err) {
    console.warn("Sitemap: could not fetch projects (e.g. build without DB):", err);
  }
  const projectPages = dbProjects.map((project) => ({
    url: `${baseUrl}/en/projects/${project.slug}`,
    lastModified: project.updatedAt?.toISOString() || currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
