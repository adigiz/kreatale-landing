"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, MessageCircle } from "lucide-react";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER, WHATSAPP_BASE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = Object.entries(typedProjectsData).sort(
    ([slugA], [slugB]) => {
      // Custom sorting order: ActiveNet, CaptLoui, Plumbing, Gemoedje, Neon, Pescheck, then rest
      const order = [
        "activenet",
        "captloui",
        "plumbing",
        "gemoedje",
        "neon",
        "pescheck",
      ];

      const aIndex = order.indexOf(slugA);
      const bIndex = order.indexOf(slugB);

      // If both are in the custom order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // If only one is in the custom order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // For the rest, sort alphabetically
      return slugA.localeCompare(slugB);
    }
  );

  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project!"
  );
  const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    ""
  )}?text=${whatsappMessage}`;

  return (
    <nav className="bg-white shadow-sm px-6 py-4 md:px-16 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-6 md:gap-16">
        <Link href={createLocalizedPath("/")}>
          <Image
            alt="logo"
            height={150}
            width={70}
            src="/kreatale-logo-primary.svg"
          />
        </Link>

        <div className="hidden md:flex gap-8 text-black">
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Desktop WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-[#0061FF] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <MessageCircle size={16} />
          {t("footer.whatsappUs")}
        </a>

        <motion.button
          className="md:hidden text-black p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={menuOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-100 px-6 py-6 md:hidden overflow-hidden"
          >
            {/* Main Navigation Links */}
            <div className="space-y-1 mb-6 pt-2">
              {[
                {
                  href: createLocalizedPath("/services"),
                  label: t("nav.services"),
                  isActive: pathname === createLocalizedPath("/services"),
                },
                {
                  href: createLocalizedPath("/about"),
                  label: t("nav.about"),
                  isActive: pathname === createLocalizedPath("/about"),
                },
                {
                  href: createLocalizedPath("/faq"),
                  label: t("nav.faq"),
                  isActive: pathname === createLocalizedPath("/faq"),
                },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                      item.isActive
                        ? "bg-blue-50 text-[#0061FF] font-semibold border-l-4 border-[#0061FF]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0061FF]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mb-6"
            >
              <div className="border-t border-gray-200 pt-4">
                <Link
                  href={createLocalizedPath("/projects")}
                  onClick={closeMobileMenu}
                  className={`block font-semibold mb-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                    pathname === createLocalizedPath("/projects")
                      ? "bg-blue-50 text-[#0061FF] border-l-4 border-[#0061FF]"
                      : "text-[#0061FF] hover:bg-blue-50"
                  }`}
                >
                  {t("nav.projects")}
                </Link>
                <div className="pl-4 space-y-2">
                  {projects.map(([slug, project], index) => (
                    <motion.div
                      key={slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.03, duration: 0.3 }}
                    >
                      <Link
                        href={createLocalizedPath(`/projects/${slug}`)}
                        onClick={closeMobileMenu}
                        className="block text-sm text-gray-600 hover:text-[#0061FF] transition-all duration-200 py-2 px-4 rounded-lg hover:bg-gray-50 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={project.heroImage}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-[#0061FF] transition-colors duration-200">
                              {project.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {project.client}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="border-t border-gray-200 pt-4"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#0061FF] to-blue-600 text-white px-6 py-4 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 w-full shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageCircle size={18} />
                {t("common.getStarted")}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
