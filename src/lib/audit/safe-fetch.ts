// Fetching URLs that visitors type in, without letting them point us at our own network
// (SSRF). Only http/https on default ports, no IP-literal hosts, every resolved address must
// be public, every redirect hop is checked again, and responses are time- and size-capped.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const AUDIT_UA = "KreataleAudit/1.0 (+https://kreatale.com/en/website-audit)";
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 10_000;
const MAX_BYTES = 2 * 1024 * 1024;

export class UnsafeUrlError extends Error {}

function v4ToInt(ip: string) {
  return ip.split(".").reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
}
const inV4 = (ip: string, base: string, bits: number) => {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (v4ToInt(ip) & mask) === (v4ToInt(base) & mask);
};

const BLOCKED_V4: [string, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8],
  ["169.254.0.0", 16], // link-local, incl. cloud metadata 169.254.169.254
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved + broadcast
];

/** True for addresses that must never be fetched (private, loopback, link-local, …). */
export function isBlockedAddress(ip: string): boolean {
  const kind = isIP(ip);
  if (kind === 4) return BLOCKED_V4.some(([b, n]) => inV4(ip, b, n));
  if (kind === 6) {
    const a = ip.toLowerCase();
    if (a === "::" || a === "::1") return true;
    const mapped = a.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedAddress(mapped[1]);
    if (/^(fc|fd)/.test(a)) return true; // unique local
    if (/^fe[89ab]/.test(a)) return true; // link-local
    if (/^ff/.test(a)) return true; // multicast
    if (a.startsWith("64:ff9b:")) return true; // NAT64 can reach v4 private space
    if (a.startsWith("2001:db8:")) return true; // documentation
    return false;
  }
  return true;
}

/** Throws UnsafeUrlError unless the URL is http(s), default port, and resolves only to public IPs. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new UnsafeUrlError("That doesn't look like a web address.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new UnsafeUrlError("Only http and https addresses can be checked.");
  if (u.port && u.port !== "80" && u.port !== "443") throw new UnsafeUrlError("Only standard web ports can be checked.");
  if (u.username || u.password) throw new UnsafeUrlError("Addresses with a username or password can't be checked.");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) throw new UnsafeUrlError("Please enter a domain name, not an IP address.");
  if (!host.includes(".") || /\.(local|localhost|internal|lan|home|corp)$/i.test(host) || host === "localhost") {
    throw new UnsafeUrlError("That address isn't on the public internet.");
  }
  let addrs: { address: string }[];
  try {
    addrs = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new UnsafeUrlError("We couldn't find that domain. Check the spelling?");
  }
  if (!addrs.length || addrs.some((a) => isBlockedAddress(a.address))) {
    throw new UnsafeUrlError("That address isn't on the public internet.");
  }
  return u;
}

export type SafeResponse = {
  url: string; // final URL after redirects
  status: number;
  headers: Headers;
  body: string;
  redirects: string[];
  truncated: boolean;
};

/** GET with manual, re-validated redirects and size/time caps. Returns text bodies only. */
export async function safeFetch(raw: string, opts: { timeoutMs?: number; maxBytes?: number } = {}): Promise<SafeResponse> {
  const deadline = Date.now() + (opts.timeoutMs ?? TIMEOUT_MS);
  const maxBytes = opts.maxBytes ?? MAX_BYTES;
  const redirects: string[] = [];
  let current = (await assertPublicUrl(raw)).toString();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const left = deadline - Date.now();
    if (left <= 0) throw new Error("The site took too long to respond.");
    const res = await fetch(current, {
      redirect: "manual",
      headers: { "User-Agent": AUDIT_UA, Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5" },
      signal: AbortSignal.timeout(left),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      res.body?.cancel().catch(() => {});
      const next = new URL(res.headers.get("location")!, current).toString();
      await assertPublicUrl(next);
      redirects.push(next);
      current = next;
      continue;
    }
    // read up to maxBytes
    let received = 0;
    let truncated = false;
    const chunks: Uint8Array[] = [];
    const reader = res.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > maxBytes) {
          truncated = true;
          chunks.push(value.subarray(0, value.byteLength - (received - maxBytes)));
          reader.cancel().catch(() => {});
          break;
        }
        chunks.push(value);
      }
    }
    const body = new TextDecoder("utf-8", { fatal: false }).decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
    return { url: current, status: res.status, headers: res.headers, body, redirects, truncated };
  }
  throw new Error("Too many redirects.");
}

/** Accepts "example.com", "www.example.com/page", "https://…" and returns a full https URL. */
export function normaliseUrl(input: string): string {
  let s = input.trim();
  if (!s) throw new UnsafeUrlError("Enter a website address.");
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  const u = new URL(s);
  u.hash = "";
  return u.toString();
}
