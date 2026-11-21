/* eslint-disable @next/next/no-html-link-for-pages -- redesign pages need a full page load to boot their scripts */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditByToken } from "@/lib/cms/queries/audits";
import type { CategoryScores, LabVitals, FieldVitals } from "@/lib/audit/pagespeed";
import type { Check, CheckId } from "@/lib/audit/html-checks";
import type { FixItem } from "@/lib/audit/run";
import ReportClient from "./ReportClient";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ locale: string; token: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const a = await getAuditByToken(token);
  return {
    title: a ? `Website report for ${a.host}` : "Website report",
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: null },
  };
}

const CHECK_LABELS: Record<CheckId, string> = {
  https: "Secure connection (HTTPS)",
  "http-redirect": "http:// sends visitors to https://",
  title: "Page title length",
  "meta-description": "Search result description",
  viewport: "Fits phone screens",
  lang: "Page language set",
  canonical: "Canonical address",
  "og-tags": "Preview when shared on social apps",
  "single-h1": "One main heading",
  "structured-data": "Business details for Google",
  "image-alt": "Images described with alt text",
  favicon: "Favicon",
  "robots-txt": "robots.txt",
  sitemap: "XML sitemap",
};

const CATS: { key: keyof CategoryScores; label: string; what: string }[] = [
  { key: "performance", label: "Speed", what: "How fast the page loads and responds" },
  { key: "seo", label: "Search basics", what: "Whether Google can read and list the page properly" },
  { key: "accessibility", label: "Accessibility", what: "Whether everyone, including people using screen readers, can use it" },
  { key: "bestPractices", label: "Best practices", what: "Security and modern web standards" },
];

const tone = (n: number | null | undefined) =>
  n == null ? "text-zinc-400" : n >= 90 ? "text-emerald-600" : n >= 50 ? "text-amber-600" : "text-red-600";
const ring = (n: number | null | undefined) => (n == null ? "#d4d4d8" : n >= 90 ? "#059669" : n >= 50 ? "#d97706" : "#dc2626");
const verdict = (n: number | null) =>
  n == null ? "" : n >= 90 ? "In good shape" : n >= 50 ? "Decent, with clear room to improve" : "Needs work: visitors and Google are likely noticing";

