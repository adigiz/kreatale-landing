"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import { PIPELINE_IMAGES, PIPELINE_INTRO, PIPELINE_STEPS } from "./fortes-data";
import { FortesSplitText } from "./FortesSplitText";

import "./fortes-pipeline-parity.css";

const PIPELINE_TITLE_SPLIT = "Your 3D rendering | project pipeline";

const DESKTOP_MIN = 1001;
const PIN_HEADER_OFFSET = 96;
const ENTRY_SNAP_DURATION_S = 1.05;
const DIAL_SCROLL_DURATION_S = 0.85;
const STAGE1_LEAVE_DURATION_S = 0.58;
const ENTRY_SNAP_COOLDOWN_MS = 1100;
const WHEEL_THRESHOLD = 12;
const WHEEL_COOLDOWN_MS = 520;

export type FortesPipelineProps = {
  requestScrollTo?: (
    y: number,
    opts?: { immediate?: boolean; duration?: number },
  ) => void;
  getViewportScrollY?: () => number;
  subscribeLenisScroll?: (cb: () => void) => () => void;
};

function formatPipelineStep(raw: string) {
  return raw.split(" | ").join("\n");
}

function slideClassNames(
  i: number,
  activeIndex: number,
  previousSlide: number,
  total: number,
): string {
  const parts = ["rendering-project__image"];
  if (i === activeIndex) parts.push("active");

  let prevIndex = activeIndex - 1;
  if (activeIndex !== 0) {
    prevIndex = prevIndex >= 0 ? prevIndex : total - 1;
  }
  const isPrev =
    i === prevIndex || (previousSlide > activeIndex && i === previousSlide);
  if (isPrev) parts.push("prev");

  return parts.join(" ");
}

function readScrollY(getViewportScrollY?: () => number) {
  return getViewportScrollY?.() ?? window.scrollY;
}

function stageIndexFromScrollD(d: number, scrollSpan: number, total: number) {
  if (scrollSpan <= 0 || total <= 1) return 0;
  const chunk = scrollSpan / total;
  return Math.min(total - 1, Math.max(0, Math.floor(d / chunk)));
}

/** True when the pinned panel (not the tall track) fills most of the viewport. */
function isPipelineViewportLocked(section: HTMLElement, vh: number) {
  const sr = section.getBoundingClientRect();
  return (
    sr.top <= vh * 0.26 &&
    sr.bottom >= vh * 0.74 &&
    sr.height > vh * 0.48
  );
}

const ANCHOR_CLAMP_EPS_PX = 6;

/** Stage 0: only clamp downward so wheel-up can leave the section; later stages clamp both ways. */
function scrollNeedsAnchorClamp(
  sy: number,
  anchorY: number,
  stageIdx: number,
): boolean {
  if (stageIdx === 0) return sy > anchorY + ANCHOR_CLAMP_EPS_PX;
  return (
    sy > anchorY + ANCHOR_CLAMP_EPS_PX || sy < anchorY - ANCHOR_CLAMP_EPS_PX
  );
}

