"use client";

import { useState } from "react";
import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MarkReadButtonProps {
  contactId: string;
  isRead: boolean;
}

export default function MarkReadButton({
  contactId,
  isRead,
}: MarkReadButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/cms/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          read: !isRead,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isUpdating}
      className={
        isRead
          ? "text-green-600 hover:text-green-700"
          : "text-blue-600 hover:text-blue-700"
      }
      title={isRead ? "Mark as unread" : "Mark as read"}
    >
      {isRead ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Mail className="w-4 h-4" />
      )}
    </Button>
  );
}

