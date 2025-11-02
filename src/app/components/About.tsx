"use client";

import { motion } from "framer-motion";
import CountryMap from "./CountryMap";
import Link from "next/link";
import { getAboutStats, getCountriesFromProjects } from "@/lib/aboutData";
import { getCountryCodeMapping } from "@/lib/countryMapping";
import projectsData from "@/lib/projectsData.json";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function About() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  // Get dynamic stats and country data
  const aboutStats = getAboutStats(projectsData);
  const countries = getCountriesFromProjects(projectsData);
  const countryCodeMapping = getCountryCodeMapping();

  // Create country codes for map highlighting
  const countryCodes = countries
    .map((country) => countryCodeMapping[country])
    .filter(Boolean);

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
          {t("about.subtitle")}
        </p>
        <h2 className="text-black text-4xl lg:text-5xl font-bold mb-6">
          {t("about.title")}
        </h2>
        <p className="text-gray-600 mb-6">{t("about.description")}</p>
        <Link href={createLocalizedPath("/projects")}>
          <button className="hover:cursor-pointer border-2 border-[#0061FF] text-[#0061FF] bg-white hover:bg-[#0061FF] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200 hover:shadow-xl transform">
            {t("common.viewProject")}
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
          <CountryMap countryCodes={countryCodes} />
        </div>
      </div>
    </section>
  );
}
