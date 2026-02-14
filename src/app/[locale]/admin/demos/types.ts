import * as z from "zod";

export const demoSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  templateId: z.string().min(1, "Template is required"),
  isPublished: z.boolean(),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  currency: z.string().default("Rp").optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  price: z.string().optional(),
  days: z.string().optional(),
  location: z.string().optional(),
  destinations: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        region: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        price: z.string().optional(),
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
