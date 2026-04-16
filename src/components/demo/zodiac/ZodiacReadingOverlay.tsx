"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import { getZodiacReading } from "./zodiac-readings";

const ICON_BY_ANGLE: Record<number, LucideIcon> = {
  0: ZodiacAries,
  30: ZodiacTaurus,
  60: ZodiacGemini,
  90: ZodiacCancer,
  120: ZodiacLeo,
  150: ZodiacVirgo,
  180: ZodiacLibra,
  210: ZodiacScorpio,
  240: ZodiacSagittarius,
  270: ZodiacCapricorn,
  300: ZodiacAquarius,
  330: ZodiacPisces,
};

export type ReadingStage = "off" | "transition" | "open";

type Props = {
  stage: ReadingStage;
  signAngle: number;
  birthDate: Date;
  onClose: () => void;
};

export function ZodiacReadingOverlay({
  stage,
  signAngle,
  birthDate,
  onClose,
}: Props) {
  const reading = getZodiacReading(signAngle);
  const Icon = ICON_BY_ANGLE[signAngle];

  useEffect(() => {
    if (stage !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, onClose]);

  useEffect(() => {
    if (stage === "off") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  const visible = stage === "transition" || stage === "open";
  const birthLabel = birthDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!reading || !Icon) return null;

  return (
    <AnimatePresence mode="sync">
      {visible ? (
        <motion.div
          key="vignette"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage === "open" ? 1 : 0.72,
            backdropFilter: stage === "open" ? "blur(12px)" : "blur(8px)",
          }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          transition={{
            duration: stage === "open" ? 0.55 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[160] bg-[radial-gradient(ellipse_at_50%_40%,rgba(241,201,125,0.18)_0%,rgba(19,19,19,0.92)_55%,#0a0a0a_100%)]"
        />
      ) : null}

      {stage === "open" ? (
        <motion.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="zodiac-reading-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[170] flex items-end justify-center sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Close reading"
            className="absolute inset-0 cursor-default bg-transparent"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-2xl flex-col overflow-hidden border border-[#4d4635]/50 bg-[#121110] shadow-[0_40px_120px_rgba(0,0,0,0.75)] sm:max-h-[85vh] sm:rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#4d4635]/35 bg-[#161514] px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-14 w-14 items-center justify-center border border-[#f1c97d]/25 text-[#f1c97d] sm:h-16 sm:w-16">
                  <Icon className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.2} />
                </div>
                <div>
                  <p className="zd-headline text-[10px] uppercase tracking-[0.25em] text-[#f1c97d]/70">
                    Sun sign
                  </p>
                  <h2
                    id="zodiac-reading-title"
                    className="zd-headline text-2xl tracking-tight text-[#f1c97d] sm:text-3xl"
                  >
                    {reading.name}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/45">
                    {reading.dates} · {birthLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="zd-headline shrink-0 border border-[#4d4635]/50 px-3 py-2 text-[10px] uppercase tracking-widest text-white/60 transition-colors hover:border-[#f1c97d]/50 hover:text-[#f1c97d]"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <p className="zd-headline mb-8 text-sm italic text-[#f1c97d]/80">
                {reading.tagline}
              </p>

              <section className="mb-10">
                <h3 className="zd-headline mb-3 text-[10px] uppercase tracking-[0.2em] text-[#f1c97d]">
                  Personality
                </h3>
                <p className="font-light leading-relaxed text-[#c8c6c5]">
                  {reading.personality}
                </p>
              </section>

              <section className="mb-10">
                <h3 className="zd-headline mb-4 text-[10px] uppercase tracking-[0.2em] text-[#f1c97d]">
                  Traits
                </h3>
                <ul className="space-y-3 font-light text-[#c8c6c5]">
                  {reading.traits.map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 border-l border-[#f1c97d]/25 pl-4 text-left"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-10">
                <h3 className="zd-headline mb-3 text-[10px] uppercase tracking-[0.2em] text-[#f1c97d]">
                  Love
                </h3>
                <p className="font-light leading-relaxed text-[#c8c6c5]">
                  {reading.loveLife}
                </p>
              </section>

              <section className="mb-4">
                <h3 className="zd-headline mb-4 text-[10px] uppercase tracking-[0.2em] text-[#f1c97d]">
                  Compatibility
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-[9px] uppercase tracking-widest text-white/40">
                      Strong fit
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reading.bestWith.map((s) => (
                        <span
                          key={s}
                          className="zd-headline border border-[#f1c97d]/30 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#f1c97d]/90"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-[9px] uppercase tracking-widest text-white/40">
                      Friction
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reading.growWith.map((s) => (
                        <span
                          key={s}
                          className="zd-headline border border-[#4d4635]/60 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/55"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
