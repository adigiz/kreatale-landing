"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";

interface ActionButtonsProps {
  demoId: string; // "new" or actual ID
}

export default function ActionButtons({ demoId }: ActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for custom save events from DemoSiteForm
    const handleSaveStart = () => setLoading(true);
    const handleSaveEnd = () => setLoading(false);

    window.addEventListener("demo-site:save-start", handleSaveStart);
    window.addEventListener("demo-site:save-end", handleSaveEnd);

    return () => {
      window.removeEventListener("demo-site:save-start", handleSaveStart);
      window.removeEventListener("demo-site:save-end", handleSaveEnd);
    };
  }, []);

  const handleSubmit = () => {
    // Find the form and submit it
    const form = document.getElementById("demo-site-form") as HTMLFormElement;
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
        <Save className="mr-2 h-4 w-4" />
        {loading
          ? "Saving..."
          : demoId === "new"
            ? "Create Demo Site"
            : "Update Demo Site"}
      </Button>
    </div>
  );
}
