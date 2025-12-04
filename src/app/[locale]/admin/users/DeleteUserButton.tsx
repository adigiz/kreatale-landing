"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  userId: string;
  locale: string;
}

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cms/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error instanceof Error ? error.message : "Failed to delete user");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      title="Delete user"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
