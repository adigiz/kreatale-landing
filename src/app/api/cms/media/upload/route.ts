import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { put } from "@vercel/blob";
import { createMedia } from "@/lib/cms/queries/media";

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.MEDIA_CREATE);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Save to database
    const media = await createMedia({
      filename: file.name,
      url: blob.url,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}


