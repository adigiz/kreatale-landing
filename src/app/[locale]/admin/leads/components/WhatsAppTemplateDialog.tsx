"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppTemplateDialogProps {
  template: string;
  onSave: (template: string) => void;
}

const DEFAULT_TEMPLATE =
  "Halo, saya melihat *{{businessName}}* di Google Maps dan ingin menawarkan jasa website/aplikasi untuk meningkatkan omset bisnis Anda.";

export function WhatsAppTemplateDialog({
  template,
  onSave,
}: WhatsAppTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(template);

  // Sync with prop when opened (or prop changes)
  useEffect(() => {
    if (open) {
      setValue(template || DEFAULT_TEMPLATE);
    }
  }, [open, template]);

  const handleSave = () => {
    onSave(value);
    setOpen(false);
    toast.success("WhatsApp template saved");
  };

  const handleReset = () => {
    setValue(DEFAULT_TEMPLATE);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="size-4" />
          WA Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>WhatsApp Template</DialogTitle>
          <DialogDescription>
            Customize the message sent to leads. Use{" "}
            <code>{"{{businessName}}"}</code> as a placeholder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-32"
            placeholder="Type your message here..."
          />
          <div className="text-xs text-muted-foreground">
            Preview: {value.replace("{{businessName}}", "Example Business")}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
