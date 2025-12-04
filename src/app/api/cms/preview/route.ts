import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth/config";
import { db, previewTokens } from "@/lib/cms/db";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { contentType, contentId, contentData } = body;

    if (!contentType || !contentData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a secure random token
    const token = randomBytes(32).toString("hex");

    // Create preview token (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.insert(previewTokens).values({
      token,
      contentType,
      contentId: contentId || null,
      expiresAt,
    });

    return NextResponse.json({ token, expiresAt });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find and validate token
    const [previewToken] = await db
      .select()
      .from(previewTokens)
      .where(and(eq(previewTokens.token, token), gt(previewTokens.expiresAt, new Date())))
      .limit(1);

    if (!previewToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json({ valid: true, previewToken });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

