"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ZodiacConfig } from "./zodiac-config";
import "./zodiac-demo.css";
import {
  ZODIAC_BURST_DURATION_MS,
  ZODIAC_READING_TRANSITION_AT_MS,
} from "./zodiac-burst-timings";
import { ZodiacDateOfBirthInput } from "./ZodiacDateOfBirthInput";
import {
  ZodiacReadingOverlay,
  type ReadingStage,
} from "./ZodiacReadingOverlay";
import { ZodiacScrollWheel } from "./ZodiacScrollWheel";
import { getSunSignAngle } from "./zodiac-sun-sign";

function birthDateKey(d: Date | null): string | null {
  if (!d) return null;
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const DEFAULT_HERO = (
  <>
    Dreams, signs, and what they might say about{" "}
    <span className="font-light italic">you</span>.
  </>
);

export function ZodiacDemoView({ config }: { config?: ZodiacConfig }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const brand = config?.websiteName?.trim() || "Celestial";
  const editorialSrc =
    config?.heroImage?.trim() ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCbbqe7kdcFxQUsQdmo9rcV0iVF_fkXYzdLPeWx5NQDX1SWhDvQmips36wETroB9NsCyswCq9AsBMchPGMK7SoLfgOi52sxaMkFhTOWOXNm07BkbeUo-lffe2EywbPqW5JDXOGovL25ysjQkRHOKCcu5bQ_VGSA4KZlyZcjDXnWRYRQFs1dkPbyzbLW0i_dlSFM0PuDwBv_LqXJZalIWT4XMq8XfdhhEruTych7BkmsrU8_hxM-Y3IqdYE4aK4MXlkytESMYvAN13M";

  const heroTitle = config?.heroTitle?.trim();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [readingStage, setReadingStage] = useState<ReadingStage>("off");
  const [burstSpin, setBurstSpin] = useState(false);
  const cancelReadingSequence = useRef<() => void>(() => {});

  const birthKey = useMemo(() => birthDateKey(birthDate), [birthDate]);
  const birthSignAngle = useMemo(
    () => (birthDate ? getSunSignAngle(birthDate) : null),
    [birthDate],
  );

  useEffect(() => {
    if (!birthKey) {
      cancelReadingSequence.current();
      setBurstSpin(false);
      setReadingStage("off");
      return;
    }
    setBurstSpin(true);
    setReadingStage("off");
    cancelReadingSequence.current();
    const t1 = window.setTimeout(
      () => setReadingStage("transition"),
      ZODIAC_READING_TRANSITION_AT_MS,
    );
    const t2 = window.setTimeout(() => {
      setReadingStage("open");
      setBurstSpin(false);
    }, ZODIAC_BURST_DURATION_MS);
    const cancel = () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    cancelReadingSequence.current = cancel;
    return cancel;
  }, [birthKey]);

  const closeReading = useCallback(() => {
    cancelReadingSequence.current();
    cancelReadingSequence.current = () => {};
    setReadingStage("off");
    setBurstSpin(false);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full max-w-full items-center justify-between bg-[#131313]/80 px-6 py-5 backdrop-blur-xl md:px-12 md:py-6">
        <div className="zd-headline text-xl tracking-[0.2em] text-[#f1c97d] md:text-2xl">
          {brand.toUpperCase()}
        </div>
        <button
          type="button"
          className="scale-95 bg-gradient-to-tr from-[#f1c97d] to-[#d4ad65] px-6 py-2 text-[10px] uppercase tracking-widest text-[#412d00] md:px-8"
        >
          Sign up
        </button>
      </nav>

      <main className="bg-[#131313] pb-16 pt-28 text-[#e5e2e1] selection:bg-[#f1c97d] selection:text-[#412d00] md:pt-32">
        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:px-12">
          <h1 className="zd-headline mb-12 max-w-4xl text-4xl leading-tight tracking-tight md:mb-16 md:text-6xl lg:text-7xl">
            {heroTitle ? heroTitle : DEFAULT_HERO}
          </h1>
          <div className="relative z-20 mb-24 w-full max-w-md md:mb-32">
            <ZodiacDateOfBirthInput onDateChange={setBirthDate} />
          </div>
          <ZodiacScrollWheel
            birthSignAngle={birthSignAngle}
            burstSpin={burstSpin}
          />
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-12">
          <div className="grid grid-cols-1 gap-0 border-t border-[#4d4635]/20 md:grid-cols-3">
            <div className="group border-[#4d4635]/20 py-16 transition-colors duration-500 hover:bg-[#1c1b1b] md:border-r md:py-20 md:pr-12">
              <div className="mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-[#f1c97d]">
                  wb_sunny
                </span>
                <h2 className="zd-headline text-xl uppercase tracking-widest">
                  Daily Forecast
                </h2>
              </div>
              <p className="mb-10 font-light leading-relaxed text-[#c8c6c5]">
                A light take on the week—mood and timing, not fate.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] transition-colors group-hover:text-[#f1c97d]"
                onClick={(e) => e.preventDefault()}
              >
                Read more
                <span className="material-symbols-outlined ml-2 text-sm">
                  trending_flat
                </span>
              </a>
            </div>
            <div className="group border-[#4d4635]/20 py-16 transition-colors duration-500 hover:bg-[#1c1b1b] md:border-r md:px-12 md:py-20">
              <div className="mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-[#f1c97d]">
                  bedtime
                </span>
                <h2 className="zd-headline text-xl uppercase tracking-widest">
                  Dream Interpretation
                </h2>
              </div>
              <p className="mb-10 font-light leading-relaxed text-[#c8c6c5]">
                Recurring images usually track stress and routine more than
                prophecy.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] transition-colors group-hover:text-[#f1c97d]"
                onClick={(e) => e.preventDefault()}
              >
                Notes
                <span className="material-symbols-outlined ml-2 text-sm">
                  trending_flat
                </span>
              </a>
            </div>
            <div className="group py-16 transition-colors duration-500 hover:bg-[#1c1b1b] md:pl-12 md:py-20">
              <div className="mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-[#f1c97d]">
                  auto_awesome
                </span>
                <h2 className="zd-headline text-xl uppercase tracking-widest">
                  Cosmic Guidance
                </h2>
              </div>
              <p className="mb-10 font-light leading-relaxed text-[#c8c6c5]">
                Sun, moon, rising—three handles on how you tend to show up.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] transition-colors group-hover:text-[#f1c97d]"
                onClick={(e) => e.preventDefault()}
              >
                Open
                <span className="material-symbols-outlined ml-2 text-sm">
                  trending_flat
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#0e0e0e] py-24 md:py-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:px-12">
            <div className="md:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#201f1f]">
                <img
                  alt="Figure with a telescope under the night sky"
                  src={editorialSrc}
                  className="h-full w-full object-cover grayscale opacity-50 transition-all duration-700 hover:grayscale-0"
                />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                  <span className="zd-headline text-5xl text-[#f1c97d]/30 md:text-6xl">
                    01
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:col-span-5">
              <span className="mb-6 text-[10px] uppercase tracking-[0.4em] text-[#f1c97d]">
                Archive
              </span>
              <h3 className="zd-headline mb-6 text-3xl leading-tight md:mb-8 md:text-4xl">
                Old charts, new readers.
              </h3>
              <p className="mb-10 font-light leading-relaxed text-[#c8c6c5] md:mb-12">
                Early astronomers mixed careful observation with metaphor. We
                still borrow both.
              </p>
              <button
                type="button"
                className="border border-[#4d4635]/30 px-8 py-4 text-[10px] uppercase tracking-widest transition-all duration-300 hover:border-[#f1c97d] md:px-10"
              >
                Archive
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-8 border-t-[0.5px] border-[#4d4635]/20 bg-[#0e0e0e] px-6 py-16 md:flex-row md:px-12 md:py-20">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="zd-headline text-lg text-[#f1c97d]">{brand}</div>
          <p className="text-center text-[10px] uppercase tracking-[0.15em] text-white/40 md:text-left">
            © {new Date().getFullYear()} {brand.toUpperCase()}. All rights
            reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <Link
            href={`/${locale}/privacy`}
            className="text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-[#f1c97d]"
          >
            Privacy Policy
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-[#f1c97d]"
          >
            Terms of Service
          </Link>
        </div>
      </footer>

      {birthDate && birthSignAngle !== null ? (
        <ZodiacReadingOverlay
          stage={readingStage}
          signAngle={birthSignAngle}
          birthDate={birthDate}
          onClose={closeReading}
        />
      ) : null}
    </>
  );
}
