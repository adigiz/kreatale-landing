"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, RotateCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAuditAction, deleteAuditAction, rerunAuditAction } from "./actions";

const field = "h-9 w-full rounded-md border bg-background px-2.5 text-sm";

export function NewAuditForm({
  defaultUrl,
  defaultDeal,
  deals,
}: {
  defaultUrl?: string;
  defaultDeal?: string;
  deals: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [v, setV] = useState({ url: defaultUrl ?? "", preparedFor: "", dealId: defaultDeal ?? "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await createAuditAction(v);
      if (!res.ok) return void toast.error(res.error);
      toast.success("Audit started. It takes about a minute.");
      setV({ url: "", preparedFor: "", dealId: "" });
      router.replace(window.location.pathname);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[2fr_1.3fr_1.3fr_auto] md:items-end">
      <label className="space-y-1 text-sm">
        <span className="font-medium">Website</span>
        <input className={field} value={v.url} onChange={set("url")} placeholder="example.com" required inputMode="url" autoComplete="off" />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Prepared for <span className="font-normal text-muted-foreground">(shown on the report)</span></span>
        <input className={field} value={v.preparedFor} onChange={set("preparedFor")} placeholder="Business name" maxLength={160} />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Link to deal <span className="font-normal text-muted-foreground">(optional)</span></span>
        <select className={field} value={v.dealId} onChange={set("dealId")}>
          <option value="">None</option>
          {deals.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" disabled={pending} className="h-9">
        {pending ? "Starting…" : "Run audit"}
      </Button>
    </form>
  );
}

export function CopyLink({ url }: { url: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        navigator.clipboard.writeText(url).then(
          () => toast.success("Report link copied"),
          () => toast.error("Couldn't copy"),
        )
      }
    >
      <Copy className="size-3.5" /> Copy link
    </Button>
  );
}

export function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        title="Run again"
        aria-label="Run again"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await rerunAuditAction(id);
            if (!r.ok) return void toast.error(r.error);
            toast.success("Running again as a new report");
            router.refresh();
          })
        }
      >
        <RotateCw className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        aria-label="Delete"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this audit? Its share link will stop working.")) return;
          start(async () => {
            const r = await deleteAuditAction(id);
            if (!r.ok) return void toast.error(r.error);
            router.refresh();
          });
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

/** Refreshes the server data every few seconds while an audit is still running. */
export function AutoRefresh({ active, ms = 4000 }: { active: boolean; ms?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => router.refresh(), ms);
    return () => clearInterval(t);
  }, [active, ms, router]);
  return null;
}
