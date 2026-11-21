import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { listDeals } from "@/lib/cms/queries/deals";
import { OPEN_STAGES, SERVICES, STAGE_LABELS, REPLY_DUE_HOURS, type Stage } from "@/lib/pipeline/constants";
import { Button } from "@/components/ui/button";
import { StagePill, serviceLabel, sourceLabel, money, ago, followUpLabel, TONE_STYLES } from "./ui";
import StageSelect from "./StageSelect";

type Row = Awaited<ReturnType<typeof listDeals>>[number];

export default async function PipelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string; stage?: string; service?: string; due?: string; q?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  if (!(await sessionHasPermission(role, "deals:read"))) redirect(`/${locale}/admin`);
  const [canEdit, canValue] = await Promise.all([
    sessionHasPermission(role, "deals:update"),
    sessionHasPermission(role, "deals:value"),
  ]);

  const view = sp.view === "list" ? "list" : "board";
  const stageFilter = sp.stage && (sp.stage === "open" || sp.stage in STAGE_LABELS) ? (sp.stage as Stage | "open") : undefined;
  const rows = await listDeals({
    stage: view === "board" ? undefined : stageFilter,
    service: sp.service && (SERVICES as readonly string[]).includes(sp.service) ? sp.service : undefined,
    due: sp.due === "1",
    q: sp.q?.trim() || undefined,
  });

  const base = `/${locale}/admin/pipeline`;
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { view: sp.view, stage: sp.stage, service: sp.service, due: sp.due, q: sp.q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };

  const byStage = (s: Stage) => rows.filter((r) => r.deal.stage === s);
  const recentClosed = (s: Stage) =>
    byStage(s)
      .sort((a, b) => +new Date(b.deal.closedAt ?? b.deal.updatedAt) - +new Date(a.deal.closedAt ?? a.deal.updatedAt))
      .slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every enquiry and prospect, from first message to won or lost.
          </p>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`${base}/new`}>
              <Plus className="size-4" /> Add deal
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form action={base} className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search name, email, company, website"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
          {view === "list" && <input type="hidden" name="view" value="list" />}
          {sp.service && <input type="hidden" name="service" value={sp.service} />}
        </form>
        <div className="flex rounded-md border p-0.5 text-sm">
          <Link href={qs({ view: undefined, stage: undefined })} className={`rounded px-3 py-1 ${view === "board" ? "bg-muted font-medium" : "text-muted-foreground"}`}>
            Board
          </Link>
          <Link href={qs({ view: "list" })} className={`rounded px-3 py-1 ${view === "list" ? "bg-muted font-medium" : "text-muted-foreground"}`}>
            List
          </Link>
        </div>
        <Link href={qs({ due: sp.due === "1" ? undefined : "1" })} className={`rounded-md border px-3 py-1.5 text-sm ${sp.due === "1" ? "border-red-300 bg-red-50 text-red-700" : "text-muted-foreground"}`}>
          Follow-up due
        </Link>
        <form action={base} className="flex items-center gap-2">
          {view === "list" && <input type="hidden" name="view" value="list" />}
          {sp.q && <input type="hidden" name="q" value={sp.q} />}
          <select name="service" defaultValue={sp.service ?? ""} className="h-9 rounded-md border bg-background px-2 text-sm">
            <option value="">All services</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{serviceLabel(s)}</option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">Filter</Button>
        </form>
      </div>

      {view === "board" ? (
        <div className="grid gap-3 lg:grid-cols-4">
          {OPEN_STAGES.map((s) => {
            const items = byStage(s);
            const total = canValue ? sumByCurrency(items) : "";
            return (
              <section key={s} className="flex min-h-40 flex-col rounded-lg border bg-muted/30">
                <header className="flex items-center justify-between border-b px-3 py-2">
                  <span className="label-mono flex items-center gap-2">{STAGE_LABELS[s]} <span className="rounded-full bg-foreground px-1.5 py-px text-[10px] text-background">{items.length}</span></span>
                  {total && <span className="text-xs text-muted-foreground">{total}</span>}
                </header>
                <div className="flex flex-col gap-2 p-2">
                  {items.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Nothing here</p>}
                  {items.map((r) => (
                    <DealCard key={r.deal.id} r={r} base={base} canEdit={canEdit} canValue={canValue} />
                  ))}
                </div>
              </section>
            );
          })}
          <div className="grid gap-3 lg:col-span-4 md:grid-cols-2">
            {(["won", "lost"] as Stage[]).map((s) => (
              <section key={s} className="rounded-lg border">
                <header className="flex items-center justify-between border-b px-3 py-2">
                  <span className="label-mono flex items-center gap-2">{STAGE_LABELS[s]} <span className="rounded-full bg-foreground px-1.5 py-px text-[10px] text-background">{byStage(s).length}</span></span>
                  <Link href={qs({ view: "list", stage: s })} className="text-xs text-primary hover:underline">See all</Link>
                </header>
                <ul className="divide-y">
                  {recentClosed(s).map((r) => (
                    <li key={r.deal.id}>
                      <Link href={`${base}/${r.deal.id}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-accent">
                        <span className="truncate">{r.deal.company || r.deal.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {s === "won" && canValue ? money(r.deal.valueAmount, r.deal.currency) : ago(r.deal.closedAt ?? r.deal.updatedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {byStage(s).length === 0 && <li className="px-3 py-3 text-xs text-muted-foreground">None yet</li>}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 text-sm">
            {[["", "All"], ["open", "Open"], ...Object.entries(STAGE_LABELS)].map(([v, l]) => (
              <Link key={v} href={qs({ stage: v || undefined })} className={`rounded-full border px-3 py-1 ${(sp.stage ?? "") === v ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                {l}
              </Link>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Who</th>
                  <th className="px-4 py-2 font-medium">Stage</th>
                  <th className="px-4 py-2 font-medium">Service</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  {canValue && <th className="px-4 py-2 font-medium">Value</th>}
                  <th className="px-4 py-2 font-medium">Follow-up</th>
                  <th className="px-4 py-2 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={7} className="h-24 text-center text-muted-foreground">No deals match</td></tr>
                )}
                {rows.map((r) => {
                  const f = followUpLabel(r.deal.nextFollowUpAt);
                  return (
                    <tr key={r.deal.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="px-4 py-2.5">
                        <Link href={`${base}/${r.deal.id}`} className="font-medium hover:underline">{r.deal.name}</Link>
                        <div className="text-xs text-muted-foreground">{[r.deal.company, r.deal.email].filter(Boolean).join(" · ")}</div>
                      </td>
                      <td className="px-4 py-2.5"><StagePill stage={r.deal.stage} /></td>
                      <td className="px-4 py-2.5">{serviceLabel(r.deal.service)}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{sourceLabel(r.deal.source)}</td>
                      {canValue && <td className="px-4 py-2.5">{money(r.deal.valueAmount, r.deal.currency) ?? "–"}</td>}
                      <td className={`px-4 py-2.5 ${f ? TONE_STYLES[f.tone] : "text-muted-foreground"}`}>{f?.text ?? "–"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{ago(r.lastActivityAt ?? r.deal.updatedAt)} ago</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function sumByCurrency(items: Row[]) {
  const sums = new Map<string, number>();
  for (const r of items) if (r.deal.valueAmount != null) sums.set(r.deal.currency, (sums.get(r.deal.currency) ?? 0) + r.deal.valueAmount);
  return [...sums].map(([c, v]) => money(v, c)).join(" + ");
}

function DealCard({ r, base, canEdit, canValue }: { r: Row; base: string; canEdit: boolean; canValue: boolean }) {
  const d = r.deal;
  const f = followUpLabel(d.nextFollowUpAt);
  const inbound = d.source === "contact_form" || d.source === "audit" || d.source === "imported";
  const waitingHours = inbound && d.stage === "new" && !d.firstRepliedAt ? (Date.now() - new Date(d.createdAt).getTime()) / 3600_000 : 0;
  const late = waitingHours > REPLY_DUE_HOURS;
  return (
    <article className={`rounded-md border bg-card p-2.5 text-sm shadow-sm ${late ? "border-red-300" : ""}`}>
      <Link href={`${base}/${d.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium leading-snug hover:underline">{d.company || d.name}</span>
          {canValue && d.valueAmount != null && <span className="shrink-0 text-xs font-medium">{money(d.valueAmount, d.currency)}</span>}
        </div>
        {d.company && <div className="text-xs text-muted-foreground">{d.name}</div>}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{serviceLabel(d.service)}</span>
          <span>·</span>
          <span>{sourceLabel(d.source)}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          {late ? (
            <span className="font-medium text-red-600">Waiting {ago(d.createdAt)} for a reply</span>
          ) : f ? (
            <span className={TONE_STYLES[f.tone]}>Follow up: {f.text}</span>
          ) : (
            <span className="text-muted-foreground">{ago(r.lastActivityAt ?? d.updatedAt)} ago</span>
          )}
        </div>
      </Link>
      {canEdit && (
        <div className="mt-2">
          <StageSelect dealId={d.id} stage={d.stage} compact />
        </div>
      )}
    </article>
  );
}
