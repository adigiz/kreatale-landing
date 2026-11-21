// Checks the shared secret on scheduled-job endpoints (Authorization: Bearer <CRON_SECRET>).

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function cronAuth(req: NextRequest): "ok" | "unauthorized" | "unconfigured" {
  const secret = process.env.CRON_SECRET;
  if (!secret) return "unconfigured";
  const header = req.headers.get("authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b) ? "ok" : "unauthorized";
}
