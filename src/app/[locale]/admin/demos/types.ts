import * as z from "zod";

export const demoSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  websiteName: z.string().optional(),
  templateId: z.string().min(1, "Template is required"),
  isPublished: z.boolean(),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  accentHoverColor: z.string().optional(),
  language: z.enum(["en", "id"]).default("en").optional(),
  currency: z.string().default("Rp").optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  /** Main hero column headline (line 1). Empty = use template default copy. */
  heroHeadline: z.string().optional(),
  /** Main hero column headline (italic line 2). Empty = use template default. */
  heroHeadlineItalic: z.string().optional(),
  heroImage: z.string().optional(),
  price: z.string().optional(),
  days: z.string().optional(),
  location: z.string().optional(),
  destinations: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().optional(),
        region: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        price: z.string().optional(),
        /** Car / bedding: links product to package slug (brand or collection). */
        brandSlug: z.string().optional(),
        /** Car template: optional PDP content */
        specs: z
          .object({
            acceleration: z.string().optional(),
            topSpeed: z.string().optional(),
            power: z.string().optional(),
            transmission: z.string().optional(),
          })
          .optional(),
        features: z.array(z.string()).optional(),
        inclusions: z.array(z.string()).optional(),
        gallery: z.array(z.string()).optional(),
        /** Bedding PLP / PDP */
        badgeLabel: z.string().optional(),
        swatches: z.array(z.string()).optional(),
      }),
    )
    .optional(),

  packages: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().optional(),
        image: z.string().optional(),
        location: z.string().optional(),
        duration: z.string().optional(),
        feature: z.string().optional(),
        price: z.string().optional(),
        /** Bedding: collection page intro (PLP) */
        collectionIntro: z.string().optional(),
        itinerary: z
          .array(
            z.object({
              day: z.number(),
              title: z.string().min(1, "Title is required"),
              description: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),

  /** Tour: theme parks, cruises, etc. (experiences listing page) */
  experienceList: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .optional(),

  /** Tour: travel tips / blog posts */
  travelTips: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        image: z.string().optional(),
        body: z.string().optional(),
      }),
    )
    .optional(),
});

export type DemoFormValues = z.infer<typeof demoSchema>;

export interface DemoSite {
  id: string;
  slug: string;
  templateId: string;
  isPublished: boolean;
  config: Omit<DemoFormValues, "slug" | "templateId" | "isPublished">;
  createdAt: Date;
  updatedAt: Date;
}
