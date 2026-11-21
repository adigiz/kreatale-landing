// Team alerts: a new enquiry is pushed to Telegram and email so it's seen in minutes instead
// of whenever someone next opens the admin. Each channel turns on with its env vars
// (see src/lib/telegram.ts and src/lib/email.ts); with neither set, a warning is logged.

import { sendEmail, escapeHtml as esc } from "@/lib/email";
import { sendTelegram } from "@/lib/telegram";

export type EnquirySource = {
  landingPage?: string;
  referrer?: string;
  formPage?: string;
  utm?: Record<string, string>;
};

export type EnquiryAlert = {
  id: string;
  /** when the enquiry became (or joined) a deal, alerts link straight to it */
  dealId?: string | null;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry: string;
  message: string;
  source?: EnquirySource | null;
};

export const SITE = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "https://kreatale.com";

export function sourceLine(source?: EnquirySource | null): string {
  if (!source) return "";
  const parts: string[] = [];
  const utm =
    source.utm &&
    Object.entries(source.utm)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
  if (utm) parts.push(utm);
  if (source.referrer) parts.push(`from ${source.referrer}`);
  if (source.landingPage) parts.push(`landed on ${source.landingPage}`);
  return parts.join(" · ");
}

const adminLink = (a: EnquiryAlert) =>
  a.dealId ? `${SITE}/en/admin/pipeline/${a.dealId}` : `${SITE}/en/admin/contacts/${a.id}`;

function telegramText(a: EnquiryAlert) {
  const who = [a.name, a.company].filter(Boolean).join(" · ");
  const src = sourceLine(a.source);
  return [
    `<b>New enquiry: ${esc(a.inquiry)}</b>`,
    esc(who),
    esc([a.email, a.phone].filter(Boolean).join(" · ")),
    "",
    esc(a.message.length > 1500 ? a.message.slice(0, 1500) + "…" : a.message),
    src ? `\n<i>${esc(src)}</i>` : "",
    `\n<a href="${adminLink(a)}">Open in admin</a>`,
  ].join("\n");
}

function emailHtml(a: EnquiryAlert) {
  const rows = [
    ["Name", a.name],
    ["Company", a.company],
    ["Email", a.email],
    ["Phone", a.phone],
    ["About", a.inquiry],
    ["Source", sourceLine(a.source)],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(String(v))}</td></tr>`,
    )
    .join("");
  return `<table style="font:14px sans-serif">${rows}</table>
<p style="font:14px sans-serif;white-space:pre-wrap">${esc(a.message)}</p>
<p style="font:14px sans-serif"><a href="${adminLink(a)}">Open in admin</a></p>`;
}

/** Sends the alert on every configured channel. Never throws: the enquiry is already saved. */
export async function notifyNewEnquiry(a: EnquiryAlert) {
  const to = process.env.NOTIFY_EMAIL_TO;
  await notifyTeam("Enquiry alert", [
    () => sendTelegram(telegramText(a)),
    () =>
      to
        ? sendEmail({
            to: to.split(",").map((s) => s.trim()),
            replyTo: a.email,
            subject: `New enquiry from ${a.name}${a.company ? ` (${a.company})` : ""}: ${a.inquiry}`,
            html: emailHtml(a),
          })
        : Promise.resolve(false),
  ]);
}

/** Runs each channel; logs failures and warns when no channel is configured. Never throws. */
export async function notifyTeam(label: string, channels: (() => Promise<boolean>)[]) {
  const results = await Promise.allSettled(channels.map((c) => c()));
  let sent = 0;
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value) sent++;
    if (r.status === "rejected") console.error(`${label} failed:`, r.reason);
  });
  if (sent === 0 && results.every((r) => r.status === "fulfilled")) {
    console.warn(`${label}: no alert channel is set up (Telegram or RESEND_API_KEY + NOTIFY_EMAIL_TO).`);
  }
  return sent;
}
