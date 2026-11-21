"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { STAGES, STAGE_LABELS } from "@/lib/pipeline/constants";
import { renderTemplate, TEMPLATE_VARIABLES } from "@/lib/pipeline/templates";
import { saveTemplateAction, deleteTemplateAction } from "./actions";

export type TemplateRow = {
  id: string;
  name: string;
  channel: string;
  subject: string | null;
  body: string;
  stageHint: string | null;
  sort: number;
};

const SAMPLE = {
  firstName: "Sam",
  name: "Sam Taylor",
  company: "Harbour Café",
  service: "website",
  website: "harbourcafe.example",
  auditUrl: "https://kreatale.com/en/website-audit/r/abc123",
  senderName: "Your Name",
  senderFirstName: "You",
};

const field = "h-9 w-full rounded-md border bg-background px-2.5 text-sm";

export default function TemplateEditor({ template, trigger }: { template?: TemplateRow; trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [v, setV] = useState({
    name: template?.name ?? "",
    channel: template?.channel ?? "email",
    subject: template?.subject ?? "",
    body: template?.body ?? "",
    stageHint: template?.stageHint ?? "",
    sort: String(template?.sort ?? 100),
  });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  const save = () =>
    start(async () => {
      const res = await saveTemplateAction(template?.id ?? null, v);
      if (!res.ok) return void toast.error(res.error);
      toast.success("Template saved");
      setOpen(false);
      router.refresh();
    });
  const remove = () =>
    start(async () => {
      if (!template) return;
      const res = await deleteTemplateAction(template.id);
      if (!res.ok) return void toast.error(res.error);
      toast.success("Template deleted");
      setOpen(false);
      router.refresh();
    });

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{template ? "Edit template" : "New template"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input value={v.name} onChange={set("name")} placeholder="Name, e.g. First reply" className={`${field} col-span-2`} />
                <select value={v.channel} onChange={set("channel")} className={field}>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <select value={v.stageHint} onChange={set("stageHint")} className={field} title="Suggested first when a deal is in this stage">
                  <option value="">Any stage</option>
                  {STAGES.map((s) => <option key={s} value={s}>Suggest at: {STAGE_LABELS[s]}</option>)}
                </select>
              </div>
              {v.channel === "email" && <input value={v.subject} onChange={set("subject")} placeholder="Subject" className={field} />}
              <textarea value={v.body} onChange={set("body")} rows={12} className="w-full rounded-md border bg-background p-2.5 text-sm leading-relaxed" placeholder="Hi {{firstName}}," />
              <p className="text-xs text-muted-foreground">
                Fill-ins: {TEMPLATE_VARIABLES.map((k) => `{{${k}}}`).join(" ")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Preview with a sample deal</p>
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                {v.channel === "email" && v.subject && <p className="mb-2 font-medium">{renderTemplate(v.subject, SAMPLE)}</p>}
                <p className="whitespace-pre-wrap leading-relaxed">{renderTemplate(v.body, SAMPLE) || "…"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            {template ? (
              <button type="button" onClick={remove} disabled={pending} className="text-sm text-muted-foreground hover:text-red-600">Delete template</button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={pending}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
