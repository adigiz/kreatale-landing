"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getDestinationSlug, getPackageSlug } from "@/lib/demo-slug";
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { tourDemoPaths } from "@/lib/tour-demo-paths";
import type { TourConfig } from "./tour-config";
import { TOUR_DICTIONARY } from "./translations";
import { TourPackageFeatureValue } from "./tour-package-feature";
import { cmsField, PACKAGE_IMG_FALLBACK } from "./tour-utils";

const DICTIONARY = TOUR_DICTIONARY;

function tourSectionContext(
  config: TourConfig | undefined,
  locale: string,
  slug: string,
) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const paths = tourDemoPaths(locale, slug);
  const brandName = config?.websiteName?.trim() ?? "";
  const displayBrand = brandName || "Dwidayatour";
  const heroImage = cmsField(config?.heroImage, PACKAGE_IMG_FALLBACK);
  const currency =
    config?.currency?.trim() || (language === "id" ? "Rp" : "$");
  const formatPrice = (p: string) => {
    if (!p) return "";
    if (p.startsWith(currency)) return p;
    const separator = currency.length > 1 ? " " : "";
    return `${currency}${separator}${p}`;
  };
  const experienceTitle = t.experience.title.replace(/Voyage/g, displayBrand);

  const packageHref = (pkgSlug: string) =>
    `/${locale}/demos/${slug}/package/${pkgSlug}`;
  const destinationHref = (destSlug: string) =>
    `/${locale}/demos/${slug}/${destSlug}`;
  return {
    t,
    paths,
    locale,
    slug,
    packageHref,
    destinationHref,
    heroImage,
    currency,
    formatPrice,
    experienceTitle,
  };
}

