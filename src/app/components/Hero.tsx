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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative flex-[3] rounded-3xl overflow-hidden min-h-[50vh] md:min-h-full"
        >
          <Image
            src="/banner.jpg"
            alt="Kreatale Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={100}
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden flex-[1] lg:flex justify-center"
        >
          <Link href="https://gemoedje-web-app.vercel.app/">
            <div className="bg-white rounded-2xl w-full max-w-sm h-full flex flex-col justify-start">
              <Image
                src="/current-project.png"
                alt="Gemoedje"
                width={400}
                height={250}
                className="rounded-2xl mb-4 w-full object-cover"
                sizes="400px"
                quality={75}
              />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm uppercase text-gray-400">
                    Our latest work
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black">
                    Gemoedje
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
