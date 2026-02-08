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

  return (
    <>
      {!isAdminRoute && <Header projects={projects} />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
