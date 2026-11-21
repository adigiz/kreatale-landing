// Runs audit jobs stored in the `audits` table. Jobs start right after the request (via after())
// and the daily cron sweeps up any that a restart left queued or running.

import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import { db, audits, type Audit } from "@/lib/cms/db";
import { runAudit } from "./run";

const MAX_ATTEMPTS = 3;
const MAX_PARALLEL = 2;
let running = 0;
const waiting: (() => void)[] = [];

async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  running++;
  try {
    return await fn();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

/** Claims and runs one audit. Returns the finished row, or null if another worker had it. */
export async function runAuditJob(id: string): Promise<Audit | null> {
  return slot(async () => {
    const [claimed] = await db
      .update(audits)
      .set({ status: "running", startedAt: new Date(), attempts: sql`${audits.attempts} + 1` })
      .where(and(eq(audits.id, id), inArray(audits.status, ["queued", "running"]), lt(audits.attempts, MAX_ATTEMPTS)))
      .returning();
    if (!claimed) return null;
    try {
      const r = await runAudit(claimed.url);
      const [done] = await db
        .update(audits)
        .set({
          status: "done",
          scores: r.scores,
          vitals: r.vitals,
          checks: r.checks,
          fixes: r.fixes,
          overall: r.overall,
          error: r.errors.length ? r.errors.join("\n") : null,
          completedAt: new Date(),
        })
        .where(eq(audits.id, id))
        .returning();
      return done;
    } catch (err) {
      const [failed] = await db
        .update(audits)
        .set({ status: "failed", error: err instanceof Error ? err.message : String(err), completedAt: new Date() })
        .where(eq(audits.id, id))
        .returning();
      return failed;
    }
  });
}

/** Re-runs audits stuck by a restart. Called by the daily cron. Returns how many it ran. */
export async function sweepStuckAudits(): Promise<number> {
  const stuck = await db
    .select({ id: audits.id, attempts: audits.attempts })
    .from(audits)
    .where(
      or(
        and(eq(audits.status, "queued"), lt(audits.createdAt, sql`now() - interval '5 minutes'`)),
        and(eq(audits.status, "running"), lt(audits.startedAt, sql`now() - interval '10 minutes'`)),
      ),
    )
    .limit(20);
  let n = 0;
  for (const s of stuck) {
    if (s.attempts >= MAX_ATTEMPTS) {
      await db.update(audits).set({ status: "failed", error: "Gave up after several tries.", completedAt: new Date() }).where(eq(audits.id, s.id));
      continue;
    }
    if (await runAuditJob(s.id)) n++;
  }
  return n;
}
