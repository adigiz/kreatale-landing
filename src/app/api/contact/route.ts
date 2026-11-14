import { NextRequest, NextResponse } from "next/server";
import { notifyNewEnquiry, type EnquirySource } from "@/lib/notify";

// Keeps only short strings from what the browser sent about where the visitor came from.
function cleanSource(raw: unknown): EnquirySource | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max = 300) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
  const utm: Record<string, string> = {};
  if (r.utm && typeof r.utm === "object") {
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
    ]) {
      const v = str((r.utm as Record<string, unknown>)[k], 120);
      if (v) utm[k] = v;
    }
  }
  const out: EnquirySource = {
    landingPage: str(r.landingPage),
    referrer: str(r.referrer),
    formPage: str(r.formPage),
    utm: Object.keys(utm).length ? utm : undefined,
  };
  return Object.values(out).some(Boolean) ? out : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, inquiry, message, captchaToken } =
      body;
    const source = cleanSource(body.source);

    // Validate required fields
    if (!name || !email || !inquiry || !message) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    // Validate captcha token
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Please complete the captcha verification" },
        { status: 400 },
      );
    }

    // Verify hCaptcha token
    const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;
    if (!hcaptchaSecret) {
      console.error("HCAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const verifyResponse = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: hcaptchaSecret,
        response: captchaToken,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Save contact form submission to database
    const { createContact } = await import("@/lib/cms/queries/contacts");

    const saved = await createContact({
      name,
      email,
      company: company || null,
      phone: phone || null,
      inquiry,
      message,
      read: "false",
      source,
    });

    // The enquiry is saved; the alert is best effort and never fails the request.
    await notifyNewEnquiry({
      id: saved.id,
      name,
      email,
      company,
      phone,
      inquiry,
      message,
      source,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
