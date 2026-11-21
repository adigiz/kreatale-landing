// Public "free website check". Saves the visitor as an enquiry + deal (source: audit), starts
// the audit, and returns the report URL right away; the report page polls until it's done.
// Afterwards the visitor gets the link by email and the team gets an alert.

import { createHash } from "node:crypto";
import { NextRequest, NextResponse, after } from "next/server";
import { verifyHcaptcha } from "@/lib/captcha";
import { rateLimit, clientIp, HOUR, DAY } from "@/lib/rate-limit";
import { cleanSource } from "@/lib/enquiry-source";
import { notifyNewEnquiry } from "@/lib/notify";
import { assertPublicUrl, normaliseUrl, UnsafeUrlError } from "@/lib/audit/safe-fetch";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const DAILY_LIMIT = Number(process.env.AUDIT_DAILY_LIMIT) || 100;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return fail("Invalid request", 400);
    if (text(body.company_site, 200)) return NextResponse.json({ reportUrl: "/en/website-audit" }); // honeypot

    const name = text(body.name, 120);
    const email = text(body.email, 200).toLowerCase();
    const rawUrl = text(body.url, 300);
    if (!name || !email || !rawUrl) return fail("Please fill in your website, name and email.", 400);
    if (!EMAIL_RE.test(email)) return fail("That email address doesn't look right.", 400);

    const ip = clientIp(request);
    if (!rateLimit(`audit:ip:${ip}`, 3, HOUR) || !rateLimit(`audit:email:${email}`, 5, DAY)) {
      return fail("You've run a few checks already. Please try again in an hour.", 429);
    }

    const captcha = await verifyHcaptcha(body.captchaToken);
    if (captcha === "missing") return fail("Please tick the box to show you are not a robot.", 400);
    if (captcha === "misconfigured") return fail("Server configuration error", 500);
    if (captcha !== "ok") return fail("The robot check didn't pass. Please try again.", 400);

    let url: URL;
    try {
      url = await assertPublicUrl(normaliseUrl(rawUrl));
    } catch (e) {
      return fail(e instanceof UnsafeUrlError ? e.message : "That doesn't look like a web address.", 400);
    }
    const host = url.hostname.replace(/^www\./, "");

    const { createAudit, recentAuditForHost, publicAuditsToday } = await import("@/lib/cms/queries/audits");
    if ((await publicAuditsToday()) >= DAILY_LIMIT) {
      return fail("We've had a lot of checks today. Please try again tomorrow, or email info@kreatale.com.", 503);
    }

    // the person becomes an enquiry and a deal, like the contact form
    const source = cleanSource(body.source);
    const { createContact } = await import("@/lib/cms/queries/contacts");
    const message = `Ran the free website check for ${url.toString()}`;
    const saved = await createContact({ name, email, inquiry: "Website audit", message, read: "false", source });
    let dealId: string | null = null;
    try {
      const { createDealFromContact } = await import("@/lib/cms/queries/deals");
      dealId = (
        await createDealFromContact({ id: saved.id, name, email, inquiry: "Website audit", message, source: "audit", website: url.toString() })
      ).dealId;
    } catch (err) {
      console.error("Could not create a deal for the audit:", err);
    }

    // reuse a check of the same site from the last day instead of running Google again
    const cached = await recentAuditForHost(host, 24);
    const audit = await createAudit({
      url: url.toString(),
      host,
      origin: "public",
      requesterName: name,
      requesterEmail: email,
      dealId,
      ipHash: createHash("sha256").update(`${ip}:${process.env.NEXTAUTH_SECRET ?? ""}`).digest("hex"),
      ...(cached
        ? {
            status: "done",
            scores: cached.scores,
            vitals: cached.vitals,
            checks: cached.checks,
            fixes: cached.fixes,
            overall: cached.overall,
            error: cached.error,
            completedAt: new Date(),
          }
        : {}),
    });

    after(async () => {
      const { addActivity } = await import("@/lib/cms/queries/deals");
      if (dealId) await addActivity({ dealId, type: "audit", body: `Ran the free website check for ${host}`, meta: { token: audit.token, auditId: audit.id } });
      let finished = audit;
      if (!cached) {
        const { runAuditJob } = await import("@/lib/audit/queue");
        finished = (await runAuditJob(audit.id).catch(() => null)) ?? audit;
      }
      const { sendAuditReport } = await import("@/lib/emails/audit-report");
      await sendAuditReport(finished);
      const score = finished.overall != null ? `, score ${finished.overall}/100` : "";
      await notifyNewEnquiry({ id: saved.id, dealId, name, email, inquiry: "Website audit", message: `${message}${score}`, source });
    });

    return NextResponse.json({ reportUrl: `/en/website-audit/r/${audit.token}` });
  } catch (error) {
    console.error("Error starting website audit:", error);
    return fail("Something went wrong. Please try again.", 500);
  }
}
