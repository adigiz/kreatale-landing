import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/cms/auth/config";
import {
  getPostById,
  updatePost,
  deletePost,
} from "@/lib/cms/queries/posts";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";
import { BLOG_CATEGORY_IDS } from "@/lib/blogCategories";

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  // "" from the editor's "No category" option clears it; leaving it out keeps it
  category: z
    .union([z.enum(BLOG_CATEGORY_IDS), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === undefined ? undefined : v || null)),
  locale: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.POSTS_READ);

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
    await requirePermission(PERMISSIONS.POSTS_UPDATE);

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

    // Revalidate blog pages when the status changes or a published post is edited
    // (e.g. a new category should show on the blog straight away)
    if (data.status !== undefined || post.status === "published") {
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
    await requirePermission(PERMISSIONS.POSTS_DELETE);

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


