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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ImagePicker from "../ImagePicker";
import { PackageItineraryList } from "./PackageItineraryList";
import { DemoFormValues } from "../types";

interface PackagesSectionProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
}

export function PackagesSection({
  control,
  register,
  watch,
  setValue,
}: PackagesSectionProps) {
  const {
    fields: packageFields,
    append: appendPackage,
    remove: removePackage,
  } = useFieldArray({
    control,
    name: "packages",
  });

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Curated Tour Packages</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            appendPackage({
              title: "",
              price: "",
              duration: "",
              itinerary: [],
            })
          }
        >
          <Plus className="size-4 mr-1" /> Add Package
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {packageFields.map((field, pkgIdx) => (
          <AccordionItem key={field.id} value={field.id}>
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                {watch(`packages.${pkgIdx}.title` as const) || "New Package"}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6 bg-white rounded-md border mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.title` as const)}
                    placeholder="Amalfi Coast Escape"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (Optional)</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.slug` as const)}
                    placeholder="amalfi-coast"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <ImagePicker
                  value={watch(`packages.${pkgIdx}.image` as const)}
                  onChange={(url) =>
                    setValue(`packages.${pkgIdx}.image` as const, url)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.location` as const)}
                    placeholder="Italy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.duration` as const)}
                    placeholder="10 Days"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Features</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.feature` as const)}
                    placeholder="Business Class, 5* Hotel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    {...register(`packages.${pkgIdx}.price` as const)}
                    placeholder="14,200"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    Package Itinerary
                  </Label>
                </div>
                <PackageItineraryList
                  control={control}
                  register={register}
                  pkgIdx={pkgIdx}
                />
              </div>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removePackage(pkgIdx)}
                className="mt-4"
              >
                <Trash2 className="size-4 mr-2" /> Remove Package
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
