import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import { getMediaById, deleteMedia } from "@/lib/cms/queries/media";
import { PERMISSIONS } from "@/lib/cms/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.MEDIA_READ);

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
    await requirePermission(PERMISSIONS.MEDIA_DELETE);

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


