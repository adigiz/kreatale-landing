import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, Building2, Gauge } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { getDeal, ownerOptions } from "@/lib/cms/queries/deals";
import { listTemplates } from "@/lib/cms/queries/templates";
import { LOST_REASON_LABELS, STAGE_LABELS, type LostReason, type Stage } from "@/lib/pipeline/constants";
import { firstNameOf } from "@/lib/pipeline/templates";
import { sourceLine, type EnquirySource } from "@/lib/notify";
import StageSelect from "../StageSelect";
import ReplyPanel from "./ReplyPanel";
import { FollowUpPicker, NoteBox, EditDeal, DeleteDeal } from "./DealControls";
import { StagePill, serviceLabel, sourceLabel, money, ago } from "../ui";

export default async function DealPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  if (!(await sessionHasPermission(role, "deals:read"))) redirect(`/${locale}/admin`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [data, canEdit, canValue, canDelete, canAudit] = await Promise.all([
    getDeal(id),
    sessionHasPermission(role, "deals:update"),
    sessionHasPermission(role, "deals:value"),
    sessionHasPermission(role, "deals:delete"),
    sessionHasPermission(role, "audits:create"),
  ]);
  if (!data) notFound();
  const { deal: d, ownerName, activities, linkedContacts } = data;
  const [templates, owners] = await Promise.all([canEdit ? listTemplates() : [], canEdit ? ownerOptions() : []]);

  const site = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "https://kreatale.com";
  const latestAudit = activities.find((a) => a.a.type === "audit" && (a.a.meta as { token?: string } | null)?.token);
  const auditToken = (latestAudit?.a.meta as { token?: string } | null)?.token;
  const senderName = session.user.name || "";
  const vars = {
    firstName: firstNameOf(d.name),
    name: d.name,
    company: d.company ?? "",
    service: serviceLabel(d.service).toLowerCase(),
    website: d.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "",
    auditUrl: auditToken ? `${site}/en/website-audit/r/${auditToken}` : "",
    senderName,
    senderFirstName: firstNameOf(senderName),
  };

  return (
    <div className="space-y-5">
      <Link href={`/${locale}/admin/pipeline`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Pipeline
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{d.company || d.name}</h1>
            <StagePill stage={d.stage} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {d.company ? `${d.name} · ` : ""}{serviceLabel(d.service)} · {sourceLabel(d.source)} · added {ago(d.createdAt)} ago
          </p>
        </div>
        {canEdit && (
          <EditDeal
            dealId={d.id}
            locale={locale}
            owners={owners}
            canValue={canValue}
            initial={{
              name: d.name,
              email: d.email ?? "",
              company: d.company ?? "",
              phone: d.phone ?? "",
              website: d.website ?? "",
              service: d.service,
              ownerId: d.ownerId ?? "",
              valueAmount: d.valueAmount != null ? String(d.valueAmount) : "",
              currency: d.currency,
            }}
          />
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <section className="rounded-lg border bg-card p-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              {d.email && <a href={`mailto:${d.email}`} className="flex items-center gap-2 hover:underline"><Mail className="size-4 text-muted-foreground" />{d.email}</a>}
              {d.phone && <a href={`tel:${d.phone}`} className="flex items-center gap-2 hover:underline"><Phone className="size-4 text-muted-foreground" />{d.phone}</a>}
              {d.website && <a href={d.website.startsWith("http") ? d.website : `https://${d.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline"><Globe className="size-4 text-muted-foreground" />{vars.website}</a>}
              {d.company && <span className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />{d.company}</span>}
            </div>
          </section>

          {canEdit && (
            <section className="rounded-lg border bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold">Reply</h2>
              <ReplyPanel
                dealId={d.id}
                stage={d.stage}
                email={d.email}
                phone={d.phone}
                vars={vars}
                prefer={d.stage === "new" && (auditToken || d.source === "audit") ? "audit" : undefined}
                templates={templates.map((t) => ({ id: t.id, name: t.name, channel: t.channel, subject: t.subject, body: t.body, stageHint: t.stageHint }))}
              />
            </section>
          )}

          <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Timeline</h2>
            {canEdit && <div className="mb-4"><NoteBox dealId={d.id} /></div>}
            <ol className="space-y-4">
              {activities.map(({ a, userName }) => (
                <li key={a.id} className="border-l-2 pl-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{activityTitle(a.type, a.meta)}</span>
                    <time className="text-xs text-muted-foreground" dateTime={a.createdAt.toISOString()} title={a.createdAt.toLocaleString("en-GB")}>
                      {ago(a.createdAt)} ago{userName ? ` · ${userName}` : ""}
                    </time>
                  </div>
                  {a.body && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{a.body.length > 1200 ? a.body.slice(0, 1200) + "…" : a.body}</p>}
                </li>
              ))}
              {activities.length === 0 && <li className="text-sm text-muted-foreground">Nothing yet.</li>}
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="space-y-2 rounded-lg border bg-card p-4">
            <h2 className="text-sm font-semibold">Stage</h2>
            {canEdit ? <StageSelect dealId={d.id} stage={d.stage} /> : <StagePill stage={d.stage} />}
            {d.stage === "lost" && d.lostReason && (
              <p className="text-xs text-muted-foreground">
                {LOST_REASON_LABELS[d.lostReason as LostReason] ?? d.lostReason}
                {d.lostNote ? `: ${d.lostNote}` : ""}
              </p>
            )}
          </section>

          {canEdit && d.stage !== "won" && d.stage !== "lost" && (
            <section className="space-y-2 rounded-lg border bg-card p-4">
              <h2 className="text-sm font-semibold">Next follow-up</h2>
              <FollowUpPicker dealId={d.id} value={d.nextFollowUpAt} />
            </section>
          )}

          <section className="space-y-1.5 rounded-lg border bg-card p-4 text-sm">
            <h2 className="mb-1 text-sm font-semibold">Details</h2>
            {canValue && <Row k="Value" v={money(d.valueAmount, d.currency) ?? "Not set"} />}
            <Row k="Owner" v={ownerName ?? "Nobody yet"} />
            <Row k="First reply" v={d.firstRepliedAt ? `${hoursBetween(d.createdAt, d.firstRepliedAt)} after enquiry` : "Not yet"} />
            {d.wonAt && <Row k="Won" v={d.wonAt.toLocaleDateString("en-GB")} />}
          </section>

          {d.website && canAudit && (
            <Link
              href={`/${locale}/admin/audits?url=${encodeURIComponent(d.website)}&deal=${d.id}`}
              className="flex items-center gap-2 rounded-lg border bg-card p-4 text-sm hover:bg-accent"
            >
              <Gauge className="size-4 text-primary" />
              {auditToken ? "Run a new website audit" : "Run a website audit"}
            </Link>
          )}

          {linkedContacts.length > 0 && (
            <section className="space-y-2 rounded-lg border bg-card p-4">
              <h2 className="text-sm font-semibold">Enquiries</h2>
              <ul className="space-y-2">
                {linkedContacts.map((c) => (
                  <li key={c.id}>
                    <Link href={`/${locale}/admin/contacts/${c.id}`} className="block text-sm hover:underline">
                      {c.inquiry} <span className="text-xs text-muted-foreground">· {c.createdAt.toLocaleDateString("en-GB")}</span>
                    </Link>
                    {c.source ? <p className="text-xs text-muted-foreground">{sourceLine(c.source as EnquirySource)}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {canDelete && <div className="px-1"><DeleteDeal dealId={d.id} locale={locale} /></div>}
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}

function hoursBetween(a: Date, b: Date) {
  const h = (b.getTime() - a.getTime()) / 3600_000;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
}

function activityTitle(type: string, meta: unknown) {
  const m = (meta ?? {}) as Record<string, string | undefined>;
  switch (type) {
    case "enquiry":
      return m.inquiry ? `Enquiry: ${m.inquiry}` : "Enquiry";
    case "note":
      return "Note";
    case "email_sent":
      return "Email sent";
    case "whatsapp_sent":
      return "WhatsApp sent";
    case "auto_reply":
      return "Auto-reply sent";
    case "stage_change":
      return `Moved from ${STAGE_LABELS[m.from as Stage] ?? m.from} to ${STAGE_LABELS[m.to as Stage] ?? m.to}${m.lostReason ? ` (${LOST_REASON_LABELS[m.lostReason as LostReason] ?? m.lostReason})` : ""}`;
    case "follow_up_set":
      return m.date ? `Follow-up set for ${new Date(m.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}` : "Follow-up cleared";
    case "audit":
      return "Website audit";
    case "audit_viewed":
      return "They opened the audit report";
    default:
      return type;
  }
}
