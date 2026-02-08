import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth/config";
import { getAllRoles } from "@/lib/cms/queries/roles";
import { updateRolePermissions } from "@/lib/cms/queries/roles";
import { ALL_PERMISSIONS, type UserRole } from "@/lib/cms/permissions";
import { z } from "zod";

const updateSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  permissions: z.array(z.string()).min(0),
});

/**
 * GET /api/cms/roles
 * Returns all roles with their permissions.
 * Requires super_admin or admin role.
 */
export async function GET() {
  try {
    const session = await requireAdmin();
    const role = (session.user as { role: string }).role as UserRole;

    if (role !== "super_admin" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allRoles = await getAllRoles();

    return NextResponse.json(allRoles);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cms/roles
 * Updates a role's permissions. Requires super_admin only.
 * Cannot modify super_admin role.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const role = (session.user as { role: string }).role as UserRole;

    if (role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    // Prevent modification of super_admin role
    if (data.roleName === "super_admin") {
      return NextResponse.json(
        { error: "Cannot modify super_admin permissions" },
        { status: 400 }
      );
    }

    // Validate all permissions are valid
    const invalidPermissions = data.permissions.filter(
      (p) => !ALL_PERMISSIONS.includes(p as typeof ALL_PERMISSIONS[number])
    );
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: "Invalid permissions", fields: invalidPermissions },
        { status: 400 }
      );
    }

    const updated = await updateRolePermissions(
      data.roleName,
      data.permissions
    );

    if (!updated) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Invalidate the cached role permissions
    revalidateTag("roles");

    return NextResponse.json(updated);
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
