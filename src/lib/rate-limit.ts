// Fixed-window rate limiting kept in memory, the same approach as the admin login lockout.
// It resets on deploy and isn't shared between instances, which is fine for one container.

import type { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();
let lastSweep = Date.now();

/** Counts one hit for `key`; returns false once `max` hits happened inside `windowMs`. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastSweep > 10 * 60_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    lastSweep = now;
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

/** The visitor's IP as seen by the reverse proxy (first X-Forwarded-For entry). */
export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export const HOUR = 60 * 60_000;
export const DAY = 24 * HOUR;
