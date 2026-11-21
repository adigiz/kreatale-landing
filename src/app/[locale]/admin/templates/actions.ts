"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import { createTemplate, deleteTemplate, updateTemplate } from "@/lib/cms/queries/templates";
import { STAGES } from "@/lib/pipeline/constants";

type Result = { ok: true } | { ok: false; error: string };

const schema = z.object({
  name: z.string().trim().min(1, "Give it a name").max(120),
  channel: z.enum(["email", "whatsapp"]),
  subject: z.string().trim().max(200).optional().nullable(),
  body: z.string().trim().min(1, "Write the message").max(5000),
  stageHint: z.union([z.literal(""), z.enum(STAGES)]).optional().nullable(),
  sort: z.coerce.number().int().min(0).max(10_000).default(100),
});

async function run(fn: () => Promise<unknown>): Promise<Result> {
  try {
    await requirePermission("templates:manage");
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  try {
    await fn();
    revalidatePath("/[locale]/admin", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { ok: false, error: err.issues[0]?.message || "Invalid input" };
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) return { ok: false, error: "A template with that name and channel already exists." };
    console.error("Template action failed:", err);
    return { ok: false, error: "Something went wrong" };
  }
}

const toRow = (f: z.infer<typeof schema>) => ({
  name: f.name,
  channel: f.channel,
  subject: f.channel === "email" ? f.subject || null : null,
  body: f.body,
  stageHint: f.stageHint || null,
  sort: f.sort,
});

export async function saveTemplateAction(id: string | null, input: Record<string, unknown>) {
  return run(async () => {
    const f = schema.parse(input);
    if (id) await updateTemplate(z.string().uuid().parse(id), toRow(f));
    else await createTemplate(toRow(f));
  });
}

export async function deleteTemplateAction(id: string) {
  return run(() => deleteTemplate(z.string().uuid().parse(id)));
}
