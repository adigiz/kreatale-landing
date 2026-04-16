"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BeddingConfig } from "./bedding-config";

const DESKTOP_MENU_CLOSE_MS = 160;

export type MegaFeatured = {
  image: string;
  title: string;
  subtitle?: string;
  collectionSlug: string;
};

type BeddingNavMega = {
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      description?: string;
      collectionSlug: string;
    }>;
  }>;
  featured?: MegaFeatured;
  featuredSecondary?: MegaFeatured;
};

function readNavMega(cat: unknown): BeddingNavMega | undefined {
  return (cat as { mega?: BeddingNavMega }).mega;
}

function megaLayoutClasses(columnCount: number, promoCount: number) {
  if (promoCount >= 2 && columnCount === 3) {
    return {
      root: "grid grid-cols-1 gap-10 p-6 sm:p-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:p-10",
      col: "min-w-0 lg:col-span-2",
      promo: "min-w-0 lg:col-span-3",
    };
  }
  if (promoCount === 1 && columnCount === 3) {
    return {
      root: "grid grid-cols-1 gap-10 p-6 sm:p-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:p-10",
      col: "min-w-0 lg:col-span-2",
      promo: "min-w-0 lg:col-span-6",
    };
  }
  if (promoCount === 1 && columnCount === 2) {
    return {
      root: "grid grid-cols-1 gap-10 p-6 sm:p-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:p-10",
      col: "min-w-0 lg:col-span-3",
      promo: "min-w-0 lg:col-span-6",
    };
  }
  return {
    root: "grid grid-cols-1 gap-10 p-6 sm:p-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10 lg:p-10",
    col: "min-w-0 lg:col-span-5",
    promo: "min-w-0 lg:col-span-7",
  };
}

