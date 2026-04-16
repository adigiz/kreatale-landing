"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export type CarFleetCardVehicle = {
  name: string;
  slug?: string;
  region?: string;
  image?: string;
  price?: string;
};

type CarFleetCardLabels = {
  available: string;
  perDay: string;
  viewDetails: string;
  defaultRegion: string;
};

type CarFleetCardProps = {
  vehicle: CarFleetCardVehicle;
  detailHref: string;
  currency: string;
  primaryColor: string;
  labels: CarFleetCardLabels;
  /** "default" | "featured" — featured uses taller image and overlay title */
  variant?: "default" | "featured";
};

export function CarFleetCard({
  vehicle,
  detailHref,
  currency,
  primaryColor,
  labels,
  variant = "default",
}: CarFleetCardProps) {
  const img =
    vehicle.image ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200";

  if (variant === "featured") {
    return (
      <Link
        href={detailHref}
        className="group relative col-span-1 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl hover:ring-black/10 dark:ring-white/10 md:col-span-2 md:row-span-2"
      >
        <div className="aspect-[4/3] min-h-[280px] w-full md:aspect-auto md:min-h-[420px]">
          <img
            alt={vehicle.name}
            src={img}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {labels.available}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {vehicle.name}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            {vehicle.region || labels.defaultRegion}
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-2xl font-semibold tabular-nums text-white md:text-3xl"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
              >
                {currency}
                {vehicle.price || "—"}
                <span className="ml-1.5 text-base font-normal text-white/65 md:text-lg">
                  {labels.perDay}
                </span>
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-900 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              {labels.viewDetails}
              <span className="material-icons text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:ring-white/10">
      <Link href={detailHref} className="relative block aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          alt={vehicle.name}
          src={img}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-sm backdrop-blur-sm dark:bg-zinc-950/90 dark:text-white">
          {labels.available}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
            {vehicle.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {vehicle.region || labels.defaultRegion}
          </p>
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              From
            </span>
            <p className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-white">
              <span style={{ color: primaryColor }}>{currency}</span>
              {vehicle.price || "—"}
              <span className="text-sm font-normal text-zinc-400">{labels.perDay}</span>
            </p>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 rounded-xl border-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:text-white"
            style={{ borderColor: primaryColor, color: primaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = primaryColor;
            }}
          >
            {labels.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}
