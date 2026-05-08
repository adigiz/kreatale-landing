"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { toast } from "sonner";

import type { FortesConfig } from "./fortes-config";
import {
  FORTES_DEMO_CONTACT_EMAIL,
  FORTES_DEMO_KREATALE_LOGO_SVG,
  FORTES_MEDIA,
  FORTES_ORIGIN,
} from "./fortes-constants";
import { TRUSTED_LOGOS } from "./fortes-data";
import { FortesApproachSection } from "./FortesApproachSection";
import { FortesContactCreate } from "./FortesContactCreate";
import { FortesSiteFooter } from "./FortesSiteFooter";

import "./fortes-contact-footer-parity.css";
import { FortesCaseStudies } from "./FortesCaseStudies";
import { FortesFaq } from "./FortesFaq";
import { FortesExpertise } from "./FortesExpertise";
import { FortesHero } from "./FortesHero";
import { FortesVisualizeArchitecture } from "./FortesVisualizeArchitecture";
import { FortesPipeline } from "./FortesPipeline";
import { FortesPreloader } from "./FortesPreloader";
import { FortesTestimonials } from "./FortesTestimonials";

const HEADER_LINKS = [
  { href: `${FORTES_ORIGIN}/3d-rendering-portfolio/`, label: "Works" },
  { href: `${FORTES_ORIGIN}/services/`, label: "Services" },
  { href: `${FORTES_ORIGIN}/about-us/`, label: "Studio" },
  { href: `${FORTES_ORIGIN}/contacts/`, label: "Contacts" },
  { href: `${FORTES_ORIGIN}/blog/`, label: "Blog" },
] as const;

const STICKY_HEADER_OFFSET_PX = 96;

