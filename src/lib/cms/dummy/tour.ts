import dwiData from "./dwidayatour-scraped.json";

const FALLBACK_PKG_IMAGE =
  "https://cdn.dwidayatour.co.id/p/images/DWW/Promo/1661-B2C-ASAKUSA.webp";

type ScrapedItineraryDay = {
  day: number;
  title: string;
  description: string;
};

type ScrapedPackage = (typeof dwiData.packages)[number] & {
  itinerary?: ScrapedItineraryDay[];
};

function formatDuration(code: string): string {
  const m = code.match(/^(\d+)D(\d+)N$/i);
  return m ? `${m[1]}D / ${m[2]}N` : code;
}

function slugifyRegion(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** When the live API returns no itinerary (e.g. stale PKGShortCode on homepage). */
function fallbackPackageItinerary(
  title: string,
  departures: string,
): ScrapedItineraryDay[] {
  return [
    {
      day: 1,
      title: "Package overview",
      description: `${title}. Departures: ${departures}. Your consultant confirms flights, hotels, transfers, and the full day-by-day programme before you travel.`,
    },
    {
      day: 2,
      title: "Booking & documents",
      description:
        "Finalise traveller names, passport validity, and visa or entry rules for this destination. Your consultant confirms seat availability on the listed series dates.",
    },
    {
      day: 3,
      title: "Before you fly",
      description:
        "Your consultant shares baggage limits, meeting point, and emergency contact details before departure.",
    },
  ];
}

function packageItineraryFromScrape(p: ScrapedPackage): ScrapedItineraryDay[] {
  const rows = p.itinerary;
  if (rows && rows.length > 0) {
    return rows.map((d) => ({
      day: d.day,
      title: d.title,
      description: d.description,
    }));
  }
  return fallbackPackageItinerary(p.title, p.feature);
}

const seenRegions = new Set<string>();
const destinations: {
  name: string;
  slug: string;
  region: string;
  description: string;
  image: string;
}[] = [];

for (const p of dwiData.packages) {
  if (seenRegions.has(p.location)) continue;
  seenRegions.add(p.location);
  const img =
    dwiData.packages.find((x) => x.location === p.location && x.image)?.image ??
    FALLBACK_PKG_IMAGE;
  destinations.push({
    name: p.location,
    slug: slugifyRegion(p.location),
    region: p.location,
    description: `Group series and value deals for ${p.location}.`,
    image: img,
  });
}

const firstPkg = dwiData.packages[0];

export const DUMMY_TOUR_CONFIG = {
  slug: "dwidayatour-demo",
  websiteName: "Dwidayatour",
  logo: "https://www.dwidayatour.co.id/Images/DWW/logo.png",
  primaryColor: "#2747A0",
  accentColor: "#F47920",
  accentHoverColor: "#DC6A18",
  language: "en" as const,
  heroTitle: firstPkg?.title ?? "Popular tour packages",
  heroSubtitle: firstPkg?.feature?.trim()
    ? firstPkg.feature.trim()
    : "Curated group departures across Asia, Europe, and beyond.",
  heroImage: firstPkg?.image ?? FALLBACK_PKG_IMAGE,
  price: firstPkg?.price ?? "16.999.000",
  currency: "Rp",
  days: firstPkg ? formatDuration(firstPkg.duration) : "6D / 3N",
  location: firstPkg?.location ?? "Japan",
  destinations,
  experienceList: dwiData.experiences.map((e) => ({
    name: e.name.replace(/\s*\(Themepark\)\s*$/, "").trim(),
    slug: e.slug,
    category: e.category,
    description: e.description.replace(/^Themepark · /, "Theme park · "),
    image: e.image,
  })),
  travelTips: dwiData.travelTips.map((t) => ({
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    body: t.body,
    image: t.image,
  })),
  packages: (dwiData.packages as ScrapedPackage[]).map((p) => ({
    title: p.title,
    slug: p.slug,
    image: p.image ?? FALLBACK_PKG_IMAGE,
    price: p.price,
    location: p.location,
    duration: formatDuration(p.duration),
    feature: p.feature,
    itinerary: packageItineraryFromScrape(p),
  })),
};
