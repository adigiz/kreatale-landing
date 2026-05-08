"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import { MAXIMA_PROGRAM_SLIDES } from "./maxima-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MaximaProgramPin() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin || reduce) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        pin,
        pinSpacing: true,
        scrub: 0.42,
        onUpdate: (self) => {
          const n = MAXIMA_PROGRAM_SLIDES.length;
          const next = Math.min(n - 1, Math.floor(self.progress * n + 1e-6));
          setActive((a) => (a !== next ? next : a));
        },
      });
    }, track);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div id="program-services" className="relative z-30 w-full px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          {MAXIMA_PROGRAM_SLIDES.map((p) => (
            <div
              key={p.key}
              className="rounded-[1.75rem] px-8 py-10 text-center shadow-xl"
              style={{ backgroundColor: p.panelBg }}
            >
              <h2 className="text-2xl font-extrabold text-[var(--color-black)]">
                {p.title}
              </h2>
              <p className="mt-2 text-sm font-bold text-[var(--color-blue)]">
                {p.tag}
              </p>
              <p className="mt-3 text-base font-semibold leading-relaxed text-neutral-900">
                {p.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const slide = MAXIMA_PROGRAM_SLIDES[active] ?? MAXIMA_PROGRAM_SLIDES[0];

  return (
    <div
      id="program-services"
      ref={trackRef}
      className="relative z-30 w-full"
      style={{ height: "300vh" }}
    >
      <div
        ref={pinRef}
        className="flex min-h-[100svh] w-full items-center justify-center px-4 py-20"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative flex min-h-[20.9375rem] w-full max-w-xl flex-col items-center justify-center gap-4 rounded-[1.75rem] px-8 py-10 text-center shadow-2xl lg:max-w-[42rem] lg:min-h-[26.375rem] lg:rounded-[1.75rem] lg:px-12 lg:py-12"
          style={{ backgroundColor: slide.panelBg }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              initial={{ opacity: 0, y: 28, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16, rotateX: 6 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-md flex-col items-center gap-4"
            >
              <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-extrabold leading-tight text-[var(--color-black)]">
                {slide.title}
              </h2>
              <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[var(--color-yellow-pale)] backdrop-blur-sm">
                {slide.tag}
              </span>
              <p className="text-base font-semibold leading-relaxed text-neutral-900 lg:text-lg">
                {slide.blurb}
              </p>
              <button
                type="button"
                className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-black)] bg-transparent text-[var(--color-black)] transition-transform hover:scale-105"
                aria-label="Scroll down"
              >
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" aria-hidden>
                  <path
                    d="M8.79004 1.37012C9.02592 1.71932 9.06578 2.15114 8.89648 2.53125C7.90737 4.75144 7.14347 5.87223 5.50879 7.41016C5.23506 7.66764 4.85548 7.80826 4.46289 7.79883C4.07044 7.78929 3.69986 7.63051 3.44141 7.36035C1.82241 5.66665 1.08387 4.55556 0.120117 2.56641C-0.0607564 2.19261 -0.0364995 1.76201 0.185547 1.40723C0.407743 1.05242 0.801836 0.815185 1.24609 0.768554C3.82668 0.498131 5.30274 0.594293 7.70215 0.764648C8.14957 0.796415 8.5541 1.02112 8.79004 1.37012Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
