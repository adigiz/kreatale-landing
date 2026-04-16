"use client";

import type { CSSProperties } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { BeddingConfig } from "./bedding-config";
import "./bedding-demo.css";
import { BeddingDemoChrome } from "./BeddingDemoChrome";
import { BeddingDemoFooter } from "./BeddingDemoFooter";

export type BeddingProductLine = "towel" | "bedding" | "loungewear" | "throw";

export type BeddingProductDetailConfig = {
  locale: string;
  demoSlug: string;
  websiteName: string;
  primaryColor: string;
  currency: string;
  chromeConfig: BeddingConfig;
  productLine: BeddingProductLine;
  showFromPrice?: boolean;
  product: {
    name: string;
    slug: string;
    description: string;
    price: string;
    image: string;
    fabricLabel?: string;
    gallery: string[];
    swatches?: string[];
  };
  collectionTitle?: string;
  collectionSlug?: string;
};

const SWATCH_HEX: Record<string, string> = {
  Frost: "#b8c9d4",
  White: "#f4f3f0",
  Natural: "#e0d6c8",
  Stone: "#8a8883",
  "Cloud grey": "#c5cad1",
  Navy: "#1a2744",
  Ombre: "#9aa89a",
  Maroon: "#6b2d3c",
};

function swatchColor(name: string): string {
  return SWATCH_HEX[name] ?? "#d4d4d4";
}

const SIZES: Record<BeddingProductLine, string[]> = {
  towel: ["Small", "Standard", "Jumbo"],
  bedding: ["Twin", "Queen", "King"],
  loungewear: ["XS", "S", "M", "L", "XL"],
  throw: ["One size"],
};

const DEFAULT_TOWEL_SWATCHES = ["Frost", "White", "Stone", "Natural"];

