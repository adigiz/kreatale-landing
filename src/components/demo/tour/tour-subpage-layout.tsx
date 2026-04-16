"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React from "react";
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { tourDemoPaths } from "@/lib/tour-demo-paths";
import type { TourConfig } from "./tour-config";
import { TOUR_DICTIONARY } from "./translations";
import { cmsField, PACKAGE_IMG_FALLBACK } from "./tour-utils";

const DICTIONARY = TOUR_DICTIONARY;

export type TourSubpageId =
  | "destinations"
  | "experiences"
  | "travelTips"
  | "packages";

function brandName(config?: TourConfig) {
  return config?.websiteName?.trim() ?? "";
}

function consultUrl() {
  return `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    "",
  )}?text=${encodeURIComponent(
    "Hi! I'd like to speak with a travel consultant.",
  )}`;
}

export function TourSubpageHero({
  page,
  config,
  locale,
  slug,
}: {
  page: TourSubpageId;
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const paths = tourDemoPaths(locale, slug);
  const heroBg = cmsField(config?.heroImage, PACKAGE_IMG_FALLBACK);

  const copy =
    page === "destinations"
      ? t.subpages.destinationsPage
      : page === "travelTips"
        ? t.subpages.travelTipsPage
        : page === "packages"
          ? t.subpages.packagesPage
          : t.subpages.experiencesPage;

  const secondaryHref =
    page === "destinations"
      ? paths.travelTips
      : page === "travelTips"
        ? paths.destinations
        : page === "packages"
          ? paths.destinations
          : paths.travelTips;

  const breadcrumbCurrent =
    page === "destinations"
      ? t.nav.destinations
      : page === "travelTips"
        ? t.nav.travelTips
        : page === "packages"
          ? t.packages.title
          : t.nav.experiences;

  return (
    <section className="relative min-h-[52vh] flex items-end md:items-center pt-24 pb-16 md:pb-20 lg:pt-28 overflow-hidden">
      <img
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        src={heroBg}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tour-navy-dark via-tour-navy-dark/75 to-tour-navy-dark/45" />
      <div className="relative z-10 max-w-[1920px] w-full mx-auto px-6 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs md:text-sm font-medium tracking-wide text-white/75 mb-6 md:mb-8"
        >
          <Link href={paths.home} className="hover:text-white transition-colors">
            {t.subpages.breadcrumbHome}
          </Link>
          <span className="mx-2 opacity-60">/</span>
          <span className="text-white">{breadcrumbCurrent}</span>
        </nav>
        <p className="text-tour-accent font-bold uppercase tracking-[0.2em] text-xs mb-4">
          {copy.eyebrow}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-tour-serif text-white max-w-4xl leading-[1.08] mb-6">
          {copy.title}
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed font-light mb-10">
          {copy.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <a
            href={consultUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center gap-2 bg-tour-accent hover:bg-white hover:text-tour-navy-dark text-white px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-black/20"
          >
            {copy.primaryCta}
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </a>
          <Link
            href={secondaryHref}
            className="inline-flex justify-center items-center gap-2 border border-white/40 hover:border-white text-white px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors bg-white/5 backdrop-blur-sm"
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TourSubpageTrustStrip({ config }: { config?: TourConfig }) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const displayBrand = brandName(config) || "Dwidayatour";
  const headline = t.subpages.trustStrip.headline.replace(
    "{{brand}}",
    displayBrand,
  );
  const icons = ["support_agent", "visibility", "palette"] as const;

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-tour-background-dark border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-center text-2xl md:text-3xl font-tour-serif text-tour-navy-dark dark:text-white mb-12 md:mb-16 max-w-3xl mx-auto">
          {headline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {t.subpages.trustStrip.items.map((item, i) => (
            <div
              key={item.title}
              className="text-center md:text-left px-2 md:px-0"
            >
              <span className="material-symbols-outlined text-3xl text-tour-accent mb-4 block md:inline-block">
                {icons[i]}
              </span>
              <h3 className="font-tour-serif text-lg md:text-xl text-tour-navy-dark dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TourSubpageExploreMore({
  current,
  config,
  locale,
  slug,
}: {
  current: TourSubpageId;
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const paths = tourDemoPaths(locale, slug);
  const em = t.subpages.exploreMore;

  const cards: {
    id: TourSubpageId | "home";
    href: string;
    label: string;
  }[] = [
    { id: "home", href: paths.home, label: em.home },
    { id: "destinations", href: paths.destinations, label: em.destinations },
    { id: "packages", href: paths.packages, label: em.packages },
    { id: "travelTips", href: paths.travelTips, label: em.travelTips },
    { id: "experiences", href: paths.experiences, label: em.experiences },
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-tour-navy-light/5">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-tour-accent mb-4">
          {em.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((card) => {
            const active = card.id === current;

            return (
              <Link
                key={card.href + card.label}
                href={card.href}
                className={`group relative flex flex-col justify-between min-h-[120px] p-6 rounded-sm border transition-all duration-300 ${
                  active
                    ? "border-tour-accent bg-white dark:bg-tour-navy-dark shadow-md ring-1 ring-tour-accent/30"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-tour-navy-dark hover:border-tour-accent/60 hover:shadow-lg"
                }`}
              >
                <span className="font-tour-serif text-lg text-tour-navy-dark dark:text-white group-hover:text-tour-accent transition-colors">
                  {card.label}
                </span>
                <span className="material-symbols-outlined text-tour-accent text-xl self-end opacity-70 group-hover:translate-x-0.5 transition-transform">
                  arrow_outward
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TourSubpageClosing({
  config,
  locale,
  slug,
}: {
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const paths = tourDemoPaths(locale, slug);

  return (
    <section className="py-16 md:py-24 px-6 bg-white dark:bg-tour-background-dark">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-tour-serif text-tour-navy-dark dark:text-white mb-6 leading-tight">
          {t.subpages.closing.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-10">
          {t.subpages.closing.body}
        </p>
        <Link
          href={paths.home}
          className="inline-flex items-center gap-2 text-tour-accent font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all"
        >
          {t.subpages.closing.cta}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
