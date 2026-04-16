"use client";

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export type PackageDepartureSummary =
  | { kind: "plain" }
  | { kind: "dates"; text: string; moreCount: boolean; full: string };

function parseSegmentTimestamps(segment: string, defaultYear: number): number[] {
  const monthRe = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept?|oct|nov|dec)\b\.?/i;
  const monthMatch = segment.match(monthRe);
  if (!monthMatch || monthMatch.index === undefined) return [];

  const raw = monthMatch[1].toLowerCase().replace(/\.$/, "");
  const key = raw === "sept" ? "sep" : raw;
  const m = MONTHS[key];
  if (m === undefined) return [];

  const before = segment.slice(0, monthMatch.index);
  const afterMonth = segment.slice(monthMatch.index + monthMatch[0].length);
  const yearMatch =
    segment.match(/\b(20\d{2})\b/) || afterMonth.match(/\b(20\d{2})\b/);
  const y = yearMatch ? parseInt(yearMatch[0], 10) : defaultYear;

  const dayMatches = before.match(/\b\d{1,2}\b/g);
  if (!dayMatches?.length) return [];

  const out: number[] = [];
  for (const dm of dayMatches) {
    const d = parseInt(dm, 10);
    if (d >= 1 && d <= 31) out.push(new Date(y, m, d).getTime());
  }
  return out;
}

export function summarizePackageDepartures(
  feature: string,
  locale: "en" | "id",
): PackageDepartureSummary {
  const trimmed = feature.trim();
  if (!trimmed || !/\d/.test(trimmed)) return { kind: "plain" };
  if (!/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i.test(trimmed)) {
    return { kind: "plain" };
  }

  const defaultYear = (() => {
    const years = trimmed.match(/\b(20\d{2})\b/g);
    if (years?.length) return parseInt(years[years.length - 1], 10);
    return new Date().getFullYear();
  })();

  const segments = trimmed.includes("/")
    ? trimmed.split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean)
    : [trimmed];

  const stamps: number[] = [];
  for (const seg of segments) {
    stamps.push(...parseSegmentTimestamps(seg, defaultYear));
  }

  const unique = [...new Set(stamps)].sort((a, b) => a - b);
  if (unique.length === 0) return { kind: "plain" };

  const loc = locale === "id" ? "id-ID" : "en-GB";
  const fmt = (ts: number) =>
    new Date(ts).toLocaleDateString(loc, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (unique.length === 1) {
    return { kind: "dates", text: fmt(unique[0]), moreCount: false, full: trimmed };
  }
  return {
    kind: "dates",
    text: fmt(unique[0]),
    moreCount: true,
    full: trimmed,
  };
}

export function tourPackageFeatureIcon(feature: string): string {
  const f = feature.toLowerCase();
  if (f.includes("flight") || f.includes("class")) return "flight_class";
  if (f.includes("spa") || f.includes("onsen")) return "spa";
  if (f.includes("safari") || f.includes("camera")) return "photo_camera";
  return "star";
}

export function TourPackageFeatureValue({
  feature,
  language,
  moreDepartureAriaLabel,
  className = "",
}: {
  feature: string;
  language: "en" | "id";
  moreDepartureAriaLabel: string;
  className?: string;
}) {
  const dep = summarizePackageDepartures(feature, language);
  if (dep.kind === "plain") {
    return (
      <span className={`inline-flex items-center gap-1 min-w-0 ${className}`}>
        <span className="material-symbols-outlined text-lg shrink-0">
          {tourPackageFeatureIcon(feature)}
        </span>
        <span className="min-w-0">{feature}</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 min-w-0 flex-wrap ${className}`}
    >
      <span className="material-symbols-outlined text-lg shrink-0">star</span>
      <span className="min-w-0">{dep.text}</span>
      {dep.moreCount ? (
        <span
          role="img"
          className="inline-flex items-center justify-center rounded-full p-0.5 text-gray-400 dark:text-gray-500 shrink-0 cursor-help"
          title={dep.full}
          aria-label={moreDepartureAriaLabel}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden>
            info
          </span>
        </span>
      ) : null}
    </span>
  );
}