export default function FortesDemoShell({ config }: { config?: FortesConfig }) {
  const heroTitle =
    config?.heroTitle?.trim() ||
    "Award-Winning | 3d Rendering and Architectural Visualization Studio";
  const heroSubtitle =
    config?.heroSubtitle?.trim() ||
    "Creating a new reality based on your personal vision through 3D rendering. We provide 3D visualization services for designers, architects, and real estate managers.";

  const [showPreloader, setShowPreloader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerDark, setHeaderDark] = useState(false);
  const [heroLocked, setHeroLocked] = useState(true);

  const lenisRef = useRef<Lenis | null>(null);
  const heroLockedRef = useRef(true);
  useEffect(() => {
    heroLockedRef.current = heroLocked;
  }, [heroLocked]);

  const completeHeroUnlockAfterFortesAnimation = useCallback(() => {
    if (!heroLockedRef.current) return;
    setHeaderDark(true);
    heroLockedRef.current = false;
    setHeroLocked(false);
    document.documentElement.classList.remove("fortes-scroll-lock");
    const lenis = lenisRef.current;
    lenis?.start();
    lenis?.resize();
    requestAnimationFrame(() => {
      lenis?.scrollTo("#expertise", {
        offset: -STICKY_HEADER_OFFSET_PX,
        duration: 1.32,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          AOS.refresh();
        },
      });
    });
  }, []);

  const relockHeroAtTop = useCallback(() => {
    if (heroLockedRef.current) return;
    const lenis = lenisRef.current;
    if (!lenis || lenis.scroll > 6) return;
    heroLockedRef.current = true;
    setHeroLocked(true);
    setHeaderDark(false);
    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
    document.documentElement.classList.add("fortes-scroll-lock");
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (showPreloader) return;
    const lenis = new Lenis({
      lerp: 0.055,
      smoothWheel: true,
      autoRaf: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    lenis.stop();
    document.documentElement.classList.add("fortes-scroll-lock");

    let aosRaf = 0;
    const onLenisScroll = () => {
      if (aosRaf) return;
      aosRaf = requestAnimationFrame(() => {
        aosRaf = 0;
        AOS.refresh();
      });
    };
    const offLenisScroll = lenis.on("scroll", onLenisScroll);

    return () => {
      offLenisScroll();
      if (aosRaf) cancelAnimationFrame(aosRaf);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("fortes-scroll-lock");
    };
  }, [showPreloader]);

  useEffect(() => {
    if (showPreloader) return;
    AOS.init({
      duration: 900,
      easing: "cubic-bezier(0.63, 0, 0.02, 1)",
      once: true,
      offset: 90,
    });
    const onResize = () => AOS.refresh();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [showPreloader]);

  useEffect(() => {
    if (showPreloader) return;

    const onWheel = (e: WheelEvent) => {
      if (heroLockedRef.current) return;
      const lenis = lenisRef.current;
      if (lenis && lenis.scroll < 4 && e.deltaY < -20) {
        e.preventDefault();
        relockHeroAtTop();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [showPreloader, relockHeroAtTop]);

  const onScroll = useCallback(() => {
    if (heroLockedRef.current) return;
    setHeaderDark(window.scrollY > STICKY_HEADER_OFFSET_PX);
  }, []);

  const requestDocumentScroll = useCallback(
    (y: number, opts?: { immediate?: boolean; duration?: number }) => {
      const lenis = lenisRef.current;
      if (!lenis) {
        window.scrollTo({ top: y, behavior: opts?.immediate ? "auto" : "smooth" });
        return;
      }
      lenis.scrollTo(y, {
        immediate: opts?.immediate ?? false,
        ...(opts?.duration != null ? { duration: opts.duration } : {}),
      });
    },
    [],
  );

  const getViewportScrollY = useCallback(
    () => lenisRef.current?.animatedScroll ?? window.scrollY,
    [],
  );

  const subscribeLenisScroll = useCallback((cb: () => void) => {
    const lenis = lenisRef.current;
    if (!lenis) return () => {};
    return lenis.on("scroll", cb);
  }, []);

  useEffect(() => {
    if (showPreloader) return;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll, showPreloader]);

  const copyEmail = () => {
    const email = FORTES_DEMO_CONTACT_EMAIL;
    void navigator.clipboard.writeText(email).then(
      () => toast.success("Copied"),
      () => toast.info(email),
    );
  };

  const estimateDemo = () => {
    toast.message("Get Estimate", {
      description: "Demo CTA — hook Calendly or your form here.",
    });
  };

  const headerIsDark = !heroLocked && headerDark;
  const headerChromeDark = headerIsDark || menuOpen;

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", closeIfDesktop);
    closeIfDesktop();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", closeIfDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      {showPreloader && (
        <FortesPreloader onDone={() => setShowPreloader(false)} />
      )}

      <header
        className={`fortes-header${menuOpen ? " fortes-header--menu-open" : ""} ${
          headerChromeDark ? "fortes-header--dark" : ""
        } ${headerChromeDark ? "fortes-header--scrolled" : ""}`}
      >
        <div className="fortes-header__inner">
          <Link
            href="#top"
            className="fortes-header__logo block"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src={FORTES_DEMO_KREATALE_LOGO_SVG}
              alt="Kreatale"
              fill
              className={`object-contain object-left transition-all duration-500 ${
                headerChromeDark ? "opacity-100" : "brightness-0 invert"
              }`}
              sizes="200px"
              unoptimized
            />
          </Link>

          <nav className="fortes-header__nav mx-auto hidden flex-wrap items-center justify-center gap-8 md:flex">
            {HEADER_LINKS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={copyEmail}
              className="fortes-header__email"
            >
              {FORTES_DEMO_CONTACT_EMAIL}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3.90625 7.16113C3.90625 5.31971 3.90625 4.399 4.47831 3.82694C5.05036 3.25488 5.97107 3.25488 7.8125 3.25488H9.76562C11.607 3.25488 12.5277 3.25488 13.0998 3.82694C13.6719 4.399 13.6719 5.31971 13.6719 7.16113V10.4163C13.6719 12.2577 13.6719 13.1784 13.0998 13.7505C12.5277 14.3226 11.607 14.3226 9.76562 14.3226H7.8125C5.97107 14.3226 5.05036 14.3226 4.47831 13.7505C3.90625 13.1784 3.90625 12.2577 3.90625 10.4163V7.16113Z"
                  stroke="currentColor"
                  strokeWidth="0.976562"
                />
                <path
                  d="M3.90625 12.3695C2.82757 12.3695 1.95312 11.4951 1.95312 10.4163V6.51009C1.95312 4.05486 1.95312 2.82725 2.71587 2.0645C3.47861 1.30176 4.70622 1.30176 7.16146 1.30176H9.76562C10.8443 1.30176 11.7187 2.1762 11.7187 3.25488"
                  stroke="currentColor"
                  strokeWidth="0.976562"
                />
              </svg>
            </button>
            <button
              type="button"
              className="fortes-btn fortes-header__estimate-btn"
              onClick={estimateDemo}
            >
              Get Estimate
            </button>
            <button
              type="button"
              className={`fortes-header__burger${menuOpen ? " fortes-header__burger--open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[1990] flex min-h-0 flex-col bg-white pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-[#080808] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav className="flex shrink-0 flex-col px-8 text-lg font-semibold">
            {HEADER_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-black/10 py-5"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <button type="button" className="py-5 text-left" onClick={copyEmail}>
              {FORTES_DEMO_CONTACT_EMAIL}
            </button>
            <button type="button" className="fortes-btn mt-4 mb-8 w-fit" onClick={estimateDemo}>
              Get Estimate
            </button>
          </nav>
          <button
            type="button"
            className="min-h-[25vh] flex-1 bg-transparent text-left"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      ) : null}

      <main id="top">
        <section aria-label="Hero">
          <FortesHero
            preloaderComplete={!showPreloader}
            scrollLocked={heroLocked}
            scrollFree={!heroLocked}
            heroTitle={heroTitle}
            heroSubtitle={heroSubtitle}
            onHeroReleaseComplete={completeHeroUnlockAfterFortesAnimation}
          />
        </section>

        <FortesExpertise />

        <FortesVisualizeArchitecture />

        <FortesCaseStudies />

        <section id="trusted" className="fortes-trusted">
          <Image
            src={FORTES_MEDIA.trustedBg}
            alt=""
            fill
            className="fortes-trusted__bg"
            unoptimized
          />
          <div className="fortes-container relative">
            <h2 className="fortes-trusted__title" data-aos="text-anim">
              Trusted by
            </h2>
            <div className="fortes-trusted__grid">
              {TRUSTED_LOGOS.map((src, i) => (
                <div
                  key={src}
                  className="relative h-9 w-28 sm:h-10 sm:w-32"
                  data-aos="trusted-show"
                  data-aos-delay={40 + (i % 8) * 45}
                >
                  <Image src={src} alt="" fill className="object-contain object-center" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fortes-ai" data-aos="scale-video">
          <video
            className="fortes-ai__video"
            autoPlay
            muted
            loop
            playsInline
            poster={FORTES_MEDIA.aiSectionPoster}
          >
            <source src={FORTES_MEDIA.aiSectionVideo} type="video/mp4" />
          </video>
          <div className="fortes-ai__overlay" />
          <div className="fortes-container fortes-ai__content">
            <p className="fortes-ai__label">ai human inplementation</p>
            <div className="fortes-ai__words">
              {(["Ai", "human", "implementation"] as const).map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.12,
                    ease: [0.63, 0, 0.02, 1],
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </div>
            <p className="fortes-ai__text">
              AI human puts realistic digital people into 3D scenes for architectural renders,
              virtual tours and product showcases.
            </p>
          </div>
        </section>

        <FortesFaq />

        <FortesTestimonials />

        <FortesPipeline
          requestScrollTo={requestDocumentScroll}
          getViewportScrollY={getViewportScrollY}
          subscribeLenisScroll={subscribeLenisScroll}
        />

        <FortesApproachSection />

        <FortesContactCreate />

        <FortesSiteFooter />
      </main>
    </>
  );
}
