"use client";

import {
  Control,
  UseFormRegister,
  useFieldArray,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../ImagePicker";
import { DemoFormValues } from "../types";
import { TemplateConfig } from "../utils/template-configs";

interface CollectionSectionProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
  config: TemplateConfig;
  errors: FieldErrors<DemoFormValues>;
}

export function CollectionSection({
  control,
  register,
  watch,
  setValue,
  config,
  errors,
}: CollectionSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinations",
  });

  const { collectionTitle, collectionItemLabel, collectionFields } = config;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{collectionTitle}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append({ name: "", image: "" })}
        >
          <Plus className="size-4 mr-1" /> Add {collectionItemLabel}
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 items-start border p-3 rounded-md bg-white"
          >
            <div className="space-y-2 flex-1">
              <Input
                {...register(`destinations.${index}.name` as const)}
                placeholder={`${collectionFields.name.label} (e.g. ${collectionFields.name.placeholder})`}
                className={
                  errors.destinations?.[index]?.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.destinations?.[index]?.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.destinations[index]?.name?.message}
                </p>
              )}
              <ImagePicker
                value={watch(`destinations.${index}.image` as const)}
                onChange={(url) =>
                  setValue(`destinations.${index}.image` as const, url)
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {collectionFields.region && (
                  <Input
                    {...register(`destinations.${index}.region` as const)}
                    placeholder={collectionFields.region.placeholder}
                  />
                )}
                {collectionFields.price && (
                  <Input
                    {...register(`destinations.${index}.price` as const)}
                    placeholder={collectionFields.price.placeholder}
                  />
                )}
              </div>
              {collectionFields.description && (
                <Textarea
                  {...register(`destinations.${index}.description` as const)}
                  placeholder={collectionFields.description.placeholder}
                  rows={2}
                />
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
