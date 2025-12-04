import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, inquiry, message, captchaToken } =
      body;

    // Validate required fields
    if (!name || !email || !inquiry || !message) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Validate captcha token
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Please complete the captcha verification" },
        { status: 400 }
      );
    }

    // Verify hCaptcha token
    const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;
    if (!hcaptchaSecret) {
      console.error("HCAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const verifyResponse = await fetch(
      "https://hcaptcha.com/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: hcaptchaSecret,
          response: captchaToken,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save contact form submission to database
    const { createContact } = await import("@/lib/cms/queries/contacts");
    
    await createContact({
      name,
      email,
      company: company || null,
      phone: phone || null,
      inquiry,
      message,
      read: "false",
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