function Gauge({ n, size = 120, stroke = 10 }: { n: number | null; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = n ?? 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={n == null ? "No score" : `Score ${n} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f4f4f5" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={ring(n)}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(v / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.3} fontWeight={700} fill="#111">
        {n ?? "–"}
      </text>
    </svg>
  );
}

type Vital = { label: string; value: string; good: boolean | null; poor: boolean; hint: string };
function vitals(lab: LabVitals | null, field: FieldVitals | null): { source: "field" | "lab"; items: Vital[] } | null {
  const s = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
  if (field && (field.lcpMs != null || field.inpMs != null)) {
    const items: Vital[] = [];
    if (field.lcpMs != null) items.push({ label: "Main content appears", value: s(field.lcpMs), good: field.lcpMs <= 2500, poor: field.lcpMs > 4000, hint: "Good is under 2.5 s" });
    if (field.inpMs != null) items.push({ label: "Reacts to taps and clicks", value: `${Math.round(field.inpMs)} ms`, good: field.inpMs <= 200, poor: field.inpMs > 500, hint: "Good is under 200 ms" });
    if (field.cls != null) items.push({ label: "Layout stays still", value: field.cls.toFixed(2), good: field.cls <= 0.1, poor: field.cls > 0.25, hint: "Good is under 0.1" });
    return { source: "field", items };
  }
  if (!lab) return null;
  const items: Vital[] = [];
  if (lab.fcpMs != null) items.push({ label: "First thing on screen", value: s(lab.fcpMs), good: lab.fcpMs <= 1800, poor: lab.fcpMs > 3000, hint: "Good is under 1.8 s" });
  if (lab.lcpMs != null) items.push({ label: "Main content appears", value: s(lab.lcpMs), good: lab.lcpMs <= 2500, poor: lab.lcpMs > 4000, hint: "Good is under 2.5 s" });
  if (lab.tbtMs != null) items.push({ label: "Time the page is frozen", value: `${Math.round(lab.tbtMs)} ms`, good: lab.tbtMs <= 200, poor: lab.tbtMs > 600, hint: "Good is under 200 ms" });
  if (lab.cls != null) items.push({ label: "Layout stays still", value: lab.cls.toFixed(2), good: lab.cls <= 0.1, poor: lab.cls > 0.25, hint: "Good is under 0.1" });
  return { source: "lab", items };
}

const AREA_LABEL: Record<FixItem["area"], string> = { speed: "Speed", search: "Search", access: "Accessibility", trust: "Trust" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <a href="/en" aria-label="Kreatale home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kreatale-logo-primary.svg" alt="Kreatale" className="h-7 w-auto" />
          </a>
          <a href="/en/contact" className="rounded-full bg-[#0061FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052d9]">
            Talk to us
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">{children}</main>
      <footer className="mx-auto max-w-4xl px-4 pb-10 text-xs leading-relaxed text-zinc-500">
        Scores come from Google PageSpeed Insights (Lighthouse) on a simulated mid-range phone, plus our own checks of the page.
        They move a little between runs. This link is private: only people you share it with can see the report.
      </footer>
    </div>
  );
}

export default async function AuditReportPage({ params }: Params) {
  const { token } = await params;
  const a = await getAuditByToken(token);
  if (!a) notFound();
  const pending = a.status === "queued" || a.status === "running";
  const date = new Date(a.completedAt ?? a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  if (pending) {
    return (
      <Shell>
        <ReportClient token={token} pending />
        <div className="rounded-2xl border bg-white p-10 text-center">
          <div className="mx-auto mb-5 size-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#0061FF]" />
          <h1 className="text-2xl font-bold">Checking {a.host}…</h1>
          <p className="mt-2 text-zinc-600">Google is loading the site on a phone and a desktop. This usually takes under a minute; the page updates by itself.</p>
        </div>
      </Shell>
    );
  }

  if (a.status === "failed") {
    return (
      <Shell>
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h1 className="text-2xl font-bold">We couldn&apos;t check {a.host}</h1>
          <p className="mt-2 text-zinc-600">{a.error?.split("\n")[0] || "The site didn't respond in time."}</p>
          <a href="/en/website-audit" className="mt-6 inline-block rounded-full bg-[#0061FF] px-5 py-2.5 font-semibold text-white">
            Try again
          </a>
        </div>
      </Shell>
    );
  }

  const scores = a.scores as { mobile: CategoryScores | null; desktop: CategoryScores | null } | null;
  const v = a.vitals as { lab: LabVitals | null; field: FieldVitals | null } | null;
  const checks = (a.checks as Check[] | null) ?? [];
  const fixes = (a.fixes as FixItem[] | null) ?? [];
  const vit = vitals(v?.lab ?? null, v?.field ?? null);
  const passed = checks.filter((c) => c.pass).length;
  const partial = Boolean(a.error);
  const speedMissing = !scores?.mobile && !scores?.desktop;

  return (
    <Shell>
      <ReportClient token={token} pending={false} />

      <section className="flex flex-col items-center gap-6 rounded-2xl border bg-white p-6 sm:flex-row sm:p-8">
        <Gauge n={a.overall} size={140} stroke={12} />
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-[#0061FF]">Website report{a.preparedFor ? ` for ${a.preparedFor}` : ""}</p>
          <h1 className="mt-1 text-xl font-bold [overflow-wrap:anywhere] sm:text-3xl">{a.host}</h1>
          {speedMissing ? (
            <p className="mt-2 font-semibold text-zinc-600">Page checks score (speed not measured this time)</p>
          ) : (
            <p className={`mt-2 font-semibold ${tone(a.overall)}`}>{verdict(a.overall)}</p>
          )}
          <p className="mt-1 text-sm text-zinc-500">Checked on {date}</p>
        </div>
      </section>

      {partial && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {speedMissing
            ? "Google's speed test didn't respond this time, so this report covers the page checks only. Speed and accessibility scores will show when the site is checked again."
            : "Part of Google's test didn't finish, so some scores are missing. The rest of the report is complete."}
        </p>
      )}

      {scores?.mobile && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Scores on a phone</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATS.map((c) => (
              <div key={c.key} className="flex flex-col items-center rounded-2xl border bg-white p-4 text-center">
                <Gauge n={scores.mobile![c.key]} size={84} stroke={8} />
                <p className="mt-2 font-semibold">{c.label}</p>
                <p className="mt-1 text-xs leading-snug text-zinc-500">{c.what}</p>
                {scores.desktop && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Desktop: <span className={`font-semibold ${tone(scores.desktop[c.key])}`}>{scores.desktop[c.key] ?? "–"}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {vit && vit.items.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">How it feels to visitors</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {vit.source === "field" ? "Measured from real Chrome visitors over the last 28 days." : "Measured in a test on a simulated phone."}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vit.items.map((i) => (
              <div key={i.label} className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-zinc-600">{i.label}</p>
                <p className={`mt-1 text-2xl font-bold tabular-nums ${i.good ? "text-emerald-600" : i.poor ? "text-red-600" : "text-amber-600"}`}>{i.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{i.hint}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {fixes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">What to fix first</h2>
          <ol className="mt-3 space-y-3">
            {fixes.map((f, i) => (
              <li key={f.id} className="flex gap-4 rounded-2xl border bg-white p-4 sm:p-5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0061FF] text-sm font-bold text-white">{i + 1}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{f.title}</p>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{AREA_LABEL[f.area]}</span>
                    {f.impact === 3 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">High impact</span>}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{f.why}</p>
                  {f.detail && <p className="mt-1 break-words text-xs text-zinc-500">Found: {f.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {checks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">
            Page checks <span className="font-normal text-zinc-500">({passed} of {checks.length} passed)</span>
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm">
                <span
                  aria-label={c.pass ? "Passed" : "Needs fixing"}
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.pass ? "bg-emerald-600" : "bg-red-600"}`}
                >
                  {c.pass ? "✓" : "!"}
                </span>
                <span className="min-w-0">
                  {CHECK_LABELS[c.id] ?? c.id}
                  {c.value && !c.pass && <span className="block break-words text-xs text-zinc-500">{c.value}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-2xl bg-zinc-900 p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">Want these fixed?</h2>
        <p className="mt-2 max-w-xl text-zinc-300">
          Kreatale designs and builds websites, online stores and apps. Tell us about your site and we&apos;ll reply within one business day with what we&apos;d fix
          first and how.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/en/contact" className="rounded-full bg-[#0061FF] px-5 py-2.5 font-semibold text-white hover:bg-[#0052d9]">
            Talk to us about it
          </a>
          <a href="/en/website-audit" className="rounded-full border border-white/30 px-5 py-2.5 font-semibold text-white hover:bg-white/10">
            Check another site
          </a>
        </div>
      </section>
    </Shell>
  );
}
