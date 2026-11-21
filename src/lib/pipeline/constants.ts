// Shared vocabulary for the sales pipeline. The database stores these as plain strings with
// CHECK constraints (drizzle/0002_pipeline.sql); keep both in sync.

export const STAGES = ["new", "replied", "call", "proposal", "won", "lost"] as const;
export type Stage = (typeof STAGES)[number];
export const OPEN_STAGES: Stage[] = ["new", "replied", "call", "proposal"];

export const STAGE_LABELS: Record<Stage, string> = {
  new: "New",
  replied: "Replied",
  call: "Call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

/** Business days to wait before the next follow-up when a deal enters a stage. */
export const FOLLOW_UP_DAYS: Partial<Record<Stage, number>> = {
  replied: 3,
  call: 2,
  proposal: 4,
};

export const SERVICES = [
  "websites",
  "online-stores",
  "web-apps",
  "mobile-apps",
  "seo-content",
  "care-plans",
  "not-sure",
] as const;
export type Service = (typeof SERVICES)[number];

export const SERVICE_LABELS: Record<Service, string> = {
  websites: "Website",
  "online-stores": "Online store",
  "web-apps": "Web app",
  "mobile-apps": "Mobile app",
  "seo-content": "SEO & content",
  "care-plans": "Care plan",
  "not-sure": "Not sure yet",
};

/** Maps the contact form's "What are you building?" text to a service. */
export function serviceFromInquiry(inquiry: string): Service {
  const s = inquiry.toLowerCase();
  if (s.includes("online store")) return "online-stores";
  if (s.includes("web app")) return "web-apps";
  if (s.includes("mobile")) return "mobile-apps";
  if (s.includes("seo")) return "seo-content";
  if (s.includes("care")) return "care-plans";
  if (s.includes("website")) return "websites";
  return "not-sure";
}

export const SOURCES = ["contact_form", "audit", "outreach", "referral", "manual", "imported"] as const;
export type DealSource = (typeof SOURCES)[number];

export const SOURCE_LABELS: Record<DealSource, string> = {
  contact_form: "Contact form",
  audit: "Website audit",
  outreach: "Outreach",
  referral: "Referral",
  manual: "Added by hand",
  imported: "Imported",
};

export const LOST_REASONS = [
  "no-response",
  "no-budget",
  "went-elsewhere",
  "not-a-fit",
  "timing",
  "spam",
  "other",
] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const LOST_REASON_LABELS: Record<LostReason, string> = {
  "no-response": "Stopped replying",
  "no-budget": "Budget didn't fit",
  "went-elsewhere": "Went with someone else",
  "not-a-fit": "Not a fit for us",
  timing: "Not the right time",
  spam: "Spam",
  other: "Other",
};

export const ACTIVITY_TYPES = [
  "enquiry",
  "note",
  "email_sent",
  "whatsapp_sent",
  "auto_reply",
  "stage_change",
  "follow_up_set",
  "audit",
  "audit_viewed",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const CURRENCIES = ["USD", "AUD", "EUR", "IDR", "GBP", "SGD"] as const;

/** Reply is overdue after this many hours (the site promises a reply within one business day). */
export const REPLY_DUE_HOURS = 20;

/** Timezone for "today" and "this month" in the admin. */
export const PIPELINE_TZ = process.env.PIPELINE_TZ || "Asia/Makassar";

/** Adds business days (Mon–Fri) to a date and returns YYYY-MM-DD. */
export function addBusinessDays(from: Date, days: number): string {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
}
