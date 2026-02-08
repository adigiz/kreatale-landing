import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth/config";
import {
  getPostById,
  updatePost,
  deletePost,
} from "@/lib/cms/queries/posts";
import { hasPermission, PERMISSIONS, type UserRole } from "@/lib/cms/permissions";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  locale: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as UserRole, PERMISSIONS.POSTS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const result = await getPostById(id);

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result);
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
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as UserRole, PERMISSIONS.POSTS_UPDATE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updatePostSchema.parse(body);

    // If status is being changed to published, ensure publishedAt is set
    if (data.status === "published") {
      const existing = await getPostById(id);
      // Set publishedAt if it's not already set (when changing from draft/archived to published)
      if (existing && !existing.post.publishedAt) {
        (data as { publishedAt?: Date }).publishedAt = new Date();
      }
      // If already published but publishedAt is null for some reason, set it
      else if (existing && existing.post.status === "published" && !existing.post.publishedAt) {
        (data as { publishedAt?: Date }).publishedAt = new Date();
      }
    }

    const post = await updatePost(id, data);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Revalidate blog pages when post status changes
    if (data.status !== undefined) {
      // Revalidate blog listing pages for all locales
      revalidatePath("/en/blog");
      revalidatePath("/id/blog");
      // Revalidate the specific blog post page
      revalidatePath(`/${post.locale}/blog/${post.slug}`);
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
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
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as UserRole, PERMISSIONS.POSTS_DELETE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await getPostById(id);
    
    await deletePost(id);

    // Revalidate blog pages after deletion
    if (existing) {
      revalidatePath("/en/blog");
      revalidatePath("/id/blog");
      revalidatePath(`/${existing.post.locale}/blog/${existing.post.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}


