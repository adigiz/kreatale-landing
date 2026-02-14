CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'replied', 'qualified', 'converted', 'lost', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin', 'editor', 'author', 'sales', 'viewer');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"search_term" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"phone" varchar(50),
	"inquiry" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"read" text DEFAULT 'false' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"template_id" varchar(100) NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demo_sites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"address" text,
	"phone" varchar(50),
	"website" text,
	"rating" varchar(10),
	"review_count" integer DEFAULT 0,
	"google_maps_url" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"is_new_listing" boolean DEFAULT false,
	"notes" text,
	"city" varchar(255),
	"district" varchar(255),
	"state" varchar(255),
	"postal_code" varchar(20),
	"country" varchar(255),
	"location_id" uuid,
	"category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"country" varchar(100),
	"state" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(500) NOT NULL,
	"url" text NOT NULL,
	"mime_type" varchar(100),
	"size" integer,
	"uploaded_by_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featured_image" text,
	"author_id" uuid NOT NULL,
	"locale" varchar(10) DEFAULT 'en' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preview_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(255) NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_id" uuid,
	"data" jsonb,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "preview_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(500) NOT NULL,
	"title" varchar(500) NOT NULL,
	"subtitle" varchar(500),
	"country" varchar(100),
	"client" varchar(255),
	"duration" varchar(255),
	"timeline" varchar(100),
	"hero_image" text,
	"portfolio_image" text,
	"project_type" varchar(255),
	"tech_stacks" jsonb DEFAULT '[]' NOT NULL,
	"images" jsonb DEFAULT '[]' NOT NULL,
	"sections" jsonb DEFAULT '{}' NOT NULL,
	"translations" jsonb DEFAULT '{}' NOT NULL,
	"demo_url" text,
	"locale" varchar(10) DEFAULT 'en' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"permissions" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;