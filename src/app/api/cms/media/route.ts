import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/cms/auth/config";
import { getAllMedia, createMedia, searchMedia } from "@/lib/cms/queries/media";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { z } from "zod";

const mediaSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.MEDIA_READ);

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    if (search) {
      const media = await searchMedia(search);
      return NextResponse.json(media);
    }

    const media = await getAllMedia();
    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.MEDIA_CREATE);

    const body = await request.json();
    const data = mediaSchema.parse(body);

    const media = await createMedia({
      ...data,
      uploadedById: session.user.id,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


