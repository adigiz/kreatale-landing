"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import projectsData from "@/lib/projectsData.json";
import { PortfolioProject } from "@/lib/types";

// Map the JSON data to the portfolio format
const projects: PortfolioProject[] = Object.entries(projectsData).map(
  ([slug, data]) => ({
    title: data.title,
    description: getProjectType(slug),
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
      return "Website Development";
    case "car-rental":
      return "Website Development";
    case "clinic":
      return "Website Development";
    case "jdm-vs-euro":
      return "Wordpress Customization";
    default:
      return "Web Development";
  }
}

function getPortfolioImage(slug: string): string {
  const imageMap: { [key: string]: string } = {
    "neon": "/portfolio-5.png",
    "pescheck": "/portfolio-6.png",
    "gemoedje": "/portfolio-1.png",
    "car-rental": "/portfolio-2.png",
    "clinic": "/portfolio-3.png",
    "jdm-vs-euro": "/portfolio-4.png",
  };
  return imageMap[slug] || "/portfolio-1.png";
}

export default function Portfolio() {
  return (
    <section
      id="works"
      className="bg-white w-full flex flex-col px-4 sm:px-8 lg:px-16 py-12 box-border"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
        <div className="flex flex-col gap-4">
          <p className="font-bold text-gray-400 uppercase text-sm">Our Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
            We help businesses to make their <br className="hidden sm:block" />
            product come to life, worldwide.
          </h2>
        </div>
        <div className="text-base sm:text-lg text-gray-500 max-w-2xl">
          Our experience has helped our clients launch new companies in the
          digital arena throughout the years. Take a look at some of our
          greatest work.
          <div className="mt-4">
            <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-semibold text-sm hover:bg-blue-200">
              See all works
            </button>
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
          <CarouselContent className="-ml-2 md:-ml-4">
            {projects.map((project, i) => (
              <CarouselItem
                key={`project-${i}`}
                className="basis-[42%] shrink-0 pl-2 md:pl-4"
              >
                <motion.div
                  className="h-full bg-gray-100 rounded-3xl flex flex-col overflow-hidden cursor-pointer"
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
                  <Link href={project.link} className="block h-full">
                    <div className="h-full flex flex-col">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 lg:p-6 flex justify-between gap-3 items-center bg-white flex-1">
                        <div className="max-w-[60%]">
                          <h3 className="text-lg sm:text-xl font-bold text-black">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {project.description}
                          </p>
                        </div>

                        <motion.button
                          className="border w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
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
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
