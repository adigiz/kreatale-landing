// Emails the finished report link to someone who used the public website audit. Copy only
// states what the report contains; the fix titles come from the hand-written dictionary.

import { sendEmail, escapeHtml as esc } from "@/lib/email";
import { SITE } from "@/lib/notify";
import type { Audit } from "@/lib/cms/db";
import type { FixItem } from "@/lib/audit/run";

const FROM = process.env.AUTO_REPLY_FROM || process.env.NOTIFY_EMAIL_FROM || "Kreatale <info@kreatale.com>";
const REPLY_TO = process.env.AUTO_REPLY_REPLY_TO || "info@kreatale.com";

export function auditReportEmail(a: Audit) {
  const first = (a.requesterName || "").trim().split(/\s+/)[0] || "there";
  const link = `${SITE}/en/website-audit/r/${a.token}`;
  const fixes = ((a.fixes as FixItem[] | null) ?? []).slice(0, 3);
  const failed = a.status !== "done";
  const subject = failed ? `We couldn't check ${a.host}` : `Your website report for ${a.host}`;

  const lines = failed
    ? [`Hi ${first},`, "", `We tried to check ${a.host} but the site didn't respond in time. You can try again here: ${SITE}/en/website-audit`, "", "If it keeps failing, reply to this email and we'll take a look by hand."]
    : [
        `Hi ${first},`,
        "",
        `Your report for ${a.host} is ready${a.overall != null ? `. Overall score: ${a.overall}/100` : ""}.`,
        link,
        ...(fixes.length ? ["", "Top things to fix:", ...fixes.map((f, i) => `${i + 1}. ${f.title}`)] : []),
        "",
        "The report explains each one in plain English. If you'd like help with any of it, just reply to this email.",
      ];
  const text = [...lines, "", "Kreatale", "Websites, online stores and apps", SITE].join("\n");

  const p = (s: string) => `<p style="margin:0 0 14px">${s}</p>`;
  const html = `<div style="font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;max-width:560px">
${p(`Hi ${esc(first)},`)}
${
  failed
    ? p(`We tried to check ${esc(a.host)} but the site didn't respond in time. You can <a href="${SITE}/en/website-audit" style="color:#0061FF">try again</a>. If it keeps failing, reply to this email and we'll take a look by hand.`)
    : `${p(`Your report for <b>${esc(a.host)}</b> is ready${a.overall != null ? `. Overall score: <b>${a.overall}/100</b>` : ""}.`)}
<p style="margin:0 0 18px"><a href="${link}" style="display:inline-block;background:#0061FF;color:#fff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:999px">Open your report</a></p>
${fixes.length ? `<p style="margin:0 0 6px"><b>Top things to fix</b></p><ol style="margin:0 0 14px;padding-left:20px">${fixes.map((f) => `<li>${esc(f.title)}</li>`).join("")}</ol>` : ""}
${p("The report explains each one in plain English. If you'd like help with any of it, just reply to this email.")}`
}
<p style="margin:22px 0 0;color:#555">Kreatale<br>Websites, online stores and apps<br><a href="${SITE}" style="color:#555">${SITE.replace(/^https?:\/\//, "")}</a></p>
</div>`;
  return { subject, text, html };
}

/** Never throws. */
export async function sendAuditReport(a: Audit) {
  if (!a.requesterEmail) return false;
  try {
    return await sendEmail({ to: a.requesterEmail, from: FROM, replyTo: REPLY_TO, ...auditReportEmail(a) });
  } catch (err) {
    console.error("Audit report email failed:", err);
    return false;
  }
}
