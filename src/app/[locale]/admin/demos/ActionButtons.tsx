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
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    // Listen for custom save events from DemoSiteForm
    const handleSaveStart = () => setLoading(true);
    const handleSaveEnd = () => setLoading(false);
    const handleValidityChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      // console.log("ActionButtons received validity:", customEvent.detail.isValid);
      setIsFormValid(customEvent.detail.isValid);
    };

    window.addEventListener("demo-site:save-start", handleSaveStart);
    window.addEventListener("demo-site:save-end", handleSaveEnd);
    window.addEventListener("demo-site:validity-change", handleValidityChange);

    return () => {
      window.removeEventListener("demo-site:save-start", handleSaveStart);
      window.removeEventListener("demo-site:save-end", handleSaveEnd);
      window.removeEventListener(
        "demo-site:validity-change",
        handleValidityChange,
      );
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

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !isFormValid}
      >
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
