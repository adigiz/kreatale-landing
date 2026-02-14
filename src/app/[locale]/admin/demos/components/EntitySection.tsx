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
import { NestedEntityList } from "./NestedEntityList";
import { DemoFormValues } from "../types";
import { TemplateConfig } from "../utils/template-configs";

interface EntitySectionProps {
  control: Control<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
  config: TemplateConfig;
}

export function EntitySection({
  control,
  register,
  watch,
  setValue,
  config,
}: EntitySectionProps) {
  const {
    fields: entityFields,
    append: appendEntity,
    remove: removeEntity,
  } = useFieldArray({
    control,
    name: "packages",
  });

  const {
    entityTitle,
    entityItemLabel,
    entityFields: fieldsConfig,
    nestedTitle,
  } = config;

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{entityTitle}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            appendEntity({
              title: "",
              price: "",
              duration: "",
              itinerary: [],
            })
          }
        >
          <Plus className="size-4 mr-1" /> Add {entityItemLabel}
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {entityFields.map((field, entIdx) => (
          <AccordionItem key={field.id} value={field.id}>
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                {watch(`packages.${entIdx}.title` as const) ||
                  `New ${entityItemLabel}`}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6 bg-white rounded-md border mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{fieldsConfig.title.label} *</Label>
                  <Input
                    {...register(`packages.${entIdx}.title` as const)}
                    placeholder={fieldsConfig.title.placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{fieldsConfig.slug.label} (Optional)</Label>
                  <Input
                    {...register(`packages.${entIdx}.slug` as const)}
                    placeholder={fieldsConfig.slug.placeholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <ImagePicker
                  value={watch(`packages.${entIdx}.image` as const)}
                  onChange={(url) =>
                    setValue(`packages.${entIdx}.image` as const, url)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldsConfig.location && (
                  <div className="space-y-2">
                    <Label>{fieldsConfig.location.label}</Label>
                    <Input
                      {...register(`packages.${entIdx}.location` as const)}
                      placeholder={fieldsConfig.location.placeholder}
                    />
                  </div>
                )}
                {fieldsConfig.duration && (
                  <div className="space-y-2">
                    <Label>{fieldsConfig.duration.label}</Label>
                    <Input
                      {...register(`packages.${entIdx}.duration` as const)}
                      placeholder={fieldsConfig.duration.placeholder}
                    />
                  </div>
                )}
                {fieldsConfig.feature && (
                  <div className="space-y-2">
                    <Label>{fieldsConfig.feature.label}</Label>
                    <Input
                      {...register(`packages.${entIdx}.feature` as const)}
                      placeholder={fieldsConfig.feature.placeholder}
                    />
                  </div>
                )}
                {fieldsConfig.price && (
                  <div className="space-y-2">
                    <Label>{fieldsConfig.price.label}</Label>
                    <Input
                      {...register(`packages.${entIdx}.price` as const)}
                      placeholder={fieldsConfig.price.placeholder}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">{nestedTitle}</Label>
                </div>
                <NestedEntityList
                  control={control}
                  register={register}
                  parentIdx={entIdx}
                  config={config}
                />
              </div>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeEntity(entIdx)}
                className="mt-4"
              >
                <Trash2 className="size-4 mr-2" /> Remove {entityItemLabel}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