export function BeddingProductDetail({ config }: { config: BeddingProductDetailConfig }) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainCtaRef = useRef<HTMLButtonElement>(null);
  const ctaInView = useInView(mainCtaRef, { margin: "0px 0px -80px 0px", amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -72]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 48]);

  const base = `/${config.locale}/demos/${config.demoSlug}`;
  const accent = config.primaryColor || "#29378c";
  const displayFont = { fontFamily: "var(--font-bedding-display), ui-serif, Georgia, serif" };

  const [activeImage, setActiveImage] = useState(0);
  const thumbs =
    config.product.gallery.length > 0 ? config.product.gallery : [config.product.image];

  const colorOptions =
    config.product.swatches && config.product.swatches.length > 0
      ? config.product.swatches
      : config.productLine === "towel"
        ? DEFAULT_TOWEL_SWATCHES
        : ["Oat", "Sage", "Fog"];

  const sizeOptions = SIZES[config.productLine];

  const faqItems =
    config.productLine === "towel"
      ? [
          {
            q: "What are SOJAO towels made of?",
            a: "Pure GOTS-certified organic cotton terry — the same fibre philosophy as our sheets, tuned for absorbency and a plush hand-feel.",
          },
          {
            q: "Are they suitable for sensitive skin?",
            a: "Organic cotton is hypoallergenic and free of harsh finishes — many customers with sensitivities choose SOJAO for bath and bed.",
          },
          {
            q: "How do I keep towels soft?",
            a: "Use less detergent, skip fabric softener (it coats fibres), and add an occasional water-only rinse to prevent residue buildup.",
          },
        ]
      : [
          {
            q: "What is organic cotton?",
            a: "Grown without toxic pesticides and processed to strict environmental standards — better for soil, workers, and your home.",
          },
          {
            q: "How should I wash this?",
            a: "Machine wash cold or warm with like colours; tumble dry low. This demo does not replace the official SOJAO wash-care guide.",
          },
        ];

  return (
    <div
      className="bedding-demo-root min-h-screen bg-[var(--bedding-bg)] text-[var(--bedding-fg)]"
      style={
        {
          "--bedding-accent": accent,
          fontFamily: "var(--font-bedding-body), system-ui, sans-serif",
        } as CSSProperties
      }
    >
      <BeddingDemoChrome
        config={config.chromeConfig}
        base={base}
        activeNavCollectionSlug={config.collectionSlug}
      />

      <div ref={scrollRef} className="mx-auto max-w-[1400px] px-4 pb-32 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--bedding-muted)]">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={base} className="transition hover:text-[var(--bedding-accent)]">
                {config.websiteName}
              </Link>
            </li>
            <li className="opacity-50" aria-hidden>
              /
            </li>
            {config.collectionSlug ? (
              <>
                <li>
                  <Link
                    href={`${base}/${config.collectionSlug}`}
                    className="transition hover:text-[var(--bedding-accent)]"
                  >
                    {config.collectionTitle ?? "Shop"}
                  </Link>
                </li>
                <li className="opacity-50" aria-hidden>
                  /
                </li>
              </>
            ) : null}
            <li className="max-w-[220px] truncate font-medium text-[var(--bedding-fg)] sm:max-w-md">
              {config.product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <motion.div style={{ y: imgY }}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200 lg:aspect-square">
                  <Image
                    src={thumbs[activeImage] ?? config.product.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 58vw"
                    priority
                    unoptimized
                  />
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {thumbs.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition ${
                        i === activeImage
                          ? "border-[var(--bedding-fg)]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div className="lg:col-span-5" style={{ y: copyY }}>
            {config.collectionTitle ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--bedding-muted)]">
                {config.collectionTitle}
              </p>
            ) : null}
            <h1
              className="mt-2 text-3xl font-normal leading-tight sm:text-4xl lg:text-[2.35rem]"
              style={displayFont}
            >
              {config.product.name}
            </h1>
            {config.product.fabricLabel ? (
              <p className="mt-3 text-sm text-[var(--bedding-muted)]">{config.product.fabricLabel}</p>
            ) : null}
            <p className="mt-6 text-base leading-relaxed text-[var(--bedding-muted)]">
              {config.product.description}
            </p>
            <p className="mt-8 text-2xl font-medium" style={displayFont}>
              {config.showFromPrice ? (
                <span className="text-base font-normal text-[var(--bedding-muted)]">From </span>
              ) : null}
              {config.currency}
              {config.product.price}
            </p>

            <div className="mt-8 space-y-6 border-t border-[var(--bedding-border)] pt-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em]">
                  {config.productLine === "towel" ? "Size" : "Size"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="min-w-[4.5rem] border border-[var(--bedding-border)] bg-[var(--bedding-surface)] px-4 py-2.5 text-sm transition hover:border-[var(--bedding-accent)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em]">Color</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colorOptions.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--bedding-border)] transition hover:border-[var(--bedding-fg)]"
                      style={{ backgroundColor: swatchColor(col) }}
                      aria-label={col}
                      title={col}
                    >
                      <span className="sr-only">{col}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--bedding-muted)]">
                  Colours shown as demo swatches — not a live variant picker.
                </p>
              </div>
            </div>

            <button
              ref={mainCtaRef}
              type="button"
              className="mt-10 w-full border border-[var(--bedding-fg)] bg-[var(--bedding-fg)] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-[var(--bedding-fg)]"
              onClick={() => toast.message("Demo only — checkout is not connected.")}
            >
              Add to bag
            </button>

            <ul className="mt-10 space-y-3 text-sm text-[var(--bedding-muted)]">
              <li className="flex gap-2">
                <span className="material-icons text-base text-[var(--bedding-fg)]">local_shipping</span>
                Free delivery in Singapore on the live store; this route is a visual demo only.
              </li>
              <li className="flex gap-2">
                <span className="material-icons text-base text-[var(--bedding-fg)]">verified</span>
                GOTS organic cotton story aligned with{" "}
                <a
                  href="https://sojao.shop"
                  className="underline decoration-[var(--bedding-border)] underline-offset-2 hover:text-[var(--bedding-accent)]"
                >
                  sojao.shop
                </a>
                .
              </li>
              <li className="flex gap-2">
                <span className="material-icons text-base text-[var(--bedding-fg)]">eco</span>
                Packaging and mills — see the real site for current sustainability copy.
              </li>
            </ul>

            <div className="mt-14 border-t border-[var(--bedding-border)] pt-10">
              <h2 className="text-lg font-normal text-[var(--bedding-fg)]" style={displayFont}>
                Common questions
              </h2>
              <div className="mt-6 space-y-2">
                {faqItems.map((item) => (
                  <details
                    key={item.q}
                    className="group border-b border-[var(--bedding-border)] pb-3"
                  >
                    <summary className="cursor-pointer list-none py-2 text-[15px] font-medium text-[var(--bedding-fg)] marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-2">
                        {item.q}
                        <span className="material-icons text-lg text-[var(--bedding-muted)] transition group-open:rotate-180">
                          expand_more
                        </span>
                      </span>
                    </summary>
                    <p className="pb-2 text-[14px] leading-relaxed text-[var(--bedding-muted)]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--bedding-border)] bg-[var(--bedding-surface)]/90 px-4 py-3 backdrop-blur-md sm:px-6"
        initial={false}
        animate={{
          y: ctaInView ? 100 : 0,
          opacity: ctaInView ? 0 : 1,
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: ctaInView ? "none" : "auto" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{config.product.name}</p>
            <p className="text-sm text-[var(--bedding-muted)]">
              {config.showFromPrice ? "From " : null}
              {config.currency}
              {config.product.price}
            </p>
          </div>
          <button
            type="button"
            className="flex-shrink-0 border border-[var(--bedding-fg)] bg-[var(--bedding-fg)] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
            onClick={() => toast.message("Demo only — checkout is not connected.")}
          >
            Add to bag
          </button>
        </div>
      </motion.div>
      <BeddingDemoFooter
        config={config.chromeConfig}
        base={base}
        stickyCtaGap
      />
    </div>
  );
}
