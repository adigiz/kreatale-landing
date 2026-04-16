"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { tourDemoPaths } from "@/lib/tour-demo-paths";
import type { TourConfig } from "./tour-config";
import { TOUR_DICTIONARY } from "./translations";

const DICTIONARY = TOUR_DICTIONARY;

export default function TourDemoShell({
  config,
  children,
}: {
  config?: TourConfig;
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;

  const language = config?.language || "en";
  const t = DICTIONARY[language];

  const brandName = config?.websiteName?.trim() ?? "";
  const displayBrand = brandName || "Dwidayatour";

  const primaryColor = config?.primaryColor || "#2747A0";
  const accentColor = config?.accentColor ?? "#F47920";
  const accentHoverColor = config?.accentHoverColor ?? "#DC6A18";
  const paths = tourDemoPaths(locale, slug);
  const consultWhatsAppUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    "",
  )}?text=${encodeURIComponent(
    "Hi! I'd like to speak with a travel consultant.",
  )}`;
  const telHref = `tel:${WHATSAPP_NUMBER.replace(/[^\d+]/g, "")}`;
  const year = new Date().getFullYear();

  const style = {
    "--tour-primary": primaryColor,
    "--tour-primary-hover": primaryColor,
    "--tour-accent": accentColor,
    "--tour-accent-hover": accentHoverColor,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className="font-sans text-tour-navy-dark dark:text-gray-100 bg-white dark:bg-tour-background-dark selection:bg-tour-accent/25 transition-colors duration-300"
    >
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-tour-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 lg:h-20 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <Link
            href={paths.home}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {config?.logo ? (
              <img
                src={config.logo}
                alt="Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tour-accent text-3xl group-hover:rotate-12 transition-transform duration-300">
                  travel_explore
                </span>
                <span className="text-xl lg:text-2xl font-tour-serif font-bold tracking-tight text-tour-navy-dark dark:text-white">
                  {displayBrand}
                  <span className="text-tour-accent">.</span>
                </span>
              </div>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
            <Link
              href={paths.destinations}
              className="hover:text-tour-accent transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-accent after:transition-all hover:after:w-full"
            >
              {t.nav.destinations}
            </Link>
            <Link
              href={paths.packages}
              className="hover:text-tour-accent transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-accent after:transition-all hover:after:w-full"
            >
              {t.nav.packages}
            </Link>
            <Link
              href={paths.experiences}
              className="hover:text-tour-accent transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-accent after:transition-all hover:after:w-full"
            >
              {t.nav.experiences}
            </Link>
            <Link
              href={paths.travelTips}
              className="hover:text-tour-accent transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-accent after:transition-all hover:after:w-full"
            >
              {t.nav.travelTips}
            </Link>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <a
              href={consultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:border-tour-accent hover:text-tour-accent transition-all rounded-sm"
            >
              {t.nav.signUp}
            </a>
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 text-tour-navy-dark dark:text-white hover:text-tour-accent transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {children}

      <footer className="bg-white dark:bg-tour-background-dark pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tour-accent text-3xl">
                  travel_explore
                </span>
                <span className="text-2xl font-tour-serif font-bold tracking-tight text-tour-navy-dark dark:text-white">
                  {displayBrand}
                  <span className="text-tour-accent">.</span>
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                {t.footer.description}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.dwidayatour.co.id/?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dwidayatour website"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-tour-navy-dark dark:text-white hover:bg-tour-accent hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    language
                  </span>
                </a>
                <a
                  href="tel:+622150884688"
                  aria-label="Phone"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-tour-navy-dark dark:text-white hover:bg-tour-accent hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-tour-serif font-medium text-lg text-tour-navy-dark dark:text-white mb-6">
                {t.footer.explore}
              </h5>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link
                    href={paths.destinations}
                    className="hover:text-tour-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-accent rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    {t.footer.destinations}
                  </Link>
                </li>
                <li>
                  <Link
                    href={paths.packages}
                    className="hover:text-tour-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-accent rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    {t.footer.packages}
                  </Link>
                </li>
                <li>
                  <Link
                    href={paths.experiences}
                    className="hover:text-tour-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-accent rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    {t.footer.signatureTours}
                  </Link>
                </li>
                <li>
                  <Link
                    href={paths.travelTips}
                    className="hover:text-tour-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-accent rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    {t.footer.travelTips}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-tour-serif font-medium text-lg text-tour-navy-dark dark:text-white mb-6">
                {t.footer.newsletter}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t.footer.newsletterDescription}
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm px-4 py-3 focus:ring-1 focus:ring-tour-accent focus:border-tour-accent transition-all"
                  placeholder={t.footer.emailPlaceholder}
                />
                <button
                  type="button"
                  className="bg-tour-navy-dark hover:bg-tour-accent text-white px-4 py-3 rounded-sm transition-colors text-sm font-bold uppercase tracking-wide"
                >
                  {t.footer.subscribe}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              © {year} {displayBrand}. {t.footer.copyrightTagline}
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link
                href={`/${locale}/privacy`}
                className="text-xs text-gray-400 hover:text-tour-navy-dark dark:hover:text-white transition-colors"
              >
                {t.footer.privacyPolicy}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-xs text-gray-400 hover:text-tour-navy-dark dark:hover:text-white transition-colors"
              >
                {t.footer.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-0 w-full bg-white dark:bg-tour-background-dark border-t border-gray-100 dark:border-gray-800 p-4 z-50 flex justify-between items-center shadow-sticky-footer lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
            {t.footer.questions}
          </span>
          <span className="text-sm font-tour-serif font-bold text-tour-navy-dark dark:text-white">
            {t.footer.contactConcierge}
          </span>
        </div>
        <div className="flex gap-3">
          <a
            href={consultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
          </a>
          <a
            href={telHref}
            aria-label="Call"
            className="bg-tour-accent text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tour-accent-hover shadow-lg shadow-tour-accent/30 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
