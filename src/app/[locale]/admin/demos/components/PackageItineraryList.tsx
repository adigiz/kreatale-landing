"use client";

import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
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

interface PackageItineraryListProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  pkgIdx: number;
}

export function PackageItineraryList({
  control,
  register,
  pkgIdx,
}: PackageItineraryListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `packages.${pkgIdx}.itinerary` as const,
  });

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {fields.map((field, index) => (
          <AccordionItem key={field.id} value={field.id}>
            <AccordionTrigger className="text-xs font-medium bg-gray-50/50 px-3 rounded-t-sm">
              Day {index + 1}: {fields[index].title || "New Day"}
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4 bg-white border-x border-b rounded-b-sm">
              <div className="grid grid-cols-1 gap-2">
                <Label className="text-[10px] uppercase font-bold text-gray-400">
                  Day Title
                </Label>
                <Input
                  {...register(
                    `packages.${pkgIdx}.itinerary.${index}.title` as const,
                  )}
                  placeholder="e.g. Arrival in Amalfi"
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label className="text-[10px] uppercase font-bold text-gray-400">
                  Description
                </Label>
                <Textarea
                  {...register(
                    `packages.${pkgIdx}.itinerary.${index}.description` as const,
                  )}
                  placeholder="e.g. Check in to your luxury hotel..."
                  rows={2}
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(index)}
                className="text-red-500 h-8 text-xs px-2"
              >
                <Trash2 className="size-3 mr-1" /> Remove Day
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
        <Plus className="size-3 mr-1" /> Add Day to Itinerary
      </Button>
    </div>
  );
}
