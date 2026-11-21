// Small display helpers shared by the pipeline pages (server-safe, no hooks).
import { STAGE_LABELS, SERVICE_LABELS, SOURCE_LABELS, type Stage, type Service, type DealSource } from "@/lib/pipeline/constants";

export const STAGE_STYLES: Record<Stage, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  replied: "bg-violet-50 text-violet-700 border-violet-200",
  call: "bg-amber-50 text-amber-800 border-amber-200",
  proposal: "bg-orange-50 text-orange-800 border-orange-200",
  won: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function StagePill({ stage }: { stage: string }) {
  const s = (stage in STAGE_LABELS ? stage : "new") as Stage;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_STYLES[s]}`}>
      {STAGE_LABELS[s]}
    </span>
  );
}

export const serviceLabel = (s: string) => SERVICE_LABELS[s as Service] ?? s;
export const sourceLabel = (s: string) => SOURCE_LABELS[s as DealSource] ?? s;

export function money(amount: number | null | undefined, currency = "USD") {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en")}`;
  }
}

/** "3h", "2d", "5w" since a date. */
export function ago(d: Date | string | null | undefined) {
  if (!d) return "";
  const ms = Date.now() - new Date(d).getTime();
  const h = Math.floor(ms / 3600_000);
  if (h < 1) return `${Math.max(1, Math.floor(ms / 60_000))}m`;
  if (h < 48) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 21) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

/** Follow-up date as "Today", "Tomorrow", "3 days overdue", "Mon 24 Nov". */
export function followUpLabel(date: string | null | undefined): { text: string; tone: "due" | "soon" | "later" } | null {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return { text: `${-diff} day${diff === -1 ? "" : "s"} overdue`, tone: "due" };
  if (diff === 0) return { text: "Today", tone: "due" };
  if (diff === 1) return { text: "Tomorrow", tone: "soon" };
  return { text: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }), tone: "later" };
}

export const TONE_STYLES = {
  due: "text-red-600",
  soon: "text-amber-700",
  later: "text-muted-foreground",
};
