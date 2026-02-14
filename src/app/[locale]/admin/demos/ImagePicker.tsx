"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({
  value,
  onChange,
  label,
}: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white">
        {value ? (
          <div className="relative group">
            <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100">
              <Image src={value} alt="Selected" fill className="object-cover" />
            </div>
            <button
              onClick={() => onChange("")}
              type="button"
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer py-8">
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*"
            />
            <div className="rounded-full bg-blue-50 p-3 mb-3">
              <Upload className="size-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              SVG, PNG, JPG or GIF (max. 10MB)
            </p>
          </label>
        )}
      </div>
    </div>
  );
}
