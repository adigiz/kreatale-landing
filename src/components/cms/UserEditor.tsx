"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/cms/db";

interface UserEditorProps {
  userId?: string;
  initialUser?: Omit<User, "passwordHash">;
}

export default function UserEditor({ userId, initialUser }: UserEditorProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: initialUser?.email || "",
    name: initialUser?.name || "",
    password: "",
    role: (initialUser?.role || "viewer") as
      | "super_admin"
      | "admin"
      | "editor"
      | "author"
      | "viewer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = userId ? `/api/cms/users/${userId}` : "/api/cms/users";
      const method = userId ? "PATCH" : "POST";

      const body: {
        email: string;
        name?: string;
        password?: string;
        role: "super_admin" | "admin" | "editor" | "author" | "viewer";
      } = {
        email: formData.email,
        role: formData.role,
      };

      if (formData.name) {
        body.name = formData.name;
      }

      // Only include password if it's provided (for new users or when updating)
      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save user");
      }

      await response.json();
      router.push(`/${locale}/admin/users`);
      router.refresh();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error instanceof Error ? error.message : "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password {userId ? "(leave empty to keep current)" : "*"}
            </label>
            <input
              type="password"
              required={!userId}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as
                    | "super_admin"
                    | "admin"
                    | "editor"
                    | "author"
                    | "viewer",
                })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="viewer">Viewer</option>
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="size-4" />
            {loading ? "Saving..." : userId ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
