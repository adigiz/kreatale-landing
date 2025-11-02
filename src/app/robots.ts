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

