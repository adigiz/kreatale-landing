"use server";

import { z } from "zod";
import { and, desc, eq, gte, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { db, deals, dealActivities, audits } from "@/lib/cms/db";
import {
  addActivity,
  changeStage,
  createDeal,
  deleteDeal,
  logReply,
  setFollowUp,
  updateDealFields,
} from "@/lib/cms/queries/deals";
import { CURRENCIES, LOST_REASONS, SERVICES, SOURCES, STAGES } from "@/lib/pipeline/constants";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

async function guarded<T>(permission: string, fn: (userId: string, role: string) => Promise<T>): Promise<ActionResult<T>> {
  let session;
  try {
    session = await requirePermission(permission);
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  try {
    const data = await fn(session.user.id, session.user.role as string);
    revalidatePath("/[locale]/admin", "layout");
    return { ok: true, data };
  } catch (err) {
    if (err instanceof z.ZodError) return { ok: false, error: err.issues[0]?.message || "Invalid input" };
    console.error("Pipeline action failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong" };
  }
}

const id = z.string().uuid();
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform((v) => (v ? v : null));

export async function changeStageAction(dealId: string, stage: string, lostReason?: string, lostNote?: string) {
  return guarded("deals:update", async (userId) => {
    const s = z.enum(STAGES).parse(stage);
    const reason = s === "lost" ? z.enum(LOST_REASONS).parse(lostReason ?? "other") : undefined;
    await changeStage(id.parse(dealId), s, { userId, lostReason: reason, lostNote: lostNote?.slice(0, 1000) || null });
  });
}

export async function addNoteAction(dealId: string, body: string) {
  return guarded("deals:update", async (userId) => {
    const text = z.string().trim().min(1, "Write something first").max(5000).parse(body);
    await addActivity({ dealId: id.parse(dealId), type: "note", body: text, userId });
    await updateDealFields(dealId, {});
  });
}

export async function setFollowUpAction(dealId: string, date: string | null) {
  return guarded("deals:update", async (userId) => {
    const d = date ? z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date").parse(date) : null;
    await setFollowUp(id.parse(dealId), d, userId);
  });
}

const dealFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(200)]).optional().nullable(),
  company: optionalText(160),
  phone: optionalText(40),
  website: optionalText(500),
  service: z.enum(SERVICES),
  ownerId: z.union([z.literal(""), z.string().uuid()]).optional().nullable(),
  valueAmount: z.union([z.literal(""), z.coerce.number().int().min(0).max(100_000_000)]).optional().nullable(),
  currency: z.enum(CURRENCIES).optional(),
});

export async function updateDealAction(dealId: string, input: Record<string, unknown>) {
  return guarded("deals:update", async (_userId, role) => {
    const f = dealFields.parse(input);
    const canValue = await sessionHasPermission(role, "deals:value");
    await updateDealFields(id.parse(dealId), {
      name: f.name,
      email: f.email || null,
      company: f.company,
      phone: f.phone,
      website: f.website,
      service: f.service,
      ownerId: f.ownerId || null,
      ...(canValue
        ? { valueAmount: f.valueAmount === "" || f.valueAmount == null ? null : Number(f.valueAmount), currency: f.currency ?? "USD" }
        : {}),
    });
  });
}

export async function createDealAction(input: Record<string, unknown>) {
  return guarded("deals:update", async (userId, role) => {
    const f = dealFields.extend({ source: z.enum(SOURCES).default("manual"), note: optionalText(5000) }).parse(input);
    const canValue = await sessionHasPermission(role, "deals:value");
    const d = await createDeal(
      {
        name: f.name,
        email: f.email || null,
        company: f.company,
        phone: f.phone,
        website: f.website,
        service: f.service,
        source: f.source,
        ownerId: f.ownerId || userId,
        ...(canValue && f.valueAmount !== "" && f.valueAmount != null
          ? { valueAmount: Number(f.valueAmount), currency: f.currency ?? "USD" }
          : {}),
      },
      userId,
    );
    if (f.note) await addActivity({ dealId: d.id, type: "note", body: f.note, userId });
    if (f.website) await linkRecentAudit(d.id, f.website, userId);
    return { id: d.id };
  });
}

/** A prospect added from the Audits page: attach the audit we already made for their site. */
async function linkRecentAudit(dealId: string, website: string, userId: string) {
  let host: string;
  try {
    host = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`).hostname.replace(/^www\./, "");
  } catch {
    return;
  }
  const [a] = await db
    .select({ id: audits.id, token: audits.token })
    .from(audits)
    .where(and(eq(audits.host, host), isNull(audits.dealId), eq(audits.origin, "admin"), gte(audits.createdAt, new Date(Date.now() - 30 * 86400_000))))
    .orderBy(desc(audits.createdAt))
    .limit(1);
  if (!a) return;
  await db.update(audits).set({ dealId }).where(eq(audits.id, a.id));
  await addActivity({ dealId, type: "audit", body: `Website audit linked for ${host}`, meta: { token: a.token, auditId: a.id }, userId });
}

/** Records a reply sent from the reply panel. Returns what's needed to undo it. */
export async function logReplyAction(dealId: string, channel: "email" | "whatsapp", templateId: string | null, text: string) {
  return guarded("deals:update", async (userId) => {
    const dId = id.parse(dealId);
    const [before] = await db
      .select({ stage: deals.stage, firstRepliedAt: deals.firstRepliedAt, next: deals.nextFollowUpAt })
      .from(deals)
      .where(eq(deals.id, dId))
      .limit(1);
    if (!before) throw new Error("Deal not found");
    const at = new Date();
    await logReply(dId, z.enum(["email", "whatsapp"]).parse(channel), { userId, templateId, text: text.slice(0, 5000) });
    return {
      undo: {
        at: at.toISOString(),
        prevStage: before.stage,
        prevFirstRepliedAt: before.firstRepliedAt?.toISOString() ?? null,
        prevFollowUp: before.next,
      },
    };
  });
}

export type ReplyUndo = { at: string; prevStage: string; prevFirstRepliedAt: string | null; prevFollowUp: string | null };

/** Reverts a reply logged by mistake: removes the entries it created and restores the deal. */
export async function undoReplyAction(dealId: string, undo: ReplyUndo) {
  return guarded("deals:update", async () => {
    const dId = id.parse(dealId);
    const at = new Date(undo.at);
    if (Number.isNaN(at.getTime()) || Date.now() - at.getTime() > 15 * 60_000) throw new Error("Too late to undo");
    await db
      .delete(dealActivities)
      .where(
        and(
          eq(dealActivities.dealId, dId),
          // the DB stamps rows with its own clock; allow a few seconds of drift
          gte(dealActivities.createdAt, new Date(at.getTime() - 5000)),
          inArray(dealActivities.type, ["email_sent", "whatsapp_sent", "stage_change"]),
        ),
      );
    await db
      .update(deals)
      .set({
        stage: z.enum(STAGES).parse(undo.prevStage),
        firstRepliedAt: undo.prevFirstRepliedAt ? new Date(undo.prevFirstRepliedAt) : null,
        nextFollowUpAt: undo.prevFollowUp,
        updatedAt: new Date(),
      })
      .where(eq(deals.id, dId));
  });
}

export async function deleteDealAction(dealId: string) {
  return guarded("deals:delete", async () => {
    await deleteDeal(id.parse(dealId));
  });
}
