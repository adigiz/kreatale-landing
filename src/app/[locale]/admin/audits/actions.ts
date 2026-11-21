"use server";

import { z } from "zod";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import { createAudit, deleteAudit, getAudit } from "@/lib/cms/queries/audits";
import { addActivity } from "@/lib/cms/queries/deals";
import { runAuditJob } from "@/lib/audit/queue";
import { assertPublicUrl, normaliseUrl, UnsafeUrlError } from "@/lib/audit/safe-fetch";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const input = z.object({
  url: z.string().trim().min(3, "Enter a website address").max(500),
  preparedFor: z.string().trim().max(160).optional().default(""),
  dealId: z.string().uuid().optional().or(z.literal("")).default(""),
});

export async function createAuditAction(raw: z.input<typeof input>): Promise<ActionResult<{ token: string }>> {
  let session;
  try {
    session = await requirePermission("audits:create");
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  const parsed = input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  const v = parsed.data;

  let url: URL;
  try {
    url = await assertPublicUrl(normaliseUrl(v.url));
  } catch (e) {
    return { ok: false, error: e instanceof UnsafeUrlError ? e.message : "That doesn't look like a web address." };
  }

  const audit = await createAudit({
    url: url.toString(),
    host: url.hostname.replace(/^www\./, ""),
    origin: "admin",
    createdBy: session.user.id,
    preparedFor: v.preparedFor || null,
    dealId: v.dealId || null,
  });
  if (audit.dealId) {
    await addActivity({
      dealId: audit.dealId,
      type: "audit",
      body: `Website audit made for ${audit.host}`,
      meta: { token: audit.token, auditId: audit.id },
      userId: session.user.id,
    });
  }
  after(() => runAuditJob(audit.id).catch((e) => console.error("Audit job failed:", e)));
  revalidatePath("/[locale]/admin", "layout");
  return { ok: true, data: { token: audit.token } };
}

export async function rerunAuditAction(id: string): Promise<ActionResult<{ token: string }>> {
  try {
    await requirePermission("audits:create");
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  const a = await getAudit(id);
  if (!a) return { ok: false, error: "Audit not found" };
  return createAuditAction({ url: a.url, preparedFor: a.preparedFor ?? "", dealId: a.dealId ?? "" });
}

export async function deleteAuditAction(id: string): Promise<ActionResult> {
  try {
    await requirePermission("audits:create");
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Invalid id" };
  await deleteAudit(id);
  revalidatePath("/[locale]/admin", "layout");
  return { ok: true };
}
