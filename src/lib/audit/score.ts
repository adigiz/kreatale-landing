import type { CategoryScores } from "./pagespeed";

/** Overall score = mean of the mobile category scores we have (most visitors are on phones). */
export function overallScore(s: CategoryScores | null | undefined): number | null {
  if (!s) return null;
  const vals = [s.performance, s.seo, s.accessibility, s.bestPractices].filter((v): v is number => typeof v === "number");
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

/** Overall from our own checks when PageSpeed failed: share of checks passed. */
export function checksScore(checks: { pass: boolean }[]): number | null {
  return checks.length ? Math.round((checks.filter((c) => c.pass).length / checks.length) * 100) : null;
}

export type Grade = "good" | "ok" | "poor";
export const grade = (n: number | null | undefined): Grade | null => (n == null ? null : n >= 90 ? "good" : n >= 50 ? "ok" : "poor");
