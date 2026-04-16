"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  getDestinationSlug,
  getPackageSlug,
  getTravelTipSlug,
} from "@/lib/demo-slug";
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import type { TourConfig } from "./tour-config";
import {
  listDestinationsForBrowse,
  listExperiencesForBrowse,
  listTravelTipsForBrowse,
} from "./tour-content-merge";
import { TourPackageFeatureValue } from "./tour-package-feature";
import { TOUR_DICTIONARY } from "./translations";
import { PACKAGE_IMG_FALLBACK } from "./tour-utils";

const DICTIONARY = TOUR_DICTIONARY;

function consultUrl() {
  return `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    "",
  )}?text=${encodeURIComponent(
    "Hi! I'd like to speak with a travel consultant.",
  )}`;
}

export function TourDestinationsBrowse({
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
  const b = t.browse;

  const items = useMemo(() => listDestinationsForBrowse(config), [config]);

  const regions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((d) => {
      if (d.region?.trim()) set.add(d.region.trim());
    });
    return ["__all__", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const [region, setRegion] = useState("__all__");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((d) => {
      if (region !== "__all__" && (d.region || "").trim() !== region)
        return false;
      if (!needle) return true;
      const hay = `${d.name} ${d.region || ""} ${d.description || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, region, q]);

  const countLabel = b.resultsLabel.replace(
    "{{count}}",
    String(filtered.length),
  );

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-tour-background-dark">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="font-tour-serif text-2xl md:text-3xl text-tour-navy-dark dark:text-white leading-tight">
            {t.subpages.destinationsPage.gridIntro}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
            <h2 className="font-tour-serif text-lg text-tour-navy-dark dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {b.filters}
            </h2>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                {b.regionLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                      region === r
                        ? "bg-tour-accent text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-tour-navy-dark dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {r === "__all__" ? b.allRegions : r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                {b.searchDestinations}
              </label>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={b.searchDestinations}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-tour-accent focus:border-tour-accent"
              />
            </div>
            <p className="text-xs text-gray-500">{countLabel}</p>
          </aside>

          <div className="flex-1 min-w-0 space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">{b.noMatches}</p>
            ) : (
              filtered.map((dest, idx) => {
                const destSlug = getDestinationSlug(dest);
                const href = `/${locale}/demos/${slug}/${destSlug}`;
                return (
                  <Link
                    key={`${dest.name}-${idx}`}
                    href={href}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-tour-navy-dark hover:border-tour-accent/40 hover:shadow-md transition-all group"
                  >
                    <div className="w-full sm:w-48 md:w-56 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-36 overflow-hidden rounded-sm">
                      <img
                        alt={dest.name}
                        src={
                          dest.image ||
                          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop"
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-tour-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                        {dest.region || "—"}
                      </span>
                      <h3 className="font-tour-serif text-xl md:text-2xl text-tour-navy-dark dark:text-white mb-2 group-hover:text-tour-accent transition-colors">
                        {dest.name}
                      </h3>
                      {dest.description ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light line-clamp-2 mb-4">
                          {dest.description}
                        </p>
                      ) : null}
                      <span className="text-xs font-bold uppercase tracking-widest text-tour-accent inline-flex items-center gap-1">
                        {b.viewPlace}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TourExperiencesBrowse({
  config,
  locale: _locale,
  slug: _slug,
}: {
  config?: TourConfig;
  locale: string;
  slug: string;
}) {
  void _locale;
  void _slug;
  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const b = t.browse;

  const items = useMemo(() => listExperiencesForBrowse(config), [config]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((d) => {
      if (d.category?.trim()) set.add(d.category.trim());
    });
    return ["__all__", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const [cat, setCat] = useState("__all__");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((d) => {
      if (cat !== "__all__" && (d.category || "").trim() !== cat) return false;
      if (!needle) return true;
      const hay = `${d.name} ${d.category || ""} ${d.description || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, cat, q]);

  const countLabel = b.resultsLabel.replace(
    "{{count}}",
    String(filtered.length),
  );

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-tour-navy-light/5">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="font-tour-serif text-2xl md:text-3xl text-tour-navy-dark dark:text-white leading-tight">
            {t.subpages.experiencesPage.listIntro}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
            <h2 className="font-tour-serif text-lg text-tour-navy-dark dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {b.filters}
            </h2>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                {b.experienceTypes}
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                      cat === c
                        ? "bg-tour-accent text-white"
                        : "bg-white dark:bg-tour-navy-dark border border-gray-200 dark:border-gray-700 text-tour-navy-dark dark:text-gray-200 hover:border-tour-accent/50"
                    }`}
                  >
                    {c === "__all__" ? b.allCategories : c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                {b.searchExperiences}
              </label>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={b.searchExperiences}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-tour-accent focus:border-tour-accent"
              />
            </div>
            <p className="text-xs text-gray-500">{countLabel}</p>
          </aside>

          <div className="flex-1 min-w-0 space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">{b.noMatches}</p>
            ) : (
              filtered.map((exp, idx) => {
                const expImage =
                  "image" in exp &&
                  typeof exp.image === "string" &&
                  exp.image.trim().length > 0
                    ? exp.image
                    : undefined;
                return (
                <div
                  key={`${exp.name}-${idx}`}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-tour-navy-dark"
                >
                  <div className="w-full sm:w-48 md:w-56 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-36 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
                    {expImage ? (
                      <img
                        alt={exp.name}
                        src={expImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-tour-accent/40">
                        <span className="material-symbols-outlined text-5xl">
                          theme_park
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-tour-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                      {exp.category || "—"}
                    </span>
                    <h3 className="font-tour-serif text-xl md:text-2xl text-tour-navy-dark dark:text-white mb-2">
                      {exp.name}
                    </h3>
                    {exp.description ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">
                        {exp.description}
                      </p>
                    ) : null}
                    <a
                      href={consultUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-widest text-tour-accent inline-flex items-center gap-1 w-fit hover:gap-2 transition-all"
                    >
                      {b.enquire}
                      <span className="material-symbols-outlined text-sm">
                        chat
                      </span>
                    </a>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TourTravelTipsBrowse({
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
  const b = t.browse;
  const tips = useMemo(() => listTravelTipsForBrowse(config), [config]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return tips;
    return tips.filter((tip) => {
      const hay = `${tip.title} ${tip.excerpt || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [tips, q]);

  const countLabel = b.resultsTips.replace(
    "{{count}}",
    String(filtered.length),
  );

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-tour-background-dark">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-tour-accent text-xs font-bold uppercase tracking-widest mb-2">
            {t.subpages.travelTipsPage.eyebrow}
          </p>
          <h2 className="font-tour-serif text-2xl md:text-3xl text-tour-navy-dark dark:text-white leading-tight">
            {t.subpages.travelTipsPage.listIntro}
          </h2>
        </div>
        <div className="max-w-xl mb-10">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={b.searchTips}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-tour-accent focus:border-tour-accent"
          />
          <p className="text-xs text-gray-500 mt-2">{countLabel}</p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">{b.noMatches}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filtered.map((tip, idx) => {
              const tipSlug = getTravelTipSlug(tip);
              const href = `/${locale}/demos/${slug}/travel-tips/${tipSlug}`;
              const tipImage =
                "image" in tip &&
                typeof tip.image === "string" &&
                tip.image.trim().length > 0
                  ? tip.image
                  : undefined;
              return (
                <Link
                  key={`${tipSlug}-${idx}`}
                  href={href}
                  className="group flex flex-col border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden bg-white dark:bg-tour-navy-dark hover:border-tour-accent/40 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {tipImage ? (
                      <img
                        alt=""
                        src={tipImage}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-tour-accent/30">
                        <span className="material-symbols-outlined text-6xl">
                          article
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-tour-serif text-xl md:text-2xl text-tour-navy-dark dark:text-white mb-3 group-hover:text-tour-accent transition-colors leading-snug">
                      {tip.title}
                    </h3>
                    {tip.excerpt ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed flex-1 mb-4 line-clamp-3">
                        {tip.excerpt}
                      </p>
                    ) : null}
                    <span className="text-xs font-bold uppercase tracking-widest text-tour-accent inline-flex items-center gap-1 mt-auto">
                      {b.readArticle}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function TourPackagesBrowse({
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
  const b = t.browse;
  const packageLocale = language === "id" ? "id" : "en";

  const packages = config?.packages ?? [];

  const locations = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((p) => {
      if (p.location?.trim()) set.add(p.location.trim());
    });
    return ["__all__", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [packages]);

  const [loc, setLoc] = useState("__all__");
  const [q, setQ] = useState("");

  const currency =
    config?.currency?.trim() || (language === "id" ? "Rp" : "$");
  const formatPrice = (p: string) => {
    if (!p) return "";
    if (p.startsWith(currency)) return p;
    const separator = currency.length > 1 ? " " : "";
    return `${currency}${separator}${p}`;
  };

  const heroImage = config?.heroImage?.trim() || PACKAGE_IMG_FALLBACK;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return packages.filter((p) => {
      if (loc !== "__all__" && (p.location || "").trim() !== loc)
        return false;
      if (!needle) return true;
      const hay =
        `${p.title} ${p.location || ""} ${p.feature || ""} ${p.duration || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [packages, loc, q]);

  const countLabel = b.resultsPackages.replace(
    "{{count}}",
    String(filtered.length),
  );

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-tour-background-dark">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="font-tour-serif text-2xl md:text-3xl text-tour-navy-dark dark:text-white leading-tight">
            {t.subpages.packagesPage.gridIntro}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
            <h2 className="font-tour-serif text-lg text-tour-navy-dark dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {b.filters}
            </h2>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                {b.regionLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {locations.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLoc(r)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                      loc === r
                        ? "bg-tour-accent text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-tour-navy-dark dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {r === "__all__" ? b.allRegions : r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                {b.searchPackages}
              </label>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={b.searchPackages}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-tour-accent focus:border-tour-accent"
              />
            </div>
            <p className="text-xs text-gray-500">{countLabel}</p>
          </aside>

          <div className="flex-1 min-w-0 space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">{b.noMatches}</p>
            ) : (
              filtered.map((pkg, idx) => {
                const pkgSlug = getPackageSlug(pkg);
                const href = `/${locale}/demos/${slug}/package/${pkgSlug}`;
                const img = pkg.image || heroImage;
                return (
                  <Link
                    key={`${pkgSlug}-${idx}`}
                    href={href}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-tour-navy-dark hover:border-tour-accent/40 hover:shadow-md transition-all group"
                  >
                    <div className="w-full sm:w-48 md:w-56 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-36 overflow-hidden rounded-sm">
                      <img
                        alt={pkg.title}
                        src={img}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-tour-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                        {pkg.location || "—"}
                      </span>
                      <h3 className="font-tour-serif text-xl md:text-2xl text-tour-navy-dark dark:text-white mb-2 group-hover:text-tour-accent transition-colors">
                        {pkg.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {pkg.duration ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">
                              calendar_month
                            </span>
                            {pkg.duration}
                          </span>
                        ) : null}
                        {pkg.feature ? (
                          <TourPackageFeatureValue
                            feature={pkg.feature}
                            language={packageLocale}
                            moreDepartureAriaLabel={
                              t.packages.moreDepartureDates
                            }
                            className="text-gray-600 dark:text-gray-400"
                          />
                        ) : null}
                      </div>
                      <p className="text-lg font-tour-serif font-semibold text-tour-accent mb-2">
                        {formatPrice(pkg.price || "")}
                      </p>
                      <span className="text-xs font-bold uppercase tracking-widest text-tour-accent inline-flex items-center gap-1">
                        {b.viewPackage}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
