"use client";

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { DemoFormValues } from "../../types";

interface GeneralTabProps {
  register: UseFormRegister<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  errors: FieldErrors<DemoFormValues>;
  templates: { id: string; name: string }[];
  onFillSampleData: () => void;
}

export function GeneralTab({
  register,
  setValue,
  watch,
  errors,
  templates,
  onFillSampleData,
}: GeneralTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">General Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">
            URL Slug <span className="text-red-500">*</span>
          </Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="legacy-travel"
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Template</Label>
          <Select
            onValueChange={(val) => setValue("templateId", val)}
            defaultValue={watch("templateId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g. Indonesia / Global"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Global Currency</Label>
            <Input
              id="currency"
              {...register("currency")}
              placeholder="e.g. Rp, $, €"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            className="h-4 w-4 rounded border-gray-300"
            checked={watch("isPublished")}
            onChange={(e) => setValue("isPublished", e.target.checked)}
          />
          <Label htmlFor="isPublished">Publish this demo site</Label>
        </div>
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          onClick={onFillSampleData}
          className="w-full md:w-auto"
        >
          <Wand2 className="size-4 mr-2" />
          Fill with Sample Data
        </Button>
      </div>
    </div>
  );
}
