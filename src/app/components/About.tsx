"use client";

import { motion } from "framer-motion";
import CountryMap from "./CountryMap";
import Link from "next/link";
import { aboutStats } from "@/lib/aboutData";

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-10 bg-white gap-8"
    >
      {/* Left: Text + Stats */}
      <motion.div
        className="h-full lg:w-1/2 mb-10 lg:mb-0 lg:px-20"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="font-bold text-gray-400 uppercase text-sm mb-2">
          About Us
        </p>
        <h2 className="text-black text-4xl lg:text-5xl font-bold mb-6">
          The team will turn your <br /> ideas into reality
        </h2>
        <p className="text-gray-600 mb-6">
          We feel that in this digital age, connection is required to develop a
          successful corporate empire. Having user-focused websites or mobile
          applications that are simple to use can increase your market
          competitiveness.
        </p>
        <Link href="/projects">
          <button className="hover:cursor-pointer bg-blue-100 text-blue-600 px-7 py-3 rounded-full font-semibold text-sm hover:bg-blue-200">
            See all works
          </button>
        </Link>

        {/* Stats */}
        <div className="text-center mt-10 grid grid-cols-2 gap-16 px-8 py-16 rounded-xl border border-gray-200 w-full">
          {aboutStats.map((stat, index) => (
            <div key={index}>
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="flex-1 px-4 py-6 my-6 rounded-2xl dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[600px] w-[668px] 2xsm:w-[307px] 2xsm:h-[307px] xsm:w-[358px] sm:h-[400px] sm:w-[400px] md:w-[500px] md:h-[500px] lg:w-[668px]"
        >
          <CountryMap />
        </div>
      </div>
    </section>
  );
}
