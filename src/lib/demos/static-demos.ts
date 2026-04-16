import type { DemoSite } from "@/lib/cms/db/schema";
import { DUMMY_CAR_CONFIG } from "@/lib/cms/dummy/car";
import { DUMMY_TOUR_CONFIG } from "@/lib/cms/dummy/tour";
import { DUMMY_ZODIAC_CONFIG } from "@/lib/cms/dummy/zodiac";
import { DUMMY_BAKERY_CONFIG } from "@/lib/cms/dummy/bakery";
import { DUMMY_BEDDING_CONFIG } from "@/lib/cms/dummy/bedding";
import { DUMMY_FORTES_CONFIG } from "@/lib/cms/dummy/fortes";

/** Fixed timestamps for sitemap / listing (no DB). */
const STATIC_TS = new Date("2026-01-01T00:00:00.000Z");

function asDemoSite(
  id: string,
  slug: string,
  templateId: "tour" | "car" | "zodiac" | "bakery" | "bedding" | "fortes",
  config: unknown,
): DemoSite {
  return {
    id,
    slug,
    templateId,
    config: config as DemoSite["config"],
    isPublished: true,
    authorId: null,
    createdAt: STATIC_TS,
    updatedAt: STATIC_TS,
  };
}

const STATIC_DEMO_SITES: DemoSite[] = [
  asDemoSite(
    "00000000-0000-4000-8000-000000000004",
    DUMMY_BAKERY_CONFIG.slug,
    "bakery",
    DUMMY_BAKERY_CONFIG,
  ),
  asDemoSite(
    "00000000-0000-4000-8000-000000000005",
    DUMMY_BEDDING_CONFIG.slug,
    "bedding",
    DUMMY_BEDDING_CONFIG,
  ),
  asDemoSite(
    "00000000-0000-4000-8000-000000000002",
    DUMMY_CAR_CONFIG.slug,
    "car",
    DUMMY_CAR_CONFIG,
  ),
  asDemoSite(
    "00000000-0000-4000-8000-000000000001",
    DUMMY_TOUR_CONFIG.slug,
    "tour",
    DUMMY_TOUR_CONFIG,
  ),
  asDemoSite(
    "00000000-0000-4000-8000-000000000003",
    DUMMY_ZODIAC_CONFIG.slug,
    "zodiac",
    DUMMY_ZODIAC_CONFIG,
  ),
  asDemoSite(
    "00000000-0000-4000-8000-000000000006",
    DUMMY_FORTES_CONFIG.slug,
    "fortes",
    DUMMY_FORTES_CONFIG,
  ),
];

export const STATIC_PUBLISHED_DEMO_SLUGS = STATIC_DEMO_SITES.map((d) => d.slug);

/** Public demos: no database. */
export function getStaticDemoBySlug(
  slug: string,
): { demoSite: DemoSite; author: null } | null {
  const demoSite = STATIC_DEMO_SITES.find((d) => d.slug === slug) ?? null;
  if (!demoSite) return null;
  return { demoSite, author: null };
}

/** Same shape as `getPublishedDemoSites()` for listing + sitemap. */
export function getStaticPublishedDemoSites(): {
  demoSite: DemoSite;
  author: null;
}[] {
  return STATIC_DEMO_SITES.filter((d) => d.isPublished).map((demoSite) => ({
    demoSite,
    author: null,
  }));
}
