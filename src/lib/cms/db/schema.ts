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

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "replied",
  "qualified",
  "converted",
  "lost",
  "ignored",
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
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'post' or 'project'
  contentId: uuid("content_id").notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Locations table
export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Samarinda"
  slug: varchar("slug", { length: 255 }).notNull().unique(), // e.g., "samarinda"
  country: varchar("country", { length: 100 }), // Optional
  state: varchar("state", { length: 100 }), // e.g., "East Kalimantan"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Coffee Shop"
  slug: varchar("slug", { length: 255 }).notNull().unique(), // e.g., "coffee-shop"
  searchTerm: varchar("search_term", { length: 255 }).notNull(), // Default query term
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leads table
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  website: text("website"),
  rating: varchar("rating", { length: 10 }),
  reviewCount: integer("review_count").default(0),
  googleMapsUrl: text("google_maps_url"),
  status: leadStatusEnum("status").default("new").notNull(),
  isNewListing: boolean("is_new_listing").default(false),
  notes: text("notes"),
  
  // Detailed Location Info
  city: varchar("city", { length: 255 }),
  district: varchar("district", { length: 255 }),
  state: varchar("state", { length: 255 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 255 }),
  
  // Relations
  locationId: uuid("location_id").references(() => locations.id),
  categoryId: uuid("category_id").references(() => categories.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

