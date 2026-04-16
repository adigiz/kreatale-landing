import { getTravelTipSlug } from "@/lib/demo-slug";
import type { TourConfig } from "./tour-config";
import { TOUR_DICTIONARY } from "./translations";

export function getTourLang(config?: TourConfig): "en" | "id" {
  return config?.language === "id" ? "id" : "en";
}

export function listDestinationsForBrowse(config?: TourConfig) {
  const lang = getTourLang(config);
  const t = TOUR_DICTIONARY[lang];
  const fromConfig = config?.destinations;
  if (fromConfig && fromConfig.length > 0) return fromConfig;
  return t.fallbackDestinations;
}

export function listExperiencesForBrowse(config?: TourConfig) {
  const lang = getTourLang(config);
  const t = TOUR_DICTIONARY[lang];
  const c = config?.experienceList;
  if (c && c.length > 0) return c;
  return t.defaultExperienceItems;
}

export function listTravelTipsForBrowse(config?: TourConfig) {
  const lang = getTourLang(config);
  const t = TOUR_DICTIONARY[lang];
  const c = config?.travelTips;
  if (c && c.length > 0) return c;
  return t.defaultTravelTips;
}

export function findTravelTipBySlug(
  config: TourConfig | undefined,
  tipSlug: string,
) {
  return listTravelTipsForBrowse(config).find(
    (tip) => getTravelTipSlug(tip) === tipSlug,
  );
}
