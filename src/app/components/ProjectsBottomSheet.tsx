"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectData } from "@/lib/types";

interface ProjectsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  projects: [string, ProjectData][];
  createLocalizedPath: (path: string) => string;
}

export default function ProjectsBottomSheet({
  isOpen,
  onClose,
  projects,
  createLocalizedPath,
}: ProjectsBottomSheetProps) {
  const t = useTranslations();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl md:hidden max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {t("portfolio.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {projects.map(([slug, project], index) => (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={createLocalizedPath(`/projects/${slug}`)}
                      onClick={onClose}
                      className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] border border-transparent hover:border-gray-200"
                    >
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-200/50 group-hover:ring-blue-200 transition-all duration-200">
                        <Image
                          src={project.heroImage}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-[#0061FF] transition-colors duration-200">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {project.client}
                        </div>
                      </div>
                      <ExternalLink
                        size={16}
                        className="text-gray-400 group-hover:text-[#0061FF] transition-colors duration-200 flex-shrink-0"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: projects.length * 0.05 + 0.1,
                  duration: 0.3,
                }}
                className="mt-6 pt-4 border-t border-gray-100"
              >
                <Link
                  href={createLocalizedPath("/projects")}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-[#0061FF] to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <span>View All Projects</span>
                  <ExternalLink size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