export function BeddingDemoChrome({
  config: c,
  base,
  activeNavCollectionSlug,
}: {
  config: BeddingConfig;
  base: string;
  /** Highlights nav + mega for this collection (PLP + PDP). */
  activeNavCollectionSlug?: string;
}) {
  const pathname = usePathname() || "";
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopSlug, setOpenDesktopSlug] = useState<string | null>(null);
  const closeMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayFont = { fontFamily: "var(--font-bedding-display), ui-serif, Georgia, serif" };
  const marqueeItems = [...c.announcements, ...c.announcements];

  const cancelCloseDesktopMenu = useCallback(() => {
    if (closeMenuTimerRef.current != null) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  }, []);

  const scheduleCloseDesktopMenu = useCallback(() => {
    cancelCloseDesktopMenu();
    closeMenuTimerRef.current = setTimeout(() => {
      setOpenDesktopSlug(null);
      closeMenuTimerRef.current = null;
    }, DESKTOP_MENU_CLOSE_MS);
  }, [cancelCloseDesktopMenu]);

  const openDesktopMenu = useCallback(
    (slug: string) => {
      cancelCloseDesktopMenu();
      setOpenDesktopSlug(slug);
    },
    [cancelCloseDesktopMenu],
  );

  useEffect(
    () => () => {
      if (closeMenuTimerRef.current != null) clearTimeout(closeMenuTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    setOpenDesktopSlug(null);
    cancelCloseDesktopMenu();
  }, [pathname, cancelCloseDesktopMenu]);

  const openDesktopCategory = openDesktopSlug
    ? c.navCategories.find((x) => x.slug === openDesktopSlug)
    : undefined;
  const openDesktopMega = openDesktopCategory
    ? readNavMega(openDesktopCategory)
    : undefined;

  const isCategoryActive = (categorySlug: string) =>
    (activeNavCollectionSlug != null &&
      activeNavCollectionSlug !== "" &&
      activeNavCollectionSlug === categorySlug) ||
    pathname === `${base}/${categorySlug}` ||
    pathname.startsWith(`${base}/${categorySlug}/`);

  const desktopNavLinkBase =
    "relative inline-flex items-center rounded-sm px-3 py-2 text-[13px] font-medium tracking-wide text-[var(--bedding-header-text)] after:pointer-events-none after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:bg-[var(--bedding-accent)] after:transition-transform after:duration-300 after:ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bedding-accent)]";

  /** Softer ease + longer durations than before — reads closer to a calm storefront reveal. */
  const megaEase = [0.25, 0.1, 0.25, 1] as const;
  const megaPanelTransition = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.48, ease: megaEase };
  /** Crossfade only when swapping categories — avoids fighting the shell motion. */
  const megaInnerSwapEnter = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.4, ease: megaEase };
  const megaInnerSwapExit = reduceMotion
    ? { duration: 0.1 }
    : { duration: 0.18, ease: megaEase };
  const megaBlockTransition = reduceMotion
    ? { duration: 0.08 }
    : { duration: 0.42, ease: megaEase };

  const megaGridVariants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.085, delayChildren: 0.12 },
    },
  };

  const megaBlockVariants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: megaBlockTransition,
    },
  };

  return (
    <>
      <div
        className="border-b border-[var(--bedding-border)] bg-[var(--bedding-surface)] py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--bedding-rust)] overflow-hidden"
        style={{ borderColor: "var(--bedding-border)" }}
      >
        <div className="bedding-marquee flex w-max whitespace-nowrap">
          {marqueeItems.map((line, i) => (
            <span key={i} className="px-12">
              {line}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--bedding-border)] bg-[var(--bedding-surface)]/95 backdrop-blur-md">
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="relative flex h-[68px] items-center justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:justify-items-stretch">
            <div className="relative z-10 flex min-w-0 items-center justify-self-start">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <span className="material-icons text-2xl text-[var(--bedding-header-text)]">menu</span>
              </button>

              <Link
                href={base}
                className="absolute left-1/2 top-1/2 flex h-9 max-w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:static lg:translate-x-0 lg:translate-y-0"
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.websiteName}
                    width={120}
                    height={30}
                    className="h-7 w-auto object-contain object-left"
                    unoptimized
                  />
                ) : (
                  <span className="text-base font-medium tracking-[0.12em]" style={displayFont}>
                    {c.websiteName}
                  </span>
                )}
              </Link>
            </div>

            <nav
              className="relative z-30 hidden justify-self-center gap-1 lg:flex"
              aria-label="Main navigation"
            >
              {c.navCategories.map((cat) => {
                const mega = readNavMega(cat);
                const navActive = isCategoryActive(cat.slug);
                const itemOpen = openDesktopSlug === cat.slug;
                const navUnderline =
                  navActive || itemOpen ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100";
                const navLinkClass = `${desktopNavLinkBase} ${navUnderline}`;

                return (
                  <div
                    key={cat.label}
                    className={mega ? "shrink-0" : "relative shrink-0"}
                    onMouseEnter={() => {
                      openDesktopMenu(cat.slug);
                    }}
                    onMouseLeave={scheduleCloseDesktopMenu}
                  >
                    <Link
                      href={`${base}/${cat.slug}`}
                      className={navLinkClass}
                      aria-expanded={itemOpen}
                      aria-haspopup="true"
                    >
                      {cat.label}
                    </Link>
                    {!mega ? (
                      <div
                        className={`absolute left-0 top-full z-20 pt-1 transition duration-150 ${
                          itemOpen
                            ? "visible opacity-100"
                            : "invisible pointer-events-none opacity-0"
                        }`}
                      >
                        <div className="min-w-[220px] border border-[var(--bedding-border)] bg-[var(--bedding-surface)] py-2 shadow-lg">
                          {c.packages
                            .filter((p) =>
                              (cat as { children?: string[] }).children?.includes(p.slug ?? ""),
                            )
                            .map((p) => (
                              <Link
                                key={p.slug}
                                href={`${base}/${p.slug}`}
                                className="block px-4 py-2 text-sm hover:bg-[var(--bedding-bg)]"
                              >
                                {p.title}
                              </Link>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="relative z-10 flex items-center justify-end justify-self-end gap-4 sm:gap-5">
              <button type="button" aria-label="Search" className="hidden sm:block">
                <span className="material-icons text-[22px] text-[var(--bedding-header-text)]">search</span>
              </button>
              <button type="button" aria-label="Account" className="hidden sm:block">
                <span className="material-icons text-[22px] text-[var(--bedding-header-text)]">
                  person_outline
                </span>
              </button>
              <button type="button" aria-label="Cart" className="relative">
                <span className="material-icons text-[22px] text-[var(--bedding-header-text)]">
                  shopping_bag
                </span>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--bedding-accent)] text-[9px] font-bold text-white">
                  0
                </span>
              </button>
            </div>
          </div>

          <div
            className={`absolute left-0 right-0 top-full z-[90] hidden lg:block ${
              openDesktopMega ? "pointer-events-auto" : "pointer-events-none"
            }`}
            onMouseEnter={cancelCloseDesktopMenu}
            onMouseLeave={scheduleCloseDesktopMenu}
          >
            <AnimatePresence initial={false}>
              {openDesktopMega ? (
                <motion.div
                  key="desktop-mega-shell"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1, transition: megaPanelTransition }}
                  exit={{
                    opacity: 0,
                    transition: reduceMotion ? { duration: 0.12 } : { duration: 0.28, ease: megaEase },
                  }}
                  className="mt-2 min-h-[min(240px,45vh)] w-full overflow-hidden border border-[var(--bedding-border)] bg-[var(--bedding-surface)] shadow-[0_24px_60px_rgba(10,39,61,0.12)]"
                >
                  <AnimatePresence initial={false} mode="wait">
                    {openDesktopSlug ? (
                      <motion.div
                        key={openDesktopSlug}
                        role="region"
                        aria-label={`${openDesktopCategory?.label ?? "Menu"} submenu`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: megaInnerSwapEnter }}
                        exit={{ opacity: 0, transition: megaInnerSwapExit }}
                        className="max-h-[min(85vh,720px)] w-full overflow-y-auto"
                      >
                        {(() => {
                          const mega = openDesktopMega;
                          const promos: MegaFeatured[] = [
                            ...(mega.featured ? [mega.featured] : []),
                            ...(mega.featuredSecondary ? [mega.featuredSecondary] : []),
                          ];
                          const layout = megaLayoutClasses(mega.columns.length, promos.length);
                          return (
                            <motion.div
                              className={layout.root}
                              variants={megaGridVariants}
                              initial="hidden"
                              animate="show"
                            >
                              {mega.columns.map((col) => (
                                <motion.div
                                  key={col.title}
                                  className={layout.col}
                                  variants={megaBlockVariants}
                                >
                                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--bedding-rust)]">
                                    {col.title}
                                  </p>
                                  <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                      <li key={link.label}>
                                        <Link
                                          href={`${base}/${link.collectionSlug}`}
                                          className="block rounded-sm py-0.5 transition hover:text-[var(--bedding-accent)]"
                                        >
                                          <span className="text-[13px] font-normal text-[var(--bedding-fg)]">
                                            {link.label}
                                          </span>
                                          {link.description ? (
                                            <span className="mt-1 block text-xs leading-snug text-[var(--bedding-muted)]">
                                              {link.description}
                                            </span>
                                          ) : null}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              ))}
                              {promos.map((promo) => (
                                <motion.div
                                  key={promo.title}
                                  className={layout.promo}
                                  variants={megaBlockVariants}
                                >
                                  <Link
                                    href={`${base}/${promo.collectionSlug}`}
                                    className="group/feat block overflow-hidden"
                                  >
                                    <div className="relative aspect-[5/3] w-full bg-neutral-100">
                                      <Image
                                        src={promo.image}
                                        alt=""
                                        fill
                                        className="object-cover transition duration-500 group-hover/feat:scale-[1.03]"
                                        sizes="(max-width:1024px) 100vw, 22vw"
                                        unoptimized
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="text-[10px] font-bold uppercase leading-snug tracking-[0.14em]">
                                          {promo.title}
                                        </p>
                                        {promo.subtitle ? (
                                          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-white/95">
                                            {promo.subtitle}
                                          </p>
                                        ) : null}
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          );
                        })()}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-[var(--bedding-surface)] shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-[var(--bedding-border)] px-4 py-4">
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.websiteName}
                    width={96}
                    height={24}
                    className="h-6 w-auto"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm font-semibold" style={displayFont}>
                    {c.websiteName}
                  </span>
                )}
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto p-4">
                {c.navCategories.map((cat) => {
                  const mega = readNavMega(cat);
                  return (
                    <div
                      key={cat.label}
                      className="mb-6 border-b border-[var(--bedding-border)] pb-6 last:mb-0 last:border-0 last:pb-0"
                    >
                      <Link
                        href={`${base}/${cat.slug}`}
                        className="text-base font-semibold text-[var(--bedding-fg)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.label}
                      </Link>
                      {mega ? (
                        <div className="mt-4 space-y-5 pl-1">
                          {mega.columns.map((col) => (
                            <div key={col.title}>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--bedding-muted)]">
                                {col.title}
                              </p>
                              <ul className="mt-2 space-y-2">
                                {col.links.map((link) => (
                                  <li key={link.label}>
                                    <Link
                                      href={`${base}/${link.collectionSlug}`}
                                      className="text-sm text-[var(--bedding-fg)]"
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 flex flex-col gap-2 pl-2">
                          {c.packages
                            .filter((p) =>
                              (cat as { children?: string[] }).children?.includes(p.slug ?? ""),
                            )
                            .map((p) => (
                              <Link
                                key={p.slug}
                                href={`${base}/${p.slug}`}
                                className="text-sm text-[var(--bedding-muted)]"
                                onClick={() => setMobileOpen(false)}
                              >
                                {p.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
