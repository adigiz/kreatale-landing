import { db, projects, type NewProject } from "../db";
import { eq, desc, and, like, or } from "drizzle-orm";

export async function getAllProjects(locale?: string) {
  const query = db.select().from(projects).orderBy(desc(projects.createdAt));

  if (locale) {
    query.where(eq(projects.locale, locale));
  }

  return await query;
}

export async function getProjectById(id: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return project || null;
}

export async function getProjectBySlug(slug: string, locale?: string) {
  const conditions = [eq(projects.slug, slug)];
  if (locale) {
    conditions.push(eq(projects.locale, locale));
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(and(...conditions))
    .limit(1);

  return project || null;
}

export async function getPublishedProjects(locale?: string) {
  const conditions = [eq(projects.status, "published")];
  if (locale) {
    conditions.push(eq(projects.locale, locale));
  }

  return await db
    .select()
    .from(projects)
    .where(and(...conditions))
    .orderBy(desc(projects.publishedAt));
}

export async function createProject(data: NewProject) {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
}

export async function updateProject(id: string, data: Partial<NewProject>) {
  const [project] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return project;
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}

export async function searchProjects(query: string, locale?: string) {
  const conditions = [
    or(
      like(projects.title, `%${query}%`),
      like(projects.subtitle, `%${query}%`),
      like(projects.client, `%${query}%`)
    ),
  ];

  if (locale) {
    conditions.push(eq(projects.locale, locale));
  }

  return await db
    .select()
    .from(projects)
    .where(and(...conditions))
    .orderBy(desc(projects.createdAt));
}
