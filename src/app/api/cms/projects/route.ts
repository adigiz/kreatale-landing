import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth/config";
import {
  getAllProjects,
  createProject,
  searchProjects,
} from "@/lib/cms/queries/projects";
import { hasPermission, PERMISSIONS, type UserRole } from "@/lib/cms/permissions";
import { z } from "zod";

const sectionSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

const translationLocaleSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  sections: z.record(z.string(), sectionSchema).optional(),
});

const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  country: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  timeline: z.string().optional(),
  heroImage: z.string().url().optional().or(z.literal("")),
  portfolioImage: z.string().url().optional().or(z.literal("")),
  projectType: z.string().optional(),
  techStacks: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  sections: z.record(z.string(), sectionSchema).default({}),
  translations: z.record(z.string(), translationLocaleSchema).default({}),
  demoUrl: z.string().url().optional().or(z.literal("")),
  locale: z.string().default("en"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as UserRole, PERMISSIONS.PROJECTS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const locale = searchParams.get("locale") || undefined;

    if (search) {
      const projects = await searchProjects(search, locale);
      return NextResponse.json(projects);
    }

    const projects = await getAllProjects(locale);
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as UserRole, PERMISSIONS.PROJECTS_CREATE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await createProject({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    });

    // Revalidate public project pages
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]", "page");

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fields = err.issues.map((i) => i.path.join(".")).filter(Boolean);
      return NextResponse.json(
        { error: "Validation failed", fields },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


