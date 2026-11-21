// Filling reply templates and building the links that open a prefilled email or WhatsApp chat.
// Safe for client and server.

export type TemplateVars = {
  firstName: string;
  name: string;
  company: string;
  service: string;
  website: string;
  auditUrl: string;
  senderName: string;
  senderFirstName: string;
};

export const TEMPLATE_VARIABLES: (keyof TemplateVars)[] = [
  "firstName",
  "name",
  "company",
  "service",
  "website",
  "auditUrl",
  "senderName",
  "senderFirstName",
];

export const firstNameOf = (name?: string | null) => (name || "").trim().split(/\s+/)[0] || "";

/** Replaces {{variable}} placeholders; unknown or empty variables become empty text. */
export function renderTemplate(text: string, vars: Partial<TemplateVars>): string {
  return text
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => (vars as Record<string, string | undefined>)[k] ?? "")
    .replace(/[ \t]+([,.!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Template variables that would be empty for this deal, so the UI can warn before sending. */
export function missingVariables(text: string, vars: Partial<TemplateVars>): string[] {
  const used = [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]);
  return [...new Set(used)].filter((k) => !(vars as Record<string, string | undefined>)[k]);
}

export function mailtoUrl(email: string, subject: string, body: string): string {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  // mail clients expect %20 for spaces, not '+'
  return `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?${q.toString().replace(/\+/g, "%20")}`;
}

/**
 * wa.me link with prefilled text. The number must be in international format; local
 * Indonesian numbers (0812…) are converted to 62…. Returns null when there's no usable number.
 */
export function waUrl(phone: string | null | undefined, text: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (!phone.trim().startsWith("+") && digits.startsWith("0")) digits = "62" + digits.slice(1);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
