"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, MessageCircle } from "lucide-react";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";

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

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = Object.entries(typedProjectsData);

  const whatsappNumber = "+6287852819078";
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project!"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    "+",
    ""
  )}?text=${whatsappMessage}`;

  return (
    <nav className="bg-white shadow-sm px-6 py-4 md:px-16 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-6 md:gap-16">
        <Link href="/">
          <Image
            alt="logo"
            height={150}
            width={70}
            src="/kreatale-logo-primary.svg"
          />
        </Link>
        <div className="hidden md:flex gap-8 text-black">
          <Link
            href="/#works"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Our Works
          </Link>
          <Link
            href="/#services"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Services
          </Link>
          <Link
            href="/#about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About
          </Link>

          {/* Projects Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProjectsDropdownOpen(true)}
            onMouseLeave={() => setProjectsDropdownOpen(false)}
          >
            <Link
              href="/projects"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
            >
              Projects
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
                      Featured Projects
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
                          href={`/projects/${slug}`}
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
                        href="/projects"
                        className="flex items-center justify-center gap-2 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                      >
                        View All Projects
                        <ExternalLink size={14} />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-[#0061FF] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <MessageCircle size={16} />
          WhatsApp Us
        </a>

        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-black absolute top-full left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col gap-4 md:hidden"
          >
            <Link href="#works" className="hover:underline">
              Works
            </Link>
            <Link href="#services" className="hover:underline">
              Services
            </Link>
            <Link href="#about" className="hover:underline">
              About
            </Link>

            {/* Mobile Projects Menu */}
            <div className="border-t pt-4">
              <Link
                href="/projects"
                className="block font-medium text-blue-600 mb-3"
              >
                Projects
              </Link>
              <div className="pl-4 space-y-2">
                {projects.map(([slug, project]) => (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#0061FF] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 w-fit shadow-lg"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
