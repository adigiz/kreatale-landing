import { NextRequest, NextResponse, after } from "next/server";
import { notifyNewEnquiry } from "@/lib/notify";
import { cleanSource } from "@/lib/enquiry-source";
import { verifyHcaptcha } from "@/lib/captcha";
import { rateLimit, clientIp, HOUR, DAY } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return fail("Invalid request", 400);

    // Honeypot: a field people never see. Bots that fill it get a normal-looking success
    // and nothing is saved or sent.
    if (text(body.website, 200)) {
      return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    }

    const name = text(body.name, 120);
    const email = text(body.email, 200).toLowerCase();
    const company = text(body.company, 160) || null;
    const phone = text(body.phone, 40) || null;
    const inquiry = text(body.inquiry, 100);
    const message = text(body.message, 5000);
    const source = cleanSource(body.source);

    if (!name || !email || !inquiry || !message) return fail("Required fields are missing", 400);
    if (!EMAIL_RE.test(email)) return fail("Invalid email format", 400);

    const ip = clientIp(request);
    if (!rateLimit(`contact:ip:${ip}`, 5, HOUR) || !rateLimit(`contact:email:${email}`, 3, DAY)) {
      return fail("Too many messages. Please email info@kreatale.com instead.", 429);
    }

    const captcha = await verifyHcaptcha(body.captchaToken);
    if (captcha === "missing") return fail("Please complete the captcha verification", 400);
    if (captcha === "misconfigured") return fail("Server configuration error", 500);
    if (captcha !== "ok") return fail("Captcha verification failed", 400);

    const { createContact } = await import("@/lib/cms/queries/contacts");
    const saved = await createContact({
      name,
      email,
      company,
      phone,
      inquiry,
      message,
      read: "false",
      source,
    });

    // The enquiry is saved. Everything below is best effort and never fails the request.
    let dealId: string | null = null;
    try {
      const { createDealFromContact } = await import("@/lib/cms/queries/deals");
      dealId = (await createDealFromContact({ id: saved.id, name, email, company, phone, inquiry, message })).dealId;
    } catch (err) {
      console.error("Could not create a deal for the enquiry:", err);
    }

    // after the response is sent: confirmation to the visitor, alert to the team
    after(async () => {
      if (dealId) {
        const { sendAutoReply } = await import("@/lib/emails/auto-reply");
        await sendAutoReply({ dealId, name, email });
      }
      await notifyNewEnquiry({ id: saved.id, dealId, name, email, company, phone, inquiry, message, source });
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return fail("Internal server error", 500);
  }
}
