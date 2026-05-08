/**
 * Lottie overlay positions reverse-engineered from maximatherapy.com
 * `assets/layout-wYxH71HP.js` (component `G` = Lottie, paths under `/assets/lottie/`).
 * Skipped: `kid_flower_pants.json` (canvas + mask / parallax — not reproduced here).
 */
export type MaximaHeroLottieLayer = {
  /** Public path under `public/` (mirrors their `/assets/lottie/…`). */
  path: string;
  /** Tailwind positioning from production (non-weight classes only). */
  className: string;
};

export const MAXIMA_HERO_LOTTIE_LAYERS: Record<string, readonly MaximaHeroLottieLayer[]> = {
  "0-to-3": [
    {
      path: "/maxima/lottie/program-0-to-3/train.json",
      className: "absolute top-[46.1%] left-[38.2%] z-10 w-[34.6%] h-auto",
    },
    {
      path: "/maxima/lottie/program-0-to-3/kid_flower_nopants.json",
      className: "absolute top-[20.3%] left-[49.3%] z-10 w-[15%] h-auto",
    },
  ],
  "3-to-18": [
    {
      path: "/maxima/lottie/program-3-to-18/program2-hero.json",
      className: "absolute top-[33%] left-[49.5%] z-10 w-[12.1%] h-auto",
    },
    {
      path: "/maxima/lottie/0Program2/bike.json",
      className: "absolute top-[53.6%] left-[25.2%] z-10 w-[34%] h-auto",
    },
  ],
  "18-to-65": [
    {
      path: "/maxima/lottie/program-18-to-65/program3-hero.json",
      className: "absolute top-[50.8%] left-[47.9%] z-[14] w-[11.3%] h-auto",
    },
    {
      path: "/maxima/lottie/0Program3/illu.json",
      className: "absolute top-[17.96%] left-[38.4%] z-10 w-[34.25%] h-auto",
    },
  ],
  "65-and-plus": [
    {
      path: "/maxima/lottie/0Program4/lighthouse.json",
      className: "absolute top-[26.8%] left-[23.65%] z-[14] w-[23.3%] h-auto pointer-events-none",
    },
    {
      path: "/maxima/lottie/0Program4/guy.json",
      className: "absolute top-[45%] left-[37.8%] z-[14] w-[12.1%] h-auto pointer-events-none",
    },
    {
      path: "/maxima/lottie/0Program4/lady-face.json",
      className: "absolute top-[29.6%] left-[41.5%] z-[14] w-[32%] h-auto pointer-events-none",
    },
  ],
};
