import { and, asc, desc, eq, gte, inArray, isNull, lt, lte, notInArray, or, sql, ilike } from "drizzle-orm";
import { db, deals, dealActivities, contacts, users, type Deal, type NewDeal } from "../db";
import {
  OPEN_STAGES,
  FOLLOW_UP_DAYS,
  REPLY_DUE_HOURS,
  addBusinessDays,
  serviceFromInquiry,
  type ActivityType,
  type Stage,
  type LostReason,
} from "@/lib/pipeline/constants";

export type DealFilters = {
  stage?: Stage | "open";
  ownerId?: string;
  service?: string;
  due?: boolean;
  q?: string;
};

export async function addActivity(a: {
  dealId: string;
  type: ActivityType;
  body?: string | null;
  meta?: Record<string, unknown> | null;
  userId?: string | null;
}) {
  await db.insert(dealActivities).values({
    dealId: a.dealId,
    type: a.type,
    body: a.body ?? null,
    meta: a.meta ?? null,
    userId: a.userId ?? null,
  });
}

/**
 * Turns a saved enquiry into a deal. If the same email already has an open deal, the enquiry
 * is added to that deal's timeline instead, so one client = one deal.
 */
export async function createDealFromContact(c: {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry: string;
  message: string;
  source?: "contact_form" | "audit";
  website?: string | null;
}): Promise<{ dealId: string; isNew: boolean }> {
  const [open] = await db
    .select({ id: deals.id })
    .from(deals)
    .where(and(sql`lower(${deals.email}) = ${c.email.toLowerCase()}`, inArray(deals.stage, OPEN_STAGES)))
    .orderBy(desc(deals.createdAt))
    .limit(1);

  if (open) {
    await addActivity({ dealId: open.id, type: "enquiry", body: c.message, meta: { contactId: c.id, inquiry: c.inquiry } });
    await db.update(deals).set({ updatedAt: new Date() }).where(eq(deals.id, open.id));
    return { dealId: open.id, isNew: false };
  }

  const [created] = await db
    .insert(deals)
    .values({
      contactId: c.id,
      name: c.name.slice(0, 160),
      email: c.email.slice(0, 200),
      company: c.company?.slice(0, 160) || null,
      phone: c.phone?.slice(0, 40) || null,
      website: c.website || null,
      service: serviceFromInquiry(c.inquiry),
      source: c.source ?? "contact_form",
      stage: "new",
    })
    .returning({ id: deals.id });
  await addActivity({ dealId: created.id, type: "enquiry", body: c.message, meta: { contactId: c.id, inquiry: c.inquiry } });
  return { dealId: created.id, isNew: true };
}

export async function createDeal(d: NewDeal, userId?: string | null) {
  const [created] = await db.insert(deals).values(d).returning();
  await addActivity({ dealId: created.id, type: "note", body: "Deal added by hand.", userId });
  return created;
}

