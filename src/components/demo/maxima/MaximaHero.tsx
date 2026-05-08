"use client";

/**
 * Program hero carousel — motion model reverse-engineered from maximatherapy
 * `layout-wYxH71HP.js` (`p2`): 4-slide bottom-pivot wheel, GSAP `elastic.out(0.8, 0.7)`
 * step rotation, pointer tilt on `tiltRef`, swipe threshold ±2.5, arrow controls.
 *
 * Visuals: local WebP illu pair + Lottie JSON / layout from maximatherapy.com
 * (`scripts/download-maxima-hero-assets.py`, `maxima-hero-lottie-layers.ts`).
 *
 * Behaviour note (matches production / Codrops write-up): Lottie on the active
 * wedge should pause while the wheel is rotating — `ready` gates autoplay until
 * the GSAP elastic tween completes.
 * @see https://tympanus.net/codrops/2026/04/06/building-the-maxima-therapy-website-react-gsap-and-dabbling-with-ai/
 */
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MAXIMA_PROGRAM_SLIDES } from "./maxima-data";
import MaximaHeroCurtain from "./MaximaHeroCurtain";
import MaximaHeroSlideArt from "./MaximaHeroSlideArt";
import "./maxima-hero.css";

const PROGRAMS = MAXIMA_PROGRAM_SLIDES;
const N = PROGRAMS.length;
const DEG = 360 / N;

