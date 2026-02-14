"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { DemoFormValues, demoSchema, DemoSite } from "./types";
import { DUMMY_TOUR_CONFIG } from "@/lib/cms/dummy/tour";
import { DUMMY_CAR_CONFIG } from "./utils/template-configs";
import { GeneralTab } from "./components/tabs/GeneralTab";
import { BrandingTab } from "./components/tabs/BrandingTab";
import { HeroTab } from "./components/tabs/HeroTab";
import { CollectionSection } from "./components/CollectionSection";
import { EntitySection } from "./components/EntitySection";
import { PreviewSystem } from "./components/PreviewSystem";
import { TEMPLATE_CONFIGS } from "./utils/template-configs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { createDemoSite, updateDemoSite } from "./actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_FIELDS: Record<string, string[]> = {
  basic: ["slug", "templateId", "language", "isPublished"],
  branding: ["logo", "primaryColor"],
  hero: [
    "heroTitle",
    "heroSubtitle",
    "heroImage",
    "price",
    "days",
    "location",
    "currency",
  ],
  content: ["destinations", "packages"],
};

interface DemoSiteFormProps {
  initialData?: DemoSite;
  isEditing?: boolean;
}

const TEMPLATES = [
  { id: "tour", name: "Tour & Travel" },
  { id: "car", name: "Car Rental" },
];

