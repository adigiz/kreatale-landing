// Sends an alert when someone fills in the contact form, so a new enquiry is seen in
// minutes instead of whenever someone next opens the admin.
//
// Each channel is switched on by its environment variables; set one or both:
//   Telegram: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
//   Email (Resend): RESEND_API_KEY, NOTIFY_EMAIL_TO, and optionally NOTIFY_EMAIL_FROM
//     (the from address must be on a domain verified in Resend)
// With neither set, alerts are skipped and a warning is logged.

export type EnquiryAlert = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry: string;
  message: string;
  source?: EnquirySource | null;
};

export type EnquirySource = {
  landingPage?: string;
  referrer?: string;
  formPage?: string;
  utm?: Record<string, string>;
};

const SITE =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "https://kreatale.com";
const TIMEOUT_MS = 5000;

function sourceLine(source?: EnquirySource | null): string {
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

function adminLink(id: string) {
  return `${SITE}/en/admin/contacts/${id}`;
}

async function post(url: string, init: RequestInit) {
  const res = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok)
    throw new Error(
      `${res.status} ${await res.text().catch(() => "")}`.slice(0, 300),
    );
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendTelegram(a: EnquiryAlert) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const who = [a.name, a.company].filter(Boolean).join(" · ");
  const src = sourceLine(a.source);
  const text = [
    `<b>New enquiry: ${esc(a.inquiry)}</b>`,
    esc(who),
    esc([a.email, a.phone].filter(Boolean).join(" · ")),
    "",
    esc(a.message.length > 1500 ? a.message.slice(0, 1500) + "…" : a.message),
    src ? `\n<i>${esc(src)}</i>` : "",
    `\n<a href="${adminLink(a.id)}">Open in admin</a>`,
  ].join("\n");
  await post(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  return true;
}

async function sendEmail(a: EnquiryAlert) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return false;
  const from =
    process.env.NOTIFY_EMAIL_FROM || "Kreatale website <noreply@kreatale.com>";
  const src = sourceLine(a.source);
  const rows = [
    ["Name", a.name],
    ["Company", a.company],
    ["Email", a.email],
    ["Phone", a.phone],
    ["About", a.inquiry],
    ["Source", src],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(String(v))}</td></tr>`,
    )
    .join("");
  const html = `<table style="font:14px sans-serif">${rows}</table>
<p style="font:14px sans-serif;white-space:pre-wrap">${esc(a.message)}</p>
<p style="font:14px sans-serif"><a href="${adminLink(a.id)}">Open in admin</a></p>`;
  await post("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: a.email,
      subject: `New enquiry from ${a.name}${a.company ? ` (${a.company})` : ""}: ${a.inquiry}`,
      html,
    }),
  });
  return true;
}

/** Sends the alert on every configured channel. Never throws: the enquiry is already saved. */
export async function notifyNewEnquiry(alert: EnquiryAlert) {
  const results = await Promise.allSettled([
    sendTelegram(alert),
    sendEmail(alert),
  ]);
  let sent = 0;
  results.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value) sent++;
    if (r.status === "rejected") {
      console.error(
        `Enquiry alert via ${i === 0 ? "Telegram" : "email"} failed:`,
        r.reason,
      );
    }
  });
  if (sent === 0 && results.every((r) => r.status === "fulfilled")) {
    console.warn(
      "New enquiry saved but no alert channel is set up (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID or RESEND_API_KEY/NOTIFY_EMAIL_TO).",
    );
  }
}
