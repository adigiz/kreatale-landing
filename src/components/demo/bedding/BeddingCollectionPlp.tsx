"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { BeddingConfig } from "./bedding-config";
import "./bedding-demo.css";
import { BeddingDemoChrome } from "./BeddingDemoChrome";
import { BeddingDemoFooter } from "./BeddingDemoFooter";

export type BeddingPlpProduct = {
  title: string;
  slug: string;
  image?: string;
  /** Shown on card hover (crossfade) when set alongside `image`. */
  imageSecondary?: string;
  price?: string;
  fabricLabel?: string;
  badgeLabel?: string;
  swatches?: string[];
  /** Live store uses “From” on some bath SKUs only. */
  showFromPrice?: boolean;
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
  Bundle: "#29378c",
};

function swatchColor(name: string): string {
  return SWATCH_HEX[name] ?? "#d4d4d4";
}

/** Mirrors merchandising order on sojao.shop/collections/bath */
const BATH_BEST_SELLING_SLUGS = [
  "organic-essentials-towel-bundle",
  "organic-towel-couple-bundle",
  "organic-towel-family-bundle",
  "organic-cotton-bath-towels",
  "organic-hand-towel",
  "organic-face-towel-pair",
];

const BATH_FAQ: { q: string; a: string }[] = [
  {
    q: "What are SOJAO's towels made of?",
    a: "Our bath towels are crafted with pure certified organic cotton, just like our bedsheets. Organic cotton can hold up to 24–27 times its own weight in water — that absorbency is what makes these towels feel so good after a shower.",
  },
  {
    q: "Are SOJAO's towels suitable for sensitive skin?",
    a: "Our certified organic cotton towels are hypoallergenic and non-toxic, making them a strong choice for anyone with skin sensitivities such as eczema.",
  },
  {
    q: "How often should you replace your bath towels?",
    a: "It depends on how often you rotate them each week. Generally, replacing them every 1–2 years helps prevent bacteria buildup and keeps them feeling fresh.",
  },
  {
    q: "How do I care for my SOJAO towels to prevent them from being crusty?",
    a: "Towels often feel stiff when detergent and softener residue build up. Use less detergent, skip fabric softener, and add a water-only rinse now and then to keep loops lofty.",
  },
  {
    q: "Do SOJAO towels come in different sizes?",
    a: "Yes — face towels, hand towels, and bath towels from small and standard through jumbo. Check the live size guide on sojao.shop for exact measurements.",
  },
];

