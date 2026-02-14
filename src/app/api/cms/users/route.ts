import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import { getAllUsers, createUser } from "@/lib/cms/queries/users";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["super_admin", "admin", "editor", "author", "sales", "viewer"]),
});

export async function GET() {
  try {
    await requirePermission(PERMISSIONS.USERS_READ);

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
    await requirePermission(PERMISSIONS.USERS_CREATE);

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


