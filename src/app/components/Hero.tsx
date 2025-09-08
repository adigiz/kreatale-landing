"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();

  return (
    <section
      id="hero"
      className="bg-white min-h-[calc(100vh-80px)] flex-1 text-white px-4 sm:px-8 lg:px-16 py-8 flex items-stretch relative overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-20 right-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, delay: 1.5 }}
        className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500 rounded-full blur-2xl"
      />

      <div className="flex flex-col md:flex-row gap-8 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="relative flex-[3] rounded-3xl overflow-hidden min-h-[50vh] md:min-h-full"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <div className="w-full h-full">
              <Image
                src="/banner.webp"
                alt={`${t("hero.title")} - ${t("hero.subtitle")}`}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-8 px-6 sm:px-10 md:px-16 bg-gradient-to-t from-black/60 to-transparent w-full"
          >
            <div className="flex flex-col">
              <motion.p
                initial={{ opacity: 0, x: -20, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xs sm:text-sm uppercase tracking-widest text-white/70"
              >
                {t("hero.subtitle")}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="block"
                >
                  {t("hero.title")}
                </motion.span>
              </motion.h1>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 80,
          }}
          className="hidden flex-[1] lg:flex justify-center"
        >
          <Link
            href="https://gemoedje-web-app.vercel.app/"
            aria-label={`View ${t("hero.projectName")} project - ${t(
              "hero.latestWork"
            )}`}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 0.5, 0],
              }}
              whileHover={{
                scale: 1.02,
                y: -8,
                rotate: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl w-full max-w-sm h-full flex flex-col justify-start"
            >
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="overflow-hidden rounded-2xl mb-4"
              >
                <Image
                  src="/current-project.png"
                  alt={`Screenshot of ${t(
                    "hero.projectName"
                  )} project showing the main interface`}
                  width={400}
                  height={250}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                  sizes="400px"
                  quality={75}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-between items-center px-4 pb-4"
              >
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="text-xs sm:text-sm uppercase text-gray-400"
                  >
                    {t("hero.latestWork")}
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="text-2xl sm:text-3xl font-bold text-black"
                  >
                    {t("hero.projectName")}
                  </motion.h2>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: "#000000",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`View ${t("hero.projectName")} project details`}
                  className="border w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <motion.svg
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
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
                  </motion.svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
