import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth/config";
import {
  getAllProjects,
  createProject,
  searchProjects,
} from "@/lib/cms/queries/projects";
import { hasPermission } from "@/lib/cms/permissions";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";

const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  country: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  timeline: z.string().optional(),
  heroImage: z.string().optional(),
  portfolioImage: z.string().optional(),
  projectType: z.string().optional(),
  techStacks: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  sections: z.record(z.string(), z.any()).default({}),
  demoUrl: z.string().optional(),
  locale: z.string().default("en"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.PROJECTS_READ)) {
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

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.PROJECTS_CREATE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await createProject({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