export async function listDeals(f: DealFilters = {}) {
  const where = [];
  if (f.stage === "open") where.push(inArray(deals.stage, OPEN_STAGES));
  else if (f.stage) where.push(eq(deals.stage, f.stage));
  if (f.ownerId) where.push(eq(deals.ownerId, f.ownerId));
  if (f.service) where.push(eq(deals.service, f.service));
  if (f.due) {
    where.push(inArray(deals.stage, OPEN_STAGES));
    where.push(lte(deals.nextFollowUpAt, sql`current_date`));
  }
  if (f.q) {
    const q = `%${f.q}%`;
    where.push(or(ilike(deals.name, q), ilike(deals.email, q), ilike(deals.company, q), ilike(deals.website, q)));
  }
  return db
    .select({
      deal: deals,
      ownerName: users.name,
      lastActivityAt: sql<Date | null>`(select max(created_at) from deal_activities a where a.deal_id = ${deals.id})`,
    })
    .from(deals)
    .leftJoin(users, eq(users.id, deals.ownerId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(deals.updatedAt))
    .limit(500);
}

export async function getDeal(id: string) {
  const [row] = await db
    .select({ deal: deals, ownerName: users.name })
    .from(deals)
    .leftJoin(users, eq(users.id, deals.ownerId))
    .where(eq(deals.id, id))
    .limit(1);
  if (!row) return null;
  const activities = await db
    .select({ a: dealActivities, userName: users.name })
    .from(dealActivities)
    .leftJoin(users, eq(users.id, dealActivities.userId))
    .where(eq(dealActivities.dealId, id))
    .orderBy(desc(dealActivities.createdAt))
    .limit(300);
  const linkedContacts = await db
    .select({ id: contacts.id, inquiry: contacts.inquiry, createdAt: contacts.createdAt, source: contacts.source })
    .from(contacts)
    .where(
      or(
        row.deal.contactId ? eq(contacts.id, row.deal.contactId) : sql`false`,
        row.deal.email ? sql`lower(${contacts.email}) = ${row.deal.email.toLowerCase()}` : sql`false`,
      ),
    )
    .orderBy(desc(contacts.createdAt));
  return { ...row, activities, linkedContacts };
}

/** Moves a deal to a stage, records it, and sets the default next follow-up for that stage. */
export async function changeStage(
  id: string,
  to: Stage,
  opts: { userId?: string | null; lostReason?: LostReason; lostNote?: string | null } = {},
) {
  const current = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
  const d = current[0];
  if (!d) throw new Error("Deal not found");
  if (d.stage === to) return d;
  const now = new Date();
  const patch: Partial<Deal> = {
    stage: to,
    stageChangedAt: now,
    updatedAt: now,
    nextFollowUpAt: FOLLOW_UP_DAYS[to] ? addBusinessDays(now, FOLLOW_UP_DAYS[to]!) : to === "won" || to === "lost" ? null : d.nextFollowUpAt,
  };
  if (to === "replied" && !d.firstRepliedAt) patch.firstRepliedAt = now;
  if (to === "won") {
    patch.wonAt = now;
    patch.closedAt = now;
  }
  if (to === "lost") {
    patch.closedAt = now;
    patch.lostReason = opts.lostReason ?? "other";
    patch.lostNote = opts.lostNote ?? null;
  }
  if (to !== "lost" && d.stage === "lost") {
    patch.lostReason = null;
    patch.lostNote = null;
    patch.closedAt = null;
  }
  const [updated] = await db.update(deals).set(patch).where(eq(deals.id, id)).returning();
  await addActivity({
    dealId: id,
    type: "stage_change",
    userId: opts.userId,
    meta: { from: d.stage, to, lostReason: patch.lostReason ?? undefined },
    body: opts.lostNote ?? null,
  });
  return updated;
}

/** Records that someone replied (email or WhatsApp) and moves a new deal to Replied. */
export async function logReply(
  id: string,
  channel: "email" | "whatsapp",
  opts: { userId?: string | null; templateId?: string | null; text?: string | null },
) {
  await addActivity({
    dealId: id,
    type: channel === "email" ? "email_sent" : "whatsapp_sent",
    userId: opts.userId,
    body: opts.text ?? null,
    meta: opts.templateId ? { templateId: opts.templateId } : null,
  });
  const [d] = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
  if (!d) throw new Error("Deal not found");
  const now = new Date();
  if (d.stage === "new") return changeStage(id, "replied", { userId: opts.userId });
  const [updated] = await db
    .update(deals)
    .set({
      firstRepliedAt: d.firstRepliedAt ?? now,
      updatedAt: now,
      nextFollowUpAt: FOLLOW_UP_DAYS[d.stage as Stage] ? addBusinessDays(now, FOLLOW_UP_DAYS[d.stage as Stage]!) : d.nextFollowUpAt,
    })
    .where(eq(deals.id, id))
    .returning();
  return updated;
}

export async function updateDealFields(id: string, patch: Partial<NewDeal>) {
  const [updated] = await db
    .update(deals)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(deals.id, id))
    .returning();
  return updated;
}

export async function setFollowUp(id: string, date: string | null, userId?: string | null) {
  await updateDealFields(id, { nextFollowUpAt: date });
  await addActivity({ dealId: id, type: "follow_up_set", userId, meta: { date } });
}

