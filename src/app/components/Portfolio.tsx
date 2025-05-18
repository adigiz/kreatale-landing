"use client";

import Image from "next/image";

const projects = [
  {
    title: "Bloomy, houseplants store",
    description: "Website development",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "We-famous, Influencers website",
    description: "Website development",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Fastbank, Mobile banking UI",
    description: "Website development",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Portfolio() {
  return (
    <section className="bg-white w-full flex flex-col px-4 sm:px-8 lg:px-16 py-12 box-border">
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
      <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <div className="flex gap-4 min-w-full">
          {projects.map((project, i) => (
            <div
              key={i}
              className="w-[85vw] sm:w-[60vw] lg:w-[45.5vw] flex-shrink-0 snap-start box-border"
            >
              <div className="h-full bg-gray-100 rounded-3xl flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex justify-between items-center bg-white">
                  <div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
