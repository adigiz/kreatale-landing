"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EstimationModal from "./EstimationModal";
import { useTranslations } from "next-intl";

type Testimonial = {
  text: string;
  author: string;
  role: string;
  company: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    text: "Really nice working with Giz. He was communicative and proactive. He brainstorm with me about how the features should look like and not always open for feedback",
    author: "Alonzo",
    role: "CEO",
    company: "Gemoedje",
    image: "/alonzo.png",
  },
  {
    text: "The work looks great. Huge improvement over the default templates.  The apple layout limitations were something unexpected but Giz still made it look good. We are very happy with his work",
    author: "Austin",
    role: "Event Manager",
    company: "JDM VS Euro",
    image: "/austin.webp",
  },
];

export default function Testimonials() {
  const t = useTranslations();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [showEstimator, setShowEstimator] = useState(false);

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
    <section
      id="testimonials"
      className="flex flex-col py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-16 bg-white min-h-screen overflow-hidden"
    >
      {/* Heading */}
      <motion.div
        className="lg:px-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="font-bold text-gray-400 uppercase text-xs sm:text-sm mb-2">
          {t("testimonials.subtitle")}
        </p>
        <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          {t("testimonials.title")}
        </h2>
      </motion.div>

      <div className="flex-1 h-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-center lg:px-20">
        <motion.div
          className="h-full overflow-hidden flex flex-col lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction === "right" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "right" ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-white px-4 sm:px-6 lg:px-12 py-6 lg:py-8 rounded-t-xl border border-gray-200 border-b-0"
            >
              <p className="text-base sm:text-lg lg:text-2xl text-black mb-4 sm:mb-6 leading-relaxed">
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 bg-gray-50 border border-gray-200 border-t-0 rounded-b-xl gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src={current.image}
                alt={current.author}
                width={48}
                height={48}
                className="rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {current.author}, {current.role}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  {current.company}
                </p>
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button
                onClick={() => paginate("left")}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
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
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
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
        </motion.div>

        {/* Estimation Box */}
        <motion.div
          className="h-full lg:col-span-1 bg-blue-600 text-white p-6 sm:p-8 lg:p-12 xl:p-16 rounded-xl flex flex-col items-center justify-center gap-6 lg:gap-8 xl:gap-10 min-h-[300px] lg:min-h-0"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <Image
            src="/calculator.png"
            alt="Calculator Icon"
            width={180}
            height={220}
            className="w-16 h-20 sm:w-20 sm:h-24 lg:w-18 lg:h-24"
          />
          <div className="text-center">
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 leading-tight">
              {t("estimation.subtitle")}
            </p>
            <button
              onClick={() => setShowEstimator(true)}
              className="w-full bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              {t("estimation.title")}
            </button>
          </div>
        </motion.div>
      </div>

      <EstimationModal
        show={showEstimator}
        onClose={() => setShowEstimator(false)}
      />
    </section>
  );
}
