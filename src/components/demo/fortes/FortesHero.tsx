"use client";

import Lottie from "lottie-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FORTES_MEDIA } from "./fortes-constants";
import "./fortes-hero-critical.css";
import { FortesSplitText } from "./FortesSplitText";

const INTRO_BOTTOM_DELAY_MS = 1000;
const WHEEL_IDLE_RESET_MS = 140;
const WHEEL_RELEASE_ACCUM_PX = 12;
const TOUCH_SWIPE_RELEASE_PX = 48;

function HeroLottie({ className }: { className?: string }) {
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
  if (!data) return <div className={className} aria-hidden />;
  return <Lottie animationData={data} loop className={className} />;
}

export type FortesHeroProps = {
  preloaderComplete: boolean;
  scrollLocked: boolean;
  scrollFree: boolean;
  heroTitle: string;
  heroSubtitle: string;
  onHeroReleaseComplete: () => void;
};

export function FortesHero({
  preloaderComplete,
  scrollLocked,
  scrollFree,
  heroTitle,
  heroSubtitle,
  onHeroReleaseComplete,
}: FortesHeroProps) {
  const hasReleasedRef = useRef(false);
  const releaseCycleRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (!preloaderComplete) return;
    if (hasReleasedRef.current) {
      setIntroReady(true);
      return;
    }
    const t = window.setTimeout(() => setIntroReady(true), INTRO_BOTTOM_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [preloaderComplete]);

  useEffect(() => {
    if (!scrollLocked) return;
    releaseCycleRef.current = false;
    if (hasReleasedRef.current) {
      setIntroReady(true);
    }
  }, [scrollLocked]);

  const innerBottomVisible = introReady;

  const startRelease = useCallback(() => {
    if (!scrollLocked || releaseCycleRef.current) return;
    releaseCycleRef.current = true;
    hasReleasedRef.current = true;
    onHeroReleaseComplete();
  }, [scrollLocked, onHeroReleaseComplete]);

  useEffect(() => {
    if (!scrollLocked) return;

    const clearWheelIdle = () => {
      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
        wheelIdleTimerRef.current = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;
      e.preventDefault();
      if (releaseCycleRef.current) return;

      wheelAccumRef.current += e.deltaY;
      clearWheelIdle();
      wheelIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
        wheelIdleTimerRef.current = null;
      }, WHEEL_IDLE_RESET_MS);

      if (wheelAccumRef.current >= WHEEL_RELEASE_ACCUM_PX) {
        wheelAccumRef.current = 0;
        clearWheelIdle();
        startRelease();
      }
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      if (touchY - endY > TOUCH_SWIPE_RELEASE_PX) {
        startRelease();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        startRelease();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      clearWheelIdle();
      wheelAccumRef.current = 0;
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [scrollLocked, startRelease]);

  return (
    <div className="fortes-hero-root">
      <div className="scroll__outer">
        <div className={`scroll${scrollFree ? " free" : ""}`}>
          <div className="scroll__static" aria-hidden />
          <div className="scroll__preview">
            <div className="scroll__container">
              <div className={`scroll__inner${innerBottomVisible ? " visible" : ""}`}>
                <div className="scroll__preview-wrap">
                  <span className="scroll__preview-title">our vision</span>
                  <span className="scroll__preview-text">we visualise</span>
                </div>
                <div className="scroll__preview-wrap">
                  <span className="scroll__preview-title">Your imagination</span>
                  <span className="scroll__preview-text">you imagine</span>
                </div>
              </div>

              <div className={`scroll__bottom${innerBottomVisible ? " visible" : ""}`}>
                <h1 className="scroll__bottom-title split-text">
                  <FortesSplitText text={heroTitle} />
                </h1>
                <p className="scroll__bottom-text split-text">
                  <FortesSplitText text={heroSubtitle} />
                </p>
                <div className="scroll__bottom-svg">
                  <HeroLottie />
                </div>
              </div>

              <div
                className="scroll__hint"
                role="button"
                tabIndex={0}
                onClick={startRelease}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    startRelease();
                  }
                }}
              >
                Scroll down
                <svg width="56" height="10" viewBox="0 0 56 10" fill="none" aria-hidden>
                  <path
                    d="M1 0.895508L27.9998 8.89551L55 0.895508"
                    stroke="white"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <video
              className="scroll__preview-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={FORTES_MEDIA.heroPoster}
              controlsList="nodownload nofullscreen noplaybackrate"
            >
              <source src={FORTES_MEDIA.heroVideo} type="video/mp4" />
            </video>
          </div>
          <div className="scroll__block scroll__block--third" aria-hidden />
        </div>
      </div>
    </div>
  );
}
