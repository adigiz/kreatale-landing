"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteDemoSite } from "./actions";
import { toast } from "sonner";

export default function DeleteDemoSiteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this demo site?")) return;

    setIsDeleting(true);
    try {
      await deleteDemoSite(id);
      toast.success("Demo site deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete demo site");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
