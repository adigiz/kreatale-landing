"use client";

import type { LucideIcon } from "lucide-react";
import {
  ZodiacAquarius,
  ZodiacAries,
  ZodiacCancer,
  ZodiacCapricorn,
  ZodiacGemini,
  ZodiacLeo,
  ZodiacLibra,
  ZodiacPisces,
  ZodiacSagittarius,
  ZodiacScorpio,
  ZodiacTaurus,
  ZodiacVirgo,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ZODIAC_BURST_DURATION_MS } from "./zodiac-burst-timings";

const SIGN_HALF_PX = 32;
const ICON_SIZE_PX = 44;
const RADIUS_INSET_PX = 56;
const LABEL_INWARD_PX = 50;

const VB = 100;
const VB_CX = VB / 2;
const VB_CY = VB / 2;
const SECTOR_INNER_R = 18;
const SECTOR_OUTER_R = 49.5;
const LINE_INNER_R = SECTOR_INNER_R;
const LINE_OUTER_R = 49.8;

const DEG_PER_MS_DEFAULT = 360 / 90_000;
const BURST_OMEGA_PEAK = 360 / 68;

function burstEaseIn(u: number): number {
  const c = Math.min(1, Math.max(0, u));
  return c * c * c;
}

function polarToXY(zodiacDeg: number, r: number): [number, number] {
  const rad = ((zodiacDeg - 90) * Math.PI) / 180;
  return [VB_CX + r * Math.cos(rad), VB_CY + r * Math.sin(rad)];
}

