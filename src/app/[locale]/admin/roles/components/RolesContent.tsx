"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
} from "@/lib/cms/permissions";

interface RoleData {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RolesContentProps {
  roles: RoleData[];
  currentUserRole: string;
}

// Display order for roles
const ROLE_ORDER = ["super_admin", "admin", "editor", "author", "sales", "viewer"];
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  author: "Author",
  sales: "Sales",
  viewer: "Viewer",
};

export default function RolesContent({
  roles,
  currentUserRole,
}: RolesContentProps) {
  const router = useRouter();
  const isSuperAdmin = currentUserRole === "super_admin";

  // Sort roles by defined order
  const sortedRoles = [...roles].sort(
    (a, b) => ROLE_ORDER.indexOf(a.name) - ROLE_ORDER.indexOf(b.name)
  );

  // State: map of roleName -> Set of permissions (editable copy)
  const [permissionState, setPermissionState] = useState<
    Record<string, Set<string>>
  >(() => {
    const state: Record<string, Set<string>> = {};
    for (const role of sortedRoles) {
      state[role.name] = new Set(role.permissions);
    }
    return state;
  });

  // Track which roles have unsaved changes
  const [dirtyRoles, setDirtyRoles] = useState<Set<string>>(new Set());
  const [savingRoles, setSavingRoles] = useState<Set<string>>(new Set());

  const togglePermission = (roleName: string, permission: string) => {
    if (!isSuperAdmin || roleName === "super_admin") return;

    setPermissionState((prev) => {
      const current = new Set(prev[roleName]);
      if (current.has(permission)) {
        current.delete(permission);
      } else {
        current.add(permission);
      }
      return { ...prev, [roleName]: current };
    });

    setDirtyRoles((prev) => {
      const next = new Set(prev);
      next.add(roleName);
      return next;
    });
  };

  const resetRole = (roleName: string) => {
    const original = roles.find((r) => r.name === roleName);
    if (!original) return;

    setPermissionState((prev) => ({
      ...prev,
      [roleName]: new Set(original.permissions),
    }));

    setDirtyRoles((prev) => {
      const next = new Set(prev);
      next.delete(roleName);
      return next;
    });
  };

  const saveRole = async (roleName: string) => {
    setSavingRoles((prev) => new Set(prev).add(roleName));

    try {
      const permissions = Array.from(permissionState[roleName] || []);
      const response = await fetch("/api/cms/roles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName, permissions }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update role");
      }

      toast.success(`${ROLE_LABELS[roleName] || roleName} permissions updated`);

      setDirtyRoles((prev) => {
        const next = new Set(prev);
        next.delete(roleName);
        return next;
      });

      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update permissions"
      );
    } finally {
      setSavingRoles((prev) => {
        const next = new Set(prev);
        next.delete(roleName);
        return next;
      });
    }
  };

  const saveAllDirty = async () => {
    const rolesToSave = Array.from(dirtyRoles);
    for (const roleName of rolesToSave) {
      await saveRole(roleName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Role Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin
              ? "Manage permissions for each role"
              : "View permissions assigned to each role"}
          </p>
        </div>
        {isSuperAdmin && dirtyRoles.size > 0 && (
          <Button onClick={saveAllDirty} disabled={savingRoles.size > 0}>
            <Save className="size-4" />
            Save All Changes ({dirtyRoles.size})
          </Button>
        )}
      </div>

      {/* Permission Matrix */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground min-w-[200px]">
                  Permission
                </th>
                {sortedRoles.map((role) => (
                  <th
                    key={role.name}
                    className="h-10 px-3 text-center align-middle text-xs font-medium text-muted-foreground min-w-[100px]"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{ROLE_LABELS[role.name] || role.name}</span>
                      {role.name === "super_admin" && (
                        <Shield className="size-3 text-amber-500" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(PERMISSION_GROUPS).map(
                ([groupKey, group]) => (
                  <Fragment key={groupKey}>
                    {/* Group header */}
                    <tr className="bg-muted/30">
                      <td
                        colSpan={sortedRoles.length + 1}
                        className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        {group.label}
                      </td>
                    </tr>
                    {/* Permission rows */}
                    {group.permissions.map((perm) => (
                      <tr
                        key={perm.key}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="px-4 py-2.5 text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {perm.key}
                            </code>
                            <span className="text-muted-foreground">
                              {perm.label}
                            </span>
                          </div>
                        </td>
                        {sortedRoles.map((role) => {
                          const isChecked =
                            permissionState[role.name]?.has(perm.key) ?? false;
                          const isDisabled =
                            !isSuperAdmin || role.name === "super_admin";

                          return (
                            <td
                              key={`${role.name}-${perm.key}`}
                              className="px-3 py-2.5 text-center"
                            >
                              <label className="inline-flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={isDisabled}
                                  onChange={() =>
                                    togglePermission(role.name, perm.key)
                                  }
                                  className="size-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-role save actions (for super_admin only) */}
      {isSuperAdmin && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedRoles
            .filter((r) => r.name !== "super_admin")
            .map((role) => {
              const isDirty = dirtyRoles.has(role.name);
              const isSaving = savingRoles.has(role.name);
              const permCount = permissionState[role.name]?.size ?? 0;

              return (
                <div
                  key={role.name}
                  className={`rounded-lg border p-4 transition-colors ${
                    isDirty ? "border-amber-500/50 bg-amber-50/5" : "bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">
                      {ROLE_LABELS[role.name] || role.name}
                    </h3>
                    {isDirty && (
                      <span className="text-xs text-amber-600 font-medium">
                        Unsaved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {permCount} of {ALL_PERMISSIONS.length} permissions
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetRole(role.name)}
                      disabled={!isDirty || isSaving}
                    >
                      <RotateCcw className="size-3" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveRole(role.name)}
                      disabled={!isDirty || isSaving}
                    >
                      <Save className="size-3" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Info banner for admin (read-only) */}
      {!isSuperAdmin && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Only Super Admins can modify role permissions. You are viewing this
            page in read-only mode.
          </p>
        </div>
      )}
    </div>
  );
}
