"use client";

import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImagePicker from "../../ImagePicker";
import { DemoFormValues } from "../../types";

interface BrandingTabProps {
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
}

export function BrandingTab({ watch, setValue }: BrandingTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        Branding
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo</Label>
          <ImagePicker
            value={watch("logo")}
            onChange={(url) => setValue("logo", url)}
          />
        </div>
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              className="w-12 h-10 p-1 cursor-pointer"
              value={watch("primaryColor")}
              onChange={(e) => setValue("primaryColor", e.target.value)}
            />
            <Input
              type="text"
              value={watch("primaryColor")}
              onChange={(e) => setValue("primaryColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
