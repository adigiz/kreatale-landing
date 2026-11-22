"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import { blockMorpheusUser, deleteMorpheusUser, MorpheusError, signOutMorpheusUser, unblockMorpheusUser } from "@/lib/morpheus";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const id = z.string().trim().min(1).max(100);

async function run<T>(fn: (email: string) => Promise<T>): Promise<ActionResult<T>> {
  let session;
  try {
    session = await requirePermission("morpheus:manage");
  } catch {
    return { ok: false, error: "You don't have permission to do that." };
  }
  try {
    const data = await fn(session.user.email ?? session.user.id);
    revalidatePath("/[locale]/admin/morpheus", "layout");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof MorpheusError ? e.message : "Something went wrong talking to Morpheus." };
  }
}

export async function blockAction(rawId: string, rawReason: string) {
  const userId = id.parse(rawId);
  const reason = z.string().trim().max(500).parse(rawReason ?? "");
  return run(async (by) => {
    const r = await blockMorpheusUser(userId, reason || undefined);
    console.info(`Morpheus account ${r.user.email} blocked by ${by}`);
    return { sessionsRevoked: r.sessionsRevoked };
  });
}

export async function unblockAction(rawId: string) {
  const userId = id.parse(rawId);
  return run(async (by) => {
    const r = await unblockMorpheusUser(userId);
    console.info(`Morpheus account ${r.user.email} unblocked by ${by}`);
  });
}

export async function signOutAction(rawId: string) {
  const userId = id.parse(rawId);
  return run(async () => {
    const r = await signOutMorpheusUser(userId);
    return { sessionsRevoked: r.sessionsRevoked };
  });
}

export async function deleteAction(rawId: string) {
  const userId = id.parse(rawId);
  return run(async (by) => {
    await deleteMorpheusUser(userId);
    console.info(`Morpheus account ${userId} deleted by ${by}`);
  });
}
