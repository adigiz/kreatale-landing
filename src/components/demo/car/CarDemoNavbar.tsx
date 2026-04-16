"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { CAR_DICTIONARY } from "./translations";

export type CarDemoNavbarProps = {
  demoBase: string;
  /** When true, Fleet/Brands use in-page anchors on the demo home URL. */
  isHome?: boolean;
  websiteName?: string;
  logo?: string;
  primaryColor?: string;
  language?: "en" | "id";
  ctaLabel: string;
};

export function CarDemoNavbar({
  demoBase,
  isHome = false,
  websiteName,
  logo,
  primaryColor = "#256af4",
  language = "en",
  ctaLabel,
}: CarDemoNavbarProps) {
  const t = CAR_DICTIONARY[language];
  const root = demoBase || "#";

  const fleetHref = isHome
    ? (demoBase ? `${demoBase}#fleet` : "#fleet")
    : demoBase
      ? `${demoBase}/fleet`
      : "#";
  const brandsHref = demoBase ? `${demoBase}#brands` : "#brands";

  return (
    <nav className="fixed z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={root}
          className="flex flex-shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
        >
          {logo ? (
            <img src={logo} alt={t.alt.logo} className="h-8 w-auto" />
          ) : (
            <>
              <span
                className="material-icons text-2xl"
                style={{ color: primaryColor }}
              >
                speed
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {websiteName || "Velocitá"}
              </span>
            </>
          )}
        </Link>
        <div className="hidden items-center space-x-10 md:flex">
          <Link
            href={fleetHref}
            className="text-xs font-medium uppercase tracking-widest text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {t.nav.fleet}
          </Link>
          <Link
            href={brandsHref}
            className="text-xs font-medium uppercase tracking-widest text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {t.nav.brands}
          </Link>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-widest text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {t.nav.membership}
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="hidden text-xs font-medium uppercase tracking-widest text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white md:block"
          >
            {t.nav.signIn}
          </a>
          <button
            type="button"
            className="rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </nav>
  );
}
