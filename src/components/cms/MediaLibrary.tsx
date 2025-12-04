"use client";

import { useState } from "react";
import { Upload, Search, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  media: {
    id: string;
    filename: string;
    url: string;
    mimeType: string | null;
    size: number | null;
    createdAt: Date;
  };
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

export default function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [media, setMedia] = useState(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const filteredMedia = media.filter((item) =>
    item.media.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const newMedia = await response.json();
      setMedia([newMedia, ...media]);
      setShowUpload(false);
    } catch {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/cms/media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMedia(media.filter((item) => item.media.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete file");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </button>
      </div>

      {/* Upload Dialog */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Media</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="block">
              <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
            {uploading && (
              <p className="mt-4 text-sm text-gray-600">Uploading...</p>
            )}
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            {searchQuery ? "No media found" : "No media uploaded yet"}
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.media.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="aspect-square bg-gray-100 relative">
                {item.media.mimeType?.startsWith("image/") ? (
                  <Image
                    src={item.media.url}
                    alt={item.media.filename}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(item.media.url)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white text-gray-900 rounded text-sm hover:bg-gray-100"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item.media.id)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">
                  {item.media.filename}
                </p>
                {item.media.size && (
                  <p className="text-xs text-gray-400">
                    {(item.media.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


