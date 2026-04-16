import { MetadataRoute } from "next";
import { getStaticPublishedDemoSites } from "@/lib/demos/static-demos";
import { getPublishedProjects } from "@/lib/cms/queries/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    {
      url: `${baseUrl}/${locale}/demos`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: {
        languages: {
          en: `${baseUrl}/en/demos`,
          id: `${baseUrl}/id/demos`,
          "x-default": `${baseUrl}/en/demos`,
        },
      },
    },
  ]);

  // Dynamic project pages from database (skip when DB unavailable at build time)
  let dbProjects: Awaited<ReturnType<typeof getPublishedProjects>> = [];
  try {
    dbProjects = await getPublishedProjects();
  } catch (err) {
    console.warn("Sitemap: could not fetch projects (e.g. build without DB):", err);
  }
  const projectPages = locales.flatMap((locale) =>
    dbProjects.map((project) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: project.updatedAt?.toISOString() || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/projects/${project.slug}`,
          id: `${baseUrl}/id/projects/${project.slug}`,
          "x-default": `${baseUrl}/en/projects/${project.slug}`,
        },
      },
    }))
  );

  const publishedDemos = getStaticPublishedDemoSites();
  const demoPages = locales.flatMap((locale) =>
    publishedDemos.map(({ demoSite }) => ({
      url: `${baseUrl}/${locale}/demos/${demoSite.slug}`,
      lastModified: demoSite.updatedAt?.toISOString() || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: {
        languages: {
          en: `${baseUrl}/en/demos/${demoSite.slug}`,
          id: `${baseUrl}/id/demos/${demoSite.slug}`,
          "x-default": `${baseUrl}/en/demos/${demoSite.slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...projectPages, ...demoPages];
}
