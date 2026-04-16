"use client";

import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../../ImagePicker";
import { DemoFormValues } from "../../types";
import { TemplateConfig } from "../../utils/template-configs";

interface HeroTabProps {
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
  config: TemplateConfig;
}

export function HeroTab({ register, watch, setValue, config }: HeroTabProps) {
  const { heroFields } = config;
  const templateId = watch("templateId");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Hero Section</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>{heroFields.heroTitle.label}</Label>
          <Textarea
            {...register("heroTitle")}
            placeholder={heroFields.heroTitle.placeholder}
          />
          <p className="text-xs text-muted-foreground">
            Shown on the image side of the split hero.
          </p>
        </div>
        <div className="space-y-2">
          <Label>{heroFields.heroSubtitle.label}</Label>
          <Textarea
            {...register("heroSubtitle")}
            placeholder={heroFields.heroSubtitle.placeholder}
          />
        </div>
        {templateId === "tour" && (
          <>
            <div className="space-y-2">
              <Label>Main headline (line 1)</Label>
              <Input
                {...register("heroHeadline")}
                placeholder="Leave empty to use template default (e.g. Redefining the)"
              />
            </div>
            <div className="space-y-2">
              <Label>Main headline (line 2, italic)</Label>
              <Input
                {...register("heroHeadlineItalic")}
                placeholder="Leave empty to use template default (e.g. Art of Travel.)"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label>Hero Image</Label>
          <ImagePicker
            value={watch("heroImage")}
            onChange={(url) => setValue("heroImage", url)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>{heroFields.price.label}</Label>
            <Input
              {...register("price")}
              placeholder={heroFields.price.placeholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{heroFields.currency.label}</Label>
            <Input
              {...register("currency")}
              placeholder={heroFields.currency.placeholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{heroFields.days.label}</Label>
            <Input
              {...register("days")}
              placeholder={heroFields.days.placeholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{heroFields.location.label}</Label>
            <Input
              {...register("location")}
              placeholder={heroFields.location.placeholder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
