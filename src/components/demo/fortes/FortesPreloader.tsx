"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

import { FORTES_MEDIA, FORTES_PUBLIC } from "./fortes-constants";

import "./fortes-preloader.css";

const PROGRESS_MS = 2200;
const HOLD_AT_100_MS = 220;
const LOTTIE_EXIT_MS = 1600;
const PANEL_SLIDE_MS = 1200;

export function FortesPreloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [bgActive, setBgActive] = useState(false);
  const [panelExiting, setPanelExiting] = useState(false);
  const [lottieExit, setLottieExit] = useState(false);
  const exitStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const local = await fetch(FORTES_PUBLIC.preloaderLottie);
        if (local.ok) {
          const d = (await local.json()) as object;
          if (!cancelled) setLottieData(d);
          return;
        }
      } catch {
        /* try remote */
      }
      try {
        const remote = await fetch(FORTES_MEDIA.preloaderLottie);
        if (!remote.ok) return;
        const d = (await remote.json()) as object;
        if (!cancelled) setLottieData(d);
      } catch {
        /* keep null — static logo shows */
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setBgActive(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const timers: number[] = [];

    const finish = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      setPct(100);
      timers.push(
        window.setTimeout(() => {
          setLottieExit(true);
          timers.push(
            window.setTimeout(() => {
              setPanelExiting(true);
              timers.push(
                window.setTimeout(() => {
                  onDone();
                }, PANEL_SLIDE_MS + 80),
              );
            }, LOTTIE_EXIT_MS),
          );
        }, HOLD_AT_100_MS),
      );
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PROGRESS_MS);
      setPct(Math.min(100, Math.floor(t * 100)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onDone]);

  return (
    <div
      className={`fortes-preloader${panelExiting ? " fortes-preloader--exiting" : ""}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="fortes-preloader__wrap">
        <div className={`fortes-preloader__lottie${lottieExit ? " fortes-preloader__lottie--hidden" : ""}`}>
          <div className="fortes-preloader__lottie-inner">
            {lottieData ? (
              <Lottie animationData={lottieData} loop={false} className="h-full w-full" />
            ) : (
              <img
                src={FORTES_PUBLIC.logoSvg}
                alt="Fortes Vision"
                className="fortes-preloader__logo-fallback mx-auto"
                width={240}
                height={32}
                decoding="async"
                fetchPriority="high"
              />
            )}
          </div>
        </div>
        <div className="fortes-preloader__count" aria-label={`Loading ${pct} percent`}>
          <div className="fortes-preloader__count-number">{pct}</div>
          <p>%</p>
        </div>
        <div className={`fortes-preloader__bg${bgActive ? " fortes-preloader__bg--active" : ""}`}>
          <img src={FORTES_MEDIA.preloaderBg} alt="" decoding="async" fetchPriority="high" />
        </div>
      </div>
    </div>
  );
}
