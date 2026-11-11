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
          // /_next/ is not blocked: it serves the CSS, scripts, fonts and optimised images
          // search engines need to render the pages
          "/sw.js",
          "/manifest.json",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

