// Google PageSpeed Insights (Lighthouse run by Google) for mobile and desktop. We keep only a
// trimmed result: four category scores, lab Core Web Vitals, real-user (CrUX) data when Google
// has it, and the failed audits with their weight. Optional PAGESPEED_API_KEY raises the quota.

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "seo", "accessibility", "best-practices"] as const;
const TIMEOUT_MS = 60_000;

export type Strategy = "mobile" | "desktop";

export type CategoryScores = { performance: number | null; seo: number | null; accessibility: number | null; bestPractices: number | null };

export type LabVitals = {
  lcpMs: number | null; // Largest Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  tbtMs: number | null; // Total Blocking Time
  fcpMs: number | null; // First Contentful Paint
  speedIndexMs: number | null;
};

export type FieldVitals = {
  overall: string | null; // FAST / AVERAGE / SLOW
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
};

export type FailedAudit = { id: string; score: number; weight: number; category: string; displayValue?: string };

export type PsiResult = {
  strategy: Strategy;
  scores: CategoryScores;
  lab: LabVitals;
  field: FieldVitals | null;
  failed: FailedAudit[];
  finalUrl: string | null;
};

type LhAudit = { score: number | null; numericValue?: number; displayValue?: string; scoreDisplayMode?: string };
type LhCategory = { score: number | null; auditRefs: { id: string; weight: number }[] };

const pct = (s: number | null | undefined) => (typeof s === "number" ? Math.round(s * 100) : null);
const num = (a?: LhAudit) => (a && typeof a.numericValue === "number" ? a.numericValue : null);

export async function runPagespeed(url: string, strategy: Strategy): Promise<PsiResult> {
  const q = new URLSearchParams({ url, strategy });
  for (const c of CATEGORIES) q.append("category", c);
  if (process.env.PAGESPEED_API_KEY) q.set("key", process.env.PAGESPEED_API_KEY);
  const res = await fetch(`${ENDPOINT}?${q}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("PageSpeed quota reached, try again later");
    if (msg.includes("FAILED_DOCUMENT_REQUEST") || msg.includes("ERRORED_DOCUMENT_REQUEST")) {
      throw new Error("Google couldn't load the page");
    }
    throw new Error(`PageSpeed error ${res.status}`);
  }
  const data = (await res.json()) as {
    lighthouseResult?: { finalDisplayedUrl?: string; finalUrl?: string; categories: Record<string, LhCategory>; audits: Record<string, LhAudit> };
    loadingExperience?: { overall_category?: string; metrics?: Record<string, { percentile?: number }> };
  };
  const lh = data.lighthouseResult;
  if (!lh) throw new Error("PageSpeed returned no result");
  const cat = lh.categories;
  const audits = lh.audits;

  const failed: FailedAudit[] = [];
  for (const [catId, c] of Object.entries(cat)) {
    for (const ref of c.auditRefs) {
      const a = audits[ref.id];
      if (!a || a.score == null || a.scoreDisplayMode === "informative" || a.scoreDisplayMode === "notApplicable") continue;
      if (a.score < 0.9) failed.push({ id: ref.id, score: a.score, weight: ref.weight, category: catId, displayValue: a.displayValue });
    }
  }
  // opportunities (weight 0 in Lighthouse) still matter for speed; keep the main ones
  for (const id of ["render-blocking-resources", "uses-optimized-images", "modern-image-formats", "uses-responsive-images", "offscreen-images", "unused-javascript", "unused-css-rules", "server-response-time", "uses-text-compression", "font-display"]) {
    const a = audits[id];
    if (a && a.score != null && a.score < 0.9 && !failed.some((f) => f.id === id)) {
      failed.push({ id, score: a.score, weight: 1, category: "performance", displayValue: a.displayValue });
    }
  }

  const m = data.loadingExperience?.metrics;
  const field: FieldVitals | null = m
    ? {
        overall: data.loadingExperience?.overall_category ?? null,
        lcpMs: m.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
        cls: m.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null ? m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : null,
        inpMs: m.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
      }
    : null;

  return {
    strategy,
    finalUrl: lh.finalDisplayedUrl || lh.finalUrl || null,
    scores: {
      performance: pct(cat.performance?.score),
      seo: pct(cat.seo?.score),
      accessibility: pct(cat.accessibility?.score),
      bestPractices: pct(cat["best-practices"]?.score),
    },
    lab: {
      lcpMs: num(audits["largest-contentful-paint"]),
      cls: num(audits["cumulative-layout-shift"]),
      tbtMs: num(audits["total-blocking-time"]),
      fcpMs: num(audits["first-contentful-paint"]),
      speedIndexMs: num(audits["speed-index"]),
    },
    field,
    failed,
  };
}
