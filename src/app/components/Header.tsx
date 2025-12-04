"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import DesktopNav from "./DesktopNav";
import MobileBottomNav from "./MobileBottomNav";
import ProjectsBottomSheet from "./ProjectsBottomSheet";
import { sortProjects } from "@/lib/utils";

export default function Header() {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [projectsBottomSheetOpen, setProjectsBottomSheetOpen] = useState(false);
  // Initialize with false, will be set correctly on mount
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  // Use useLayoutEffect to check scroll position synchronously before paint
  useLayoutEffect(() => {
    // Check initial scroll position immediately to prevent flicker
    if (typeof window !== "undefined") {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    }
  }, []);

  // Set up scroll listener after initial render
  useEffect(() => {
    const checkScroll = () => {
      if (typeof window !== "undefined") {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);
      }
    };

    // Add scroll listener with passive for better performance
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = sortProjects(Object.entries(typedProjectsData)).slice(0, 5);

  return (
    <div
      className={`relative sticky z-50 ${
        isScrolled ? "px-4 md:px-8 top-5" : "top-0 px-0"
      }`}
    >
      <motion.nav
        className={`relative flex items-center justify-between bg-white transition-all duration-300 ${
          isScrolled
            ? "px-6 py-3 max-w-5xl mx-auto rounded-full"
            : "px-6 py-4 md:px-16 w-full rounded-none"
        } ${
          isScrolled
            ? "shadow-[0_10px_40px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-[20px]"
            : "shadow-[0_1px_3px_rgba(0,0,0,0.1)] backdrop-blur-0"
        }`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div
          className={`flex items-center ${
            isScrolled ? "gap-4 md:gap-8" : "gap-6 md:gap-16"
          }`}
        >
          <Link href={createLocalizedPath("/")} className="flex-shrink-0">
            <motion.div
              initial={false}
              animate={{
                scale: isScrolled ? 0.85 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                alt="logo"
                height={isScrolled ? 40 : 50}
                width={isScrolled ? 50 : 60}
                src="/kreatale-logo-primary.svg"
                className="transition-all duration-300"
              />
            </motion.div>
          </Link>

          <DesktopNav
            pathname={pathname}
            createLocalizedPath={createLocalizedPath}
            projects={projects}
            projectsDropdownOpen={projectsDropdownOpen}
            setProjectsDropdownOpen={setProjectsDropdownOpen}
            isScrolled={isScrolled}
          />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        pathname={pathname}
        createLocalizedPath={createLocalizedPath}
        onProjectsClick={() => setProjectsBottomSheetOpen(true)}
      />

      {/* Projects Bottom Sheet */}
      <ProjectsBottomSheet
        isOpen={projectsBottomSheetOpen}
        onClose={() => setProjectsBottomSheetOpen(false)}
        projects={projects}
        createLocalizedPath={createLocalizedPath}
      />
    </div>
  );
}
