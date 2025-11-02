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
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { sortProjects } from "@/lib/utils";

const createProjectsArray = (locale: string): PortfolioProject[] => {
  const projectEntries = Object.entries(projectsData);
  const sortedEntries = sortProjects(projectEntries);

  return sortedEntries.map(([slug, data]) => ({
    title: data.title,
    description: data.projectType || "Web Development",
    country: data.country || "Unknown",
    image: data.portfolioImage || "/portfolio-1.webp",
    link: `/${locale}/projects/${slug}`,
    slug: slug,
  }));
};

export default function Portfolio() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Create projects array with locale-aware links
  const projects = createProjectsArray(currentLocale);

  return (
    <section
      id="works"
      className="bg-white w-full flex flex-col  py-12 box-border"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 mb-8 lg:mb-8 px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-3 lg:gap-4">
          <p className="font-bold text-gray-400 uppercase text-xs sm:text-sm">
            {t("portfolio.subtitle")}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight">
            {t("portfolio.title")}
          </h2>
        </div>
        <div className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl">
          {t("portfolio.description")}
          <div className="mt-3 lg:mt-4">
            <Link href={`/${currentLocale}/projects`}>
              <button className="hover:cursor-pointer border-2 border-[#0061FF] text-[#0061FF] bg-white hover:bg-[#0061FF] hover:text-white px-5 py-3 rounded-full text-sm font-semibold transition-colors duration-200 hover:shadow-xl transform">
                {t("portfolio.viewAll")}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons & Carousel */}
      <div className="relative pl-0 pr-0">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            {projects.map((project, i) => (
              <CarouselItem
                key={`project-${i}`}
                className="basis-[85%] sm:basis-[60%] md:basis-[50%] lg:basis-[42%] shrink-0 pl-1 sm:pl-2 md:pl-4"
              >
                <Link href={project.link} className="block h-full">
                  <motion.div
                    className="h-full bg-gray-100 rounded-3xl flex flex-col overflow-hidden cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 85vw, 50vw"
                          quality={75}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-2 sm:p-3 lg:p-6 flex justify-between gap-2 sm:gap-3 items-center bg-white flex-1">
                        <div className="max-w-[60%]">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black">
                            {project.title}
                          </h3>
                          <div
                            id={`project-${i}-description`}
                            className="space-y-1"
                          >
                            <p className="text-xs sm:text-sm text-gray-500">
                              {project.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              {project.country}
                            </p>
                          </div>
                        </div>

                        <div className="border w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center pointer-events-none">
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
