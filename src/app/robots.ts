import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kreatale.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/en/admin/", // Disallow admin routes for English locale
          "/id/admin/", // Disallow admin routes for Indonesian locale
          "/api/",
          "/_next/",
          "/static/",
          "/sw.js",
          "/manifest.json",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

