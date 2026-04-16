"use client";

import {
  Control,
  UseFormRegister,
  useFieldArray,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../ImagePicker";
import { DemoFormValues } from "../types";

interface TourExtraListsSectionProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
}

export function TourExtraListsSection({
  control,
  register,
  watch,
  setValue,
}: TourExtraListsSectionProps) {
  const expArray = useFieldArray({ control, name: "experienceList" });
  const tipsArray = useFieldArray({ control, name: "travelTips" });

  return (
    <div className="space-y-10 pt-4 border-t">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">
              Experiences catalog
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Theme parks, cruises, and other bookable experience types for the
              Experiences page. Leave empty to use template defaults.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              expArray.append({
                name: "",
                slug: "",
                category: "",
                description: "",
                image: "",
              })
            }
          >
            <Plus className="size-4 mr-1" /> Add experience
          </Button>
        </div>
        <div className="space-y-3">
          {expArray.fields.map((field, i) => (
            <div
              key={field.id}
              className="flex gap-3 items-start border p-3 rounded-md bg-white"
            >
              <div className="space-y-2 flex-1">
                <Input
                  {...register(`experienceList.${i}.name` as const)}
                  placeholder="Name (e.g. Disneyland Resort)"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    {...register(`experienceList.${i}.category` as const)}
                    placeholder="Category (e.g. Theme parks)"
                  />
                  <Input
                    {...register(`experienceList.${i}.slug` as const)}
                    placeholder="Slug (optional)"
                  />
                </div>
                <Textarea
                  {...register(`experienceList.${i}.description` as const)}
                  placeholder="Short description"
                  rows={2}
                />
                <ImagePicker
                  value={watch(`experienceList.${i}.image` as const)}
                  onChange={(url) =>
                    setValue(`experienceList.${i}.image` as const, url)
                  }
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => expArray.remove(i)}
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">Travel tips (blog)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Articles for the Travel Tips page. Body supports line breaks.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              tipsArray.append({
                title: "",
                slug: "",
                excerpt: "",
                image: "",
                body: "",
              })
            }
          >
            <Plus className="size-4 mr-1" /> Add tip
          </Button>
        </div>
        <div className="space-y-3">
          {tipsArray.fields.map((field, i) => (
            <div
              key={field.id}
              className="flex gap-3 items-start border p-3 rounded-md bg-white"
            >
              <div className="space-y-2 flex-1">
                <Input
                  {...register(`travelTips.${i}.title` as const)}
                  placeholder="Title"
                />
                <Input
                  {...register(`travelTips.${i}.slug` as const)}
                  placeholder="Slug (optional)"
                />
                <Textarea
                  {...register(`travelTips.${i}.excerpt` as const)}
                  placeholder="Excerpt for listing"
                  rows={2}
                />
                <ImagePicker
                  value={watch(`travelTips.${i}.image` as const)}
                  onChange={(url) =>
                    setValue(`travelTips.${i}.image` as const, url)
                  }
                />
                <Textarea
                  {...register(`travelTips.${i}.body` as const)}
                  placeholder="Article body"
                  rows={6}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => tipsArray.remove(i)}
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