function HeroArrowIcon() {
  return (
    <svg
      width="28"
      height="17"
      viewBox="0 0 28 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16.2847 16.3363C16.9132 16.7609 17.6903 16.8325 18.3745 16.5277C22.3708 14.7473 24.3875 13.3715 27.1558 10.4291C27.6192 9.93635 27.8739 9.25392 27.8569 8.54724C27.8398 7.84051 27.5536 7.17266 27.0669 6.7074C24.0182 3.79316 22.0185 2.46561 18.438 0.730835C17.7651 0.405076 16.9908 0.448401 16.352 0.848022C15.7133 1.24788 15.2857 1.95656 15.2017 2.75623C14.7148 7.40168 14.8872 10.0591 15.1938 14.3783C15.251 15.1837 15.6564 15.9116 16.2847 16.3363Z"
        fill="currentColor"
      />
      <path
        d="M2.57157 6.42859C1.3881 6.42859 0.428711 7.38798 0.428711 8.57145C0.428711 9.75491 1.3881 10.7143 2.57157 10.7143H10.2859C11.4693 10.7143 12.4287 9.75491 12.4287 8.57145C12.4287 7.38798 11.4693 6.42859 10.2859 6.42859H2.57157Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function MaximaHero() {
  const reduce = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportW, setViewportW] = useState(1024);
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const slidesDragRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const scaleDecorRef = useRef<HTMLDivElement>(null);

  const pointerActive = useRef(false);
  const pointerStartX = useRef(0);
  const swipeAccum = useRef(0);

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const rotateWheelTo = useCallback(
    (index: number, instant: boolean) => {
      const el = wheelRef.current;
      if (!el) return;
      gsap.killTweensOf(el, "rotate");
      if (instant || reduce) {
        gsap.set(el, { rotate: `${-index * DEG}deg` });
        setReady(true);
        return;
      }
      gsap.to(el, {
        rotate: `${-index * DEG}deg`,
        duration: 2,
        ease: "elastic.out(0.8, 0.7)",
        onComplete: () => setReady(true),
      });
    },
    [reduce],
  );

  const resetTilt = useCallback(
    (instant: boolean) => {
      const el = tiltRef.current;
      if (!el) return;
      gsap.killTweensOf(el, "rotate");
      if (instant || reduce) {
        gsap.set(el, { rotate: 0 });
        return;
      }
      gsap.to(el, {
        rotate: 0,
        duration: 1.2,
        ease: "linear.none",
      });
    },
    [reduce],
  );

  const go = useCallback(
    (delta: number) => {
      let next = active + delta;
      if (next < 0) next = N - 1;
      if (next >= N) next = 0;
      setReady(false);
      resetTilt(false);
      setActive(next);
      rotateWheelTo(next, false);
    },
    [active, resetTilt, rotateWheelTo],
  );

  useLayoutEffect(() => {
    if (wheelRef.current) gsap.set(wheelRef.current, { rotate: 0 });
    setReady(true);
  }, []);

  useLayoutEffect(
    () => () => {
      gsap.killTweensOf([
        wheelRef.current,
        tiltRef.current,
        scaleDecorRef.current,
      ].filter(Boolean));
    },
    [],
  );

  /** Intro: scale bottom decoration (curtain-complete analogue). */
  useLayoutEffect(() => {
    const el = scaleDecorRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (reduce) {
      gsap.set(el, { scale: 1, opacity: 0.35 });
      return;
    }
    gsap.set(el, { scale: 0, opacity: 0 });
    gsap.to(el, {
      scale: 1,
      opacity: 0.35,
      ease: "elastic.out(1.2, 0.8)",
      duration: 1.2,
      delay: 0.6,
    });
  }, [reduce]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerActive.current = true;
      setIsDragging(true);
      pointerStartX.current = e.clientX;
      swipeAccum.current = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
      if (tiltRef.current) gsap.killTweensOf(tiltRef.current, "rotate");
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerActive.current || isTouch) return;
      const w = Math.max(320, viewportW);
      const t = gsap.utils.clamp(-1, 1, (2 * (e.clientX - pointerStartX.current)) / w);
      const deg = gsap.utils.mapRange(-1, 1, -5, 5, t);
      swipeAccum.current = deg;
      if (tiltRef.current) {
        gsap.to(tiltRef.current, { rotate: deg, duration: 0.08, overwrite: true });
      }
    },
    [isTouch, viewportW],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerActive.current) return;
      pointerActive.current = false;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (Math.abs(swipeAccum.current) > 2.5) {
        const dir = swipeAccum.current < 0 ? 1 : -1;
        go(dir);
      } else if (tiltRef.current) {
        gsap.to(tiltRef.current, {
          rotate: 0,
          ease: "elastic.out(1.1, 0.9)",
          duration: 1.2,
        });
      }
      swipeAccum.current = 0;
    },
    [go],
  );

  const onArrowHover = useCallback(
    (dir: number) => {
      if (isTouch || !tiltRef.current) return;
      gsap.killTweensOf(tiltRef.current, "rotate");
      gsap.to(tiltRef.current, {
        rotate: -dir * 5,
        ease: dir === 0 ? "elastic.out(1.1, 0.9)" : "expo.out",
        duration: dir === 0 ? 1.2 : 1.4,
      });
    },
    [isTouch],
  );

  const slide = PROGRAMS[active] ?? PROGRAMS[0];

  const onIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  const showIntroCurtain = !reduce && !introDone;

  return (
    <section
      className="maxima-hero-carousel absolute left-0 top-0 z-10 h-[110svh] w-full overflow-hidden transition-[background-color] duration-1000 ease-in-out"
      style={{ backgroundColor: slide.heroBackdrop }}
      aria-label="Program carousel"
    >
      {showIntroCurtain ? <MaximaHeroCurtain onComplete={onIntroComplete} /> : null}
      <div
        ref={slidesDragRef}
        className={cn(
          /* SSR markup: aspect box `absolute left-[50%] origin-center` + translate-x-[-50%] only (no translate-y). */
          "maxima-hero-drag absolute left-1/2 aspect-[3341/3352] h-[calc(3352/982*70svh)] origin-center -translate-x-1/2 lg:h-[calc(3352/982*100svh)]",
          isDragging
            ? "max-xl:maxima-hero-cursor-grabbing xl:cursor-grabbing"
            : "max-xl:maxima-hero-cursor-grab xl:cursor-grab",
        )}
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={tiltRef} className="relative h-full w-full">
          <div ref={wheelRef} className="relative h-full w-full">
            {PROGRAMS.map((p, w) => (
              <div
                key={p.slug}
                className={cn(
                  "absolute left-0 top-0 h-[50%] w-full",
                  active === w ? "z-10" : "z-0",
                )}
                style={{
                  transform: `rotate(${w * DEG}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div className="relative h-full w-full will-change-transform">
                  <MaximaHeroSlideArt slug={p.slug} playing={active === w && ready} priority={w === 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-[calc(10svh+6rem)] left-0 w-[12.5rem] md:w-[25.1875rem]"
        aria-hidden
      >
        <div
          ref={scaleDecorRef}
          className="relative h-14 w-14 origin-bottom rounded-full bg-white/15"
        />
      </div>

      <div
        className="maxima-hero-program-pill pointer-events-none absolute bottom-[max(1.25rem,6svh)] left-1/2 z-20 w-[min(92vw,26.5rem)] -translate-x-1/2 lg:bottom-[max(1.75rem,7svh)] lg:w-[min(92vw,31rem)]"
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.key}
            role="presentation"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex flex-col items-center gap-3 rounded-[2rem] bg-[var(--color-orange)] px-8 py-5 text-center shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] lg:gap-3.5 lg:rounded-[2.25rem] lg:px-12 lg:py-6"
          >
            <p className="text-pretty font-extrabold uppercase leading-[1.05] tracking-[0.04em] text-white [font-size:clamp(1.35rem,3.8vw,1.85rem)]">
              {slide.title}
            </p>
            <span className="rounded-full bg-white px-5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[var(--color-black)] lg:text-sm">
              {slide.tag}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="maxima-hero-carousel-controls">
        <button
          type="button"
          className="maxima-hero-arrow maxima-hero-arrow--prev"
          aria-label="Previous program"
          onClick={() => go(-1)}
          onMouseEnter={() => onArrowHover(-1)}
          onMouseLeave={() => onArrowHover(0)}
        >
          <HeroArrowIcon />
        </button>
        <button
          type="button"
          className="maxima-hero-arrow maxima-hero-arrow--next"
          aria-label="Next program"
          onClick={() => go(1)}
          onMouseEnter={() => onArrowHover(1)}
          onMouseLeave={() => onArrowHover(0)}
        >
          <HeroArrowIcon />
        </button>
      </div>

      <span className="sr-only">
        {ready
          ? `Showing ${PROGRAMS[active]?.title ?? ""}`
          : "Animating carousel"}
      </span>
    </section>
  );
}
