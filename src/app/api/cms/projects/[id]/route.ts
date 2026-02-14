import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/cms/queries/projects";
import { PERMISSIONS } from "@/lib/cms/permissions";
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

const updateProjectSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  country: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  timeline: z.string().optional(),
  heroImage: z.string().url().optional().or(z.literal("")),
  portfolioImage: z.string().url().optional().or(z.literal("")),
  projectType: z.string().optional(),
  techStacks: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  sections: z.record(z.string(), sectionSchema).optional(),
  translations: z.record(z.string(), translationLocaleSchema).optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  locale: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.PROJECTS_READ);

    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.PROJECTS_UPDATE);

    const { id } = await params;
    const body = await request.json();
    const data = updateProjectSchema.parse(body);

    // If status is being changed to published, set publishedAt
    let publishedAt: Date | undefined;
    if (data.status === "published") {
      const existing = await getProjectById(id);
      if (existing && existing.status !== "published") {
        publishedAt = new Date();
      }
    }

    const project = await updateProject(id, {
      ...data,
      ...(publishedAt ? { publishedAt } : {}),
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Revalidate public project pages
    revalidatePath("/[locale]/projects", "page");
    revalidatePath(`/[locale]/projects/${project.slug}`, "page");
    revalidatePath("/[locale]", "page");

    return NextResponse.json(project);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.PROJECTS_DELETE);

    const { id } = await params;
    await deleteProject(id);

    // Revalidate public project pages
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]", "page");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}


