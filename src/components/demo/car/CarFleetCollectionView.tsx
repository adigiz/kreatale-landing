"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getDestinationSlug } from "@/lib/demo-slug";
import { CAR_DICTIONARY } from "./translations";
import type { CarConfig } from "./CarTemplate";
import { CarDemoBreadcrumbs } from "./CarDemoBreadcrumbs";
import { CarDemoNavbar } from "./CarDemoNavbar";
import { CarFleetCard } from "./CarFleetCard";

export function CarFleetCollectionView({ config }: { config: CarConfig }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const language = config.language || "en";
  const t = CAR_DICTIONARY[language];
  const primaryColor = config.primaryColor || "#256af4";
  const demoBase = config.slug ? `/${locale}/demos/${config.slug}` : "";
  const destinations = config.destinations ?? [];

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const d of destinations) {
      if (d.region) set.add(d.region);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [destinations]);

  const [regionFilter, setRegionFilter] = useState<string | "all">("all");

  const filtered =
    regionFilter === "all"
      ? destinations
      : destinations.filter((d) => d.region === regionFilter);

  const labels = {
    available: t.fleet.available,
    perDay: t.fleet.perDay,
    viewDetails: t.fleet.viewDetails,
    defaultRegion: t.specs.defaultRegion,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased dark:bg-gray-900 dark:text-gray-200">
      <CarDemoNavbar
        demoBase={demoBase}
        websiteName={config.websiteName}
        logo={config.logo}
        primaryColor={primaryColor}
        language={language}
        ctaLabel={t.nav.bookNow}
      />

      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88, transparent)`,
          }}
        />
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          {demoBase ? (
            <CarDemoBreadcrumbs
              className="mb-8"
              ariaLabel={t.breadcrumb.ariaLabel}
              primaryColor={primaryColor}
              items={[
                {
                  label: config.websiteName || "Velocitá",
                  href: demoBase,
                },
                { label: t.fleetCollection.title },
              ]}
            />
          ) : null}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {t.fleetCollection.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {t.fleetCollection.subtitle}
          </p>
          {regions.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRegionFilter("all")}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  regionFilter === "all"
                    ? "text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
                style={
                  regionFilter === "all"
                    ? { backgroundColor: primaryColor }
                    : undefined
                }
              >
                {t.fleetCollection.filterAll}
              </button>
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    regionFilter === r
                      ? "text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                  style={
                    regionFilter === r
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length}{" "}
          {filtered.length === 1 ? "vehicle" : "vehicles"}
          {regionFilter !== "all" ? ` · ${regionFilter}` : null}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-fr lg:grid-cols-3 lg:gap-8">
          {filtered.map((car, index) => {
            const destSlug = getDestinationSlug(car);
            const detailHref =
              demoBase && destSlug ? `${demoBase}/package/${destSlug}` : "#";
            return (
              <CarFleetCard
                key={`${car.name}-${index}`}
                vehicle={{
                  name: car.name,
                  slug: car.slug,
                  region: car.region,
                  image: car.image,
                  price: car.price,
                }}
                detailHref={detailHref}
                currency={config.currency || "$"}
                primaryColor={primaryColor}
                labels={labels}
                variant={index === 0 && regionFilter === "all" ? "featured" : "default"}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
