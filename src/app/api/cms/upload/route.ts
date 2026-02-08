import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/cms/auth/config";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary — the SDK auto-reads CLOUDINARY_URL if set
// but we configure explicitly as a fallback
function ensureCloudinaryConfig() {
  // If CLOUDINARY_URL is set, the SDK reads it automatically
  if (process.env.CLOUDINARY_URL) {
    return true;
  }

  // Fallback to individual env vars
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration
    if (!ensureCloudinaryConfig()) {
      console.error("[Upload] Cloudinary not configured. Set CLOUDINARY_URL or individual CLOUDINARY_* env vars.");
      return NextResponse.json(
        { error: "Image upload service is not configured" },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    // Use Blob check instead of File — File class isn't available in all Node.js runtimes
    if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side file validation
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/avif",
    ];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const fileType = file.type;
    const fileSize = file.size;

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI — more reliable than upload_stream in containers
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${fileType};base64,${base64}`;

    // Upload to Cloudinary using base64 data URI
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "kreatale-cms",
      resource_type: "image",
    });

    // Insert f_auto,q_auto delivery transformation for automatic format and quality optimization
    const optimizedUrl = uploadResult.secure_url.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_auto/"
    );

    return NextResponse.json({
      url: optimizedUrl,
      publicId: uploadResult.public_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Upload Error]", message);

    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
