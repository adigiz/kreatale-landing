"use client";

/* eslint-disable @next/next/no-img-element */

import { useParams } from "next/navigation";
import { CAR_DICTIONARY } from "./translations";
import type { CarConfig } from "./CarTemplate";
import { CarDemoBreadcrumbs } from "./CarDemoBreadcrumbs";
import { CarDemoNavbar } from "./CarDemoNavbar";
import { CarFleetCard } from "./CarFleetCard";

export type BrandVehicle = {
  title: string;
  slug?: string;
  image?: string;
  price?: string;
  location?: string;
};

export function CarBrandBrowseView({
  config,
  brandTitle,
  vehicles,
  heroImage,
}: {
  config: CarConfig;
  brandTitle: string;
  vehicles: BrandVehicle[];
  heroImage?: string;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const language = config.language || "en";
  const t = CAR_DICTIONARY[language];
  const primaryColor = config.primaryColor || "#256af4";
  const demoBase = config.slug ? `/${locale}/demos/${config.slug}` : "";
  const currency = config.currency || "$";
  const hero =
    heroImage ||
    vehicles[0]?.image ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000";

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

      <header className="relative pt-20">
        <div className="relative h-[min(52vh,420px)] w-full overflow-hidden bg-zinc-900">
          <img
            src={hero}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
            {demoBase ? (
              <CarDemoBreadcrumbs
                variant="onDark"
                className="mb-6"
                ariaLabel={t.breadcrumb.ariaLabel}
                primaryColor={primaryColor}
                items={[
                  {
                    label: config.websiteName || "Velocitá",
                    href: demoBase,
                  },
                  {
                    label: t.breadcrumb.brands,
                    href: `${demoBase}#brands`,
                  },
                  { label: brandTitle },
                ]}
              />
            ) : null}
            <p
              className="mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-white/70"
              style={{ color: `${primaryColor}` }}
            >
              {t.brandBrowse.marqueLabel}
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              {brandTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {t.brandBrowse.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {vehicles.length}{" "}
                {vehicles.length === 1
                  ? t.brandBrowse.vehicleSingular
                  : t.brandBrowse.vehiclePlural}
              </span>
              {config.location ? (
                <span className="rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {config.location}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2 border-b border-gray-200 pb-8 dark:border-gray-800 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
              {t.brandBrowse.gridTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.brandBrowse.gridHint}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {vehicles.map((v, index) => {
            const slug = v.slug ?? "";
            const detailHref =
              demoBase && slug ? `${demoBase}/package/${slug}` : "#";
            const vehicle = {
              name: v.title,
              slug: v.slug,
              region: v.location,
              image: v.image,
              price: v.price,
            };
            return (
              <CarFleetCard
                key={`${v.title}-${index}`}
                vehicle={vehicle}
                detailHref={detailHref}
                currency={currency}
                primaryColor={primaryColor}
                labels={labels}
                variant={index === 0 ? "featured" : "default"}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