function chunkPackages<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function TourPackagesSection({
  config,
  locale,
  slug,
}: {
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const { t, paths, packageHref, heroImage, formatPrice } =
    tourSectionContext(config, locale, slug);
  const language = config?.language === "id" ? "id" : "en";

  const displayed = useMemo(
    () => (config?.packages ?? []).slice(0, 9),
    [config?.packages],
  );
  const slides = useMemo(() => chunkPackages(displayed, 4), [displayed]);
  const [slide, setSlide] = useState(0);
  const maxSlide = Math.max(0, slides.length - 1);
  const safeSlide = Math.min(slide, maxSlide);

  useEffect(() => {
    setSlide((s) => Math.min(s, maxSlide));
  }, [maxSlide]);

  return (
    <section
      id="tour-packages"
      className="scroll-mt-24 py-24 bg-gray-50 dark:bg-tour-navy-light/10"
    >
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex items-end justify-between mb-12 border-b border-gray-200 dark:border-gray-700 pb-6">
          <div>
            <span className="text-tour-accent font-bold uppercase tracking-widest text-xs mb-2 block">
              {t.packages.handpicked}
            </span>
            <h3 className="text-3xl md:text-4xl font-tour-serif text-tour-navy-dark dark:text-white">
              {t.packages.title}
            </h3>
          </div>
          <Link
            href={paths.packages}
            className="text-sm font-bold uppercase tracking-widest text-tour-accent hover:text-tour-navy-dark dark:hover:text-white transition-colors flex items-center gap-1"
          >
            {t.packages.viewAll}{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
        {config?.packages && config.packages.length > 0 ? (
          <div className="relative">
            {slides.length > 1 ? (
              <div className="flex justify-end gap-2 mb-6">
                <button
                  type="button"
                  aria-label={t.packages.carouselPrev}
                  onClick={() =>
                    setSlide((s) => (s <= 0 ? maxSlide : s - 1))
                  }
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white hover:border-tour-accent hover:text-tour-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    chevron_left
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={t.packages.carouselNext}
                  onClick={() =>
                    setSlide((s) => (s >= maxSlide ? 0 : s + 1))
                  }
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white hover:border-tour-accent hover:text-tour-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    chevron_right
                  </span>
                </button>
              </div>
            ) : null}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${safeSlide * 100}%)`,
                }}
              >
                {slides.map((group, gi) => (
                  <div
                    key={gi}
                    className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
                  >
                    {group.map((pkg, idx) => {
                      const pkgSlug = getPackageSlug(pkg);
                      return (
                        <div
                          key={`${pkgSlug}-${gi}-${idx}`}
                          className="group flex h-full flex-col bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300"
                        >
                          <div className="h-80 w-full shrink-0 overflow-hidden relative">
                            <img
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              src={
                                pkg.image || heroImage || PACKAGE_IMG_FALLBACK
                              }
                            />
                            {pkg.location && (
                              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                                  {pkg.location}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col min-h-0 p-6 md:p-8">
                            <h4 className="text-lg md:text-xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2 leading-snug">
                              {pkg.title}
                            </h4>
                            <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                              {pkg.duration && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="material-symbols-outlined text-lg">
                                    calendar_month
                                  </span>
                                  <span>{pkg.duration}</span>
                                </div>
                              )}
                              {pkg.feature ? (
                                <TourPackageFeatureValue
                                  feature={pkg.feature}
                                  language={language}
                                  moreDepartureAriaLabel={
                                    t.packages.moreDepartureDates
                                  }
                                />
                              ) : null}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  {t.packages.startingFrom}
                                </p>
                                <p className="text-xl font-tour-serif font-semibold text-tour-accent">
                                  {formatPrice(pkg.price || "")}
                                </p>
                              </div>
                              <Link
                                href={packageHref(pkgSlug)}
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  arrow_outward
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            <div className="group flex h-full flex-col bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                <div className="h-80 w-full shrink-0 overflow-hidden relative">
                  <img
                    alt="Amalfi Coast Escape"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCp4p7WeLLEjMCN5TiCmNRCWON91Rwp4SHC2XF0XZihLjl5xKIkW9A0REWzsqfrbk2Kk7QT-tn6HOSqua1gk67nXuFB2AHBk-ILYndaJLvFQ4YzcJKXXPXYx5EKJI1ypzoGFZsviNVIM9ki4S-WHUUC075R5-D5aRrHd-VU6wyTRV_mTHbjN41RPq3kHBNB3YZNVO3UDhIk2j0spcj8lK98pFEpbVjcQSwQRcV5-gK9GZkX2VR-uqRRL3NEl7prUm3jjbs7Jhz4wk"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                      Italy
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col min-h-0 p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2 leading-snug">
                    Amalfi Coast Escape
                  </h4>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                      <span>10 Days</span>
                    </div>
                    <TourPackageFeatureValue
                      feature="Business Class"
                      language={language}
                      moreDepartureAriaLabel={t.packages.moreDepartureDates}
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {t.packages.startingFrom}
                      </p>
                      <p className="text-xl font-tour-serif font-semibold text-tour-accent">
                        Rp 14,200
                      </p>
                    </div>
                    <Link
                      href={packageHref(
                        getPackageSlug({ title: "Amalfi Coast Escape" }),
                      )}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        arrow_outward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group flex h-full flex-col bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                <div className="h-80 w-full shrink-0 overflow-hidden relative">
                  <img
                    alt="Kyoto Zen Retreat"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcSMBd4G8lS8bxdnjsgyWqVYjTFEqFXnOluD3-hhMQ-otYChltQ2dFN622iPkvgEKef27U8uN-vBhjxMSKoQMY-5dTzhpO8WM2a9daxVHSr2nMdBv4PHJsuANsPOcZtdmJeAgguAtrw_M0cQVtZoe4QzN81c8zED8ryItB4m6AlyHRxokKZxk8hF6kuYkrjLKiTYUT9v7WIm7EqE7h3urUeok6vDRyJWEgoiq3gcEesCtyMrsZL60TyffKeeMt5QAlwGPOB36QK0"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                      Japan
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col min-h-0 p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2 leading-snug">
                    Timeless Kyoto
                  </h4>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                      <span>9 Days</span>
                    </div>
                    <TourPackageFeatureValue
                      feature="Private Onsen"
                      language={language}
                      moreDepartureAriaLabel={t.packages.moreDepartureDates}
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {t.packages.startingFrom}
                      </p>
                      <p className="text-xl font-tour-serif font-semibold text-tour-accent">
                        Rp 9,800
                      </p>
                    </div>
                    <Link
                      href={packageHref(
                        getPackageSlug({ title: "Timeless Kyoto" }),
                      )}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        arrow_outward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group flex h-full flex-col bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                <div className="h-80 w-full shrink-0 overflow-hidden relative">
                  <img
                    alt="Serengeti Safari"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7526hg4wnagGUvoFcdfgcipg4xjJAZHdE1pW6AzkrKsXgtYhMsCthqKJG5Upb29XYOdaA-GrkFnmu3ftJPY8zdLeE8ZP1Snn9KBdI4zM8Bgr1LdpFwAoUEr_eeHvFdx-s0uMRUIyA4zdItN1TaBDoUgoeFSbeUx4uCqAD669av2lgzg0XMXieoqm0Pndz4Q79MbCuCu5DPgO_fn4QQq744fFBwlQW3-OpK09n-xkzmkIERjf83XwTUivkyjFGJdKCP3O4XQLv4rY"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                      Tanzania
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col min-h-0 p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2 leading-snug">
                    Serengeti & Beyond
                  </h4>
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                      <span>6D / 3N</span>
                    </div>
                    <TourPackageFeatureValue
                      feature="18, 25 Jun/ 09, 23 Jul/ 06, 20 Aug/ 03, 17 Sep 2026"
                      language={language}
                      moreDepartureAriaLabel={t.packages.moreDepartureDates}
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {t.packages.startingFrom}
                      </p>
                      <p className="text-xl font-tour-serif font-semibold text-tour-accent">
                        Rp 12,500
                      </p>
                    </div>
                    <Link
                      href={packageHref(
                        getPackageSlug({ title: "Serengeti & Beyond" }),
                      )}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        arrow_outward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function TourDestinationsSection({
  config,
  locale,
  slug,
}: {
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const { t, destinationHref } = tourSectionContext(config, locale, slug);

  return (
    <section
      id="tour-destinations"
      className="scroll-mt-24 py-24 bg-white dark:bg-tour-background-dark"
    >
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-tour-accent font-bold uppercase tracking-widest text-xs mb-3 block">
            {t.destinations.wanderlust}
          </span>
          <h3 className="text-4xl md:text-5xl font-tour-serif text-tour-navy-dark dark:text-white mb-6">
            {t.destinations.title}
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            {t.destinations.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[800px] md:h-[600px] lg:h-[600px]">
          {config?.destinations && config.destinations.length > 0 ? (
            config.destinations.map((dest, idx) => {
              const destSlug = getDestinationSlug(dest);
              return (
                <Link
                  key={idx}
                  href={`/${locale}/demos/${slug}/${destSlug}`}
                  className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
                >
                  <img
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src={
                      dest.image ||
                      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/80 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2 block">
                      {dest.region || "Global"}
                    </span>
                    <h4 className="text-3xl font-tour-serif text-white mb-2">
                      {dest.name}
                    </h4>
                    {dest.description && (
                      <p className="text-gray-200 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                        {dest.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <>
              <Link
                href={destinationHref(
                  getDestinationSlug({ name: "Santorini" }),
                )}
                className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
              >
                <img
                  alt="Santorini, Greece"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2938&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tour-navy-dark/90 via-tour-navy-dark/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest mb-1 block text-tour-accent">
                    Greece
                  </span>
                  <h3 className="text-2xl font-tour-serif italic mb-2">
                    Santorini
                  </h3>
                  <div className="h-0.5 w-0 bg-white group-hover:w-12 transition-all duration-500"></div>
                </div>
              </Link>
              <Link
                href={destinationHref(getDestinationSlug({ name: "Kyoto" }))}
                className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
              >
                <img
                  alt="Kyoto Streets"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyU6OxNe7z0NQ7uEX7VvsNZF2iAhNR8klSv7Vct6lzgoErV9IXpp33UQQVtwXMJyp_y2uMOK5fLmiacjxT3k4MSaHd90rg_QMcxnBoOXrnlnSj_3Ughj02WxucNKrhj0xO8etNtBcKs_NoANyJtf9z-nSQw__45j5-iLdZhfx2ZEzb9dFg0XK98xle8U3SHXmWgqTm4wBU9dLjXUm730YIb09gqaQ1dk85n4zis4rQxwm7sz0R3_hWn4lZlLyLulVLkE3kmRoEH4Y"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-bold uppercase tracking-widest text-tour-accent mb-2 block">
                    Asia
                  </span>
                  <h4 className="text-3xl font-tour-serif text-white mb-2">
                    Kyoto
                  </h4>
                  <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Walk through history in the ancient capital of culture and
                    tradition.
                  </p>
                </div>
              </Link>
              <Link
                href={destinationHref(
                  getDestinationSlug({ name: "Private Villas" }),
                )}
                className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
              >
                <img
                  alt="Luxury Interior"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-bold uppercase tracking-widest text-tour-accent mb-2 block">
                    Global
                  </span>
                  <h4 className="text-3xl font-tour-serif text-white mb-2">
                    Private Villas
                  </h4>
                  <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Exclusive estates offering privacy and unparalleled luxury
                    worldwide.
                  </p>
                </div>
              </Link>
              <Link
                href={destinationHref(
                  getDestinationSlug({ name: "Swiss Alps" }),
                )}
                className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
              >
                <img
                  alt="The Swiss Alps"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnTmx0MTw7u-lpY9UBYiBdBQWVs_38vwcDSqQnKVjoDA6MGKzNBvonFr52thJ0isqSC_n74JRW5L449taqrvYMHuZeHGBwFklTKXX_mx6tACLUn6ZeHSkXBT1dWb0qpk_-Ur647zgo8vgHnrR9Un5gTgX9pPdDgJrYGwNetI7hf67ybUdJ0WIIrW29MoKb5Kph-SFDOIZWQChOZDUeom5hEu755GTT5C5ox_zr1aV7HCaaG1fCQ"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-bold uppercase tracking-widest text-tour-accent mb-2 block">
                    Europe
                  </span>
                  <h4 className="text-3xl font-tour-serif text-white mb-2">
                    Swiss Alps
                  </h4>
                  <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    Pristine peaks and luxury chalets for the discerning winter
                    enthusiast.
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function TourExperienceSection({
  config,
  locale,
  slug,
}: {
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  const { t, experienceTitle } = tourSectionContext(config, locale, slug);

  return (
    <section
      id="tour-experience"
      className="scroll-mt-24 py-24 bg-gray-50 dark:bg-tour-navy-light/5"
    >
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] rounded-sm overflow-hidden relative shadow-2xl">
              <img
                alt="Lifestyle Travel Moment"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALyA5-VyX0cZKdMb6JFFoilDp9FunF9YfqCRJCi258tFXwjEY98qei8omSiho4St9aOU-MD_cjg1M4970T6lf180J30f4bRYh8DFpUeFXWNyTgHwR0rE-bBgMpMkzHYNS5wB3TvMGBZ_-Rrhi641YwJ0hP439UmaLV5aHAKmUg3hw-LenCwIpxLzg_mgyXFMwFFmd114zILlP3PUNXKMlwPlgwOgL4AY-mpTLPB34YoENM7nhw5GERWXcaZcohMwv0iaVva6Vugh8"
              />
              <div className="absolute inset-0 bg-tour-navy-dark/10"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white dark:bg-tour-navy-dark flex items-center justify-center rounded-full shadow-lg z-10 hidden md:flex">
                <span className="material-symbols-outlined text-4xl text-tour-accent">
                  format_quote
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-tour-accent font-bold uppercase tracking-widest text-xs mb-6 block">
              {experienceTitle}
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-tour-serif leading-tight text-tour-navy-dark dark:text-white mb-10 italic">
              &quot;{t.testimonial.quote}&quot;
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  alt="Client Portrait"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsHyqewONwlavQwN_YnhdGQG1Dif_3qOpyoiWuMDggfAlfMov0E-EVbqhBjZqYjmtuwrKpbK-3ujhO71AAejf0WPtAmZZXHRQEdUGMR1bmtrzqxy3MPjvnoDsMLa2YDDZmqUQYIT-BlU3wqCnBR304YME6vzSZ-itrXava9Uh_un-C25EGZSFzffAWrA-okxHTftYuGkmqVITUp9j4hUkWLUJd5tRfx40yRrIfU5wbcGpY9pQM5KuVQfv3nYBz3EUFcOGyttVjQgU"
                />
              </div>
              <div>
                <p className="font-bold text-tour-navy-dark dark:text-white text-lg font-tour-serif">
                  {t.testimonial.attribution}
                </p>
                <p className="text-xs text-tour-accent uppercase tracking-wider font-bold">
                  {t.testimonial.role}
                </p>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <div>
                <p className="text-3xl font-tour-serif text-tour-navy-dark dark:text-white mb-1">
                  98%
                </p>
                <p className="text-sm text-gray-500">{t.stats.fiveStarReviews}</p>
              </div>
              <div>
                <p className="text-3xl font-tour-serif text-tour-navy-dark dark:text-white mb-1">
                  12k+
                </p>
                <p className="text-sm text-gray-500">{t.stats.happyTravelers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TourCtaSection({
  config,
}: {
  config?: TourConfig;
}) {
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const consultWhatsAppUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    "",
  )}?text=${encodeURIComponent(
    "Hi! I'd like to speak with a travel consultant.",
  )}`;

  return (
    <section
      id="tour-cta"
      className="scroll-mt-24 relative w-full h-[600px] overflow-hidden group"
    >
      <img
        alt="Luxury Resort Pool"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q"
      />
      <div className="absolute inset-0 bg-tour-navy-dark/70 transition-opacity duration-500 group-hover:bg-tour-navy-dark/60"></div>
      <div className="relative z-10 h-full min-w-0 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full">
        <span className="text-tour-accent font-bold uppercase tracking-widest text-sm mb-6 block animate-fade-in-up">
          {t.cta.yourNextChapter}
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-tour-serif text-white mb-8 leading-tight text-balance break-words px-1">
          {t.cta.startJourneyToday}
        </h2>
        <p className="text-gray-200 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed text-balance">
          {t.cta.journeyDescription}
        </p>
        <a
          href={consultWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-tour-accent hover:bg-white hover:text-tour-navy-dark text-white px-12 py-5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-tour-accent/30 hover:shadow-white/20 transform hover:-translate-y-1"
        >
          {t.cta.talkToConsultant}
        </a>
      </div>
    </section>
  );
}
