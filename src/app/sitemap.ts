import { MetadataRoute } from "next";
import projectsData from "@/lib/projectsData.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kreatale.com";
  const currentDate = new Date().toISOString();
  const locales = ["en", "id"]; // Available locales

  // Static pages for each locale with alternate languages
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          id: `${baseUrl}/id`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          id: `${baseUrl}/id/about`,
          "x-default": `${baseUrl}/en/about`,
        },
      },
    },
    {
      url: `${baseUrl}/${locale}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/services`,
          id: `${baseUrl}/id/services`,
          "x-default": `${baseUrl}/en/services`,
        },
      },
    },
    {
      url: `${baseUrl}/${locale}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/faq`,
          id: `${baseUrl}/id/faq`,
          "x-default": `${baseUrl}/en/faq`,
        },
      },
    },
    {
      url: `${baseUrl}/${locale}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/projects`,
          id: `${baseUrl}/id/projects`,
          "x-default": `${baseUrl}/en/projects`,
        },
      },
    },
  ]);

  // Dynamic project pages for each locale with alternate languages
  const projectPages = locales.flatMap((locale) =>
    Object.keys(projectsData).map((slug) => ({
      url: `${baseUrl}/${locale}/projects/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/projects/${slug}`,
          id: `${baseUrl}/id/projects/${slug}`,
          "x-default": `${baseUrl}/en/projects/${slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...projectPages];
}