export function BeddingCollectionPlp({
  config,
  locale,
  demoSlug,
  categorySlug,
  collectionTitle,
  collectionIntro,
  products,
}: {
  config: BeddingConfig;
  locale: string;
  demoSlug: string;
  categorySlug: string;
  collectionTitle: string;
  collectionIntro?: string;
  products: BeddingPlpProduct[];
}) {
  const base = `/${locale}/demos/${demoSlug}`;
  const accent = config.primaryColor ?? "#29378c";
  const currency = config.currency ?? "S$";
  const displayFont = { fontFamily: "var(--font-bedding-display), ui-serif, Georgia, serif" };
  const isBathTowels = categorySlug === "bath-towels";

  const [sortBy, setSortBy] = useState<
    "featured" | "best-selling" | "price-asc" | "price-desc" | "title"
  >("featured");

  const [rewardSlide, setRewardSlide] = useState(0);
  const rewardSlides = [
    {
      title: "Unlock rewards with every purchase",
      subtitle: "Join our Sleep Easy Club now — points, perks, and member-only drops.",
      cta: "Learn more",
    },
    {
      title: "Free delivery in Singapore",
      subtitle: "No minimum spend on the live store — this demo is visual only.",
      cta: "Shop SOJAO",
    },
  ];

  const sorted = useMemo(() => {
    const copy = [...products];
    const parse = (p: string | undefined) =>
      parseFloat((p ?? "0").replace(/[^\d.]/g, "")) || 0;

    if (sortBy === "best-selling" && isBathTowels) {
      const rank = (slug: string) => {
        const i = BATH_BEST_SELLING_SLUGS.indexOf(slug);
        return i === -1 ? 999 : i;
      };
      copy.sort((a, b) => rank(a.slug) - rank(b.slug));
      return copy;
    }
    if (sortBy === "price-asc") {
      copy.sort((a, b) => parse(a.price) - parse(b.price));
    } else if (sortBy === "price-desc") {
      copy.sort((a, b) => parse(b.price) - parse(a.price));
    } else if (sortBy === "title") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [products, sortBy, isBathTowels]);

  const intro =
    collectionIntro ||
    "Thoughtfully made organic cotton — demo collection styled to echo the live SOJAO storefront.";

  const essentialsSlug = "organic-essentials-towel-bundle";
  const treatImage =
    products.find((p) => p.slug === essentialsSlug)?.image ??
    products[0]?.image ??
    config.heroImage;

  return (
    <div
      className="bedding-demo-root min-h-screen pb-20"
      style={
        {
          "--bedding-accent": accent,
          fontFamily: "var(--font-bedding-body), system-ui, sans-serif",
        } as CSSProperties
      }
    >
      <BeddingDemoChrome
        config={config}
        base={base}
        activeNavCollectionSlug={categorySlug}
      />

      <main className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-10 lg:pt-10">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--bedding-muted)]">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={base} className="transition hover:text-[var(--bedding-accent)]">
                {config.websiteName}
              </Link>
            </li>
            <li className="text-[var(--bedding-muted)]/60" aria-hidden>
              /
            </li>
            <li className="font-medium text-[var(--bedding-fg)]" aria-current="page">
              {collectionTitle}
            </li>
          </ol>
        </nav>

        <h1
          className="mt-6 max-w-3xl text-4xl font-normal tracking-tight text-[var(--bedding-fg)] sm:text-5xl"
          style={displayFont}
        >
          {collectionTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--bedding-muted)]">
          {intro}
        </p>

        <div className="mt-10 flex flex-col gap-4 border-y border-[var(--bedding-border)] py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled
              className="rounded border border-[var(--bedding-border)] bg-[var(--bedding-surface)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--bedding-muted)] opacity-70"
            >
              Filters
            </button>
            <label className="flex items-center gap-2 text-[13px] text-[var(--bedding-muted)]">
              <span className="sr-only">Sort by</span>
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="max-w-[200px] rounded border border-[var(--bedding-border)] bg-[var(--bedding-surface)] px-3 py-2 text-[13px] text-[var(--bedding-fg)] sm:max-w-none"
              >
                <option value="featured">Featured</option>
                {isBathTowels ? <option value="best-selling">Best selling</option> : null}
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="title">Alphabetical</option>
              </select>
            </label>
          </div>
          <p className="text-[13px] text-[var(--bedding-muted)]">
            {sorted.length} product{sorted.length === 1 ? "" : "s"}
          </p>
        </div>

        <p className="mt-3 text-[13px] text-[var(--bedding-muted)] sm:hidden">
          <span className="font-medium text-[var(--bedding-fg)]">Filter and sort</span>
          <span className="mx-2 text-[var(--bedding-border)]">·</span>
          Tap filters above on larger screens; sort applies below.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14">
          {sorted.map((p) => {
            const showFrom = p.showFromPrice !== false;
            return (
              <li key={p.slug}>
                <Link href={`${base}/package/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                    {p.image && p.imageSecondary ? (
                      <>
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          className="object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none group-hover:opacity-0"
                          sizes="(max-width:1024px) 50vw, 33vw"
                          unoptimized
                        />
                        <Image
                          src={p.imageSecondary}
                          alt=""
                          fill
                          className="object-cover opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none group-hover:opacity-100"
                          sizes="(max-width:1024px) 50vw, 33vw"
                          unoptimized
                        />
                      </>
                    ) : p.image ? (
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width:1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : null}
                    {p.badgeLabel ? (
                      <span className="absolute left-2 top-2 z-10 bg-[var(--bedding-surface)]/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--bedding-rust)] shadow-sm">
                        {p.badgeLabel}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-[15px] font-normal leading-snug text-[var(--bedding-fg)] group-hover:text-[var(--bedding-accent)]">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-[13px] text-[var(--bedding-muted)]">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--bedding-rust)]">
                      Sale price
                    </span>
                    <span className="ml-1.5 text-[var(--bedding-fg)]">
                      {showFrom ? <>From </> : null}
                      {currency}
                      {p.price ?? "—"}
                    </span>
                  </p>
                  {p.fabricLabel ? (
                    <p className="mt-1 text-xs text-[var(--bedding-muted)]">{p.fabricLabel}</p>
                  ) : null}
                  {p.swatches && p.swatches.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.swatches.map((name) => (
                        <span
                          key={name}
                          title={name}
                          className="h-5 w-5 rounded-full border border-[var(--bedding-border)] shadow-sm"
                          style={{ backgroundColor: swatchColor(name) }}
                        />
                      ))}
                    </div>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {isBathTowels ? (
          <>
            <section
              className="mt-16 border border-[var(--bedding-border)] bg-[var(--bedding-surface)] px-4 py-8 sm:px-8"
              aria-label="Rewards"
            >
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bedding-rust)]">
                  Sleep Easy Club
                </p>
                <h2
                  className="mt-3 text-2xl font-normal text-[var(--bedding-fg)] sm:text-3xl"
                  style={displayFont}
                >
                  {rewardSlides[rewardSlide].title}
                </h2>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--bedding-muted)]">
                  {rewardSlides[rewardSlide].subtitle}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    className="border border-[var(--bedding-fg)] bg-[var(--bedding-fg)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-[var(--bedding-fg)]"
                    onClick={() =>
                      toast.message("Demo — join the real Sleep Easy Club on sojao.shop.")
                    }
                  >
                    {rewardSlides[rewardSlide].cta}
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Previous"
                      className="flex h-10 w-10 items-center justify-center border border-[var(--bedding-border)] text-[var(--bedding-fg)] transition hover:border-[var(--bedding-fg)]"
                      onClick={() =>
                        setRewardSlide((i) => (i === 0 ? rewardSlides.length - 1 : i - 1))
                      }
                    >
                      <span className="material-icons text-xl">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Next"
                      className="flex h-10 w-10 items-center justify-center border border-[var(--bedding-border)] text-[var(--bedding-fg)] transition hover:border-[var(--bedding-fg)]"
                      onClick={() =>
                        setRewardSlide((i) => (i + 1) % rewardSlides.length)
                      }
                    >
                      <span className="material-icons text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-20 border-t border-[var(--bedding-border)] pt-14">
              <h2
                className="max-w-3xl text-2xl font-normal text-[var(--bedding-fg)] sm:text-3xl"
                style={displayFont}
              >
                What are the sizes of our Bath Towels?
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--bedding-muted)]">
                Bath towels come in various sizes, colours, and thicknesses for comfort and style. Our
                plush bath towels come in three sizes — Small, Standard, and Jumbo — so you can choose
                the drape you want after every bath.
              </p>

              <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Suitable for sensitive skin",
                    body: "Our certified organic cotton towels are hypoallergenic and non-toxic, making them perfect for anyone with skin sensitivities such as eczema.",
                  },
                  {
                    title: "How to maintain your towels",
                    body: "Wash regularly to keep towels fresh. That rhythm helps maintain absorbency and softness over time — pair with gentle detergent and skip fabric softener.",
                  },
                  {
                    title: "Luxurious feel",
                    body: "Made from 100% organic cotton, our towels are plush and velvety against the skin — the kind of detail that elevates an everyday routine.",
                  },
                  {
                    title: "Absorbency",
                    body: "Organic cotton can hold many times its weight in water. That’s why SOJAO towels feel so satisfying right out of the shower.",
                  },
                ].map((block) => (
                  <div key={block.title}>
                    <h3 className="text-[15px] font-semibold text-[var(--bedding-fg)]">{block.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--bedding-muted)]">
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 border-t border-[var(--bedding-border)] pt-12">
              <h2 className="text-lg font-normal text-[var(--bedding-fg)]" style={displayFont}>
                Common questions
              </h2>
              <div className="mt-6 space-y-2">
                {BATH_FAQ.map((item) => (
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
            </section>

            <section className="mt-20 overflow-hidden border border-[var(--bedding-border)] bg-[var(--bedding-surface)]">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/3] min-h-[240px] bg-neutral-200 lg:aspect-auto lg:min-h-[320px]">
                  {treatImage ? (
                    <Image
                      src={treatImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--bedding-rust)]">
                    Treat yourself
                  </p>
                  <h2
                    className="mt-4 text-3xl font-normal text-[var(--bedding-fg)] sm:text-4xl"
                    style={displayFont}
                  >
                    Plush towels for all your needs
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--bedding-muted)]">
                    Build a cohesive bathroom set with bundles designed to mix Frost, Stone, Natural,
                    and White — same spirit as the live bath collection.
                  </p>
                  <Link
                    href={`${base}/package/${essentialsSlug}`}
                    className="mt-8 inline-flex w-fit border border-[var(--bedding-fg)] bg-[var(--bedding-fg)] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-[var(--bedding-fg)]"
                  >
                    Shop Essential Towel Bundle
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-20 bg-[var(--bedding-fg)] px-4 py-14 text-center sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
                We hustle, you sleep easy
              </p>
              <h2
                className="mx-auto mt-4 max-w-xl text-2xl font-normal leading-snug text-white sm:text-3xl"
                style={displayFont}
              >
                Get 5% off your first order
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                Collect points and exclusive perks with our rewards program — demo form only; the real
                newsletter lives on{" "}
                <a
                  href="https://sojao.shop"
                  className="underline decoration-white/40 underline-offset-2 hover:text-white"
                >
                  sojao.shop
                </a>
                .
              </p>
              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.message("Demo only — subscribe on SOJAO for real perks.");
                }}
              >
                <label htmlFor="bedding-plp-email" className="sr-only">
                  Email
                </label>
                <input
                  id="bedding-plp-email"
                  type="email"
                  placeholder="Email address"
                  className="min-h-[48px] flex-1 border border-white/25 bg-white/10 px-4 text-[15px] text-white placeholder:text-white/50 focus:border-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[48px] border border-white bg-white px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bedding-fg)] transition hover:bg-transparent hover:text-white"
                >
                  Join us
                </button>
              </form>
            </section>
          </>
        ) : null}

        {!isBathTowels ? (
          <section className="mt-20 border-t border-[var(--bedding-border)] pt-12">
            <h2 className="text-lg font-normal text-[var(--bedding-fg)]" style={displayFont}>
              Why organic cotton?
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Suitable for sensitive skin",
                  body: "Certified organic cotton is hypoallergenic and non-toxic — gentle for eczema-prone skin.",
                },
                {
                  title: "Luxurious feel",
                  body: "Finishes that stay soft wash after wash when cared for properly.",
                },
                {
                  title: "Absorbency",
                  body: "Organic cotton fibres can hold many times their weight in water.",
                },
                {
                  title: "Care tips",
                  body: "Skip fabric softener, use less detergent, and add an extra rinse to keep fibres lofty.",
                },
              ].map((block) => (
                <div key={block.title}>
                  <p className="text-[14px] font-semibold text-[var(--bedding-fg)]">{block.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--bedding-muted)]">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <BeddingDemoFooter config={config} base={base} />
    </div>
  );
}
