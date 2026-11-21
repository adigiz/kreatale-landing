// Sends email through Resend's HTTP API (no SDK). Configured with RESEND_API_KEY; the from
// address must be on a domain verified in Resend.

const TIMEOUT_MS = 8000;

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export const DEFAULT_FROM =
  process.env.NOTIFY_EMAIL_FROM || "Kreatale <noreply@kreatale.com>";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Returns false when email isn't configured; throws when Resend rejects the message. */
export async function sendEmail(m: EmailMessage): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: m.from || DEFAULT_FROM,
      to: Array.isArray(m.to) ? m.to : [m.to],
      subject: m.subject,
      html: m.html,
      text: m.text,
      reply_to: m.replyTo,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  }
  return true;
}

/** Escapes text for HTML email bodies. */
export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
