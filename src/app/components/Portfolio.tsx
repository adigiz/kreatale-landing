"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import projectsData from "@/lib/projectsData.json";
import { PortfolioProject } from "@/lib/types";

// Map the JSON data to the portfolio format
const projects: PortfolioProject[] = Object.entries(projectsData).map(
  ([slug, data]) => ({
    title: data.title,
    description: getProjectType(slug),
    country: data.country || "Unknown", // Add country from data
    image: getPortfolioImage(slug),
    link: `/projects/${slug}`,
  })
);

function getProjectType(slug: string): string {
  switch (slug) {
    case "neon":
      return "Mobile Development";
    case "pescheck":
      return "Wordpress Customization";
    case "gemoedje":
      return "Web App Development";
    case "car-rental":
      return "Website Development";
    case "clinic":
      return "Website Development";
    case "jdm-vs-euro":
      return "Wordpress Customization";
    case "plumbing":
      return "Website Development";
    case "captloui":
      return "Website Development";
    case "ayobareng":
      return "Web App Development";
    default:
      return "Web Development";
  }
}

function getPortfolioImage(slug: string): string {
  const imageMap: { [key: string]: string } = {
    neon: "/portfolio-5.png",
    pescheck: "/portfolio-6.png",
    gemoedje: "/portfolio-1.png",
    "car-rental": "/portfolio-2.png",
    clinic: "/portfolio-3.png",
    "jdm-vs-euro": "/portfolio-4.png",
    plumbing: "/portfolio-7.png",
    ayobareng: "/portfolio-8.png",
    captloui: "/portfolio-9.png",
  };
  return imageMap[slug] || "/portfolio-1.png";
}

// Image Modal Component
function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-6xl max-h-[95vh] w-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white/90 backdrop-blur-sm text-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 z-30 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative w-full max-h-[85vh] aspect-video bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl p-2 sm:p-4">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain"
            sizes="95vw"
            priority
          />
        </div>

        {/* Title */}
        <div className="mt-3 sm:mt-6 text-center px-2">
          <h3 className="text-white text-lg sm:text-2xl font-semibold tracking-wide drop-shadow-lg">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
}

export default function Portfolio() {
  const [modalImage, setModalImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const openModal = (imageSrc: string, title: string) => {
    setModalImage({ src: imageSrc, title });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <section
      id="works"
      className="bg-white w-full flex flex-col px-4 sm:px-8 lg:px-16 py-12 box-border"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 mb-8 lg:mb-8">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="font-bold text-gray-400 uppercase text-xs sm:text-sm">
            Our Work
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight">
            We help businesses to make their <br className="hidden sm:block" />
            product come to life, worldwide.
          </h2>
        </div>
        <div className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl">
          Our experience has helped our clients launch new companies in the
          digital arena throughout the years. Take a look at some of our
          greatest work.
          <div className="mt-3 lg:mt-4">
            <Link href="/projects">
              <button className="hover:cursor-pointer bg-blue-100 text-blue-600 px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-blue-200 transition-colors">
                See all works
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable Work Cards */}
      <div></div>
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            {projects.map((project, i) => (
              <CarouselItem
                key={`project-${i}`}
                className="basis-[85%] sm:basis-[60%] md:basis-[50%] lg:basis-[42%] shrink-0 pl-1 sm:pl-2 md:pl-4"
              >
                <motion.div
                  className="h-full bg-gray-100 rounded-3xl flex flex-col overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.15,
                  }}
                >
                  <div className="h-full flex flex-col">
                    {/* Clickable Image */}
                    <div
                      className="relative aspect-[4/3] cursor-pointer"
                      onClick={() => openModal(project.image, project.title)}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content with Links */}
                    <div className="p-2 sm:p-3 lg:p-6 flex justify-between gap-2 sm:gap-3 items-center bg-white flex-1">
                      <Link
                        href={project.link}
                        className="max-w-[60%] hover:opacity-80 transition"
                      >
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black">
                          {project.title}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {project.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {project.country}
                          </p>
                        </div>
                      </Link>

                      <Link href={project.link}>
                        <motion.button
                          className="border w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalImage !== null}
        onClose={closeModal}
        imageSrc={modalImage?.src || ""}
        title={modalImage?.title || ""}
      />
    </section>
  );
}