export function FortesPipeline({
  requestScrollTo,
  getViewportScrollY,
  subscribeLenisScroll,
}: FortesPipelineProps) {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const navHostRef = useRef<HTMLDivElement | null>(null);
  const pipeSwiperRef = useRef<SwiperType | null>(null);
  const priorIndexRef = useRef(-1);
  const activeIndexRef = useRef(0);
  const lastEntrySnapAtRef = useRef(0);
  const wasInScrubRef = useRef(false);
  const wheelCooldownRef = useRef(false);
  const suppressClampUntilRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [navDialInactive, setNavDialInactive] = useState(true);
  const [wide, setWide] = useState(false);
  const [, bumpPipelineVisual] = useReducer((n: number) => n + 1, 0);

  const total = PIPELINE_IMAGES.length;

  const setSlide = useCallback(
    (index: number, opts?: { force?: boolean }) => {
      const next = Math.max(0, Math.min(index, total - 1));
      if (opts?.force) {
        if (next === activeIndexRef.current) {
          priorIndexRef.current = -1;
          activeIndexRef.current = next;
          setActiveIndex(next);
          bumpPipelineVisual();
          return;
        }
        priorIndexRef.current = activeIndexRef.current;
        activeIndexRef.current = next;
        setActiveIndex(next);
        return;
      }
      if (next === activeIndexRef.current) return;
      priorIndexRef.current = activeIndexRef.current;
      activeIndexRef.current = next;
      setActiveIndex(next);
    },
    [bumpPipelineVisual, total],
  );

  const scrollDocumentToStage = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(index, total - 1));
      if (!window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`).matches) {
        setSlide(next);
        return;
      }
      const track = scrollTrackRef.current;
      if (!track || !requestScrollTo) {
        setSlide(next);
        return;
      }
      setSlide(next);
      const sy = readScrollY(getViewportScrollY);
      const trackTopDoc = sy + track.getBoundingClientRect().top;
      const scrollSpan = Math.max(1, track.offsetHeight - window.innerHeight);
      const chunk = scrollSpan / total;
      const y = trackTopDoc + next * chunk;
      suppressClampUntilRef.current = Date.now() + (DIAL_SCROLL_DURATION_S + 0.2) * 1000;
      requestScrollTo(y, { duration: DIAL_SCROLL_DURATION_S });
    },
    [getViewportScrollY, requestScrollTo, setSlide, total],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    pipeSwiperRef.current?.slideTo(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

    const readTrackGeometry = () => {
      const track = scrollTrackRef.current;
      if (!track) return null;
      const vh = window.innerHeight;
      const scrollSpan = Math.max(1, track.offsetHeight - vh);
      if (scrollSpan < 48) return null;
      const sy = readScrollY(getViewportScrollY);
      const tr = track.getBoundingClientRect();
      const trackTopDoc = sy + tr.top;
      const d = Math.min(Math.max(0, sy - trackTopDoc), scrollSpan);
      const chunk = scrollSpan / total;
      return { track, vh, scrollSpan, sy, tr, trackTopDoc, d, chunk };
    };

    const onScroll = () => {
      if (!mq.matches || !requestScrollTo) return;
      const section = sectionRef.current;
      if (!section) return;
      const g = readTrackGeometry();
      if (!g) return;

      const { vh, scrollSpan, sy, trackTopDoc, d, chunk } = g;
      const sr = section.getBoundingClientRect();
      const locked = isPipelineViewportLocked(section, vh);
      const inScrollRange =
        sy >= trackTopDoc - 48 && sy <= trackTopDoc + scrollSpan + Math.min(120, vh * 0.15);
      const inScrubZone = locked && inScrollRange;

      if ((locked && inScrollRange) || (sr.top < 420 && sr.bottom > vh * 0.22)) {
        setNavDialInactive((inactive) => (inactive ? false : inactive));
      }

      if (inScrubZone && !wasInScrubRef.current) {
        wasInScrubRef.current = true;
        const atScrubStart = d < Math.max(chunk * 0.65, scrollSpan * 0.11);
        if (atScrubStart) {
          setSlide(0, { force: true });
        } else {
          const fromD = stageIndexFromScrollD(d, scrollSpan, total);
          if (fromD !== activeIndexRef.current) setSlide(fromD);
        }
      }
      if (!inScrubZone) {
        wasInScrubRef.current = false;
      }

      const idx = activeIndexRef.current;
      const anchorY = trackTopDoc + idx * chunk;
      const nearScrubStart = d < scrollSpan * 0.12;
      const misaligned = sr.top > PIN_HEADER_OFFSET + 10;
      const inApproachBand = sr.top < 300 && sr.bottom > vh * 0.28;
      const now = Date.now();
      const cooldownOk = now - lastEntrySnapAtRef.current > ENTRY_SNAP_COOLDOWN_MS;

      if (
        nearScrubStart &&
        idx === 0 &&
        misaligned &&
        inApproachBand &&
        cooldownOk
      ) {
        const targetY = trackTopDoc - PIN_HEADER_OFFSET;
        lastEntrySnapAtRef.current = now;
        suppressClampUntilRef.current = now + (ENTRY_SNAP_DURATION_S + 0.25) * 1000;
        requestScrollTo(targetY, { duration: ENTRY_SNAP_DURATION_S });
      }

      if (sy < trackTopDoc - vh * 1.2) {
        lastEntrySnapAtRef.current = 0;
      }

      if (
        inScrubZone &&
        idx < total - 1 &&
        Date.now() >= suppressClampUntilRef.current &&
        scrollNeedsAnchorClamp(sy, anchorY, idx)
      ) {
        requestScrollTo(anchorY, { immediate: true });
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!mq.matches || !requestScrollTo) return;
      const section = sectionRef.current;
      if (!section) return;
      const g = readTrackGeometry();
      if (!g) return;
      const { vh, scrollSpan, sy, trackTopDoc, chunk } = g;

      if (!isPipelineViewportLocked(section, vh)) return;
      if (sy < trackTopDoc - 80 || sy > trackTopDoc + scrollSpan + vh * 0.5) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < WHEEL_THRESHOLD) return;

      const idx = activeIndexRef.current;

      if (idx === 0 && dy < 0) {
        e.preventDefault();
        e.stopPropagation();
        if (wheelCooldownRef.current) return;
        wheelCooldownRef.current = true;
        window.setTimeout(() => {
          wheelCooldownRef.current = false;
        }, WHEEL_COOLDOWN_MS);
        const leaveA = sy - vh * 0.58;
        const leaveB = trackTopDoc - PIN_HEADER_OFFSET - 40;
        const leaveY = Math.max(0, Math.min(leaveA, leaveB));
        suppressClampUntilRef.current = Date.now() + (STAGE1_LEAVE_DURATION_S + 0.2) * 1000;
        requestScrollTo(leaveY, { duration: STAGE1_LEAVE_DURATION_S });
        return;
      }

      if (idx >= total - 1 && dy > 0) return;

      if (wheelCooldownRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (dy > 0 && idx < total - 1) {
        e.preventDefault();
        e.stopPropagation();
        wheelCooldownRef.current = true;
        window.setTimeout(() => {
          wheelCooldownRef.current = false;
        }, WHEEL_COOLDOWN_MS);
        const next = idx + 1;
        setSlide(next);
        const anchor = trackTopDoc + next * chunk;
        requestScrollTo(anchor, { immediate: true });
        return;
      }

      if (dy < 0 && idx > 0) {
        e.preventDefault();
        e.stopPropagation();
        wheelCooldownRef.current = true;
        window.setTimeout(() => {
          wheelCooldownRef.current = false;
        }, WHEEL_COOLDOWN_MS);
        const next = idx - 1;
        setSlide(next);
        const anchor = trackTopDoc + next * chunk;
        requestScrollTo(anchor, { immediate: true });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);

    let offLenis = () => {};
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      offLenis = subscribeLenisScroll?.(onScroll) ?? (() => {});
    });

    onScroll();

    return () => {
      cancelled = true;
      offLenis();
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, [getViewportScrollY, requestScrollTo, setSlide, subscribeLenisScroll, total]);

  useEffect(() => {
    const host = navHostRef.current;
    if (!host || !wide) return;

    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/fortes/pipeline-nav-desktop.svg");
        const svgText = await res.text();
        if (cancelled || !navHostRef.current) return;
        navHostRef.current.innerHTML = svgText;
        const svg = navHostRef.current.querySelector("svg");
        if (svg) {
          svg.classList.remove("svg__render", "inactive", "svg__render-desctope");
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "auto");
          svg.style.display = "block";
          svg.style.maxWidth = "299px";
        }
        navHostRef.current.querySelectorAll(".rendering-project__nav-item").forEach((node, i) => {
          node.addEventListener("click", () => scrollDocumentToStage(i));
        });
      } catch {}
    };
    void run();
    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [wide, scrollDocumentToStage]);

  useEffect(() => {
    const host = navHostRef.current;
    if (!host || !wide) return;
    host.querySelectorAll(".rendering-project__nav-item").forEach((node, i) => {
      node.classList.toggle("active", i === activeIndex);
    });
  }, [activeIndex, wide]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setNavDialInactive(false);
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={scrollTrackRef}
      id="pipeline"
      className="rendering-project-scroll-track"
      style={
        {
          ["--fortes-pipeline-scroll-steps" as string]: total,
        } as CSSProperties
      }
    >
      <section
        ref={sectionRef}
        className="rendering-project rendering-project--pin"
        aria-labelledby="fortes-pipeline-title"
      >
        <div className="rendering-project__container">
          <div className="rendering-project__wrapper">
            <div className="rendering-project__left">
              <h2
                id="fortes-pipeline-title"
                className="rendering-project__title split-anim-title"
                data-aos="text-anim"
              >
                <FortesSplitText text={PIPELINE_TITLE_SPLIT} />
              </h2>
              <div className="rendering-project__text split-anim-title" data-aos="text-anim" data-aos-delay="60">
                <FortesSplitText text={PIPELINE_INTRO.subtitle} />
              </div>
              <div className="rendering-project__slide-texts" aria-live="polite">
                {PIPELINE_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`rendering-project__slide-text${i === activeIndex ? " active" : ""}`}
                  >
                    {formatPipelineStep(step)}
                  </div>
                ))}
              </div>
              <div
                ref={navHostRef}
                className={`rendering-project__nav-inject${navDialInactive ? " inactive" : ""} step-${activeIndex + 1}`}
                aria-label="Pipeline stages"
              />
            </div>

            <div className="rendering-project__center">
              <div className="rendering-project__images" data-aos="rendering-scale" data-aos-delay="200">
                {PIPELINE_IMAGES.map((src, i) => (
                  <div
                    key={src}
                    className={slideClassNames(i, activeIndex, priorIndexRef.current, total)}
                    aria-hidden={i !== activeIndex}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="50vw" unoptimized />
                  </div>
                ))}
              </div>
            </div>

            <div className="rendering-project__swiper">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                onSlideChange={(s) => setSlide(s.activeIndex)}
                onSwiper={(s) => {
                  pipeSwiperRef.current = s;
                }}
              >
                {PIPELINE_IMAGES.map((src, i) => (
                  <SwiperSlide key={src}>
                    <button
                      type="button"
                      className="rendering-project__slide-image"
                      onClick={() => setSlide(i)}
                    >
                      <Image
                        src={src}
                        alt={`Pipeline stage ${i + 1}`}
                        width={620}
                        height={820}
                        className="h-[410px] w-full object-cover"
                        unoptimized
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
