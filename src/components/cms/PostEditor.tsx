"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import {
  ArrowUpRight,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  RotateCw,
  Upload,
  X,
} from "lucide-react";
import type { Post } from "@/lib/cms/db";
import { Button } from "@/components/ui/button";

interface PostEditorProps {
  postId?: string;
  initialPost?: Post;
  author?: { id: string; name: string | null; email: string } | null;
  onSaveStateChange?: (loading: boolean) => void;
}

export default function PostEditor({
  postId,
  initialPost,
  onSaveStateChange,
}: PostEditorProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [, setLoading] = useState(false); // Used for onSaveStateChange callback and events
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [deviceSize, setDeviceSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(20); // Percentage for form section (20:80 split)
  const [isResizing, setIsResizing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    content: initialPost?.content || "",
    excerpt: initialPost?.excerpt || "",
    featuredImage: initialPost?.featuredImage || "",
    locale: initialPost?.locale || "en",
    status:
      initialPost?.status || ("draft" as "draft" | "published" | "archived"),
  });

  useEffect(() => {
    if (initialPost) {
      setFormData({
        title: initialPost.title,
        slug: initialPost.slug,
        content: initialPost.content,
        excerpt: initialPost.excerpt || "",
        featuredImage: initialPost.featuredImage || "",
        locale: initialPost.locale,
        status: initialPost.status as "draft" | "published" | "archived",
      });
    }
  }, [initialPost]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Find the container element
      const container = document.querySelector(
        "[data-split-container]"
      ) as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;

      // Constrain between 20% and 80%
      const constrainedRatio = Math.max(20, Math.min(80, newRatio));
      setSplitRatio(constrainedRatio);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";
    };
  }, [isResizing]);

  // Auto-generate/update preview token when form data changes
  useEffect(() => {
    // Only auto-generate/update if:
    // 1. Preview should be shown
    // 2. We have both title and slug
    // 3. Not currently loading
    // 4. Either we have an initial post (editing) or it's a new post with valid data
    if (
      showPreview &&
      formData.title &&
      formData.slug &&
      !previewLoading &&
      (postId || (formData.title.length > 3 && formData.slug.length > 3))
    ) {
      const timer = setTimeout(() => {
        handlePreview(false);
      }, 1500); // 1.5 second debounce to avoid too frequent calls
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.title,
    formData.slug,
    formData.content,
    formData.excerpt,
    formData.featuredImage,
    postId,
  ]); // Trigger when form data changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSaveStateChange?.(true);
    window.dispatchEvent(new CustomEvent("post-editor:save-start"));

    try {
      const url = postId ? `/api/cms/posts/${postId}` : "/api/cms/posts";
      const method = postId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save post");
      }

      await response.json();
      router.push(`/${locale}/admin/posts`);
      router.refresh();
    } catch (error) {
      console.error("Error saving post:", error);
      alert(error instanceof Error ? error.message : "Failed to save post");
      setLoading(false);
      onSaveStateChange?.(false);
      window.dispatchEvent(new CustomEvent("post-editor:save-end"));
    } finally {
      setLoading(false);
      onSaveStateChange?.(false);
      window.dispatchEvent(new CustomEvent("post-editor:save-end"));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handlePreview = async (
    openInNewTab = false,
    deviceSize?: "mobile" | "tablet" | "desktop"
  ) => {
    setPreviewLoading(true);
    try {
      // Always save current form data as draft to ensure preview shows latest changes
      let savedPostId = postId;
      if (!postId) {
        // New post - create it
        const saveResponse = await fetch("/api/cms/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            status: "draft",
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save draft for preview");
        }

        const savedPost = await saveResponse.json();
        savedPostId = savedPost.id;
      } else {
        // Existing post - update it with current form data
        const saveResponse = await fetch(`/api/cms/posts/${postId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            // Keep original status, don't force to draft
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save changes for preview");
        }
      }

      // Create preview token
      const previewResponse = await fetch("/api/cms/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: "post",
          contentId: savedPostId,
          contentData: formData,
        }),
      });

      if (!previewResponse.ok) {
        throw new Error("Failed to create preview");
      }

      const { token } = await previewResponse.json();

      if (openInNewTab) {
        const previewUrl = deviceSize
          ? `/${locale}/preview/${token}?device=${deviceSize}`
          : `/${locale}/preview/${token}`;
        window.open(previewUrl, "_blank");
      } else {
        setPreviewToken(token);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error creating preview:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create preview"
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, featuredImage: url }));
    } catch (error) {
      console.error("Image upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Split view: Form and Preview */}
      {isPreviewFullscreen ? (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="sticky top-0 bg-background pb-4 mb-4 border-b flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Preview</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handlePreview(false)}
                disabled={previewLoading || !formData.title || !formData.slug}
                title={previewLoading ? "Loading..." : "Update Preview"}
              >
                <RotateCw className="size-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {deviceSize === "mobile" && "(375px)"}
                {deviceSize === "tablet" && "(768px)"}
                {deviceSize === "desktop" && "(100%)"}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={deviceSize === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceSize("mobile")}
                  title="Mobile Preview (375px)"
                >
                  <Smartphone className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant={deviceSize === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceSize("tablet")}
                  title="Tablet Preview (768px)"
                >
                  <Tablet className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant={deviceSize === "desktop" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceSize("desktop")}
                  title="Desktop Preview (100%)"
                >
                  <Monitor className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsPreviewFullscreen(false)}
                title="Exit Fullscreen"
              >
                <Minimize2 className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex items-start justify-center p-4">
            {previewToken ? (
              <div
                className="rounded-md border bg-white transition-all duration-300"
                style={{
                  width:
                    deviceSize === "mobile"
                      ? "375px"
                      : deviceSize === "tablet"
                      ? "768px"
                      : "100%",
                  maxWidth: "100%",
                  minHeight: "100vh",
                }}
              >
                <iframe
                  src={`/${locale}/preview/${previewToken}`}
                  className="w-full rounded-md"
                  style={{
                    minHeight: "100vh",
                  }}
                  title="Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[100vh] rounded-md border border-dashed bg-muted/50 w-full">
                <p className="text-sm text-muted-foreground">
                  Preview will show here
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-1 min-h-0 mt-6 overflow-hidden relative"
          data-split-container
        >
          {/* Form Section */}
          <div
            className="overflow-y-auto"
            style={{
              width: showPreview ? `${splitRatio}%` : "100%",
              transition: isResizing ? "none" : "width 0.2s ease",
              minHeight: "100vh",
            }}
          >
            <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({
                        ...formData,
                        title: newTitle,
                        slug: generateSlug(newTitle),
                      });
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Featured Image
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingImage}
                          className="w-full"
                          asChild
                        >
                          <span>
                            <Upload className="size-4 mr-2 inline" />
                            {uploadingImage ? "Uploading..." : "Upload Image"}
                          </span>
                        </Button>
                      </label>
                    </div>
                    {formData.featuredImage && (
                      <div className="relative w-full h-48">
                        <Image
                          src={formData.featuredImage}
                          alt="Featured"
                          fill
                          className="object-cover rounded-md border border-input"
                          unoptimized
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                          onClick={() =>
                            setFormData({ ...formData, featuredImage: "" })
                          }
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      type="url"
                      placeholder="Or enter image URL"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuredImage: e.target.value,
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Locale
                    </label>
                    <select
                      value={formData.locale}
                      onChange={(e) =>
                        setFormData({ ...formData, locale: e.target.value })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="en">English</option>
                      <option value="id">Indonesian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "draft"
                            | "published"
                            | "archived",
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Content *
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Resize Handle */}
          {showPreview && (
            <div
              className="w-1 bg-border hover:bg-primary cursor-col-resize group relative z-10 flex-shrink-0 select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsResizing(true);
              }}
              style={{
                cursor: isResizing ? "col-resize" : "col-resize",
              }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-2 transition-all" />
            </div>
          )}

          {/* Preview Section */}
          {showPreview && (
            <div
              className="border-l pl-4 overflow-y-auto"
              style={{
                width: `${100 - splitRatio}%`,
                transition: isResizing ? "none" : "width 0.2s ease",
                minHeight: "100vh",
              }}
            >
              <div className="sticky top-0 bg-background pb-4 mb-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Preview
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePreview(false)}
                    disabled={
                      previewLoading || !formData.title || !formData.slug
                    }
                    title={previewLoading ? "Loading..." : "Update Preview"}
                  >
                    <RotateCw className="size-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {deviceSize === "mobile" && "(375px)"}
                    {deviceSize === "tablet" && "(768px)"}
                    {deviceSize === "desktop" && "(100%)"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant={deviceSize === "mobile" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setDeviceSize("mobile")}
                      title="Mobile Preview (375px)"
                    >
                      <Smartphone className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={deviceSize === "tablet" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setDeviceSize("tablet")}
                      title="Tablet Preview (768px)"
                    >
                      <Tablet className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={deviceSize === "desktop" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setDeviceSize("desktop")}
                      title="Desktop Preview (100%)"
                    >
                      <Monitor className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePreview(true)}
                    title="Open in New Tab"
                  >
                    <ArrowUpRight className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPreviewFullscreen(true)}
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="h-full overflow-y-auto flex items-start justify-center">
                {previewToken ? (
                  <div
                    className="rounded-md border bg-white transition-all duration-300"
                    style={{
                      width:
                        deviceSize === "mobile"
                          ? "375px"
                          : deviceSize === "tablet"
                          ? "768px"
                          : "100%",
                      maxWidth: "100%",
                      minHeight: "100vh",
                    }}
                  >
                    <iframe
                      src={`/${locale}/preview/${previewToken}`}
                      className="w-full rounded-md"
                      style={{
                        minHeight: "100vh",
                      }}
                      title="Preview"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[100vh] rounded-md border border-dashed bg-muted/50 w-full">
                    <p className="text-sm text-muted-foreground">
                      Preview will show here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
