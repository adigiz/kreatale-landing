// The instant "we got your message" email sent to someone who used the contact form.
// It only repeats promises the site already makes (a person reads it, a reply within one
// business day with questions and a rough plan). Sent at most once per address per day.

import { and, eq, gte, sql } from "drizzle-orm";
import { db, deals, dealActivities } from "@/lib/cms/db";
import { addActivity } from "@/lib/cms/queries/deals";
import { sendEmail, escapeHtml } from "@/lib/email";
import { SITE } from "@/lib/notify";

const FROM = process.env.AUTO_REPLY_FROM || process.env.NOTIFY_EMAIL_FROM || "Kreatale <info@kreatale.com>";
const REPLY_TO = process.env.AUTO_REPLY_REPLY_TO || "info@kreatale.com";

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

export function autoReplyContent(name: string) {
  const first = firstName(name);
  const subject = `Thanks, ${first}. We got your message`;
  const text = [
    `Hi ${first},`,
    "",
    "Thanks for telling us about your project. A person here reads every message, and you'll get a proper reply within one business day, usually with a few questions and a rough plan.",
    "",
    "If you'd like to add anything in the meantime, like a link, a sketch or a site you like, just reply to this email.",
    "",
    `While you wait, here's some of what we've built: ${SITE}/en/projects`,
    "",
    "Kreatale",
    "Websites, online stores and apps",
    SITE,
  ].join("\n");
  const p = (s: string) => `<p style="margin:0 0 14px">${s}</p>`;
  const html = `<div style="font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;max-width:560px">
${p(`Hi ${escapeHtml(first)},`)}
${p("Thanks for telling us about your project. A person here reads every message, and you'll get a proper reply within one business day, usually with a few questions and a rough plan.")}
${p("If you'd like to add anything in the meantime, like a link, a sketch or a site you like, just reply to this email.")}
${p(`While you wait, here's some of <a href="${SITE}/en/projects" style="color:#0061FF">what we've built</a>.`)}
<p style="margin:22px 0 0;color:#555">Kreatale<br>Websites, online stores and apps<br><a href="${SITE}" style="color:#555">${SITE.replace(/^https?:\/\//, "")}</a></p>
</div>`;
  return { subject, text, html };
}

/** Sends the auto-reply unless this address already got one in the last 24 hours. Never throws. */
export async function sendAutoReply(opts: { dealId: string; name: string; email: string }) {
  try {
    const [recent] = await db
      .select({ id: dealActivities.id })
      .from(dealActivities)
      .innerJoin(deals, eq(deals.id, dealActivities.dealId))
      .where(
        and(
          eq(dealActivities.type, "auto_reply"),
          sql`lower(${deals.email}) = ${opts.email.toLowerCase()}`,
          gte(dealActivities.createdAt, new Date(Date.now() - 24 * 3600_000)),
        ),
      )
      .limit(1);
    if (recent) return false;
    const c = autoReplyContent(opts.name);
    const sent = await sendEmail({ to: opts.email, from: FROM, replyTo: REPLY_TO, ...c });
    if (sent) await addActivity({ dealId: opts.dealId, type: "auto_reply", body: c.text, meta: { subject: c.subject } });
    return sent;
  } catch (err) {
    console.error("Auto-reply failed:", err);
    return false;
  }
}
