"use client";

/**
 * Full-viewport intro curtain — matches maximatherapy.com loading layer:
 * `bg-beige`, white blob SVGs, `curtain-title` (red Robuck) + `curtain-desc` (blue Diatype),
 * then slides away to reveal the program carousel (see Program-C1Fj9AJ9.css on their CDN).
 */
import { motion } from "framer-motion";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

function BlobClusterSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 365 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M132.565 179.442C167.036 179.442 194.98 139.272 194.98 89.7208C194.98 40.1694 167.036 0 132.565 0C98.0934 0 70.1489 40.1694 70.1489 89.7208C70.1489 139.272 98.0934 179.442 132.565 179.442Z"
        fill="white"
      />
      <path
        d="M237.12 179.442C271.591 179.442 299.536 139.272 299.536 89.7208C299.536 40.1694 271.591 0 237.12 0C202.649 0 174.704 40.1694 174.704 89.7208C174.704 139.272 202.649 179.442 237.12 179.442Z"
        fill="white"
      />
      <path
        d="M321.334 152.398C345.414 152.398 364.934 124.336 364.934 89.721C364.934 55.1056 345.414 27.0443 321.334 27.0443C297.255 27.0443 277.734 55.1056 277.734 89.721C277.734 124.336 297.255 152.398 321.334 152.398Z"
        fill="white"
      />
      <path
        d="M43.5997 152.398C67.6791 152.398 87.1994 124.336 87.1994 89.721C87.1994 55.1056 67.6791 27.0443 43.5997 27.0443C19.5203 27.0443 0 55.1056 0 89.721C0 124.336 19.5203 152.398 43.5997 152.398Z"
        fill="white"
      />
    </svg>
  );
}

function WaveArcSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 335 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M335 112.978C335 69.3958 310.633 34.0609 280.595 34.0609C262.453 34.0609 246.415 47.0014 236.514 66.8256C224.33 27.4678 197.128 0 165.473 0C133.818 0 108.809 25.2998 95.9833 62.1321C85.9929 44.9899 71.0848 34.0833 54.4045 34.0833C24.3447 34.0833 0 69.4181 0 113"
        fill="white"
      />
    </svg>
  );
}

const root = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.18 },
  },
};

const blob = {
  hidden: { scale: 0, opacity: 0.88 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 240, damping: 19, mass: 0.82 },
  },
};

const textWrap = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
};

const textLine = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type Props = {
  /** Called after the curtain has animated off-screen. */
  onComplete: () => void;
};

export default function MaximaHeroCurtain({ onComplete }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete,
    });

    tl.to(layer, { yPercent: -102, duration: 1.05 }, "+=1.55");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={layerRef}
      className="maxima-hero-curtain-layer fixed inset-0 z-[150] flex flex-col bg-[var(--color-beige)] will-change-transform"
      style={{ pointerEvents: "auto" }}
    >
      <motion.div
        className="maxima-hero-curtain-scaler relative flex min-h-0 flex-1 flex-col items-center justify-center px-5 max-lg:pt-[min(6vh,3rem)]"
        initial="hidden"
        animate="visible"
        variants={root}
      >
        <motion.div
          variants={blob}
          className="pointer-events-none absolute top-[calc(50%-0.4*23rem)] left-[calc(50%-0.4*30rem)] h-auto w-[9.875rem] lg:top-[calc(50%-23rem)] lg:left-[calc(50%-30rem)] lg:w-[22.8125rem]"
        >
          <BlobClusterSvg className="h-auto w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.06)]" />
        </motion.div>
        <motion.div
          variants={blob}
          className="pointer-events-none absolute top-[calc(50%-0.4*10rem)] left-[calc(50%+0.4*25rem)] h-auto w-[9.875rem] lg:top-[calc(50%-10rem)] lg:left-[calc(50%+25rem)] lg:w-[22.8125rem]"
        >
          <BlobClusterSvg className="h-auto w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.06)]" />
        </motion.div>
        <motion.div
          variants={blob}
          className="pointer-events-none absolute top-[calc(50%+0.4*14.5rem)] left-[calc(50%-0.4*43rem)] z-10 h-auto w-[8.5rem] lg:top-[calc(50%+14.5rem)] lg:left-[calc(50%-43rem)] lg:w-[20.9375rem]"
        >
          <WaveArcSvg className="h-auto w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.06)]" />
        </motion.div>

        <div
          className="relative z-[1] flex w-full max-w-[min(96vw,52rem)] flex-col items-center text-center"
          aria-label="Maxima Therapy"
        >
          {/* Production spacer before headline (layout rhythm). */}
          <div className="mb-0 h-auto w-[10rem] shrink-0 lg:mt-[-2rem] lg:w-[23rem]" aria-hidden />

          <motion.div variants={textWrap} className="flex flex-col items-center">
            <motion.h1 variants={textLine} className="maxima-hero-curtain-title text-pretty">
              See life from <br /> a different angle
            </motion.h1>
            <motion.p variants={textLine} className="maxima-hero-curtain-desc mt-[1.75rem] text-pretty lg:mt-10">
              We don&apos;t treat disabilities.
              <br />
              We support differences, from
              <br />
              birth to golden age.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
