import { randomBytes } from "node:crypto";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db, audits, deals, users, type Audit, type NewAudit } from "../db";

export const newAuditToken = () => randomBytes(16).toString("base64url"); // 22 chars, unguessable

export async function createAudit(a: Omit<NewAudit, "token">): Promise<Audit> {
  const [row] = await db.insert(audits).values({ status: "queued", ...a, token: newAuditToken() }).returning();
  return row;
}

export async function getAuditByToken(token: string) {
  if (!/^[A-Za-z0-9_-]{16,32}$/.test(token)) return null;
  const [row] = await db.select().from(audits).where(eq(audits.token, token)).limit(1);
  return row ?? null;
}

export async function getAudit(id: string) {
  const [row] = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
  return row ?? null;
}

export async function listAudits(f: { origin?: "public" | "admin"; limit?: number } = {}) {
  return db
    .select({
      audit: audits,
      dealName: deals.name,
      dealCompany: deals.company,
      createdByName: users.name,
    })
    .from(audits)
    .leftJoin(deals, eq(deals.id, audits.dealId))
    .leftJoin(users, eq(users.id, audits.createdBy))
    .where(f.origin ? eq(audits.origin, f.origin) : undefined)
    .orderBy(desc(audits.createdAt))
    .limit(f.limit ?? 200);
}

/** A finished audit of the same host in the last `hours`, to reuse instead of re-running. */
export async function recentAuditForHost(host: string, hours = 24) {
  const [row] = await db
    .select()
    .from(audits)
    .where(and(eq(audits.host, host), eq(audits.status, "done"), gte(audits.completedAt, sql`now() - make_interval(hours => ${hours})`)))
    .orderBy(desc(audits.completedAt))
    .limit(1);
  return row ?? null;
}

export async function publicAuditsToday() {
  const [r] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(audits)
    .where(and(eq(audits.origin, "public"), gte(audits.createdAt, sql`now() - interval '24 hours'`)));
  return r?.n ?? 0;
}

/** Counts a view; returns the audit and whether this was the first one. */
export async function recordAuditView(token: string): Promise<{ audit: Audit; first: boolean } | null> {
  const [row] = await db
    .update(audits)
    .set({
      views: sql`${audits.views} + 1`,
      lastViewedAt: new Date(),
      firstViewedAt: sql`coalesce(${audits.firstViewedAt}, now())`,
    })
    .where(eq(audits.token, token))
    .returning();
  if (!row) return null;
  return { audit: row, first: row.views === 1 };
}

export async function deleteAudit(id: string) {
  await db.delete(audits).where(eq(audits.id, id));
}

export async function auditStats(since: Date) {
  const [r] = await db
    .select({
      total: sql<number>`count(*)::int`,
      publicRuns: sql<number>`count(*) filter (where ${audits.origin} = 'public')::int`,
      viewed: sql<number>`count(*) filter (where ${audits.origin} = 'admin' and ${audits.views} > 0)::int`,
      adminRuns: sql<number>`count(*) filter (where ${audits.origin} = 'admin')::int`,
    })
    .from(audits)
    .where(gte(audits.createdAt, since));
  return r;
}
