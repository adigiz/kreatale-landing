"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER, WHATSAPP_BASE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import DesktopNav from "./DesktopNav";
import MobileBottomNav from "./MobileBottomNav";
import ProjectsBottomSheet from "./ProjectsBottomSheet";
import { sortProjects } from "@/lib/utils";

export default function Header() {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [projectsBottomSheetOpen, setProjectsBottomSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = sortProjects(Object.entries(typedProjectsData)).slice(0, 5);

  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project!"
  );
  const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    ""
  )}?text=${whatsappMessage}`;

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
        }`}
        animate={{
          boxShadow: isScrolled
            ? "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)"
            : "0 1px 3px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div
          className={`flex items-center ${
            isScrolled ? "gap-4 md:gap-8" : "gap-6 md:gap-16"
          }`}
        >
          <Link href={createLocalizedPath("/")} className="flex-shrink-0">
            <motion.div
              animate={{
                scale: isScrolled ? 0.85 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                alt="logo"
                height={isScrolled ? 40 : 150}
                width={isScrolled ? 50 : 70}
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

          {/* Desktop WhatsApp CTA */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#0061FF] text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            animate={{
              paddingLeft: isScrolled ? "1rem" : "1.25rem",
              paddingRight: isScrolled ? "1rem" : "1.25rem",
              paddingTop: isScrolled ? "0.5rem" : "0.75rem",
              paddingBottom: isScrolled ? "0.5rem" : "0.75rem",
              fontSize: isScrolled ? "0.75rem" : "0.875rem",
            }}
            transition={{ duration: 0.3 }}
          >
            <MessageCircle size={isScrolled ? 14 : 16} />
            {t("footer.whatsappUs")}
          </motion.a>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        pathname={pathname}
        createLocalizedPath={createLocalizedPath}
        onProjectsClick={() => setProjectsBottomSheetOpen(true)}
        whatsappUrl={whatsappUrl}
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
