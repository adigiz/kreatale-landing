import {
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
  uuid,
  varchar,
  integer,
  boolean,
  date,
  char,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "editor",
  "author",
  "sales",
  "viewer",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Roles table (for RBAC)
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  permissions: jsonb("permissions").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table (Blog posts)
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  // one of BLOG_CATEGORIES in src/lib/blogCategories.ts; null = uncategorised
  category: varchar("category", { length: 50 }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 10 }).notNull().default("en"),
  status: contentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  country: varchar("country", { length: 100 }),
  client: varchar("client", { length: 255 }),
  duration: varchar("duration", { length: 255 }),
  timeline: varchar("timeline", { length: 100 }),
  heroImage: text("hero_image"),
  portfolioImage: text("portfolio_image"),
  projectType: varchar("project_type", { length: 255 }),
  techStacks: jsonb("tech_stacks").notNull().default("[]"),
  images: jsonb("images").notNull().default("[]"),
  sections: jsonb("sections").notNull().default("{}"),
  translations: jsonb("translations").notNull().default("{}"),
  demoUrl: text("demo_url"),
  locale: varchar("locale", { length: 10 }).notNull().default("en"),
  status: contentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Media table
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 500 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"), // Size in bytes
  uploadedById: uuid("uploaded_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Preview tokens table (for live preview)
export const previewTokens = pgTable("preview_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'post' or 'project' ('demo-site' was used by the removed demo sites)
  contentId: uuid("content_id"), // Nullable if new
  data: jsonb("data"), // Store unsaved content for preview
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contacts table (Contact form submissions)
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  inquiry: varchar("inquiry", { length: 100 }).notNull(),
  message: text("message").notNull(),
  read: text("read").default("false").notNull(), // 'true' or 'false' as string
  // where the visitor came from: { landingPage, referrer, formPage, utm }
  source: jsonb("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sales pipeline (drizzle/0002_pipeline.sql). Stage, service, source and activity type are
// varchar with CHECK constraints in SQL; the allowed values live in src/lib/pipeline/constants.ts.
export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }),
  company: varchar("company", { length: 160 }),
  phone: varchar("phone", { length: 40 }),
  website: text("website"),
  service: varchar("service", { length: 40 }).notNull().default("not-sure"),
  stage: varchar("stage", { length: 20 }).notNull().default("new"),
  lostReason: varchar("lost_reason", { length: 60 }),
  lostNote: text("lost_note"),
  valueAmount: integer("value_amount"),
  currency: char("currency", { length: 3 }).notNull().default("USD"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  source: varchar("source", { length: 20 }).notNull().default("manual"),
  nextFollowUpAt: date("next_follow_up_at"),
  firstRepliedAt: timestamp("first_replied_at", { withTimezone: true }),
  stageChangedAt: timestamp("stage_changed_at", { withTimezone: true }).defaultNow().notNull(),
  wonAt: timestamp("won_at", { withTimezone: true }),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dealActivities = pgTable("deal_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  type: varchar("type", { length: 20 }).notNull(),
  body: text("body"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const audits = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: varchar("token", { length: 32 }).notNull().unique(),
  url: text("url").notNull(),
  host: varchar("host", { length: 255 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default("queued"),
  origin: varchar("origin", { length: 10 }).notNull().default("admin"),
  requesterEmail: varchar("requester_email", { length: 200 }),
  requesterName: varchar("requester_name", { length: 160 }),
  dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  preparedFor: varchar("prepared_for", { length: 160 }),
  scores: jsonb("scores"),
  vitals: jsonb("vitals"),
  checks: jsonb("checks"),
  fixes: jsonb("fixes"),
  overall: integer("overall"),
  error: text("error"),
  ipHash: varchar("ip_hash", { length: 64 }),
  attempts: integer("attempts").notNull().default(0),
  views: integer("views").notNull().default(0),
  firstViewedAt: timestamp("first_viewed_at", { withTimezone: true }),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;

export const replyTemplates = pgTable("reply_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull(),
  subject: varchar("subject", { length: 200 }),
  body: text("body").notNull(),
  stageHint: varchar("stage_hint", { length: 20 }),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  projects: many(projects),
  media: many(media),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

// Projects don't have authorId for now, can be added later if needed
// export const projectsRelations = relations(projects, ({ one }) => ({
//   author: one(users, {
//     fields: [projects.authorId],
//     references: [users.id],
//   }),
// }));

export const mediaRelations = relations(media, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [media.uploadedById],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type PreviewToken = typeof previewTokens.$inferSelect;
export type NewPreviewToken = typeof previewTokens.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
export type DealActivity = typeof dealActivities.$inferSelect;
export type NewDealActivity = typeof dealActivities.$inferInsert;
export type ReplyTemplate = typeof replyTemplates.$inferSelect;
export type NewReplyTemplate = typeof replyTemplates.$inferInsert;
