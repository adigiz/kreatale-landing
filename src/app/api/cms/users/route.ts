import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth/config";
import { getAllUsers, createUser } from "@/lib/cms/queries/users";
import { hasPermission } from "@/lib/cms/permissions";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["super_admin", "admin", "editor", "author", "viewer"]),
});

export async function GET() {
  try {
    const session = await requireAdmin();
    const role = session.user.role;

    if (
      !hasPermission(
        role as "super_admin" | "admin" | "editor" | "author" | "viewer",
        PERMISSIONS.USERS_READ
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await getAllUsers();
    // Don't return password hashes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeUsers = users.map(({ passwordHash: _, ...user }) => user);
    return NextResponse.json(safeUsers);
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

    if (
      !hasPermission(
        role as "super_admin" | "admin" | "editor" | "author" | "viewer",
        PERMISSIONS.USERS_CREATE
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = userSchema.parse(body);

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await createUser({
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
    });

    // Don't return password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 201 });
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


