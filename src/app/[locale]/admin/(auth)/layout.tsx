import type { Metadata } from "next";

// Prevent search engines from indexing admin login page
export const metadata: Metadata = {
  title: "Admin Login | Kreatale",
  description: "Admin login page for Kreatale CMS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

// Route group layout that excludes login from admin layout
// This layout doesn't require auth - it's just a wrapper
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
