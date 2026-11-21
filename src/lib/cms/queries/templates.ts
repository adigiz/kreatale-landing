import { asc, eq } from "drizzle-orm";
import { db, replyTemplates, type NewReplyTemplate } from "../db";

export async function listTemplates() {
  return db.select().from(replyTemplates).orderBy(asc(replyTemplates.sort), asc(replyTemplates.name));
}

export async function getTemplate(id: string) {
  const [t] = await db.select().from(replyTemplates).where(eq(replyTemplates.id, id)).limit(1);
  return t ?? null;
}

export async function createTemplate(t: NewReplyTemplate) {
  const [created] = await db.insert(replyTemplates).values(t).returning();
  return created;
}

export async function updateTemplate(id: string, patch: Partial<NewReplyTemplate>) {
  const [updated] = await db
    .update(replyTemplates)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(replyTemplates.id, id))
    .returning();
  return updated;
}

export async function deleteTemplate(id: string) {
  await db.delete(replyTemplates).where(eq(replyTemplates.id, id));
}
