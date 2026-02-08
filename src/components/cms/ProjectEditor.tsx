"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Languages,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  Computer,
  ExternalLink,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import type { Project } from "@/lib/cms/db";

// --- Zod Schema ---

const sectionSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

const translationLocaleSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  sections: z.record(z.string(), sectionSchema).optional(),
});

const projectSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, separated by hyphens"
    ),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  country: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  timeline: z.string().optional(),
  heroImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  portfolioImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  projectType: z.string().optional(),
  techStacks: z.array(z.string()).default([]),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  sections: z.record(z.string(), sectionSchema).default({}),
  translations: z.record(z.string(), translationLocaleSchema).default({}),
  demoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  locale: z.string().default("en"),
  status: z.enum(["draft", "published", "archived"], {
    error: "Status is required",
  }),
});

// --- Tab-to-field mapping for error indicators ---

const TAB_FIELDS: Record<string, string[]> = {
  basic: ["title", "slug", "subtitle", "projectType", "demoUrl"],
  details: ["client", "country", "duration", "timeline", "techStacks"],
  media: ["heroImage", "portfolioImage", "images"],
  sections: ["sections"],
  settings: ["locale", "status"],
};

// --- Types ---

interface TranslationData {
  title?: string;
  subtitle?: string;
  sections?: Record<string, { title: string; content: string[] }>;
}

interface FormData {
  slug: string;
  title: string;
  subtitle: string;
  country: string;
  client: string;
  duration: string;
  timeline: string;
  heroImage: string;
  portfolioImage: string;
  projectType: string;
  techStacks: string[];
  images: string[];
  sections: Record<string, { title: string; content: string[] }>;
  translations: { id?: TranslationData };
  demoUrl: string;
  locale: string;
  status: "draft" | "published" | "archived";
}

interface ProjectEditorProps {
  project?: Project;
}

// --- Shared styles ---

const inputClasses =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const inputErrorClasses =
  "flex h-9 w-full rounded-md border border-destructive bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";

const labelClasses =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const sectionHeaderClasses =
  "text-sm font-semibold text-foreground/80 border-b border-border pb-2";

// --- Helper: inline error display ---

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-xs text-destructive mt-1">{error}</p>;
}

