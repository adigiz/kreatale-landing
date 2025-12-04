import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth/config";
import {
  getAllPosts,
  createPost,
  searchPosts,
} from "@/lib/cms/queries/posts";
import { hasPermission } from "@/lib/cms/permissions";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  locale: z.string().default("en"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.POSTS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const locale = searchParams.get("locale") || undefined;

    if (search) {
      const posts = await searchPosts(search, locale);
      return NextResponse.json(posts);
    }

    const posts = await getAllPosts(locale);
    return NextResponse.json(posts);
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

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.POSTS_CREATE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = postSchema.parse(body);

    const post = await createPost({
      ...data,
      authorId: session.user.id,
      publishedAt: data.status === "published" ? new Date() : null,
    });

    return NextResponse.json(post, { status: 201 });
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
