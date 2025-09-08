"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight, Code } from "lucide-react";
import projectsData from "@/lib/projectsData.json";
import { ProjectsDatabase } from "@/lib/types";

// Animation variants
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
          <motion.div
            className="flex justify-center items-center gap-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="flex items-center gap-1">
              <Code size={16} />
              {projects.length} Projects
            </span>
            <span>•</span>
            <span>Multiple Technologies</span>
            <span>•</span>
            <span>Satisfied Clients</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map(([slug, project]) => (
            <motion.div key={slug} variants={cardVariants} className="group">
              <Link href={`/projects/${slug}`}>
                <motion.div
                  variants={hoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {project.duration.split(" - ")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all duration-300">
                        <span>View Project</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
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
