import { db, users } from "@/lib/cms/db";
import { eq } from "drizzle-orm";

export async function getAllUsers() {
  const allUsers = await db.select().from(users).orderBy(users.createdAt);
  return allUsers;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user || null;
}

export async function createUser(data: {
  email: string;
  name?: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "editor" | "author" | "viewer";
}) {
  const [user] = await db
    .insert(users)
    .values({
      email: data.email,
      name: data.name || null,
      passwordHash: data.passwordHash,
      role: data.role,
    })
    .returning();
  return user;
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    name?: string | null;
    passwordHash?: string;
    role?: "super_admin" | "admin" | "editor" | "author" | "viewer";
  }
) {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return user || null;
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}


