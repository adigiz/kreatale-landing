import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth/config";
import { getMediaById, deleteMedia } from "@/lib/cms/queries/media";
import { hasPermission } from "@/lib/cms/permissions";
import { PERMISSIONS } from "@/lib/cms/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.MEDIA_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const result = await getMediaById(id);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (!hasPermission(role as "super_admin" | "admin" | "editor" | "author" | "viewer", PERMISSIONS.MEDIA_DELETE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await deleteMedia(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
