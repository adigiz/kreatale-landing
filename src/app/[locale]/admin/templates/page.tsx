import { redirect } from "next/navigation";
import { Plus, Mail, MessageCircle } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { listTemplates } from "@/lib/cms/queries/templates";
import { STAGE_LABELS, type Stage } from "@/lib/pipeline/constants";
import { Button } from "@/components/ui/button";
import TemplateEditor from "./TemplateEditor";

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  if (!(await sessionHasPermission(session.user.role as string, "templates:manage"))) redirect(`/${locale}/admin`);
  const templates = await listTemplates();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Reply templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ready-made messages for the reply panel on each deal. Keep them short and personal; edit before sending.
          </p>
        </div>
        <TemplateEditor trigger={<Button><Plus className="size-4" /> New template</Button>} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {templates.map((t) => (
          <TemplateEditor
            key={t.id}
            template={t}
            trigger={
              <button type="button" className="w-full rounded-lg border bg-card p-4 text-left hover:bg-accent">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium">
                    {t.channel === "email" ? <Mail className="size-4 text-muted-foreground" /> : <MessageCircle className="size-4 text-muted-foreground" />}
                    {t.name}
                  </span>
                  {t.stageHint && <span className="text-xs text-muted-foreground">{STAGE_LABELS[t.stageHint as Stage]}</span>}
                </div>
                {t.subject && <p className="mt-1 text-sm">{t.subject}</p>}
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.body}</p>
              </button>
            }
          />
        ))}
        {templates.length === 0 && <p className="text-sm text-muted-foreground">No templates yet.</p>}
      </div>
    </div>
  );
}
