"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-white min-h-[calc(100vh-80px)] flex-1 text-white px-4 sm:px-8 lg:px-16 py-8 flex items-stretch"
    >
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex-[3] rounded-3xl overflow-hidden min-h-[50vh] md:min-h-full"
        >
          <Image
            src="/banner.webp"
            alt="Gradient Keyboard"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
          <div className="absolute bottom-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-8 px-6 sm:px-10 md:px-16 bg-gradient-to-t from-black/60 to-transparent w-full">
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70">
                Software Development Partner
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl">
                We are a website & app development partner
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black font-semibold px-5 py-2 rounded-full w-max text-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Start a new project with Kreatale"
            >
              Start a project
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Side Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="hidden flex-[1] lg:flex justify-center"
        >
          <Link href="https://www.captloui.com/">
            <div className="bg-white rounded-2xl w-full max-w-sm h-full flex flex-col justify-start">
              <Image
                src="/current-project.png"
                alt="Capt Loui"
                width={400}
                height={250}
                className="rounded-2xl mb-4 w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
                quality={85}
              />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm uppercase text-gray-400">
                    Our latest work
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black">
                    Capt Loui
                  </h2>
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
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
