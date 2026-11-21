"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_LABELS, SOURCES, SOURCE_LABELS, CURRENCIES } from "@/lib/pipeline/constants";
import { createDealAction, updateDealAction } from "./actions";

export type DealFormValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  service: string;
  ownerId: string;
  valueAmount: string;
  currency: string;
  source?: string;
  note?: string;
};

const field = "h-10 w-full rounded-xl border bg-background px-3 text-sm";
const label = "block text-xs font-medium text-muted-foreground mb-1";

export default function DealForm({
  mode,
  dealId,
  initial,
  owners,
  canValue,
  locale,
  onDone,
}: {
  mode: "create" | "edit";
  dealId?: string;
  initial: DealFormValues;
  owners: { id: string; name: string | null; email: string }[];
  canValue: boolean;
  locale: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [pending, start] = useTransition();
  const set = (k: keyof DealFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      if (mode === "create") {
        const res = await createDealAction(v);
        if (!res.ok) return void toast.error(res.error);
        toast.success("Deal added");
        router.push(`/${locale}/admin/pipeline/${res.data?.id}`);
      } else {
        const res = await updateDealAction(dealId!, v);
        if (!res.ok) return void toast.error(res.error);
        toast.success("Saved");
        router.refresh();
        onDone?.();
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className={label}>Name *</label><input required value={v.name} onChange={set("name")} className={field} /></div>
        <div><label className={label}>Company</label><input value={v.company} onChange={set("company")} className={field} /></div>
        <div><label className={label}>Email</label><input type="email" value={v.email} onChange={set("email")} className={field} /></div>
        <div><label className={label}>Phone / WhatsApp</label><input value={v.phone} onChange={set("phone")} placeholder="+61 4…" className={field} /></div>
        <div className="sm:col-span-2"><label className={label}>Website</label><input value={v.website} onChange={set("website")} placeholder="https://" className={field} /></div>
        <div>
          <label className={label}>Service</label>
          <select value={v.service} onChange={set("service")} className={field}>
            {SERVICES.map((s) => <option key={s} value={s}>{SERVICE_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Owner</label>
          <select value={v.ownerId} onChange={set("ownerId")} className={field}>
            <option value="">Nobody yet</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.name || o.email}</option>)}
          </select>
        </div>
        {canValue && (
          <>
            <div><label className={label}>Estimated value</label><input inputMode="numeric" value={v.valueAmount} onChange={set("valueAmount")} placeholder="e.g. 4000" className={field} /></div>
            <div>
              <label className={label}>Currency</label>
              <select value={v.currency} onChange={set("currency")} className={field}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </>
        )}
        {mode === "create" && (
          <>
            <div>
              <label className={label}>Where it came from</label>
              <select value={v.source ?? "manual"} onChange={set("source")} className={field}>
                {SOURCES.filter((s) => s !== "imported" && s !== "contact_form").map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Note</label>
              <textarea value={v.note ?? ""} onChange={set("note")} rows={3} className="w-full rounded-md border bg-background p-2.5 text-sm" placeholder="How you met, what they need" />
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>{mode === "create" ? "Add deal" : "Save"}</Button>
        {onDone && <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>}
      </div>
    </form>
  );
}
