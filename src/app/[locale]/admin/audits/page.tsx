import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, ExternalLink, UserPlus } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { listAudits } from "@/lib/cms/queries/audits";
import { listDeals } from "@/lib/cms/queries/deals";
import { SITE } from "@/lib/notify";
import { ago } from "../pipeline/ui";
import { NewAuditForm, CopyLink, RowActions, AutoRefresh } from "./AuditClient";

export const dynamic = "force-dynamic";

function ScoreBadge({ n, status }: { n: number | null; status: string }) {
  if (status === "queued" || status === "running") {
    return <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 animate-pulse">Running</span>;
  }
  if (status === "failed" || n == null) {
    return <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">Failed</span>;
  }
  const tone = n >= 90 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : n >= 50 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-700";
  return <span className={`inline-flex min-w-9 justify-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${tone}`}>{n}</span>;
}

export default async function AuditsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ url?: string; deal?: string; show?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  if (!(await sessionHasPermission(role, "audits:read"))) redirect(`/${locale}/admin`);
  const [canCreate, canDeals] = await Promise.all([sessionHasPermission(role, "audits:create"), sessionHasPermission(role, "deals:read")]);

  const show = sp.show === "public" || sp.show === "admin" ? sp.show : undefined;
  const [rows, openDeals] = await Promise.all([
    listAudits({ origin: show }),
    canCreate && canDeals ? listDeals({ stage: "open" }) : Promise.resolve([]),
  ]);
  const dealOptions = openDeals.map((r) => ({ id: r.deal.id, label: r.deal.company ? `${r.deal.company} (${r.deal.name})` : r.deal.name }));
  const pending = rows.some((r) => r.audit.status === "queued" || r.audit.status === "running");
  const base = `/${locale}/admin/audits`;
  const tab = (key: string | undefined, label: string) => (
    <Link
      href={key ? `${base}?show=${key}` : base}
      className={`rounded-full border px-3 py-1 text-sm ${show === key ? "border-foreground bg-foreground text-background" : "hover:bg-muted"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-5">
      <AutoRefresh active={pending} />
      <div>
        <h1 className="text-2xl font-semibold">Website audits</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Check any site for speed, search and accessibility problems and get a shareable report in plain English. Send the
          link to a prospect: you&apos;ll see here when they open it, and the deal gets a note.
        </p>
      </div>

      {canCreate && <NewAuditForm defaultUrl={sp.url} defaultDeal={sp.deal} deals={dealOptions} />}

      <div className="flex flex-wrap gap-2">
        {tab(undefined, "All")}
        {tab("admin", "Made by us")}
        {tab("public", "From the public tool")}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No audits yet.</p>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {rows.map(({ audit: a, dealName, dealCompany, createdByName }) => {
            const share = `${SITE}/en/website-audit/r/${a.token}`;
            const who = a.origin === "public" ? a.requesterName || a.requesterEmail || "Website visitor" : a.preparedFor;
            return (
              <li key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <ScoreBadge n={a.overall} status={a.status} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="truncate font-medium">{a.host}</span>
                      {who && <span className="truncate text-sm text-muted-foreground">for {who}</span>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{a.origin === "public" ? "Public tool" : `By ${createdByName ?? "the team"}`}, {ago(a.createdAt)} ago</span>
                      {a.dealId && (
                        <Link href={`/${locale}/admin/pipeline/${a.dealId}`} className="text-primary hover:underline">
                          Deal: {dealCompany || dealName}
                        </Link>
                      )}
                      {a.origin === "admin" && (
                        <span className={`inline-flex items-center gap-1 ${a.views ? "font-medium text-emerald-700" : ""}`}>
                          <Eye className="size-3" />
                          {a.views ? `Opened ${a.views}× · last ${ago(a.lastViewedAt)} ago` : "Not opened yet"}
                        </span>
                      )}
                      {a.status === "failed" && a.error && <span className="text-red-700">{a.error.split("\n")[0]}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                  {a.status === "done" && <CopyLink url={share} />}
                  <a
                    href={`/en/website-audit/r/${a.token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-sm hover:bg-muted"
                  >
                    <ExternalLink className="size-3.5" /> Open
                  </a>
                  {canCreate && canDeals && !a.dealId && (
                    <Link
                      href={`/${locale}/admin/pipeline/new?website=${encodeURIComponent(a.url)}&source=outreach${a.preparedFor ? `&company=${encodeURIComponent(a.preparedFor)}` : ""}`}
                      className="inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-sm hover:bg-muted"
                    >
                      <UserPlus className="size-3.5" /> Add as deal
                    </Link>
                  )}
                  {canCreate && <RowActions id={a.id} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
