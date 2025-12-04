import { db, posts, users, type NewPost } from "../db";
import { eq, desc, and, like, or } from "drizzle-orm";

export async function getAllPosts(locale?: string) {
  const query = db
    .select({
      post: posts,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt));

  if (locale) {
    query.where(eq(posts.locale, locale));
  }

  return await query;
}

export async function getPostById(id: string) {
  const [result] = await db
    .select({
      post: posts,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  return result || null;
}

export async function getPostBySlug(slug: string, locale?: string) {
  const conditions = [eq(posts.slug, slug)];
  if (locale) {
    conditions.push(eq(posts.locale, locale));
  }

  const [result] = await db
    .select({
      post: posts,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...conditions))
    .limit(1);

  return result || null;
}

export async function getPublishedPosts(locale?: string) {
  const conditions = [eq(posts.status, "published")];
  if (locale) {
    conditions.push(eq(posts.locale, locale));
  }

  return await db
    .select({
      post: posts,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt));
}

export async function createPost(data: NewPost) {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function updatePost(id: string, data: Partial<NewPost>) {
  const [post] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return post;
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id));
}

export async function searchPosts(query: string, locale?: string) {
  const conditions = [
    or(
      like(posts.title, `%${query}%`),
      like(posts.content, `%${query}%`),
      like(posts.excerpt, `%${query}%`)
    ),
  ];

  if (locale) {
    conditions.push(eq(posts.locale, locale));
  }

  return await db
    .select({
      post: posts,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...conditions))
    .orderBy(desc(posts.createdAt));
}
