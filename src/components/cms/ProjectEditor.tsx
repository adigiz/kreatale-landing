"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Save } from "lucide-react";
import type { Project } from "@/lib/cms/db";

interface ProjectEditorProps {
  project?: Project;
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
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
    demoUrl: string;
    locale: string;
    status: "draft" | "published" | "archived";
  }>({
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
    demoUrl: project?.demoUrl || "",
    locale: project?.locale || "en",
    status: project?.status || ("draft" as "draft" | "published" | "archived"),
  });

  const [newTechStack, setNewTechStack] = useState("");
  const [newImage, setNewImage] = useState("");
  const [sectionKey, setSectionKey] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");

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
        demoUrl: project.demoUrl || "",
        locale: project.locale,
        status: project.status as "draft" | "published" | "archived",
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = project
        ? `/api/cms/projects/${project.id}`
        : "/api/cms/projects";
      const method = project ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      router.push(`/${locale}/admin/projects`);
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setLoading(false);
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

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
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
      return { ...prev, sections: newSections };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline
            </label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) =>
                setFormData({ ...formData, timeline: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              value={formData.heroImage}
              onChange={(e) =>
                setFormData({ ...formData, heroImage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Image URL
            </label>
            <input
              type="url"
              value={formData.portfolioImage}
              onChange={(e) =>
                setFormData({ ...formData, portfolioImage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tech Stacks
          </label>
          <div className="flex gap-2 mb-2">
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
              placeholder="Add tech stack"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addTechStack}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStacks.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="Add image URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Project image ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sections
          </label>
          <div className="border border-gray-300 rounded-lg p-4 space-y-4 mb-4">
            <input
              type="text"
              value={sectionKey}
              onChange={(e) => setSectionKey(e.target.value)}
              placeholder="Section key (e.g., background)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Section title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              value={sectionContent}
              onChange={(e) => setSectionContent(e.target.value)}
              placeholder="Section content (one paragraph per line)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add Section
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(formData.sections).map(
              ([key, section]: [
                string,
                { title: string; content: string[] }
              ]) => (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg p-3 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-semibold">{section.title}</h4>
                    <p className="text-sm text-gray-600">{key}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locale
            </label>
            <select
              value={formData.locale}
              onChange={(e) =>
                setFormData({ ...formData, locale: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "draft" | "published" | "archived",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
        </button>
      </div>
    </form>
  );
}

