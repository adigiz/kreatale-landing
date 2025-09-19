import { MetadataRoute } from "next";
import projectsData from "@/lib/projectsData.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kreatale.com";
  const currentDate = new Date().toISOString();
  const locales = ["en", "id"]; // Available locales

  // Static pages for each locale
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${locale}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ]);

  // Dynamic project pages for each locale
  const projectPages = locales.flatMap((locale) =>
    Object.keys(projectsData).map((slug) => ({
      url: `${baseUrl}/${locale}/projects/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...projectPages];
}
