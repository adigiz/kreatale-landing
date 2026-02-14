import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/cms/queries/users";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["super_admin", "admin", "editor", "author", "sales", "viewer"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.USERS_READ);

    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Don't return password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
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
    const session = await requirePermission(PERMISSIONS.USERS_UPDATE);

    const { id } = await params;
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    const updateData: Parameters<typeof updateUser>[1] = {};

    if (data.email) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name || null;
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await updateUser(id, updateData);

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Don't return password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
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
    const session = await requirePermission(PERMISSIONS.USERS_DELETE);

    const { id } = await params;
    
    // Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await deleteUser(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}


