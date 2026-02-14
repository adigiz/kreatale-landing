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

interface DestinationsSectionProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
}

export function DestinationsSection({
  control,
  register,
  watch,
  setValue,
}: DestinationsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinations",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Destinations / Collections
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append({ name: "", image: "" })}
        >
          <Plus className="size-4 mr-1" /> Add
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
                placeholder="Name (e.g. Ubud)"
              />
              <ImagePicker
                value={watch(`destinations.${index}.image` as const)}
                onChange={(url) =>
                  setValue(`destinations.${index}.image` as const, url)
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  {...register(`destinations.${index}.region` as const)}
                  placeholder="Region (e.g. Europe)"
                />
                <Input
                  {...register(`destinations.${index}.price` as const)}
                  placeholder="Starting Price (optional)"
                />
              </div>
              <Textarea
                {...register(`destinations.${index}.description` as const)}
                placeholder="Short description..."
                rows={2}
              />
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
