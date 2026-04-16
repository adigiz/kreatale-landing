"use client";

import Lottie from "lottie-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { FORTES_MEDIA } from "./fortes-constants";
import {
  GALLERY_ROWS,
  VISUALIZE_ARCHITECTURE_LEAD,
  VISUALIZE_ARCHITECTURE_TITLE,
} from "./fortes-data";
import { FortesSplitText } from "./FortesSplitText";
import "./fortes-visualize-parity.css";

const STACKED_MAX = 1023;
const MOBILE_EXPAND_MAX = 768;

function isStackedLayout() {
  return typeof window !== "undefined" && window.innerWidth <= STACKED_MAX;
}

function isMobileTouch() {
  return typeof window !== "undefined" && window.innerWidth <= MOBILE_EXPAND_MAX;
}

function parseDesignWeight(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function rowGapPx(row: HTMLElement): number {
  const g = getComputedStyle(row).gap;
  if (!g || g === "normal") return 20;
  const px = /^([\d.]+)px/.exec(g);
  if (px?.[1]) return Number.parseFloat(px[1]);
  const n = Number.parseFloat(g);
  return Number.isFinite(n) ? n : 20;
}

function HeadingLottie({
  className,
  play,
  onPlayedOnce,
}: {
  className?: string;
  play: boolean;
  onPlayedOnce: () => void;
}) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(FORTES_MEDIA.preloaderLottie)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data || !play) return <div className={className} aria-hidden />;

  return (
    <Lottie
      animationData={data}
      loop={false}
      className={className}
      onComplete={onPlayedOnce}
    />
  );
}

