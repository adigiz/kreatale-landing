/** CMS / static demo shape for the bakery template (Broma-style homepage). */
export type BakeryConfig = {
  slug?: string;
  websiteName?: string;
  heroKicker?: string;
  heroTitle?: string;
  /** Long hero paragraph; template falls back to `heroSubtitle` when set from admin form only. */
  heroBody?: string;
  heroImage?: string;
  heroSubtitle?: string;
  language?: "en" | "id";
};
