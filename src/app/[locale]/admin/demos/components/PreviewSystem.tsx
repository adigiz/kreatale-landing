"use client";

import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewSystemProps {
  previewToken: string | null;
  deviceSize: "mobile" | "tablet" | "desktop";
  setDeviceSize: (size: "mobile" | "tablet" | "desktop") => void;
  previewLoading: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: (val: boolean) => void;
  onOpenNewTab: () => void;
  onClosePreview: () => void;
  locale: string;
}

export function PreviewSystem({
  previewToken,
  deviceSize,
  setDeviceSize,
  previewLoading,
  isFullscreen,
  onToggleFullscreen,
  onOpenNewTab,
  onClosePreview,
  locale,
}: PreviewSystemProps) {
  const iframeSrc = previewToken
    ? `/${locale}/preview/${previewToken}?type=demo`
    : null;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFullscreen(false)}
            >
              <Minimize2 className="mr-2 size-4" /> Exit Fullscreen
            </Button>
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={deviceSize === "mobile" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setDeviceSize("mobile")}
              >
                <Smartphone className="size-4" />
              </Button>
              <Button
                variant={deviceSize === "tablet" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setDeviceSize("tablet")}
              >
                <Tablet className="size-4" />
              </Button>
              <Button
                variant={deviceSize === "desktop" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setDeviceSize("desktop")}
              >
                <Monitor className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 flex justify-center overflow-auto p-8">
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              className="bg-white shadow-xl transition-all duration-300"
              style={{
                width:
                  deviceSize === "mobile"
                    ? "375px"
                    : deviceSize === "tablet"
                      ? "768px"
                      : "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-2 border-b bg-white flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          Live Preview
        </span>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => setDeviceSize("mobile")}
          >
            <Smartphone className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => setDeviceSize("tablet")}
          >
            <Tablet className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => setDeviceSize("desktop")}
          >
            <Monitor className="size-4" />
          </Button>
          <div className="w-px bg-gray-200 mx-1" />
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onToggleFullscreen(true)}
          >
            <Maximize2 className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={onOpenNewTab}
          >
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={onClosePreview}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex justify-center p-8 bg-gray-50/50">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="bg-white shadow-xl transition-all duration-300"
            style={{
              width:
                deviceSize === "mobile"
                  ? "375px"
                  : deviceSize === "tablet"
                    ? "768px"
                    : "100%",
              height: "100%",
              minHeight: "800px",
              border: "none",
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-gray-400">
            <Loader2
              className={`size-8 mb-2 ${previewLoading ? "animate-spin" : ""}`}
            />
            <p>
              {previewLoading
                ? "Generating Preview..."
                : "Enter slug to see preview"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
