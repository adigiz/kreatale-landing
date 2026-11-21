"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, MessageCircle, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renderTemplate, missingVariables, mailtoUrl, waUrl, type TemplateVars } from "@/lib/pipeline/templates";
import { logReplyAction, undoReplyAction, type ReplyUndo } from "../actions";

type Template = { id: string; name: string; channel: string; subject: string | null; body: string; stageHint: string | null };

export default function ReplyPanel({
  dealId,
  stage,
  email,
  phone,
  vars,
  templates,
  prefer,
}: {
  dealId: string;
  stage: string;
  email: string | null;
  phone: string | null;
  vars: Partial<TemplateVars>;
  templates: Template[];
  /** a word in the template name to suggest first, e.g. "audit" for a prospect we sent an audit */
  prefer?: string;
}) {
  const router = useRouter();
  const [channel, setChannel] = useState<"email" | "whatsapp">(email ? "email" : "whatsapp");
  const options = templates.filter((t) => t.channel === channel);
  const suggest = (opts: Template[]) =>
    (prefer && opts.find((t) => t.name.toLowerCase().includes(prefer))) || opts.find((t) => t.stageHint === stage) || opts[0];
  const suggested = suggest(options);
  const [templateId, setTemplateId] = useState<string>(suggested?.id ?? "");
  const tpl = options.find((t) => t.id === templateId) ?? suggested;
  const [subject, setSubject] = useState(() => (tpl?.subject ? renderTemplate(tpl.subject, vars) : ""));
  const [body, setBody] = useState(() => (tpl ? renderTemplate(tpl.body, vars) : ""));
  const [pending, start] = useTransition();

  const missing = useMemo(
    () => (tpl ? missingVariables(`${tpl.subject ?? ""} ${tpl.body}`, vars) : []),
    [tpl, vars],
  );

  const pick = (t?: Template) => {
    setTemplateId(t?.id ?? "");
    setSubject(t?.subject ? renderTemplate(t.subject, vars) : "");
    setBody(t ? renderTemplate(t.body, vars) : "");
  };
  const switchChannel = (c: "email" | "whatsapp") => {
    setChannel(c);
    const opts = templates.filter((t) => t.channel === c);
    pick(suggest(opts));
  };

  const log = (ch: "email" | "whatsapp") =>
    start(async () => {
      const res = await logReplyAction(dealId, ch, tpl?.id ?? null, channel === "email" && subject ? `${subject}\n\n${body}` : body);
      if (!res.ok) return void toast.error(res.error);
      router.refresh();
      const undo = res.data?.undo as ReplyUndo | undefined;
      toast.success(ch === "email" ? "Email logged" : "WhatsApp logged", {
        description: "Marked as replied and set the next follow-up.",
        action: undo
          ? {
              label: "Undo",
              onClick: async () => {
                const u = await undoReplyAction(dealId, undo);
                if (!u.ok) toast.error(u.error);
                else router.refresh();
              },
            }
          : undefined,
        duration: 10_000,
      });
    });

  const mailHref = email ? mailtoUrl(email, subject, body) : null;
  const waHref = waUrl(phone, body);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex rounded-md border p-0.5 text-sm">
          {(["email", "whatsapp"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => switchChannel(c)}
              className={`rounded px-3 py-1 ${channel === c ? "bg-muted font-medium" : "text-muted-foreground"}`}
            >
              {c === "email" ? "Email" : "WhatsApp"}
            </button>
          ))}
        </div>
        <select
          aria-label="Template"
          value={tpl?.id ?? ""}
          onChange={(e) => pick(options.find((t) => t.id === e.target.value))}
          className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm"
        >
          {options.length === 0 && <option value="">No templates yet</option>}
          {options.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {missing.length > 0 && (
        <p className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Empty in this deal: {missing.join(", ")}. Check the wording before sending.
        </p>
      )}

      {channel === "email" && (
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="h-9 w-full rounded-md border bg-background px-2.5 text-sm" />
      )}
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className="w-full rounded-md border bg-background p-2.5 text-sm leading-relaxed" />

      <div className="flex flex-wrap gap-2">
        {channel === "email" ? (
          mailHref ? (
            <Button asChild disabled={pending}>
              <a href={mailHref} onClick={() => log("email")}>
                <Mail className="size-4" /> Open in email
              </a>
            </Button>
          ) : (
            <Button disabled>No email address</Button>
          )
        ) : waHref ? (
          <Button asChild disabled={pending}>
            <a href={waHref} target="_blank" rel="noreferrer" onClick={() => log("whatsapp")}>
              <MessageCircle className="size-4" /> Open WhatsApp
            </a>
          </Button>
        ) : (
          <Button disabled>No phone number</Button>
        )}
        <Button
          variant="outline"
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(channel === "email" && subject ? `${subject}\n\n${body}` : body);
            toast("Copied", { action: { label: "I sent it", onClick: () => log(channel) } });
          }}
        >
          <Copy className="size-4" /> Copy text
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Opening email or WhatsApp logs the reply, marks the deal as replied and sets the next follow-up.
      </p>
    </div>
  );
}
