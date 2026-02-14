"use client";

import {
  Control,
  UseFormRegister,
  useFieldArray,
  FieldErrors,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DemoFormValues } from "../types";
import { TemplateConfig } from "../utils/template-configs";

interface NestedEntityListProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  parentIdx: number;
  config: TemplateConfig;
  errors: FieldErrors<DemoFormValues>;
}

export function NestedEntityList({
  control,
  register,
  parentIdx,
  config,
  errors,
}: NestedEntityListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `packages.${parentIdx}.itinerary` as const,
  });

  const { nestedItemLabel, nestedFields } = config;

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {fields.map((field, index) => (
          <AccordionItem key={field.id} value={field.id}>
            <AccordionTrigger className="text-xs font-medium bg-gray-50/50 px-3 rounded-t-sm">
              <div className="flex items-center gap-2">
                {nestedItemLabel} {index + 1}:{" "}
                {fields[index].title || `New ${nestedItemLabel}`}
                {errors.packages?.[parentIdx]?.itinerary?.[index]?.title && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4 bg-white border-x border-b rounded-b-sm">
              <div className="grid grid-cols-1 gap-2">
                <Label className="text-[10px] uppercase font-bold text-gray-400">
                  {nestedFields.title.label}
                </Label>
                <Input
                  {...register(
                    `packages.${parentIdx}.itinerary.${index}.title` as const,
                  )}
                  placeholder={nestedFields.title.placeholder}
                  className={`h-8 text-sm ${
                    errors.packages?.[parentIdx]?.itinerary?.[index]?.title
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.packages?.[parentIdx]?.itinerary?.[index]?.title && (
                  <p className="text-xs text-red-500">
                    {
                      errors.packages[parentIdx]?.itinerary?.[index]?.title
                        ?.message
                    }
                  </p>
                )}
              </div>
              {nestedFields.description && (
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">
                    {nestedFields.description.label}
                  </Label>
                  <Textarea
                    {...register(
                      `packages.${parentIdx}.itinerary.${index}.description` as const,
                    )}
                    placeholder={nestedFields.description.placeholder}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(index)}
                className="text-red-500 h-8 text-xs px-2"
              >
                <Trash2 className="size-3 mr-1" /> Remove {nestedItemLabel}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          append({ day: fields.length + 1, title: "", description: "" })
        }
        className="w-full text-xs h-8 border-dashed"
      >
        <Plus className="size-3 mr-1" /> Add {nestedItemLabel}
      </Button>
    </div>
  );
}
