"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";
import { sortProjects } from "@/lib/utils";
import { usePathname } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const hoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function ProjectsPage() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const typedProjectsData = projectsData as ProjectsDatabase;
  const projects = sortProjects(Object.entries(typedProjectsData));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our <span className="text-blue-600">Projects</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore our portfolio of innovative digital solutions crafted for
            businesses across various industries
          </motion.p>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map(([slug, project]) => (
            <motion.div
              key={slug}
              variants={cardVariants}
              className="group h-full"
            >
              <Link
                href={createLocalizedPath(`/projects/${slug}`)}
                className="block h-full"
              >
                <motion.div
                  variants={hoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow duration-300 group-hover:shadow-xl h-full flex flex-col"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={70}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStacks.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStacks.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                          +{project.techStacks.length - 3}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.subtitle}
                    </p>

                    {/* Project Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{project.client}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{project.timeline}</span>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {project.duration.split(" - ")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
