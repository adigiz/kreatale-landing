// Weekday morning digest for the team: who's waiting for a reply, follow-ups due, new leads
// from the website audit, and proposals that went quiet. Sent by email and Telegram, and only
// when there's something to report. Triggered by a Dokploy schedule (see docs in .env.example).

import { NextRequest, NextResponse } from "next/server";
import { cronAuth } from "@/lib/cron-auth";
import { digestData } from "@/lib/cms/queries/deals";
import { sendEmail, escapeHtml as esc } from "@/lib/email";
import { sendTelegram } from "@/lib/telegram";
import { notifyTeam, SITE } from "@/lib/notify";
import { STAGE_LABELS, type Stage } from "@/lib/pipeline/constants";

export const dynamic = "force-dynamic";

type D = { id: string; name: string; company: string | null; stage: string; createdAt: Date; updatedAt: Date; nextFollowUpAt: string | null };

const link = (d: D) => `${SITE}/en/admin/pipeline/${d.id}`;
const who = (d: D) => d.company || d.name;
const hours = (d: Date) => Math.round((Date.now() - new Date(d).getTime()) / 3600_000);

async function handle(req: NextRequest) {
  const auth = cronAuth(req);
  if (auth === "unconfigured") return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 503 });
  if (auth !== "ok") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // keep the audit queue moving: re-run audits stuck by a restart (no-op until audits exist)
  let swept = 0;
  try {
    const { sweepStuckAudits } = await import("@/lib/audit/queue");
    swept = await sweepStuckAudits();
  } catch {
    /* audits not set up yet */
  }

  const { late, due, auditLeads, staleProposals } = await digestData();
  const sections: { title: string; items: { label: string; detail: string; url: string }[] }[] = [
    {
      title: "Waiting for a first reply",
      items: late.map((d) => ({ label: who(d), detail: `${hours(d.createdAt)} h since they wrote`, url: link(d) })),
    },
    {
      title: "Follow-ups due",
      items: due.map((d) => ({ label: who(d), detail: `${STAGE_LABELS[d.stage as Stage]}, due ${d.nextFollowUpAt}`, url: link(d) })),
    },
    {
      title: "New leads from the website audit",
      items: auditLeads.map((d) => ({ label: who(d), detail: "ran the free audit", url: link(d) })),
    },
    {
      title: "Proposals with no news for a week",
      items: staleProposals.map((d) => ({ label: who(d), detail: `last touched ${Math.round(hours(d.updatedAt) / 24)} days ago`, url: link(d) })),
    },
  ].filter((s) => s.items.length);

  if (sections.length === 0) return NextResponse.json({ sent: false, reason: "nothing to report", swept });

  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const tg = [
    `<b>Kreatale today: ${total} thing${total === 1 ? "" : "s"} to do</b>`,
    ...sections.map(
      (s) => `\n<b>${esc(s.title)}</b>\n` + s.items.slice(0, 15).map((i) => `• <a href="${i.url}">${esc(i.label)}</a>, ${esc(i.detail)}`).join("\n"),
    ),
    `\n<a href="${SITE}/en/admin">Open the admin</a>`,
  ].join("\n");
  const html = `<div style="font:14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;max-width:560px">
${sections
  .map(
    (s) =>
      `<h3 style="font-size:15px;margin:18px 0 6px">${esc(s.title)}</h3><ul style="padding-left:18px;margin:0">${s.items
        .map((i) => `<li style="margin:3px 0"><a href="${i.url}" style="color:#0061FF">${esc(i.label)}</a>, ${esc(i.detail)}</li>`)
        .join("")}</ul>`,
  )
  .join("")}
<p style="margin-top:20px"><a href="${SITE}/en/admin" style="color:#0061FF">Open the admin</a></p></div>`;

  const to = process.env.NOTIFY_EMAIL_TO;
  const sent = await notifyTeam("Daily digest", [
    () => sendTelegram(tg),
    () =>
      to
        ? sendEmail({ to: to.split(",").map((s) => s.trim()), subject: `Today: ${total} thing${total === 1 ? "" : "s"} to follow up`, html })
        : Promise.resolve(false),
  ]);
  return NextResponse.json({ sent: sent > 0, items: total, swept });
}

export const POST = handle;
export const GET = handle;
