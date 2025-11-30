"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectData } from "@/lib/types";

// Animation variants
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

interface DesktopNavProps {
  pathname: string;
  createLocalizedPath: (path: string) => string;
  projects: [string, ProjectData][];
  projectsDropdownOpen: boolean;
  setProjectsDropdownOpen: (open: boolean) => void;
  isScrolled: boolean;
}

export default function DesktopNav({
  pathname,
  createLocalizedPath,
  projects,
  projectsDropdownOpen,
  setProjectsDropdownOpen,
  isScrolled,
}: DesktopNavProps) {
  const t = useTranslations();

  return (
    <motion.div
      className="hidden md:flex text-black"
      animate={{
        gap: isScrolled ? "1.5rem" : "2rem",
        fontSize: isScrolled ? "0.875rem" : "1rem",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Projects Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setProjectsDropdownOpen(true)}
        onMouseLeave={() => setProjectsDropdownOpen(false)}
      >
        <Link
          href={createLocalizedPath("/projects")}
          className={`flex items-center gap-1 transition-colors duration-200 ${
            pathname === createLocalizedPath("/projects")
              ? "text-blue-600 font-semibold"
              : "hover:text-blue-600"
          }`}
        >
          {t("nav.projects")}
          <motion.div
            animate={{ rotate: projectsDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </Link>

        <AnimatePresence>
          {projectsDropdownOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="px-3 py-2 text-sm text-gray-500 font-medium border-b border-gray-100 mb-1"
                >
                  {t("portfolio.title")}
                </motion.div>
                {projects.map(([slug, project], index) => (
                  <motion.div
                    key={slug}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={createLocalizedPath(`/projects/${slug}`)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                    >
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={project.heroImage}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="48px"
                                quality={70}
                              />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                            {project.title}
                          </h4>
                          <ExternalLink
                            size={12}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                          />
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {project.client}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: projects.length * 0.05 + 0.2 }}
                  className="mt-2 pt-2 border-t border-gray-100"
                >
                  <Link
                    href={createLocalizedPath("/projects")}
                    className="flex items-center justify-center gap-2 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    {t("portfolio.viewAll")}
                    <ExternalLink size={14} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Other Navigation Links */}
      <Link
        href={createLocalizedPath("/blog")}
        className={`transition-colors duration-200 ${
          pathname?.startsWith(createLocalizedPath("/blog"))
            ? "text-blue-600 font-semibold"
            : "hover:text-blue-600"
        }`}
      >
        Blog
      </Link>
      <Link
        href={createLocalizedPath("/services")}
        className={`transition-colors duration-200 ${
          pathname === createLocalizedPath("/services")
            ? "text-blue-600 font-semibold"
            : "hover:text-blue-600"
        }`}
      >
        {t("nav.services")}
      </Link>
      <Link
        href={createLocalizedPath("/about")}
        className={`transition-colors duration-200 ${
          pathname === createLocalizedPath("/about")
            ? "text-blue-600 font-semibold"
            : "hover:text-blue-600"
        }`}
      >
        {t("nav.about")}
      </Link>
      <Link
        href={createLocalizedPath("/faq")}
        className={`transition-colors duration-200 ${
          pathname === createLocalizedPath("/faq")
            ? "text-blue-600 font-semibold"
            : "hover:text-blue-600"
        }`}
      >
        {t("nav.faq")}
      </Link>
    </motion.div>
  );
}

