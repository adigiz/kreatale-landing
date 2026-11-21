// Verifies an hCaptcha response token server-side (HCAPTCHA_SECRET_KEY).

export type CaptchaResult = "ok" | "failed" | "missing" | "misconfigured";

export async function verifyHcaptcha(token: unknown): Promise<CaptchaResult> {
  if (typeof token !== "string" || !token) return "missing";
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("HCAPTCHA_SECRET_KEY is not set");
    return "misconfigured";
  }
  try {
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch (err) {
    console.error("hCaptcha verification error:", err);
    return "failed";
  }
}
