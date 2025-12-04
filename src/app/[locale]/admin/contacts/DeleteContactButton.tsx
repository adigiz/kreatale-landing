"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DeleteContactButtonProps {
  contactId: string;
}

export default function DeleteContactButton({
  contactId,
}: DeleteContactButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cms/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <X className="w-4 h-4" />
    </Button>
  );
}
