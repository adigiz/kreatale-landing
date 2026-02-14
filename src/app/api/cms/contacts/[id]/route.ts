import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { markContactAsRead, markContactAsUnread, deleteContact } from "@/lib/cms/queries/contacts";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.CONTACTS_UPDATE);

    const { id } = await params;
    const body = await request.json();
    const { read } = body;

    if (read === true || read === "true") {
      await markContactAsRead(id);
    } else {
      await markContactAsUnread(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact:", error);
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
    await requirePermission(PERMISSIONS.CONTACTS_DELETE);

    const { id } = await params;
    await deleteContact(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

