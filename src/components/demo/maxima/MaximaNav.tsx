"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MAXIMA_NAV_PAGES, MAXIMA_PROGRAM_SLIDES } from "./maxima-data";
import { MaximaNavLogo } from "./MaximaNavLogo";
import "./maxima-nav.css";

/** Rest rotation when mega is open — production `angle` prop on `ie` wrapper. */
const MEGA_MENU_REST_ROTATION = -4.23;

type Panel = "programs" | "about" | null;

function defaultPreviewForPanel(panel: Panel): string | null {
  switch (panel) {
    case "programs":
      return MAXIMA_PROGRAM_SLIDES[0]?.image ?? null;
    case "about":
      return MAXIMA_NAV_PAGES[0]?.image ?? null;
    case null:
      return null;
    default: {
      const _exhaustive: never = panel;
      return _exhaustive;
    }
  }
}

export default function MaximaNav() {
  const headerRef = useRef<HTMLElement>(null);
  const programsMegaRef = useRef<HTMLDivElement>(null);
  const aboutMegaRef = useRef<HTMLDivElement>(null);
  const programsMegaTl = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const aboutMegaTl = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const reduceMotion = useReducedMotion();
  const [panel, setPanel] = useState<Panel>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeT.current) {
      clearTimeout(closeT.current);
      closeT.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeT.current = setTimeout(() => {
      setPanel(null);
      setPreview(null);
    }, 200);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setPanel(null);
    setPreview(null);
  }, [cancelClose]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    if (reduceMotion) {
      gsap.set(el, { clearProps: "transform" });
      return;
    }

    gsap.set(el, { yPercent: -200 });
    const tween = gsap.to(el, {
      yPercent: 0,
      duration: 0.95,
      ease: "power4.out",
      delay: 0.1,
    });

    return () => {
      tween.kill();
    };
  }, [reduceMotion]);

  /** Mega peel: same GSAP pattern as maximatherapy.com `ie` component. */
  useLayoutEffect(() => {
    if (reduceMotion) {
      programsMegaTl.current?.kill();
      aboutMegaTl.current?.kill();
      programsMegaTl.current = null;
      aboutMegaTl.current = null;
      return;
    }

    const pEl = programsMegaRef.current;
    const aEl = aboutMegaRef.current;
    if (!pEl || !aEl) return;

    gsap.set([pEl, aEl], {
      transformOrigin: "100% 100%",
      rotation: 90,
    });

    programsMegaTl.current?.kill();
    aboutMegaTl.current?.kill();

    const pTl = gsap.timeline({ paused: true });
    pTl.fromTo(
      pEl,
      { rotation: 90 },
      {
        rotation: MEGA_MENU_REST_ROTATION,
        duration: 1.2,
        ease: "elastic.out(1, 1)",
      },
    );
    programsMegaTl.current = pTl;

    const aTl = gsap.timeline({ paused: true });
    aTl.fromTo(
      aEl,
      { rotation: 90 },
      {
        rotation: MEGA_MENU_REST_ROTATION,
        duration: 1.2,
        ease: "elastic.out(1, 1)",
      },
    );
    aboutMegaTl.current = aTl;

    return () => {
      programsMegaTl.current?.kill();
      aboutMegaTl.current?.kill();
      programsMegaTl.current = null;
      aboutMegaTl.current = null;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const pTl = programsMegaTl.current;
    const aTl = aboutMegaTl.current;
    if (!pTl || !aTl) return;

    gsap.killTweensOf([pTl, aTl]);

    if (panel === "programs") {
      gsap.to(pTl, { progress: 1, duration: 1.8, ease: "power1.out" });
      gsap.to(aTl, { progress: 0, duration: 1, ease: "power1.out" });
    } else if (panel === "about") {
      gsap.to(aTl, { progress: 1, duration: 1.8, ease: "power1.out" });
      gsap.to(pTl, { progress: 0, duration: 1, ease: "power1.out" });
    } else {
      gsap.to(pTl, { progress: 0, duration: 1, ease: "power1.out" });
      gsap.to(aTl, { progress: 0, duration: 1, ease: "power1.out" });
    }
  }, [panel, reduceMotion]);

  useEffect(() => {
    setPreview(defaultPreviewForPanel(panel));
  }, [panel]);

  useEffect(() => {
    const root = headerRef.current?.closest(".maxima-demo-root");
    if (!root) return;
    root.classList.toggle("maxima-nav-mega-open", Boolean(panel));
    return () => root.classList.remove("maxima-nav-mega-open");
  }, [panel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeNow]);

  useEffect(
    () => () => {
      if (closeT.current) clearTimeout(closeT.current);
    },
    [],
  );

  return (
    <header ref={headerRef} className="header maxima-nav-shell">
      <div className="maxima-nav-ghost" aria-hidden />
      <div className="maxima-nav-rail">
        <Link
          href="#top"
          className="pointer-events-auto relative z-[2] mr-auto flex flex-col justify-center"
          aria-label="Maxima Therapy - Home"
          onClick={closeNow}
        >
          <MaximaNavLogo />
        </Link>

        <nav
          className="maxima-nav-main pointer-events-auto relative z-[1] flex items-center"
          onMouseLeave={scheduleClose}
        >
          <div className="maxima-nav-sub-nav pointer-events-none absolute left-0 top-0 z-0">
            <div
              className={cn(
                "maxima-nav-mega-scale maxima-nav-mega-scale--programs origin-bottom-right",
                panel === "programs" ? "z-[2]" : "z-[1]",
              )}
            >
              <div
                ref={programsMegaRef}
                className={cn(
                  "maxima-nav-mega-panel maxima-nav-corners-big flex flex-col items-start justify-end bg-[var(--color-white)]",
                  !reduceMotion && "rotate-90",
                  reduceMotion &&
                    panel === "programs" &&
                    "maxima-nav-mega-panel--open",
                  panel === "programs"
                    ? "pointer-events-auto"
                    : "pointer-events-none",
                )}
                aria-hidden={panel !== "programs"}
              >
                <MegaProgramsColumn
                  preview={preview}
                  onPreview={setPreview}
                  onNavigate={closeNow}
                />
              </div>
            </div>
            <div
              className={cn(
                "maxima-nav-mega-scale maxima-nav-mega-scale--about origin-bottom-right",
                panel === "about" ? "z-[2]" : "z-[1]",
              )}
            >
              <div
                ref={aboutMegaRef}
                className={cn(
                  "maxima-nav-mega-panel maxima-nav-corners-big flex flex-col items-start justify-end bg-[var(--color-white)]",
                  !reduceMotion && "rotate-90",
                  reduceMotion &&
                    panel === "about" &&
                    "maxima-nav-mega-panel--open",
                  panel === "about"
                    ? "pointer-events-auto"
                    : "pointer-events-none",
                )}
                aria-hidden={panel !== "about"}
              >
                <MegaAboutColumn
                  preview={preview}
                  onPreview={setPreview}
                  onNavigate={closeNow}
                />
              </div>
            </div>
          </div>

          <ul
            className={cn(
              "maxima-nav-pill relative z-10 flex items-center transition-colors",
              panel ? "bg-[var(--color-beige)]" : "bg-[var(--color-white)]",
            )}
          >
            <li
              className={cn(
                "maxima-nav-btn maxima-nav-pill-programs pointer-events-auto flex cursor-pointer items-center text-[var(--color-black)]",
              )}
              onMouseEnter={() => {
                cancelClose();
                setPanel("programs");
              }}
              onClick={() =>
                setPanel((p) => (p === "programs" ? null : "programs"))
              }
              aria-expanded={panel === "programs"}
            >
              <span>Programs</span>
              <span
                className={cn(
                  "maxima-nav-chevron-wrap",
                  panel === "programs" && "maxima-nav-chevron-wrap--open",
                )}
              >
                <ChevronIcon />
              </span>
            </li>
            <li
              className={cn(
                "maxima-nav-btn maxima-nav-pill-about pointer-events-auto flex cursor-pointer items-center text-[var(--color-black)]",
              )}
              onMouseEnter={() => {
                cancelClose();
                setPanel("about");
              }}
              onClick={() => setPanel((p) => (p === "about" ? null : "about"))}
              aria-expanded={panel === "about"}
            >
              <span>About</span>
              <span
                className={cn(
                  "maxima-nav-chevron-wrap",
                  panel === "about" && "maxima-nav-chevron-wrap--open",
                )}
              >
                <ChevronIcon />
              </span>
            </li>
            <li className="maxima-nav-btn maxima-nav-pill-areas pointer-events-auto text-[var(--color-black)]">
              <Link
                href="#areas"
                className="text-[var(--color-black)] hover:opacity-80"
                onClick={closeNow}
              >
                Service Areas
              </Link>
            </li>
          </ul>

          <DonateButton />

          <div className="relative z-10">
            <Link
              href="#contact"
              className="maxima-nav-btn-round text-[var(--color-blue)] transition-opacity hover:opacity-90"
              aria-label="Contact"
              onClick={closeNow}
            >
              <MailIcon />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function MegaProgramsColumn({
  preview,
  onPreview,
  onNavigate,
}: {
  preview: string | null;
  onPreview: (src: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="relative flex w-auto flex-col items-start">
      <div className="maxima-nav-preview-stack">
        {MAXIMA_PROGRAM_SLIDES.map((p) => (
          <div
            key={p.key}
            className={cn(
              "maxima-nav-preview-frame maxima-nav-corners-medium",
              preview === p.image && "maxima-nav-preview-frame--active",
            )}
          >
            <Image
              src={p.image}
              alt=""
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
        ))}
      </div>
      {MAXIMA_PROGRAM_SLIDES.map((p) => (
        <div key={p.key}>
          <Link
            href="#program-services"
            className="maxima-nav-mega-row maxima-nav-height-item flex items-center text-[var(--color-black)] hover:opacity-95"
            onMouseEnter={() => onPreview(p.image)}
            onClick={onNavigate}
          >
            <span className="maxima-nav-item-title">{p.title}</span>
            <span className="maxima-nav-tag">{p.tag}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

function MegaAboutColumn({
  preview,
  onPreview,
  onNavigate,
}: {
  preview: string | null;
  onPreview: (src: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="relative flex w-auto flex-col items-start">
      <div className="maxima-nav-preview-stack">
        {MAXIMA_NAV_PAGES.map((p) => (
          <div
            key={p.label}
            className={cn(
              "maxima-nav-preview-frame maxima-nav-corners-medium",
              preview === p.image && "maxima-nav-preview-frame--active",
            )}
          >
            <Image
              src={p.image}
              alt=""
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
        ))}
      </div>
      {MAXIMA_NAV_PAGES.map((p) => (
        <div key={p.label}>
          <Link
            href={p.href}
            className="maxima-nav-mega-row maxima-nav-height-item flex items-center text-[var(--color-black)] hover:opacity-95"
            onMouseEnter={() => onPreview(p.image)}
            onClick={onNavigate}
          >
            <span className="maxima-nav-item-title">{p.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="maxima-nav-chevron-svg"
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      aria-hidden
    >
      <path
        d="M8.79004 1.37012C9.02592 1.71932 9.06578 2.15114 8.89648 2.53125C7.90737 4.75144 7.14347 5.87223 5.50879 7.41016C5.23506 7.66764 4.85548 7.80826 4.46289 7.79883C4.07044 7.78929 3.69986 7.63051 3.44141 7.36035C1.82241 5.66665 1.08387 4.55556 0.120117 2.56641C-0.0607564 2.19261 -0.0364995 1.76201 0.185547 1.40723C0.407743 1.05242 0.801836 0.815185 1.24609 0.768554C3.82668 0.498131 5.30274 0.594293 7.70215 0.764648C8.14957 0.796415 8.5541 1.02112 8.79004 1.37012Z"
        fill="var(--color-blue)"
      />
    </svg>
  );
}

function DonateButton() {
  return (
    <button
      type="button"
      aria-label="Donate"
      className="maxima-nav-btn maxima-nav-cta-primary pointer-events-auto relative z-10 flex items-center justify-center"
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        aria-hidden
      >
        <path
          d="M70,5 L70,5 C105.88,5 135,34.12 135,70 L135,70 C135,105.88 105.88,135 70,135 L70,135 C34.12,135 5,105.88 5,70 L5,70 C5,34.12 34.12,5 70,5 Z"
          className="maxima-nav-cta-circle"
        />
        <path
          d="M34.5,40.5 L105.5,40.5 C121.784,40.5 135,53.715999999999994 135,70 L135,70 C135,86.284 121.784,99.5 105.5,99.5 L34.5,99.5 C18.215999999999998,99.5 5,86.284 5,70 L5,70 C5,53.715999999999994 18.215999999999998,40.5 34.5,40.5 Z"
        />
      </svg>
      <span className="relative z-[1] block">Donate</span>
    </button>
  );
}

function MailIcon() {
  return (
    <svg
      className="maxima-nav-mail-svg"
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M0.399902 3.04002C0.399902 2.42471 0.64433 1.83461 1.07941 1.39953C1.5145 0.964444 2.1046 0.720016 2.7199 0.720016H21.2799C21.8952 0.720016 22.4853 0.964444 22.9204 1.39953C23.3555 1.83461 23.5999 2.42471 23.5999 3.04002V16.96C23.5999 17.5753 23.3555 18.1654 22.9204 18.6005C22.4853 19.0356 21.8952 19.28 21.2799 19.28H2.7199C2.1046 19.28 1.5145 19.0356 1.07941 18.6005C0.64433 18.1654 0.399902 17.5753 0.399902 16.96V3.04002ZM4.48194 3.04002L11.9999 9.61838L19.5179 3.04002H4.48194ZM21.2799 4.58166L12.7643 12.0335C12.5528 12.2188 12.2811 12.321 11.9999 12.321C11.7187 12.321 11.447 12.2188 11.2355 12.0335L2.7199 4.58166V16.96H21.2799V4.58166Z"
        fill="var(--color-blue)"
      />
    </svg>
  );
}
