"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Gemoedje",
    description: "Website development",
    image: "/portfolio-1.png",
  },
  {
    title: "Car Rental",
    description: "Website development",
    image: "/portfolio-2.png",
  },
  {
    title: "Clinic",
    description: "Website Development",
    image: "/portfolio-3.png",
  },
];

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
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {projects.map((project, i) => (
              <CarouselItem
                key={`project-${i}`}
                className="basis-1/2 shrink-0 px-2"
              >
                <motion.div
                  className="h-full bg-gray-100 rounded-3xl flex flex-col overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.15,
                  }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 lg:p-6 flex h-full justify-between gap-3 items-center bg-white">
                    <div className="max-w-[60%]">
                      <h3 className="text-lg sm:text-xl font-bold text-black">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    <button className="border w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition">
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
                    </button>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
