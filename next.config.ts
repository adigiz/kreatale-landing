import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Enable preview mode for CMS live preview
  experimental: {
    // Preview mode is enabled by default in Next.js 15
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow larger request bodies for image uploads (default is 1MB)
  serverExternalPackages: ["cloudinary"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.pexel.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "morpheus.kreatale.com",
      },
      {
        protocol: "https",
        hostname: "s3.kreatale.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bromabakery.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "sojao.shop",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "fortes.vision",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Optimized for mobile-first: smaller sizes for mobile devices
    deviceSizes: [320, 375, 414, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  // Put title and description in <head> for every visitor, not streamed into the body
  // (Next 15 only does this for known bots by default, and some crawlers and audits miss it).
  htmlLimitedBots: /.*/,
  // The site is English. Indonesian lives on only in the blog (/id/blog), so every other
  // /id page goes to its English version. Admin, preview and API routes are left alone.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // other sites can't frame the site (the CMS preview frames it from the same origin)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /work became /projects (the URL search engines already know). The old per-project
      // pages are gone; Gala Esports has its case study, the rest go to the list.
      { source: "/:locale(en|id)/work", destination: "/en/projects", permanent: true },
      { source: "/:locale(en|id)/work/gala-esports", destination: "/en/projects/gala-esports", permanent: true },
      { source: "/:path(work|projects)", destination: "/en/projects", permanent: true },
      // pages typed without a locale (/about, /blog/some-post) go to the English version
      {
        source: "/:page(about|blog|contact|faq|services|privacy|terms|projects)/:rest*",
        destination: "/en/:page/:rest*",
        permanent: true,
      },
      {
        // skips the case study and the page's generated share image
        source: "/:locale(en|id)/projects/:slug((?!gala-esports$|opengraph-image|twitter-image)[^/]+)",
        destination: "/en/projects",
        permanent: true,
      },
      { source: "/id", destination: "/en", permanent: true },
      {
        source: "/id/:path((?!blog(?:/|$)|preview(?:/|$)|admin(?:/|$)|api(?:/|$)).+)",
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
