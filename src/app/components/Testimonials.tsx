"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  text: string;
  author: string;
  role: string;
  company: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    text: "It has been an honor to work with Reemax; they are an absolutely fantastic team. Every piece of work they've completed is flawless. Many users were amazed with the work's quality.",
    author: "Aaron Mario",
    role: "CEO",
    company: "We-famous",
    image: "https://i.pravatar.cc/300?img=1",
  },
  {
    text: "Reemax delivered beyond expectations. Their attention to detail and user experience is top-notch. I'd recommend them to anyone!",
    author: "Jane Doe",
    role: "CTO",
    company: "TechNova",
    image: "https://i.pravatar.cc/300?img=5",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const paginate = (newDirection: "left" | "right") => {
    setDirection(newDirection);
    setIndex((prev) =>
      newDirection === "right"
        ? (prev + 1) % testimonials.length
        : (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[index];

  return (
    <section className="py-16 px-4 md:px-16 bg-white">
      <div className="lg:px-20 ">
        <p className="font-bold text-gray-400 uppercase text-sm mb-2">
          Testimonials
        </p>
        <h2 className="text-black text-4xl lg:text-4xl font-bold mb-6">
          What they say about us
        </h2>
      </div>
      <div className="h-full mx-auto grid md:grid-cols-4 gap-8 items-center lg:px-20">
        <div className="h-full flex flex-col col-span-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
              transition={{ duration: 0.4 }}
              className="h-full md:col-span- bg-white px-12 py-8 rounded-t-xl border border-gray-200 border-b-0"
            >
              <p className="text-2xl text-black mb-6">“{current.text}”</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between px-12 py-8 bg-gray-50 border border-gray-200 border-t-0 rounded-b-xl">
            <div className="flex items-center gap-4">
              <Image
                src={current.image}
                alt={current.author}
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {current.author}, {current.role}
                </p>
                <p className="text-gray-500 text-sm">{current.company}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate("left")}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => paginate("right")}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
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

        {/* Estimation Box */}
        <div className="h-full col-span-3 lg:col-span-1 bg-blue-600 text-white p-16 rounded-xl flex flex-col items-center justify-center gap-32">
          <Image
            src="/calculator.png"
            alt="Calculator Icon"
            width={180}
            height={220}
            className="w-18 h-24"
          />
          <div className="flex flex-col justify-center items-center gap-8">
            <p className="text-3xl font-semibold text-center">
              Want to estimate your project?
            </p>
            <button className="w-40 bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition">
              Project estimation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
