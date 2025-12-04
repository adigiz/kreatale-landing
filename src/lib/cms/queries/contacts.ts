import { db, contacts, type NewContact } from "../db";
import { eq, desc, like, or } from "drizzle-orm";

export async function getAllContacts() {
  return await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));
}

export async function getContactById(id: string) {
  const [result] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);

  return result || null;
}

export async function getUnreadContacts() {
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.read, "false"))
    .orderBy(desc(contacts.createdAt));
}

export async function createContact(data: NewContact) {
  const [contact] = await db.insert(contacts).values(data).returning();
  return contact;
}

export async function markContactAsRead(id: string) {
  const [contact] = await db
    .update(contacts)
    .set({ read: "true" })
    .where(eq(contacts.id, id))
    .returning();
  return contact;
}

export async function markContactAsUnread(id: string) {
  const [contact] = await db
    .update(contacts)
    .set({ read: "false" })
    .where(eq(contacts.id, id))
    .returning();
  return contact;
}

export async function deleteContact(id: string) {
  await db.delete(contacts).where(eq(contacts.id, id));
}

export async function searchContacts(query: string) {
  return await db
    .select()
    .from(contacts)
    .where(
      or(
        like(contacts.name, `%${query}%`),
        like(contacts.email, `%${query}%`),
        like(contacts.company, `%${query}%`),
        like(contacts.message, `%${query}%`)
      )
    )
    .orderBy(desc(contacts.createdAt));
}