export default function DemoSiteForm({
  initialData,
  isEditing = false,
}: DemoSiteFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [deviceSize, setDeviceSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(
    initialData?.id || null,
  );
  const lastPreviewConfig = useRef<string>("");
  const [activeTab, setActiveTab] = useState("basic");

  const tabHasErrors = (tab: string) => {
    const fields = TAB_FIELDS[tab] || [];
    return fields.some((field) => {
      return Object.keys(errors).some(
        (errorKey) => errorKey === field || errorKey.startsWith(`${field}.`),
      );
    });
  };

  const TabLabel = ({ label, tab }: { label: string; tab: string }) => (
    <span className="flex items-center gap-2">
      {label}
      {tabHasErrors(tab) && (
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      )}
    </span>
  );

  const defaultValues: Partial<DemoFormValues> = {
    slug: initialData?.slug || "",
    websiteName: initialData?.config?.websiteName || "",
    templateId: initialData?.templateId || "tour",
    language: initialData?.config?.language || "en",
    isPublished: initialData?.isPublished || false,
    logo: initialData?.config?.logo || "",
    primaryColor: initialData?.config?.primaryColor || "#000000",
    currency: initialData?.config?.currency || "Rp",
    location: initialData?.config?.location || "",
    heroTitle: initialData?.config?.heroTitle || "",
    heroSubtitle: initialData?.config?.heroSubtitle || "",
    heroImage: initialData?.config?.heroImage || "",
    price: initialData?.config?.price || "",
    days: initialData?.config?.days || "",
    destinations: initialData?.config?.destinations || [],
    packages: initialData?.config?.packages || [],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues,
  });

  const templateId = watch("templateId");
  const formValues = watch();
  const currentTemplateId = templateId || "tour";
  const templateConfig =
    TEMPLATE_CONFIGS[currentTemplateId] || TEMPLATE_CONFIGS.tour;

  useEffect(() => {
    // When templateId changes, we should reset specific fields to their defaults
    // to avoid carrying over irrelevant data from the previous template.
    // However, we only do this if it's a user interaction, not on initial load.
    // The best way to detect this is to check if the form is dirty or if we're not initializing.

    // For now, we'll just listen to templateId changes and if it's different from the default "tour",
    // we might want to clear some fields.
    // A better approach is to rely on the "Fill Sample Data" feature, but users might want a clean slate.

    // Let's reset collections and entities when template changes
    if (templateId !== initialData?.templateId) {
      setValue("destinations", []);
      setValue("packages", []);
      setValue("heroImage", "");
      setValue("heroTitle", "");
      setValue("heroSubtitle", "");
      // Reset other fields as needed
    }
  }, [templateId, setValue, initialData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = document.querySelector(
        "[data-split-container]",
      ) as HTMLElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.max(20, Math.min(80, newRatio)));
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleFillDummy = () => {
      handleFillDummyData();
    };

    window.addEventListener("demo-site:fill-dummy", handleFillDummy);
    return () => {
      window.removeEventListener("demo-site:fill-dummy", handleFillDummy);
    };
  }, []);

  const handlePreview = useCallback(
    async (openInNewTab = false) => {
      setPreviewLoading(true);
      try {
        const { slug, templateId, isPublished, ...configData } = getValues();
        const payload = {
          slug,
          templateId,
          isPublished,
          config: configData,
        };

        let savedPostId = createdDraftId;

        if (!savedPostId) {
          savedPostId = "draft";
        }

        const previewResponse = await fetch("/api/cms/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: "demo-site",
            contentId: savedPostId === "draft" ? null : savedPostId,
            contentData: payload,
          }),
        });

        if (!previewResponse.ok) throw new Error("Failed to create preview");
        const { token } = await previewResponse.json();

        if (openInNewTab) {
          const previewUrl = `/${locale}/preview/${token}?type=demo`;
          window.open(previewUrl, "_blank");
        } else {
          setPreviewToken(token);
          setShowPreview(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate preview");
      } finally {
        setPreviewLoading(false);
      }
    },
    [getValues, createdDraftId, locale],
  );

  const handleFillDummyData = useCallback(() => {
    let dummyData = null;
    if (templateId === "tour") {
      dummyData = DUMMY_TOUR_CONFIG;
    } else if (templateId === "car") {
      dummyData = DUMMY_CAR_CONFIG;
    }

    if (dummyData) {
      Object.entries(dummyData).forEach(([key, value]) => {
        setValue(key as keyof DemoFormValues, value);
      });
      toast.success(`Filled with ${templateConfig.name} sample data`);
    } else {
      toast.info(`Sample data for '${templateId}' not available yet.`);
    }

    setShowPreview(true);

    setTimeout(() => {
      handlePreview(false);
    }, 100);
  }, [templateId, setValue, handlePreview, templateConfig.name]);

  useEffect(() => {
    const currentConfigString = JSON.stringify(formValues);
    if (
      showPreview &&
      formValues.slug &&
      !previewLoading &&
      (createdDraftId || formValues.slug.length > 3) &&
      currentConfigString !== lastPreviewConfig.current
    ) {
      const timer = setTimeout(() => {
        lastPreviewConfig.current = currentConfigString;
        handlePreview(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formValues, showPreview, createdDraftId, handlePreview, previewLoading]);

  const onSubmit = async (data: DemoFormValues) => {
    window.dispatchEvent(new CustomEvent("demo-site:save-start"));
    try {
      const { slug, templateId, isPublished, ...configData } = data;
      const payload = {
        slug,
        templateId,
        isPublished,
        config: configData,
      };

      if (isEditing && initialData?.id) {
        await updateDemoSite(initialData.id, payload);
        toast.success("Demo site updated successfully");
      } else {
        const newSite = await createDemoSite(payload);
        if (newSite?.id) setCreatedDraftId(newSite.id);
        toast.success("Demo site created successfully");
        if (!isEditing) router.push(`/${locale}/admin/demos`);
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save demo site.");
      }
    } finally {
      window.dispatchEvent(new CustomEvent("demo-site:save-end"));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {isPreviewFullscreen ? (
        <PreviewSystem
          previewToken={previewToken}
          deviceSize={deviceSize}
          setDeviceSize={setDeviceSize}
          previewLoading={previewLoading}
          isFullscreen={isPreviewFullscreen}
          onToggleFullscreen={setIsPreviewFullscreen}
          onOpenNewTab={() => handlePreview(true)}
          onClosePreview={() => setShowPreview(false)}
          locale={locale}
        />
      ) : (
        <div
          className="flex flex-1 min-h-0 overflow-hidden relative"
          data-split-container
        >
          <div
            className="overflow-y-auto p-1"
            style={{ width: showPreview ? `${splitRatio}%` : "100%" }}
          >
            <form
              id="demo-site-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 pb-20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">Configuration</h3>
                  <div className="flex items-center gap-2 border-l pl-4 ml-2">
                    <Switch
                      id="publish-mode"
                      checked={watch("isPublished")}
                      onCheckedChange={(checked) =>
                        setValue("isPublished", checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Label
                      htmlFor="publish-mode"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {watch("isPublished") ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600 border-none text-white"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Draft
                        </Badge>
                      )}
                    </Label>
                  </div>
                </div>
                {!showPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    Show Preview
                  </Button>
                )}
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="basic">
                    <TabLabel label="General" tab="basic" />
                  </TabsTrigger>
                  <TabsTrigger value="branding">
                    <TabLabel label="Branding" tab="branding" />
                  </TabsTrigger>
                  <TabsTrigger value="hero">
                    <TabLabel label="Hero / Spotlight" tab="hero" />
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <TabLabel label="Content" tab="content" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="basic"
                  className="space-y-4 border p-4 rounded-lg bg-gray-50/50 mt-4"
                >
                  <GeneralTab
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    templates={TEMPLATES}
                    onFillSampleData={handleFillDummyData}
                  />
                </TabsContent>

                <TabsContent
                  value="branding"
                  className="space-y-4 border p-4 rounded-lg bg-gray-50/50 mt-4"
                >
                  <BrandingTab watch={watch} setValue={setValue} />
                </TabsContent>

                <TabsContent
                  value="hero"
                  className="space-y-4 border p-4 rounded-lg bg-gray-50/50 mt-4"
                >
                  <HeroTab
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    config={templateConfig}
                  />
                </TabsContent>
                <TabsContent
                  value="content"
                  className="space-y-6 border p-4 rounded-lg bg-gray-50/50 mt-4"
                >
                  <CollectionSection
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    config={templateConfig}
                    errors={errors}
                  />

                  <EntitySection
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    config={templateConfig}
                    errors={errors}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </div>

          {/* HANDLE */}
          {showPreview && (
            <div
              className="w-1 bg-border hover:bg-primary cursor-col-resize group relative z-10 flex-shrink-0 select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-2 transition-all bg-gray-200 group-hover:bg-blue-500" />
            </div>
          )}

          {/* RIGHT: PREVIEW */}
          {showPreview && (
            <div
              className="bg-gray-100 flex flex-col border-l"
              style={{ width: `${100 - splitRatio}%` }}
            >
              <PreviewSystem
                previewToken={previewToken}
                deviceSize={deviceSize}
                setDeviceSize={setDeviceSize}
                previewLoading={previewLoading}
                isFullscreen={false}
                onToggleFullscreen={setIsPreviewFullscreen}
                onOpenNewTab={() => handlePreview(true)}
                onClosePreview={() => setShowPreview(false)}
                locale={locale}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
