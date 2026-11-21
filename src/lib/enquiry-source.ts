import type { EnquirySource } from "@/lib/notify";

// Keeps only short strings from what the browser sent about where the visitor came from.
export function cleanSource(raw: unknown): EnquirySource | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max = 300) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
  const utm: Record<string, string> = {};
  if (r.utm && typeof r.utm === "object") {
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]) {
      const v = str((r.utm as Record<string, unknown>)[k], 120);
      if (v) utm[k] = v;
    }
  }
  const out: EnquirySource = {
    landingPage: str(r.landingPage),
    referrer: str(r.referrer),
    formPage: str(r.formPage),
    utm: Object.keys(utm).length ? utm : undefined,
  };
  return Object.values(out).some(Boolean) ? out : undefined;
}
