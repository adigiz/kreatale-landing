import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
    formats: ["image/webp"],
  },
  compress: true,
};

export default nextConfig;
