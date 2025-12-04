"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";

interface ActionButtonsProps {
  postId: string;
}

export default function ActionButtons({ postId }: ActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for custom save events from PostEditor
    const handleSaveStart = () => setLoading(true);
    const handleSaveEnd = () => setLoading(false);

    window.addEventListener("post-editor:save-start", handleSaveStart);
    window.addEventListener("post-editor:save-end", handleSaveEnd);

    return () => {
      window.removeEventListener("post-editor:save-start", handleSaveStart);
      window.removeEventListener("post-editor:save-end", handleSaveEnd);
    };
  }, []);

  const handleSubmit = () => {
    // Find the form and submit it
    const form = document.getElementById("post-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={() => router.back()}>
        Cancel
      </Button>
      <Button type="button" onClick={handleSubmit} disabled={loading}>
        <Save className="size-4" />
        {loading
          ? "Saving..."
          : postId === "new"
          ? "Create Post"
          : "Update Post"}
      </Button>
    </div>
  );
}
