// Runs a full website audit: PageSpeed (mobile + desktop) and our HTML checks in parallel.
// Each part can fail on its own; the result keeps whatever succeeded plus the errors.

import { runPagespeed, type PsiResult, type CategoryScores, type LabVitals, type FieldVitals } from "./pagespeed";
import { runHtmlChecks, type Check } from "./html-checks";
import { FIXES, fixForLighthouse, type Fix } from "./fixes";
import { overallScore, checksScore } from "./score";
import { assertPublicUrl, normaliseUrl } from "./safe-fetch";

export type FixItem = Fix & { id: string; detail?: string };

export type AuditResult = {
  url: string;
  finalUrl: string;
  scores: { mobile: CategoryScores | null; desktop: CategoryScores | null };
  vitals: { lab: LabVitals | null; field: FieldVitals | null };
  checks: Check[];
  fixes: FixItem[];
  overall: number | null;
  errors: string[];
};

const MAX_FIXES = 12;

function buildFixes(checks: Check[], psi: PsiResult[]): FixItem[] {
  const out = new Map<string, FixItem & { rank: number }>();
  for (const c of checks) {
    if (c.pass) continue;
    const f = FIXES[c.id];
    if (f) out.set(c.id, { ...f, id: c.id, detail: c.value, rank: f.impact * 10 });
  }
  // our own checks already cover these, don't list twice
  const covered: Record<string, string> = { "document-title": "title", "meta-description": "meta-description", "image-alt": "image-alt", "html-has-lang": "lang", "robots-txt": "robots-txt", "is-on-https": "https", viewport: "viewport" };
  for (const r of psi) {
    for (const a of r.failed) {
      if (covered[a.id] && out.has(covered[a.id])) continue;
      const f = fixForLighthouse(a.id);
      if (!f) continue;
      const rank = f.impact * 10 + Math.min(a.weight, 10) + (1 - a.score) * 5 + (r.strategy === "mobile" ? 1 : 0);
      const prev = out.get(a.id);
      if (!prev || prev.rank < rank) out.set(a.id, { ...f, id: a.id, detail: a.displayValue, rank });
    }
  }
  return [...out.values()]
    .sort((a, b) => b.rank - a.rank)
    .slice(0, MAX_FIXES)
    .map((f) => {
      const { rank, ...rest } = f;
      void rank;
      return rest;
    });
}

export async function runAudit(input: string): Promise<AuditResult> {
  const url = normaliseUrl(input);
  await assertPublicUrl(url); // throws UnsafeUrlError with a visitor-friendly message

  const [mobile, desktop, html] = await Promise.allSettled([runPagespeed(url, "mobile"), runPagespeed(url, "desktop"), runHtmlChecks(url)]);
  const errors: string[] = [];
  const msg = (r: PromiseRejectedResult) => (r.reason instanceof Error ? r.reason.message : String(r.reason));
  if (mobile.status === "rejected") errors.push(`Mobile speed test: ${msg(mobile)}`);
  if (desktop.status === "rejected") errors.push(`Desktop speed test: ${msg(desktop)}`);
  if (html.status === "rejected") errors.push(`Page checks: ${msg(html)}`);

  const m = mobile.status === "fulfilled" ? mobile.value : null;
  const d = desktop.status === "fulfilled" ? desktop.value : null;
  const checks = html.status === "fulfilled" ? html.value.checks : [];

  if (!m && !d && !checks.length) {
    throw new Error(errors.join(" ") || "The audit couldn't load the site.");
  }

  return {
    url,
    finalUrl: (html.status === "fulfilled" && html.value.finalUrl) || m?.finalUrl || d?.finalUrl || url,
    scores: { mobile: m?.scores ?? null, desktop: d?.scores ?? null },
    vitals: { lab: m?.lab ?? d?.lab ?? null, field: m?.field ?? d?.field ?? null },
    checks,
    fixes: buildFixes(checks, [m, d].filter((x): x is PsiResult => Boolean(x))),
    overall: overallScore(m?.scores) ?? overallScore(d?.scores) ?? checksScore(checks),
    errors,
  };
}