// --- Component ---

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<"card" | "detail">("card");

  const heroInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    slug: project?.slug || "",
    title: project?.title || "",
    subtitle: project?.subtitle || "",
    country: project?.country || "",
    client: project?.client || "",
    duration: project?.duration || "",
    timeline: project?.timeline || "",
    heroImage: project?.heroImage || "",
    portfolioImage: project?.portfolioImage || "",
    projectType: project?.projectType || "",
    techStacks: (project?.techStacks as string[]) || [],
    images: (project?.images as string[]) || [],
    sections: ((project?.sections as Record<
      string,
      { title: string; content: string[] }
    >) || {}) as Record<string, { title: string; content: string[] }>,
    translations: ((project?.translations as { id?: TranslationData }) ||
      {}) as { id?: TranslationData },
    demoUrl: project?.demoUrl || "",
    locale: project?.locale || "en",
    status: (project?.status as "draft" | "published" | "archived") || "draft",
  });

  const [newTechStack, setNewTechStack] = useState("");
  const [sectionKey, setSectionKey] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [showIdTranslation, setShowIdTranslation] = useState(
    !!(
      (project?.translations as { id?: TranslationData })?.id?.title ||
      (project?.translations as { id?: TranslationData })?.id?.subtitle
    )
  );

  // Track which sections have their ID translations expanded
  const [expandedIdSections, setExpandedIdSections] = useState<Set<string>>(
    () => {
      const initial = new Set<string>();
      const trans = (project?.translations as { id?: TranslationData })?.id;
      if (trans?.sections) {
        Object.keys(trans.sections).forEach((k) => initial.add(k));
      }
      return initial;
    }
  );

  useEffect(() => {
    if (project) {
      setFormData({
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle || "",
        country: project.country || "",
        client: project.client || "",
        duration: project.duration || "",
        timeline: project.timeline || "",
        heroImage: project.heroImage || "",
        portfolioImage: project.portfolioImage || "",
        projectType: project.projectType || "",
        techStacks: (project.techStacks as string[]) || [],
        images: (project.images as string[]) || [],
        sections: ((project.sections as Record<
          string,
          { title: string; content: string[] }
        >) || {}) as Record<string, { title: string; content: string[] }>,
        translations: ((project.translations as { id?: TranslationData }) ||
          {}) as { id?: TranslationData },
        demoUrl: project.demoUrl || "",
        locale: project.locale,
        status: project.status as "draft" | "published" | "archived",
      });
    }
  }, [project]);

  // --- Helpers ---

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const tabHasErrors = (tab: string): boolean => {
    const fields = TAB_FIELDS[tab] || [];
    return fields.some((f) => !!errors[f]);
  };

  const getFirstErrorTab = (): string | null => {
    for (const tab of ["basic", "details", "media", "sections", "settings"]) {
      if (tabHasErrors(tab)) return tab;
    }
    return null;
  };

  // --- Validation ---

  const validate = (): boolean => {
    const result = projectSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!newErrors[path]) {
        newErrors[path] = issue.message;
      }
    }
    setErrors(newErrors);

    // Navigate to first tab with errors
    const firstErrorTab = getFirstErrorTab();
    if (firstErrorTab) {
      // We need to wait for errors state to update, so use setTimeout
      setTimeout(() => {
        const tab = Object.entries(TAB_FIELDS).find(([, fields]) =>
          fields.some((f) => !!newErrors[f])
        );
        if (tab) setActiveTab(tab[0]);
      }, 0);
    }

    return false;
  };

  // --- Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setLoading(true);

    try {
      const url = project
        ? `/api/cms/projects/${project.id}`
        : "/api/cms/projects";
      const method = project ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      toast.success(
        project
          ? "Project updated successfully"
          : "Project created successfully"
      );
      router.push(`/${locale}/admin/projects`);
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save project"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: fd,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();
      onSuccess(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const addTechStack = () => {
    if (newTechStack.trim()) {
      setFormData((prev) => ({
        ...prev,
        techStacks: [...prev.techStacks, newTechStack.trim()],
      }));
      setNewTechStack("");
    }
  };

  const removeTechStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStacks: prev.techStacks.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    if (sectionKey.trim() && sectionTitle.trim()) {
      setFormData((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey.trim()]: {
            title: sectionTitle.trim(),
            content: sectionContent.split("\n").filter((line) => line.trim()),
          },
        },
      }));
      setSectionKey("");
      setSectionTitle("");
      setSectionContent("");
    }
  };

  const removeSection = (key: string) => {
    setFormData((prev) => {
      const newSections = { ...prev.sections };
      delete newSections[key];
      // Also remove from translations
      const newTranslations = { ...prev.translations };
      if (newTranslations.id?.sections?.[key]) {
        const newIdSections = { ...newTranslations.id.sections };
        delete newIdSections[key];
        newTranslations.id = { ...newTranslations.id, sections: newIdSections };
      }
      return { ...prev, sections: newSections, translations: newTranslations };
    });
    setExpandedIdSections((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  // --- Translation helpers ---

  const updateIdTranslation = (field: keyof TranslationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        id: {
          ...prev.translations.id,
          [field]: value,
        },
      },
    }));
  };

  const updateIdSectionTranslation = (
    sectionKey: string,
    field: "title" | "content",
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        id: {
          ...prev.translations.id,
          sections: {
            ...(prev.translations.id?.sections || {}),
            [sectionKey]: {
              ...(prev.translations.id?.sections?.[sectionKey] || {
                title: "",
                content: [],
              }),
              [field]: value,
            },
          },
        },
      },
    }));
  };

  const toggleIdSection = (key: string) => {
    setExpandedIdSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // --- Tab error dot ---

  const TabLabel = ({ label, tab }: { label: string; tab: string }) => (
    <span className="relative flex items-center gap-1.5">
      {label}
      {tabHasErrors(tab) && (
        <span className="size-1.5 rounded-full bg-destructive" />
      )}
    </span>
  );

  // --- Render ---

  return (
    <div className="flex gap-6 items-start">
      {/* Left: Form */}
      <div
        className="flex-1 min-w-0"
        style={{ maxWidth: showPreview ? "55%" : "100%" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="basic">
            <TabLabel label="Basic Info" tab="basic" />
          </TabsTrigger>
          <TabsTrigger value="details">
            <TabLabel label="Details" tab="details" />
          </TabsTrigger>
          <TabsTrigger value="media">
            <TabLabel label="Media" tab="media" />
          </TabsTrigger>
          <TabsTrigger value="sections">
            <TabLabel label="Sections" tab="sections" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <TabLabel label="Settings" tab="settings" />
          </TabsTrigger>
        </TabsList>

        {/* ===== BASIC INFO TAB ===== */}
        <TabsContent value="basic">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className={sectionHeaderClasses}>Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title: newTitle,
                      slug: project ? prev.slug : generateSlug(newTitle),
                    }));
                    clearFieldError("title");
                  }}
                  placeholder="Project title"
                  className={errors.title ? inputErrorClasses : inputClasses}
                />
                <FieldError error={errors.title} />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>
                  Slug <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, slug: e.target.value }));
                    clearFieldError("slug");
                  }}
                  placeholder="project-slug"
                  className={errors.slug ? inputErrorClasses : inputClasses}
                />
                <FieldError error={errors.slug} />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    subtitle: e.target.value,
                  }));
                  clearFieldError("subtitle");
                }}
                placeholder="A brief description of the project"
                className={errors.subtitle ? inputErrorClasses : inputClasses}
              />
              <FieldError error={errors.subtitle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Project Type</label>
                <input
                  type="text"
                  value={formData.projectType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectType: e.target.value,
                    }))
                  }
                  placeholder="e.g. Web Application, Mobile App"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Demo URL</label>
                <input
                  type="text"
                  value={formData.demoUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      demoUrl: e.target.value,
                    }));
                    clearFieldError("demoUrl");
                  }}
                  placeholder="https://demo.example.com"
                  className={errors.demoUrl ? inputErrorClasses : inputClasses}
                />
                <FieldError error={errors.demoUrl} />
              </div>
            </div>

            {/* Indonesian Translations for Basic Info */}
            <div className="mt-4 pt-4 border-t border-dashed border-border">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowIdTranslation(!showIdTranslation)}
              >
                <Languages className="size-4" />
                Indonesian Translation
                {showIdTranslation ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
                {(formData.translations.id?.title ||
                  formData.translations.id?.subtitle) && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    ID
                  </span>
                )}
              </button>
              {showIdTranslation && (
                <div className="mt-3 space-y-3 pl-6 border-l-2 border-muted">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Title (Indonesian)
                    </label>
                    <input
                      type="text"
                      value={formData.translations.id?.title || ""}
                      onChange={(e) =>
                        updateIdTranslation("title", e.target.value)
                      }
                      placeholder="Judul proyek dalam Bahasa Indonesia"
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Subtitle (Indonesian)
                    </label>
                    <input
                      type="text"
                      value={formData.translations.id?.subtitle || ""}
                      onChange={(e) =>
                        updateIdTranslation("subtitle", e.target.value)
                      }
                      placeholder="Deskripsi singkat dalam Bahasa Indonesia"
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ===== DETAILS TAB ===== */}
        <TabsContent value="details">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className={sectionHeaderClasses}>Project Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Client</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      client: e.target.value,
                    }))
                  }
                  placeholder="Client name"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  placeholder="e.g. Indonesia"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g. 3 months"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Timeline</label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2024"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Tech Stacks */}
            <div className="space-y-2">
              <label className={labelClasses}>Tech Stacks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechStack();
                    }
                  }}
                  placeholder="Add technology..."
                  className={inputClasses}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTechStack}
                  className="shrink-0"
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
              {formData.techStacks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.techStacks.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechStack(index)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ===== MEDIA TAB ===== */}
        <TabsContent value="media">
          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h3 className={sectionHeaderClasses}>Media</h3>

            {/* Hero Image */}
            <div className="space-y-2">
              <label className={labelClasses}>Hero Image</label>
              <div className="space-y-2">
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(
                        file,
                        (url) => {
                          setFormData((prev) => ({ ...prev, heroImage: url }));
                          clearFieldError("heroImage");
                        },
                        setUploadingHero
                      );
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingHero}
                  className="w-full"
                  onClick={() => heroInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  {uploadingHero ? "Uploading..." : "Upload Hero Image"}
                </Button>
                {formData.heroImage && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden border border-input">
                    <Image
                      src={formData.heroImage}
                      alt="Hero"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background size-7"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, heroImage: "" }))
                      }
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  value={formData.heroImage}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      heroImage: e.target.value,
                    }));
                    clearFieldError("heroImage");
                  }}
                  className={
                    errors.heroImage ? inputErrorClasses : inputClasses
                  }
                />
                <FieldError error={errors.heroImage} />
              </div>
            </div>

            {/* Portfolio Image */}
            <div className="space-y-2">
              <label className={labelClasses}>Portfolio Image</label>
              <div className="space-y-2">
                <input
                  ref={portfolioInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(
                        file,
                        (url) => {
                          setFormData((prev) => ({
                            ...prev,
                            portfolioImage: url,
                          }));
                          clearFieldError("portfolioImage");
                        },
                        setUploadingPortfolio
                      );
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingPortfolio}
                  className="w-full"
                  onClick={() => portfolioInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  {uploadingPortfolio
                    ? "Uploading..."
                    : "Upload Portfolio Image"}
                </Button>
                {formData.portfolioImage && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden border border-input">
                    <Image
                      src={formData.portfolioImage}
                      alt="Portfolio"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background size-7"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          portfolioImage: "",
                        }))
                      }
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  value={formData.portfolioImage}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      portfolioImage: e.target.value,
                    }));
                    clearFieldError("portfolioImage");
                  }}
                  className={
                    errors.portfolioImage ? inputErrorClasses : inputClasses
                  }
                />
                <FieldError error={errors.portfolioImage} />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <label className={labelClasses}>Gallery Images</label>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(
                      file,
                      (url) =>
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, url],
                        })),
                      setUploadingGallery
                    );
                  }
                  e.target.value = "";
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingGallery}
                className="w-full"
                onClick={() => galleryInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {uploadingGallery ? "Uploading..." : "Upload Gallery Image"}
              </Button>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video rounded-md overflow-hidden border border-input"
                    >
                      <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 bg-background/80 hover:bg-background size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ===== SECTIONS TAB ===== */}
        <TabsContent value="sections">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className={sectionHeaderClasses}>Content Sections</h3>

            {/* Existing Sections */}
            {Object.entries(formData.sections).length > 0 && (
              <div className="space-y-3">
                {Object.entries(formData.sections).map(
                  ([key, section]: [
                    string,
                    { title: string; content: string[] },
                  ]) => {
                    const idSection =
                      formData.translations.id?.sections?.[key];
                    const hasIdTranslation =
                      !!idSection?.title || (idSection?.content?.length ?? 0) > 0;
                    const isIdExpanded = expandedIdSections.has(key);

                    return (
                      <div
                        key={key}
                        className="rounded-md border border-border overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="p-3 flex items-start justify-between gap-3 bg-muted/30">
                          <div className="flex items-start gap-2 min-w-0">
                            <GripVertical className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {section.title}
                                </p>
                                {hasIdTranslation && (
                                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                    ID
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {key}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {section.content.join(" ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                              onClick={() => toggleIdSection(key)}
                              title="Toggle Indonesian translation"
                            >
                              <Languages className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeSection(key)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Indonesian Translation Panel */}
                        {isIdExpanded && (
                          <div className="p-3 border-t border-dashed border-border bg-muted/10 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                              <Languages className="size-3.5" />
                              Indonesian Translation
                            </div>
                            <div className="space-y-2 pl-5">
                              <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">
                                  Section Title (ID)
                                </label>
                                <input
                                  type="text"
                                  value={idSection?.title || ""}
                                  onChange={(e) =>
                                    updateIdSectionTranslation(
                                      key,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Translation of "${section.title}"`}
                                  className={inputClasses}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">
                                  Content (ID) — one paragraph per line
                                </label>
                                <textarea
                                  value={
                                    idSection?.content?.join("\n") || ""
                                  }
                                  onChange={(e) =>
                                    updateIdSectionTranslation(
                                      key,
                                      "content",
                                      e.target.value
                                        .split("\n")
                                        .filter((l) => l.trim())
                                    )
                                  }
                                  placeholder="Indonesian content..."
                                  rows={4}
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Add New Section */}
            <div className="rounded-md border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Add New Section
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">
                    Section Key
                  </label>
                  <input
                    type="text"
                    value={sectionKey}
                    onChange={(e) => setSectionKey(e.target.value)}
                    placeholder="e.g. background"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">
                    Section Title (English)
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="e.g. Project Background"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Content (English) — one paragraph per line
                </label>
                <textarea
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  placeholder="Section content..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSection}
                disabled={!sectionKey.trim() || !sectionTitle.trim()}
              >
                <Plus className="size-4" />
                Add Section
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ===== SETTINGS TAB ===== */}
        <TabsContent value="settings">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className={sectionHeaderClasses}>Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Locale</label>
                <select
                  value={formData.locale}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locale: e.target.value,
                    }))
                  }
                  className={inputClasses}
                >
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>
                  Status <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as
                        | "draft"
                        | "published"
                        | "archived",
                    }));
                    clearFieldError("status");
                  }}
                  className={errors.status ? inputErrorClasses : inputClasses}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <FieldError error={errors.status} />
              </div>
            </div>

            {/* Translation summary */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Translation Status
              </h4>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span className="size-2 rounded-full bg-green-500" />
                  English (primary)
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span
                    className={`size-2 rounded-full ${
                      formData.translations.id?.title ||
                      formData.translations.id?.subtitle ||
                      Object.keys(formData.translations.id?.sections || {})
                        .length > 0
                        ? "bg-green-500"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                  Indonesian
                  {formData.translations.id?.title ||
                  formData.translations.id?.subtitle ||
                  Object.keys(formData.translations.id?.sections || {}).length >
                    0
                    ? " (partial)"
                    : " (not started)"}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Hide Preview" : "Show Preview"}
        >
          {showPreview ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            loading ||
            uploadingHero ||
            uploadingPortfolio ||
            uploadingGallery ||
            !formData.title.trim() ||
            !formData.slug.trim()
          }
        >
          <Save className="size-4" />
          {loading
            ? "Saving..."
            : project
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
      </div>

      {/* Right: Preview */}
      {showPreview && (
        <div className="w-[45%] shrink-0 sticky top-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Preview
              </h3>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={previewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPreviewMode("card")}
                >
                  Card
                </Button>
                <Button
                  type="button"
                  variant={previewMode === "detail" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPreviewMode("detail")}
                >
                  Detail
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {previewMode === "card" ? (
                <CardPreview formData={formData} />
              ) : (
                <DetailPreview formData={formData} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PREVIEW COMPONENTS
// =============================================================================

function CardPreview({ formData }: { formData: FormData }) {
  const hasImage = !!formData.heroImage;

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
        Projects listing card
      </p>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm max-w-sm mx-auto">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {hasImage ? (
            <Image
              src={formData.heroImage}
              alt={formData.title || "Preview"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No hero image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {formData.techStacks.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
            {formData.techStacks.length > 3 && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                +{formData.techStacks.length - 3}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {formData.title || "Project Title"}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {formData.subtitle || "Project subtitle will appear here"}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{formData.client || "Client"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{formData.timeline || "Timeline"}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{formData.duration || "Duration"}</span>
          </div>
        </div>
      </div>

      {/* Portfolio Card (marquee style) */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-6 mb-2">
        Homepage portfolio card
      </p>
      <div className="bg-gray-100 rounded-2xl overflow-hidden max-w-xs mx-auto">
        <div className="relative aspect-[4/3] bg-gray-200">
          {formData.portfolioImage || formData.heroImage ? (
            <Image
              src={formData.portfolioImage || formData.heroImage}
              alt={formData.title || "Preview"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
        <div className="p-3 flex justify-between items-center bg-white">
          <div className="max-w-[70%]">
            <h3 className="text-sm font-bold text-black truncate">
              {formData.title || "Project Title"}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {formData.subtitle || "Subtitle"}
            </p>
            <p className="text-[10px] text-gray-400">
              {formData.country || "Country"}
            </p>
          </div>
          <div className="border w-7 h-7 rounded-full bg-white text-black flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPreview({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
        Project detail page
      </p>

      <div className="bg-white rounded-lg overflow-hidden border text-left">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {formData.title || "Project Title"}
          </h1>
          <p className="text-sm text-gray-600 mb-3">
            {formData.subtitle || "Project subtitle will appear here"}
          </p>
          {formData.demoUrl && (
            <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold">
              <Play className="size-3" />
              View Demo
              <ExternalLink className="size-3" />
            </div>
          )}
        </div>

        {/* Hero Image */}
        {formData.heroImage ? (
          <div className="relative w-full h-36 bg-gray-100">
            <Image
              src={formData.heroImage}
              alt={formData.title || "Hero"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            No hero image
          </div>
        )}

        {/* Meta bar */}
        <div className="px-5 py-3 bg-slate-50 flex flex-wrap gap-4 text-[10px] text-gray-500">
          <div>
            <p className="mb-0.5">Client</p>
            <div className="flex items-center gap-1 font-bold text-black text-xs">
              <User size={10} />
              {formData.client || "—"}
            </div>
          </div>
          <div>
            <p className="mb-0.5">Tech</p>
            <div className="flex items-center gap-1 font-bold text-black text-xs">
              <Computer size={10} />
              <div className="flex gap-1 flex-wrap">
                {formData.techStacks.length > 0 ? (
                  formData.techStacks.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span>—</span>
                )}
                {formData.techStacks.length > 2 && (
                  <span className="text-[9px] text-gray-400">
                    +{formData.techStacks.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="mb-0.5">Timeline</p>
            <div className="flex items-center gap-1 font-bold text-black text-xs">
              <Calendar size={10} />
              {formData.duration || "—"}
            </div>
          </div>
          <div>
            <p className="mb-0.5">Duration</p>
            <div className="flex items-center gap-1 font-bold text-black text-xs">
              <Clock size={10} />
              {formData.timeline || "—"}
            </div>
          </div>
        </div>

        {/* Sections */}
        {Object.entries(formData.sections).length > 0 && (
          <div className="px-5 py-4 space-y-4 bg-slate-50">
            <hr />
            {Object.entries(formData.sections).map(([key, section]) => (
              <div key={key}>
                <h2 className="text-sm font-bold text-gray-900 mb-1.5">
                  {section.title}
                </h2>
                <div className="text-xs text-gray-600 space-y-1.5">
                  {section.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {formData.images.length > 0 && (
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-2">
              {formData.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-video rounded overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            {formData.images.length > 4 && (
              <p className="text-[10px] text-gray-400 mt-1 text-center">
                +{formData.images.length - 4} more images
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t text-center">
          <h3 className="text-xs font-semibold text-gray-900 mb-1">
            Ready to start a project?
          </h3>
          <div className="flex gap-2 justify-center mt-2">
            <span className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-full font-semibold">
              Get Started
            </span>
            <span className="text-[10px] border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full font-semibold">
              View More Work
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