function annularSectorPath(
  innerR: number,
  outerR: number,
  startZodiacDeg: number,
  endZodiacDeg: number,
): string {
  const [x1, y1] = polarToXY(startZodiacDeg, outerR);
  const [x2, y2] = polarToXY(endZodiacDeg, outerR);
  const [x3, y3] = polarToXY(endZodiacDeg, innerR);
  const [x4, y4] = polarToXY(startZodiacDeg, innerR);
  const sweep = endZodiacDeg - startZodiacDeg;
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

const SEPARATOR_ANGLES = [
  15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345,
] as const;

const SIGNS: readonly {
  angle: number;
  Icon: LucideIcon;
  label: string;
}[] = [
  { angle: 0, Icon: ZodiacAries, label: "Aries" },
  { angle: 30, Icon: ZodiacTaurus, label: "Taurus" },
  { angle: 60, Icon: ZodiacGemini, label: "Gemini" },
  { angle: 90, Icon: ZodiacCancer, label: "Cancer" },
  { angle: 120, Icon: ZodiacLeo, label: "Leo" },
  { angle: 150, Icon: ZodiacVirgo, label: "Virgo" },
  { angle: 180, Icon: ZodiacLibra, label: "Libra" },
  { angle: 210, Icon: ZodiacScorpio, label: "Scorpio" },
  { angle: 240, Icon: ZodiacSagittarius, label: "Sagittarius" },
  { angle: 270, Icon: ZodiacCapricorn, label: "Capricorn" },
  { angle: 300, Icon: ZodiacAquarius, label: "Aquarius" },
  { angle: 330, Icon: ZodiacPisces, label: "Pisces" },
];

function sectorLeave(
  angle: number,
  setHovered: (v: number | null) => void,
  e: React.MouseEvent,
) {
  const related = e.relatedTarget;
  if (
    related instanceof Element &&
    related.closest(`[data-zodiac-sector="${angle}"]`)
  ) {
    return;
  }
  setHovered(null);
}

type ZodiacScrollWheelProps = {
  birthSignAngle?: number | null;
  burstSpin?: boolean;
};

export function ZodiacScrollWheel({
  birthSignAngle = null,
  burstSpin = false,
}: ZodiacScrollWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const burstSpinRef = useRef(burstSpin);
  const burstStartedAtRef = useRef<number | null>(null);
  const prevBurstRef = useRef(false);
  const lineGradId = useId().replace(/:/g, "");
  const [hoveredAngle, setHoveredAngle] = useState<number | null>(null);

  useEffect(() => {
    burstSpinRef.current = burstSpin;
  }, [burstSpin]);

  const layoutSigns = useCallback(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const half = wheel.offsetWidth / 2;
    const iconRadius = Math.max(0, half - RADIUS_INSET_PX);
    const labelRadius = Math.max(
      0,
      half - RADIUS_INSET_PX - LABEL_INWARD_PX,
    );

    const signs = wheel.querySelectorAll<HTMLElement>(".zodiac-sign");
    signs.forEach((sign) => {
      const angle = parseFloat(sign.dataset.angle ?? "0");
      const radians = ((angle - 90) * Math.PI) / 180;
      const x = iconRadius * Math.cos(radians);
      const y = iconRadius * Math.sin(radians);
      sign.style.left = `calc(50% + ${x}px - ${SIGN_HALF_PX}px)`;
      sign.style.top = `calc(50% + ${y}px - ${SIGN_HALF_PX}px)`;
      sign.style.transform = `rotate(${angle}deg)`;
    });

    const labels = wheel.querySelectorAll<HTMLElement>(".zodiac-sector-label");
    labels.forEach((el) => {
      const angle = parseFloat(el.dataset.angle ?? "0");
      const radians = ((angle - 90) * Math.PI) / 180;
      const x = labelRadius * Math.cos(radians);
      const y = labelRadius * Math.sin(radians);
      el.style.left = `calc(50% + ${x}px)`;
      el.style.top = `calc(50% + ${y}px)`;
      el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    });
  }, []);

  useEffect(() => {
    layoutSigns();
    const wheel = wheelRef.current;
    if (!wheel) return;
    const ro = new ResizeObserver(() => layoutSigns());
    ro.observe(wheel);
    return () => ro.disconnect();
  }, [layoutSigns]);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let rotation = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const burst = burstSpinRef.current;
      if (burst && !prevBurstRef.current) {
        burstStartedAtRef.current = now;
      }
      if (!burst) {
        burstStartedAtRef.current = null;
      }
      prevBurstRef.current = burst;

      let degPerMs = reduceMotion ? 0 : DEG_PER_MS_DEFAULT;
      if (burst && !reduceMotion && burstStartedAtRef.current != null) {
        const elapsed = now - burstStartedAtRef.current;
        const u = elapsed / ZODIAC_BURST_DURATION_MS;
        const eased = burstEaseIn(u);
        const floor = 0.014;
        degPerMs = BURST_OMEGA_PEAK * Math.max(floor, eased);
      } else if (burst && reduceMotion && burstStartedAtRef.current != null) {
        const elapsed = now - burstStartedAtRef.current;
        const u = elapsed / ZODIAC_BURST_DURATION_MS;
        const eased = burstEaseIn(u);
        degPerMs = DEG_PER_MS_DEFAULT * 14 * Math.max(0.06, eased);
      }
      rotation += dt * degPerMs;
      wheel.style.transform = `rotate(${rotation}deg)`;
      const signs = wheel.querySelectorAll<HTMLElement>(".zodiac-sign");
      signs.forEach((sign) => {
        const inner = sign.querySelector<HTMLElement>(".zodiac-sign-inner");
        if (!inner) return;
        const baseAngle = parseFloat(sign.dataset.angle ?? "0");
        inner.style.transform = `rotate(${-rotation - baseAngle}deg)`;
      });

      const sectorLabels = wheel.querySelectorAll<HTMLElement>(
        ".zodiac-sector-label",
      );
      sectorLabels.forEach((labelEl) => {
        const inner = labelEl.querySelector<HTMLElement>(
          ".zodiac-sector-label-inner",
        );
        if (!inner) return;
        const baseAngle = parseFloat(labelEl.dataset.angle ?? "0");
        inner.style.transform = `rotate(${-rotation - baseAngle}deg)`;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative mb-32 flex aspect-square w-full max-w-3xl items-center justify-center"
      id="zodiac-wheel-container"
      style={{ perspective: "1000px" }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(241,201,125,0.12) 0%, transparent 65%)",
        }}
      />
      <div
        ref={wheelRef}
        className="relative flex h-[85%] w-[85%] items-center justify-center rounded-full border border-[#f1c97d]/20"
        id="zodiac-rotating-wheel"
      >
        <div className="pointer-events-none absolute inset-4 rounded-full border border-[#f1c97d]/10" />
        <div className="pointer-events-none absolute inset-12 rounded-full border border-[#f1c97d]/5" />
        <div className="pointer-events-none absolute inset-[-20px] rounded-full border border-[#f1c97d]/5" />

        <svg
          className="pointer-events-none absolute inset-0 size-full opacity-40"
          viewBox={`0 0 ${VB} ${VB}`}
          aria-hidden
        >
          <defs>
            <linearGradient
              id={`zodiacRadialLineGrad-${lineGradId}`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f1c97d" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f1c97d" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <g
            stroke={`url(#zodiacRadialLineGrad-${lineGradId})`}
            strokeWidth="0.2"
            strokeLinecap="round"
          >
            {SEPARATOR_ANGLES.map((deg) => {
              const [x1, y1] = polarToXY(deg, LINE_INNER_R);
              const [x2, y2] = polarToXY(deg, LINE_OUTER_R);
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        </svg>

        <svg
          className="absolute inset-0 z-[1] size-full"
          viewBox={`0 0 ${VB} ${VB}`}
          aria-hidden
        >
          {SIGNS.map(({ angle, label }) => (
            <a
              key={angle}
              href="#"
              data-zodiac-sector={angle}
              aria-label={label}
              className="outline-none"
              onClick={(e) => e.preventDefault()}
              onMouseEnter={() => setHoveredAngle(angle)}
              onMouseLeave={(e) => sectorLeave(angle, setHoveredAngle, e)}
              onFocus={() => setHoveredAngle(angle)}
              onBlur={(e) => {
                if (
                  !e.currentTarget.contains(e.relatedTarget as Node | null)
                ) {
                  setHoveredAngle(null);
                }
              }}
            >
              <path
                d={annularSectorPath(
                  SECTOR_INNER_R,
                  SECTOR_OUTER_R,
                  angle - 15,
                  angle + 15,
                )}
                className={`cursor-pointer transition-[fill] duration-300 ease-out ${
                  hoveredAngle === angle
                    ? "fill-[rgba(241,201,125,0.18)]"
                    : birthSignAngle === angle
                      ? "fill-[rgba(241,201,125,0.12)]"
                      : "fill-[rgba(241,201,125,0)]"
                }`}
              />
            </a>
          ))}
        </svg>

        {SIGNS.map(({ angle, label }) => (
          <div
            key={`label-${angle}`}
            className="zodiac-sector-label pointer-events-none absolute z-[5] max-w-[5.25rem] text-center"
            data-angle={angle}
            aria-hidden
          >
            <span
              className={`zodiac-sector-label-inner zd-headline inline-block origin-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#f1c97d] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-300 ease-out sm:text-[11px] ${
                hoveredAngle === angle ? "opacity-100" : "opacity-0"
              }`}
            >
              {label}
            </span>
          </div>
        ))}

        {SIGNS.map(({ angle, Icon }) => (
          <div
            key={`icon-${angle}`}
            data-zodiac-sector={angle}
            className="zodiac-sign absolute z-[10] flex h-16 w-16 cursor-pointer items-center justify-center"
            data-angle={angle}
            onMouseEnter={() => setHoveredAngle(angle)}
            onMouseLeave={(e) => sectorLeave(angle, setHoveredAngle, e)}
          >
            <span
              className={`zd-headline flex h-full w-full items-center justify-center transition-[color] duration-300 ease-out ${
                hoveredAngle === angle || birthSignAngle === angle
                  ? "text-[#f1c97d]"
                  : "text-[#f1c97d]/55"
              } zodiac-sign-inner`}
            >
              <Icon
                size={ICON_SIZE_PX}
                strokeWidth={1.35}
                aria-hidden
                className="shrink-0"
              />
            </span>
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute z-10 flex flex-col items-center rounded-full border border-[#f1c97d]/10 p-12 shadow-[0_0_50px_rgba(241,201,125,0.1)]"
        aria-hidden
      />
    </div>
  );
}
