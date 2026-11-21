import Link from "next/link";
import { redirect } from "next/navigation";
import { gte, desc, eq, and, sql } from "drizzle-orm";
import { Plus, Gauge, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { db, contacts, deals, posts } from "@/lib/cms/db";
import {
  needsReply,
  followUpsDue,
  pipelineCounts,
  pipelineValues,
  winRate,
  medianReplyHours,
} from "@/lib/cms/queries/deals";
import { OPEN_STAGES, STAGE_LABELS, REPLY_DUE_HOURS, PIPELINE_TZ, type Stage } from "@/lib/pipeline/constants";
import { channelOf, landingBlogPost } from "@/lib/pipeline/sources";
import type { EnquirySource } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { ago, money, serviceLabel, followUpLabel, TONE_STYLES } from "./pipeline/ui";

/** Midnight on the 1st of this month in the pipeline's timezone, as a Date. */
function startOfMonth(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: PIPELINE_TZ, year: "numeric", month: "2-digit" }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  // offset of the timezone right now, e.g. "+08:00"
  const off = new Intl.DateTimeFormat("en", { timeZone: PIPELINE_TZ, timeZoneName: "longOffset" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")!
    .value.replace("GMT", "") || "+00:00";
  return new Date(`${y}-${m}-01T00:00:00${off === "" ? "Z" : off}`);
}

const days = (n: number) => new Date(Date.now() - n * 86_400_000);

export default async function TodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  const [canDeals, canValue, canContacts, canAudits] = await Promise.all([
    sessionHasPermission(role, "deals:read"),
    sessionHasPermission(role, "deals:value"),
    sessionHasPermission(role, "contacts:read"),
    sessionHasPermission(role, "audits:create"),
  ]);

  const firstName = (session.user.name || "").split(" ")[0];
  const base = `/${locale}/admin`;

  if (!canDeals) {
    const [drafts] = await db.select({ n: sql<number>`count(*)::int` }).from(posts).where(eq(posts.status, "draft"));
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Hi{firstName ? ` ${firstName}` : ""}</h1>
        <Link href={`${base}/posts?status=draft`} className="inline-block rounded-lg border bg-card p-4 hover:bg-accent">
          <div className="text-sm text-muted-foreground">Draft posts</div>
          <div className="text-2xl font-semibold">{drafts.n}</div>
        </Link>
      </div>
    );
  }

  const monthStart = startOfMonth();
  const [late, due, counts, values, rate, median, recentContacts, auditDeals, [drafts]] = await Promise.all([
    needsReply(10),
    followUpsDue(10),
    pipelineCounts(),
    pipelineValues(monthStart),
    winRate(days(90)),
    medianReplyHours(days(30)),
    canContacts
      ? db.select({ source: contacts.source, createdAt: contacts.createdAt }).from(contacts).where(gte(contacts.createdAt, days(90))).orderBy(desc(contacts.createdAt))
      : Promise.resolve([] as { source: unknown; createdAt: Date }[]),
    db.select({ n: sql<number>`count(*)::int` }).from(deals).where(and(eq(deals.source, "audit"), gte(deals.createdAt, days(90)))),
    db.select({ n: sql<number>`count(*)::int` }).from(posts).where(eq(posts.status, "draft")),
  ]);

  const countOf = (s: Stage) => counts.find((c) => c.stage === s)?.n ?? 0;
  const openCount = OPEN_STAGES.reduce((n, s) => n + countOf(s), 0);
  const wonThisMonth = values.won.reduce((n, r) => n + r.n, 0);
  const fmt = (rows: { currency: string; total: number }[]) =>
    rows.filter((r) => r.total > 0).map((r) => money(r.total, r.currency)).join(" + ") || null;
  const decided = rate.won + rate.lost;

  const channels = new Map<string, number>();
  const posts30 = new Map<string, number>();
  for (const c of recentContacts) {
    const src = c.source as EnquirySource | null;
    const ch = channelOf(src);
    channels.set(ch, (channels.get(ch) ?? 0) + 1);
    const post = landingBlogPost(src);
    if (post) posts30.set(post, (posts30.get(post) ?? 0) + 1);
  }
  if (auditDeals[0]?.n) channels.set("Website audit tool", auditDeals[0].n);
  const channelRows = [...channels].sort((a, b) => b[1] - a[1]);
  const channelMax = Math.max(1, ...channelRows.map((r) => r[1]));
  const enquiries30 = recentContacts.filter((c) => c.createdAt >= days(30)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{greeting()}{firstName ? `, ${firstName}` : ""}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {late.length || due.length
              ? `${late.length} waiting for a reply, ${due.length} follow-up${due.length === 1 ? "" : "s"} due.`
              : "Nobody is waiting on you. Good time to reach out to someone new."}
          </p>
        </div>
        <div className="flex gap-2">
          {canAudits && (
            <Button asChild variant="outline">
              <Link href={`${base}/audits`}><Gauge className="size-4" /> Audit a website</Link>
            </Button>
          )}
          <Button asChild>
            <Link href={`${base}/pipeline/new`}><Plus className="size-4" /> Add deal</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Waiting for a reply" href={`${base}/pipeline?view=list&stage=new`} empty="Everyone has a reply.">
          {late.map((d) => {
            const hours = (Date.now() - new Date(d.createdAt).getTime()) / 3600_000;
            return (
              <ItemLink key={d.id} href={`${base}/pipeline/${d.id}`} title={d.company || d.name} sub={serviceLabel(d.service)}>
                <span className={hours > REPLY_DUE_HOURS ? "font-medium text-red-600" : "text-muted-foreground"}>{ago(d.createdAt)}</span>
              </ItemLink>
            );
          })}
        </Panel>
        <Panel title="Follow-ups due" href={`${base}/pipeline?view=list&due=1`} empty="No follow-ups due today.">
          {due.map((d) => {
            const f = followUpLabel(d.nextFollowUpAt);
            return (
              <ItemLink key={d.id} href={`${base}/pipeline/${d.id}`} title={d.company || d.name} sub={STAGE_LABELS[d.stage as Stage]}>
                <span className={f ? TONE_STYLES[f.tone] : ""}>{f?.text}</span>
              </ItemLink>
            );
          })}
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Tile label="Open deals" value={String(openCount)} sub={canValue ? fmt(values.open) ?? "No values set" : OPEN_STAGES.map((s) => `${countOf(s)} ${STAGE_LABELS[s].toLowerCase()}`).join(" · ")} href={`${base}/pipeline`} />
        <Tile label="Won this month" value={String(wonThisMonth)} sub={canValue ? fmt(values.won) ?? "–" : undefined} />
        <Tile label="Win rate, 90 days" value={decided ? `${Math.round((rate.won / decided) * 100)}%` : "–"} sub={decided ? `${rate.won} won of ${decided} decided` : "No decided deals yet"} />
        <Tile label="Median first reply" value={median == null ? "–" : median < 1 ? `${Math.round(median * 60)} min` : `${median.toFixed(median < 10 ? 1 : 0)} h`} sub="Last 30 days · promise is 1 business day" />
        <Tile label="Enquiries, 30 days" value={String(enquiries30)} sub={`${recentContacts.length} in 90 days`} href={canContacts ? `${base}/contacts` : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border bg-card p-4">
          <h2 className="text-base font-bold">Where enquiries come from</h2>
          <p className="mb-3 text-xs text-muted-foreground">Last 90 days, from the page they first landed on and the site that sent them.</p>
          {channelRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enquiries in the last 90 days.</p>
          ) : (
            <ul className="space-y-2">
              {channelRows.map(([name, n]) => (
                <li key={name} className="grid grid-cols-[140px_1fr_32px] items-center gap-3 text-sm">
                  <span className="truncate">{name}</span>
                  <span className="h-2 rounded-full bg-muted">
                    <span className="block h-2 rounded-full bg-primary" style={{ width: `${(n / channelMax) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-lg border bg-card p-4">
          <h2 className="text-base font-bold">Blog posts that led to enquiries</h2>
          <p className="mb-3 text-xs text-muted-foreground">Last 90 days. Write more like these.</p>
          {posts30.size === 0 ? (
            <p className="text-sm text-muted-foreground">None yet. Enquiries that start on a blog post will show here.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {[...posts30].sort((a, b) => b[1] - a[1]).map(([slug, n]) => (
                <li key={slug} className="flex justify-between gap-3">
                  <a href={`/en/blog/${slug}`} target="_blank" rel="noreferrer" className="truncate hover:underline">{slug.replace(/-/g, " ")}</a>
                  <span className="tabular-nums text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`${base}/posts?status=draft`} className="mt-4 flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm hover:bg-muted">
            <span>{drafts.n} draft post{drafts.n === 1 ? "" : "s"} waiting</span>
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en", { timeZone: PIPELINE_TZ, hour: "numeric", hour12: false }).format(new Date()));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Panel({ title, href, empty, children }: { title: string; href: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold">{title}</h2>
        <Link href={href} className="text-xs font-bold text-primary hover:underline">See all →</Link>
      </div>
      {children.length === 0 ? <p className="py-3 text-sm text-muted-foreground">{empty}</p> : <ul className="divide-y">{children}</ul>}
    </section>
  );
}

function ItemLink({ href, title, sub, children }: { href: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-accent">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{title}</span>
          <span className="block truncate text-xs text-muted-foreground">{sub}</span>
        </span>
        <span className="shrink-0 text-xs">{children}</span>
      </Link>
    </li>
  );
}

function Tile({ label, value, sub, href }: { label: string; value: string; sub?: string; href?: string }) {
  const body = (
    <>
      <div className="label-mono text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">{value}</div>
      {sub && <div className="mt-1 truncate text-xs text-muted-foreground" title={sub}>{sub}</div>}
    </>
  );
  return href ? (
    <Link href={href} className="rounded-lg border bg-card p-4 hover:bg-accent">{body}</Link>
  ) : (
    <div className="rounded-lg border bg-card p-4">{body}</div>
  );
}
