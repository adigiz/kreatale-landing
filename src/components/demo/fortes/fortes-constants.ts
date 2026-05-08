export const FORTES_ORIGIN = "https://fortes.vision";

/** Kreatale primary wordmark with Fortes yellow dot (`--fortes-yellow`); demo-only, keeps `/logos/*` unchanged. */
export const FORTES_DEMO_KREATALE_LOGO_SVG = "/fortes/kreatale-logo-fortes-yellow.svg" as const;

/** Shown in Fortes-layout demo header/footer instead of info@fortes.vision. */
export const FORTES_DEMO_CONTACT_EMAIL = "contact@kreatale.com" as const;

/** Same-origin copies under `/public/fortes/` (preloader Lottie + logo). */
export const FORTES_PUBLIC = {
  preloaderLottie: "/fortes/preloader-logo.json",
  logoSvg: "/fortes/logo.svg",
} as const;

export const FORTES_MEDIA = {
  heroVideo: `${FORTES_ORIGIN}/wp-content/uploads/2025/12/For_Site_V3.mp4`,
  heroPoster: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/videos/caspian-preview.jpg`,
  preloaderBg: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/preloadar-bg.png`,
  preloaderLottie: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/preloader-logo.json`,
  logoLottie: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/logo.json`,
  logoSvg: `${FORTES_ORIGIN}/wp-content/uploads/2025/06/logo.svg`,
  trustedBg: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/trusted-bg.png`,
  faqBg: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/faq.png`,
  testimonialsBgDesk: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/what.png`,
  testimonialsBgMob: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/what-mob.png`,
  aiSectionVideo: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/video1.mp4`,
  aiSectionPoster: `${FORTES_ORIGIN}/wp-content/themes/theme/src/sass/images/preview_1.jpg`,
  /** “Our approach” heading strip image. */
  approachHeadingImage: `${FORTES_ORIGIN}/wp-content/uploads/2025/06/Rectangle-7260.jpg`,
  /** Footer hero strip above the footer columns. */
  footerHouseImage: `${FORTES_ORIGIN}/wp-content/uploads/2025/09/blue-house-1.jpg`,
  footerSocialLinkedIn: `${FORTES_ORIGIN}/wp-content/uploads/2025/12/Vector-1.svg`,
  footerSocialInstagram: `${FORTES_ORIGIN}/wp-content/uploads/2025/12/Exclude-1.svg`,
} as const;
