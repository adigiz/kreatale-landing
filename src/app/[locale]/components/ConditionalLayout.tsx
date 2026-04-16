"use client";

import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ProjectData } from "@/lib/types";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  projects: [string, ProjectData][];
}

export default function ConditionalLayout({
  children,
  projects,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes("/admin") || false;
  // Full-screen demo: /{locale}/demos/{slug}/... — not /{locale}/demos (listing)
  const isDemoRoute =
    Boolean(pathname && /\/[a-z]{2}\/demos\/.+/i.test(pathname));
  const isPreviewRoute = pathname?.includes("/preview") || false;

  return (
    <>
      {!isAdminRoute && !isDemoRoute && !isPreviewRoute && (
        <Header projects={projects} />
      )}
      {children}
      {!isAdminRoute && !isDemoRoute && !isPreviewRoute && <Footer />}
    </>
  );
}
