"use client";

import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../../ImagePicker";
import { DemoFormValues } from "../../types";

interface HeroTabProps {
  register: UseFormRegister<DemoFormValues>;
  watch: UseFormWatch<DemoFormValues>;
  setValue: UseFormSetValue<DemoFormValues>;
}

export function HeroTab({ register, watch, setValue }: HeroTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Hero Section</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Hero Title</Label>
          <Textarea
            {...register("heroTitle")}
            placeholder="Experience the Extraordinary"
          />
        </div>
        <div className="space-y-2">
          <Label>Hero Subtitle</Label>
          <Textarea
            {...register("heroSubtitle")}
            placeholder="Your journey begins here..."
          />
        </div>
        <div className="space-y-2">
          <Label>Hero Image</Label>
          <ImagePicker
            value={watch("heroImage")}
            onChange={(url) => setValue("heroImage", url)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Spotlight Price</Label>
            <Input {...register("price")} placeholder="e.g. 14,200" />
          </div>
          <div className="space-y-2">
            <Label>Global Currency</Label>
            <Input {...register("currency")} placeholder="Rp" />
          </div>
          <div className="space-y-2">
            <Label>Spotlight Duration</Label>
            <Input {...register("days")} placeholder="7 Days" />
          </div>
          <div className="space-y-2">
            <Label>Spotlight Location</Label>
            <Input {...register("location")} placeholder="Bali, Indonesia" />
          </div>
        </div>
      </div>
    </div>
  );
}
