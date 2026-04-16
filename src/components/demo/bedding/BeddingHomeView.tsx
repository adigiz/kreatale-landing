"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { BeddingConfig } from "./bedding-config";
import { BeddingDemoChrome } from "./BeddingDemoChrome";
import { BeddingDemoFooter } from "./BeddingDemoFooter";
import { DUMMY_BEDDING_CONFIG } from "@/lib/cms/dummy/bedding";

const CAROUSEL_MS = 5500;

export function BeddingHomeView({ config }: { config?: BeddingConfig }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const c = config ?? DUMMY_BEDDING_CONFIG;
  const slug = c.slug;
  const base = `/${locale}/demos/${slug}`;
  const accent = c.primaryColor || "#29378c";

  const [slide, setSlide] = useState(0);
  const slides = c.heroSlides ?? [];
  const n = Math.max(slides.length, 1);

  const nextSlide = useCallback(() => {
    setSlide((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(nextSlide, CAROUSEL_MS);
    return () => clearInterval(t);
  }, [n, nextSlide]);

  const displayFont = { fontFamily: "var(--font-bedding-display), ui-serif, Georgia, serif" };

  return (
    <div className="pb-0">
      <BeddingDemoChrome config={c} base={base} />

      {/* Hero carousel */}
      <section className="relative h-[min(88vh,860px)] w-full overflow-hidden bg-neutral-900">
        <AnimatePresence mode="wait">
          {slides[slide] ? (
            <motion.div
              key={slides[slide].title + slide}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={slides[slide].image}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority={slide === 0}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end px-4 pb-16 sm:px-8 lg:px-16 lg:pb-24">
                <motion.p
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45 }}
                >
                  {(slides[slide] as { kicker?: string }).kicker ?? "New in"}
                </motion.p>
                <motion.h1
                  className="max-w-xl text-4xl font-normal leading-[1.1] text-white sm:text-5xl md:text-6xl"
                  style={displayFont}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  {slides[slide].title}
                </motion.h1>
                <motion.p
                  className="mt-4 max-w-md text-base font-normal text-white/85 sm:text-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                >
                  {slides[slide].subtitle}
                </motion.p>
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                >
                  <Link
                    href={`${base}/${slides[slide].collectionSlug}`}
                    className="inline-block border border-white/90 bg-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bedding-fg)] transition hover:bg-transparent hover:text-white"
                  >
                    {slides[slide].ctaLabel}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              className="h-2 w-2 rounded-full transition-all"
              style={{
                backgroundColor: i === slide ? "#fff" : "rgba(255,255,255,0.35)",
                transform: i === slide ? "scale(1.2)" : "scale(1)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 md:left-6 md:block"
          onClick={() => setSlide((i) => (i - 1 + n) % n)}
          aria-label="Previous slide"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition hover:bg-white/25 md:right-6 md:block"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </section>

      {/* Bestsellers */}
      <section className="bg-[var(--bedding-surface)] py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--bedding-muted)]">
          Shop our
        </p>
        <h2
          className="mt-3 text-center text-3xl font-normal md:text-4xl"
          style={displayFont}
        >
          Bestsellers
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {c.bestsellerBlocks.map((block, idx) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col"
            >
              <Link href={`${base}/${block.collectionSlug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                <Image
                  src={block.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
              </Link>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium md:text-xl" style={displayFont}>
                  {block.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--bedding-muted)]">{block.tagline}</p>
                <Link
                  href={`${base}/${block.collectionSlug}`}
                  className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.2em] underline-offset-4 hover:underline"
                  style={{ color: accent }}
                >
                  {block.ctaLabel}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Mix & match */}
      <section className="border-y border-[var(--bedding-border)] bg-[var(--bedding-surface)] py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {(c.mixMatchSection as { imageSrc?: string }).imageSrc ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              <Image
                src={(c.mixMatchSection as { imageSrc: string }).imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                unoptimized
              />
            </div>
          ) : null}
          <div
            className={`text-center ${(c.mixMatchSection as { imageSrc?: string }).imageSrc ? "lg:text-left" : "mx-auto max-w-[720px]"}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--bedding-muted)]">
              {c.mixMatchSection.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-normal md:text-[2.25rem]" style={displayFont}>
              {c.mixMatchSection.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--bedding-muted)]">
              {c.mixMatchSection.body}
            </p>
            <Link
              href={`${base}/${c.mixMatchSection.collectionSlug}`}
              className="mt-8 inline-block border border-[var(--bedding-accent)] bg-[var(--bedding-accent)] px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-[var(--bedding-accent)]"
            >
              {c.mixMatchSection.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">
          {(c.valuesSection as { imageSrc?: string }).imageSrc ? (
            <div className="relative aspect-square w-full max-w-md shrink-0 overflow-hidden bg-neutral-50">
              <Image
                src={(c.valuesSection as { imageSrc: string }).imageSrc}
                alt=""
                fill
                className="object-contain p-6"
                sizes="(max-width:1024px) 100vw, 400px"
                unoptimized
              />
            </div>
          ) : null}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-normal leading-snug md:text-3xl" style={displayFont}>
              {c.valuesSection.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--bedding-muted)] lg:mx-0">
              {c.valuesSection.body}
            </p>
            <a
              href={c.valuesSection.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-[11px] font-bold uppercase tracking-[0.2em] underline-offset-4 hover:underline"
              style={{ color: accent }}
            >
              {c.valuesSection.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="border-t border-[var(--bedding-border)] bg-[var(--bedding-surface)] py-14 lg:py-18">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-10">
          <p className="text-xl font-medium md:text-2xl" style={displayFont}>
            {c.socialSection.hashtag}
          </p>
          <p className="mt-4 text-sm text-[var(--bedding-muted)]">{c.socialSection.body}</p>
          <a
            href={c.socialSection.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium hover:opacity-70"
            style={{ color: accent }}
          >
            {c.socialSection.handle}
          </a>
        </div>
      </section>

      <BeddingDemoFooter config={c} base={base} />
    </div>
  );
}