export function FortesVisualizeArchitecture() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [lottiePlay, setLottiePlay] = useState(false);
  const [lottieHidden, setLottieHidden] = useState(false);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    if (typeof window === "undefined" || window.innerWidth <= MOBILE_EXPAND_MAX) return;

    const obs = new MutationObserver(() => {
      if (title.classList.contains("aos-animate")) {
        setLottiePlay(true);
        obs.disconnect();
      }
    });
    obs.observe(title, { attributes: true, attributeFilter: ["class"] });
    if (title.classList.contains("aos-animate")) {
      setLottiePlay(true);
      obs.disconnect();
    }
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rowCleanups: Array<() => void> = [];
    const effectCleanups: Array<() => void> = [];

    const setupRows = () => {
      rowCleanups.forEach((fn) => fn());
      rowCleanups.length = 0;

      const pointerNone = section.querySelector(".visualize-architecture__image-wrapper.pointer_events");
      const rows = Array.from(section.querySelectorAll<HTMLElement>(".visualize-architecture__image-row"));

      rows.forEach((row) => {
        const wrappers = Array.from(row.querySelectorAll<HTMLElement>(".visualize-architecture__image-wrapper"));
        if (wrappers.length <= 1) return;

        const maxHeightPx = window.innerHeight * 0.8;
        const originalSizes = new Map<HTMLElement, { width: number; height: number }>();

        const measure = () => {
          originalSizes.clear();
          const weights = wrappers.map((w) => parseDesignWeight(w.dataset.wrapperWidth));
          const allWeights = weights.length > 0 && weights.every((x) => x != null);
          let weightSum = 0;
          for (const b of weights) weightSum += b ?? 0;

          const gapPx = rowGapPx(row);
          const rowOuterW = row.getBoundingClientRect().width;
          const nWrap = wrappers.length;
          const innerW = Math.max(0, rowOuterW - gapPx * Math.max(0, nWrap - 1));

          wrappers.forEach((w, i) => {
            if (!isStackedLayout()) {
              w.style.height = "";
              w.style.transition = "width 0.8s ease, height 0.8s ease";
              w.style.removeProperty("flex");
              w.style.removeProperty("minWidth");
              if (allWeights && weightSum > 0) {
                const wt = weights[i]!;
                const px = (innerW * wt) / weightSum;
                w.style.width = `${px}px`;
              } else {
                const bw = w.dataset.wrapperWidth;
                if (bw) w.style.width = bw;
                else w.style.removeProperty("width");
              }
            } else {
              w.style.width = "";
              w.style.height = "";
              w.style.transition = "";
              w.style.removeProperty("flex");
              w.style.removeProperty("minWidth");
            }
            void w.offsetHeight;
            const rect = w.getBoundingClientRect();
            originalSizes.set(w, { width: rect.width, height: rect.height });
          });
        };

        measure();

        const isVerticalImage = (wrapper: HTMLElement): boolean => {
          const img = wrapper.querySelector("img");
          if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return false;
          return img.naturalHeight / img.naturalWidth > 1.2;
        };

        const getSizesForWrapper = (activeWrapper: HTMLElement): { width: number; height: number }[] => {
          const rowOuter = row.getBoundingClientRect().width;
          const gap = rowGapPx(row);
          const rowInner = Math.max(0, rowOuter - gap * Math.max(0, wrappers.length - 1));
          const isVertical = isVerticalImage(activeWrapper);
          const activeWidthPercent = isVertical ? 60 : 80;
          let activeWidthPx = (rowInner * activeWidthPercent) / 100;
          const img = activeWrapper.querySelector("img");
          if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) {
            return wrappers.map((w) => ({ ...originalSizes.get(w)! }));
          }
          const imgRatio = img.naturalWidth / img.naturalHeight;
          let activeHeight = activeWidthPx / imgRatio;
          const origSize = originalSizes.get(activeWrapper);
          if (!origSize) return wrappers.map((w) => ({ ...originalSizes.get(w)! }));
          const maxAllowedHeight = origSize.height * 1.6;
          activeHeight = Math.min(activeHeight, maxAllowedHeight, maxHeightPx);
          activeWidthPx = activeHeight * imgRatio;
          const inactiveWrappers = wrappers.filter((w) => w !== activeWrapper);
          const inactiveWidth = inactiveWrappers.length
            ? (rowInner - activeWidthPx) / inactiveWrappers.length
            : 0;
          return wrappers.map((w) =>
            w === activeWrapper
              ? { width: activeWidthPx, height: activeHeight }
              : { width: inactiveWidth, height: activeHeight },
          );
        };

        const onEnter = (wrapper: HTMLElement) => {
          if (isStackedLayout() || pointerNone) return;
          if (wrapper.classList.contains("count-1")) return;
          const sizes = getSizesForWrapper(wrapper);
          wrappers.forEach((w, i) => {
            const s = sizes[i];
            if (!s) return;
            w.style.removeProperty("flex");
            w.style.removeProperty("minWidth");
            w.style.width = `${s.width}px`;
            w.style.height = `${s.height}px`;
          });
        };

        const onLeaveRowDesktop = () => {
          if (isStackedLayout() || pointerNone) return;
          measure();
        };

        const onRowMouseOut = (e: MouseEvent) => {
          if (isStackedLayout() || pointerNone) return;
          const rel = e.relatedTarget;
          if (rel instanceof Node && row.contains(rel)) return;
          onLeaveRowDesktop();
        };

        wrappers.forEach((wrapper) => {
          if (wrapper.classList.contains("count-1")) return;
          const fn = () => onEnter(wrapper);
          wrapper.addEventListener("mouseenter", fn);
          rowCleanups.push(() => wrapper.removeEventListener("mouseenter", fn));
        });

        row.addEventListener("mouseout", onRowMouseOut);
        rowCleanups.push(() => row.removeEventListener("mouseout", onRowMouseOut));

        const animateHeightToAuto = (w: HTMLElement) => {
          w.style.height = "auto";
        };

        const expand = (e: Event, wrapper: HTMLElement) => {
          if (!isMobileTouch() || pointerNone) return;
          e.preventDefault();
          e.stopPropagation();
          wrappers.forEach((w) => {
            if (w === wrapper) w.style.height = `${maxHeightPx}px`;
            else animateHeightToAuto(w);
          });
        };

        const onWrapperLeaveMobile = () => {
          if (!isMobileTouch() || pointerNone) return;
          wrappers.forEach(animateHeightToAuto);
        };

        wrappers.forEach((wrapper) => {
          const onClick = (ev: Event) => expand(ev, wrapper);
          wrapper.addEventListener("click", onClick, { passive: false });
          wrapper.addEventListener("touchstart", onClick, { passive: false });
          rowCleanups.push(() => {
            wrapper.removeEventListener("click", onClick);
            wrapper.removeEventListener("touchstart", onClick);
          });
          wrapper.addEventListener("mouseleave", onWrapperLeaveMobile);
          rowCleanups.push(() => wrapper.removeEventListener("mouseleave", onWrapperLeaveMobile));
        });
      });
    };

    setupRows();

    const onResize = () => {
      setupRows();
    };
    window.addEventListener("resize", onResize);
    effectCleanups.push(() => window.removeEventListener("resize", onResize));

    const imgs = Array.from(section.querySelectorAll<HTMLImageElement>(".visualize-architecture__image"));
    const onImg = () => {
      setupRows();
    };
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onImg, { once: true });
        effectCleanups.push(() => img.removeEventListener("load", onImg));
      }
    });

    return () => {
      rowCleanups.forEach((fn) => fn());
      effectCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="visualize-architecture"
      aria-labelledby="fortes-visualize-heading"
    >
      <div className="visualize-architecture__container container-1320">
        <div className="visualize-architecture__heading">
          <h2
            ref={titleRef}
            id="fortes-visualize-heading"
            className="visualize-architecture__title split-anim-title"
            data-aos="text-anim"
          >
            <FortesSplitText text={VISUALIZE_ARCHITECTURE_TITLE} />
          </h2>
          <div className="visualize-architecture__text split-anim-title" data-aos="text-anim">
            <FortesSplitText text={VISUALIZE_ARCHITECTURE_LEAD} />
          </div>
          <div
            className={`visualize-architecture__lottie${lottieHidden ? " hidden" : ""}`}
            data-aos="text-anim"
            data-aos-delay="80"
          >
            <HeadingLottie
              className="h-full w-full"
              play={lottiePlay}
              onPlayedOnce={() => setLottieHidden(true)}
            />
          </div>
        </div>

        {GALLERY_ROWS.map((row, ri) => (
          <div
            key={ri}
            className={`visualize-architecture__image-row row_${ri + 1}_images count-${row.cells.length}`}
          >
            {row.cells.map((cell, ci) => (
              <div
                key={ci}
                className={`visualize-architecture__image-wrapper count-${row.cells.length} visualize-architecture__image-wrapper--sized`}
                data-wrapper-width={cell.wrapperWidth}
                data-aos="gallery-show"
                data-aos-delay={150}
              >
                <img
                  src={cell.image}
                  alt={cell.alt}
                  className="visualize-architecture__image"
                  loading="lazy"
                />
                {"award" in cell && cell.award ? (
                  <img
                    src={cell.award.src}
                    alt={cell.award.alt}
                    className="visualize-architecture__image-award"
                    loading="lazy"
                  />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
