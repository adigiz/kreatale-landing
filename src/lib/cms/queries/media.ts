import { db, media, users, type NewMedia } from "../db";
import { eq, desc, like } from "drizzle-orm";

export async function getAllMedia() {
  return await db
    .select({
      media: media,
      uploadedBy: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(media)
    .leftJoin(users, eq(media.uploadedById, users.id))
    .orderBy(desc(media.createdAt));
}

export async function getMediaById(id: string) {
  const [result] = await db
    .select({
      media: media,
      uploadedBy: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(media)
    .leftJoin(users, eq(media.uploadedById, users.id))
    .where(eq(media.id, id))
    .limit(1);

  return result || null;
}

export async function createMedia(data: NewMedia) {
  const [mediaItem] = await db.insert(media).values(data).returning();
  return mediaItem;
}

export async function deleteMedia(id: string) {
  await db.delete(media).where(eq(media.id, id));
}

export async function searchMedia(query: string) {
  return await db
    .select({
      media: media,
      uploadedBy: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(media)
    .leftJoin(users, eq(media.uploadedById, users.id))
    .where(like(media.filename, `%${query}%`))
    .orderBy(desc(media.createdAt));
}