export async function deleteDeal(id: string) {
  await db.delete(deals).where(eq(deals.id, id));
}

/** Deals still waiting for a first reply, oldest first. */
/** Deals that started with them writing to us; outreach and manual deals have nobody waiting. */
const INBOUND = ["contact_form", "audit", "imported"];

export async function needsReply(limit = 20) {
  return db
    .select()
    .from(deals)
    .where(and(eq(deals.stage, "new"), isNull(deals.firstRepliedAt), inArray(deals.source, INBOUND)))
    .orderBy(asc(deals.createdAt))
    .limit(limit);
}

/** Open deals whose follow-up date is today or earlier. */
export async function followUpsDue(limit = 30) {
  return db
    .select()
    .from(deals)
    .where(and(inArray(deals.stage, OPEN_STAGES), lte(deals.nextFollowUpAt, sql`current_date`)))
    .orderBy(asc(deals.nextFollowUpAt))
    .limit(limit);
}

export async function pipelineCounts() {
  return db.select({ stage: deals.stage, n: sql<number>`count(*)::int` }).from(deals).groupBy(deals.stage);
}

/** Sum of value per currency for open deals and for deals won since `since`. */
export async function pipelineValues(since: Date) {
  const open = await db
    .select({ currency: deals.currency, total: sql<number>`coalesce(sum(${deals.valueAmount}),0)::int`, n: sql<number>`count(*)::int` })
    .from(deals)
    .where(inArray(deals.stage, OPEN_STAGES))
    .groupBy(deals.currency);
  const won = await db
    .select({ currency: deals.currency, total: sql<number>`coalesce(sum(${deals.valueAmount}),0)::int`, n: sql<number>`count(*)::int` })
    .from(deals)
    .where(and(eq(deals.stage, "won"), gte(deals.wonAt, since)))
    .groupBy(deals.currency);
  return { open, won };
}

/** Won vs lost (excluding spam and imported "outcome not recorded") over a window. */
export async function winRate(since: Date) {
  const [r] = await db
    .select({
      won: sql<number>`count(*) filter (where ${deals.stage} = 'won')::int`,
      lost: sql<number>`count(*) filter (where ${deals.stage} = 'lost' and coalesce(${deals.lostReason},'') <> 'spam' and coalesce(${deals.lostNote},'') <> 'Imported, outcome not recorded')::int`,
    })
    .from(deals)
    .where(gte(deals.closedAt, since));
  return r;
}

/** Median hours from enquiry to first reply over a window (null when no data). */
export async function medianReplyHours(since: Date) {
  const [r] = await db
    .select({
      h: sql<number | null>`percentile_cont(0.5) within group (order by extract(epoch from (${deals.firstRepliedAt} - ${deals.createdAt})) / 3600)`,
    })
    .from(deals)
    .where(and(gte(deals.createdAt, since), sql`${deals.firstRepliedAt} is not null`, inArray(deals.source, ["contact_form", "audit"])));
  return r?.h ?? null;
}

/** What the morning digest reports. */
export async function digestData() {
  const overdueBefore = new Date(Date.now() - REPLY_DUE_HOURS * 3600_000);
  const [late, due, auditLeads, staleProposals] = await Promise.all([
    db
      .select()
      .from(deals)
      .where(and(eq(deals.stage, "new"), isNull(deals.firstRepliedAt), inArray(deals.source, INBOUND), lt(deals.createdAt, overdueBefore)))
      .orderBy(asc(deals.createdAt)),
    followUpsDue(50),
    db
      .select()
      .from(deals)
      .where(and(eq(deals.source, "audit"), gte(deals.createdAt, new Date(Date.now() - 24 * 3600_000))))
      .orderBy(desc(deals.createdAt)),
    db
      .select()
      .from(deals)
      .where(and(eq(deals.stage, "proposal"), lt(deals.updatedAt, new Date(Date.now() - 7 * 24 * 3600_000))))
      .orderBy(asc(deals.updatedAt)),
  ]);
  return { late, due, auditLeads, staleProposals };
}

export async function ownerOptions() {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(notInArray(users.role, ["viewer"]))
    .orderBy(asc(users.name));
}
