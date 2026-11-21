// Counts a view of an audit report. Called from the page by script, so link previews
// (WhatsApp, Slack) that only fetch the HTML don't count. Team members signed in to the admin
// don't count either. The first real view of an audit we sent pings the team.

import { NextRequest, NextResponse, after } from "next/server";
import { getSession } from "@/lib/cms/auth/config";
import { recordAuditView } from "@/lib/cms/queries/audits";
import { addActivity } from "@/lib/cms/queries/deals";
import { rateLimit, clientIp, HOUR } from "@/lib/rate-limit";
import { sendTelegram } from "@/lib/telegram";
import { escapeHtml as esc } from "@/lib/email";
import { SITE } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: unknown };
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{16,32}$/.test(token)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!rateLimit(`audit-view:${clientIp(req)}`, 60, HOUR)) return NextResponse.json({ ok: false }, { status: 429 });
  if ((await getSession())?.user) return NextResponse.json({ ok: true, counted: false });

  const r = await recordAuditView(token);
  if (!r) return NextResponse.json({ ok: false }, { status: 404 });

  if (r.first && r.audit.origin === "admin") {
    const a = r.audit;
    after(async () => {
      if (a.dealId) await addActivity({ dealId: a.dealId, type: "audit_viewed", body: `Opened the report for ${a.host}`, meta: { token: a.token } });
      const who = a.preparedFor ? `${esc(a.preparedFor)} (${esc(a.host)})` : esc(a.host);
      const link = a.dealId ? `${SITE}/en/admin/pipeline/${a.dealId}` : `${SITE}/en/admin/audits`;
      await sendTelegram(`👀 <b>${who}</b> just opened their website audit.\nGood moment to follow up: <a href="${link}">open</a>`).catch(() => {});
    });
  }
  return NextResponse.json({ ok: true, counted: true });
}
