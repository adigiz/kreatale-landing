// Our own checks on the page HTML plus robots.txt and the sitemap, fetched through the SSRF
// guard. These cover search and sharing basics that PageSpeed doesn't explain in plain words.

import { safeFetch, AUDIT_UA } from "./safe-fetch";

export type CheckId =
  | "https"
  | "http-redirect"
  | "title"
  | "meta-description"
  | "viewport"
  | "lang"
  | "canonical"
  | "og-tags"
  | "single-h1"
  | "structured-data"
  | "image-alt"
  | "favicon"
  | "robots-txt"
  | "sitemap";

export type Check = { id: CheckId; pass: boolean; value?: string };

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
const metaContent = (html: string, key: string, by: "name" | "property" = "name") => {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) if (attr(m[0], by)?.toLowerCase() === key) return attr(m[0], "content")?.trim() ?? "";
  return undefined;
};
const clip = (s: string, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export async function runHtmlChecks(url: string): Promise<{ checks: Check[]; finalUrl: string }> {
  const page = await safeFetch(url);
  if (page.status >= 400) throw new Error(`The page returned an error (${page.status}).`);
  const html = page.body;
  const final = new URL(page.url);
  const head = html.slice(0, 200_000);
  const checks: Check[] = [];

  checks.push({ id: "https", pass: final.protocol === "https:" });

  // does the plain-http version send people to https?
  try {
    const httpVersion = new URL(final.toString());
    httpVersion.protocol = "http:";
    const r = await fetch(httpVersion, { redirect: "manual", headers: { "User-Agent": AUDIT_UA }, signal: AbortSignal.timeout(6000) });
    const loc = r.headers.get("location") || "";
    checks.push({ id: "http-redirect", pass: r.status >= 300 && r.status < 400 && loc.startsWith("https://") });
  } catch {
    checks.push({ id: "http-redirect", pass: final.protocol === "https:" });
  }

  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
  checks.push({ id: "title", pass: title.length >= 10 && title.length <= 65, value: title ? `${title.length} characters: ${clip(title)}` : "Missing" });

  const desc = metaContent(head, "description") ?? "";
  checks.push({ id: "meta-description", pass: desc.length >= 50 && desc.length <= 170, value: desc ? `${desc.length} characters: ${clip(desc, 120)}` : "Missing" });

  checks.push({ id: "viewport", pass: /width\s*=\s*device-width/i.test(metaContent(head, "viewport") ?? "") });

  const htmlTag = head.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const lang = attr(htmlTag, "lang");
  checks.push({ id: "lang", pass: Boolean(lang), value: lang || undefined });

  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((t) => attr(t, "rel")?.toLowerCase() === "canonical");
  checks.push({ id: "canonical", pass: Boolean(canonical && attr(canonical, "href")) });

  const ogTitle = metaContent(head, "og:title", "property");
  const ogImage = metaContent(head, "og:image", "property");
  checks.push({ id: "og-tags", pass: Boolean(ogTitle && ogImage), value: [ogTitle ? "title" : null, ogImage ? "image" : null].filter(Boolean).join(" + ") || "None" });

  const h1s = html.match(/<h1\b/gi)?.length ?? 0;
  checks.push({ id: "single-h1", pass: h1s === 1, value: `${h1s} found` });

  checks.push({ id: "structured-data", pass: /application\/ld\+json/i.test(html) });

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const withAlt = imgs.filter((t) => /\balt\s*=/i.test(t)).length;
  checks.push({
    id: "image-alt",
    pass: imgs.length === 0 || withAlt / imgs.length >= 0.9,
    value: imgs.length ? `${withAlt} of ${imgs.length} images` : "No images",
  });

  const icon = [...head.matchAll(/<link\b[^>]*>/gi)].some((m) => /icon/i.test(attr(m[0], "rel") ?? ""));
  checks.push({ id: "favicon", pass: icon });

  const origin = `${final.protocol}//${final.host}`;
  let robotsBody = "";
  try {
    const r = await safeFetch(`${origin}/robots.txt`, { timeoutMs: 6000, maxBytes: 200_000 });
    robotsBody = r.status < 400 ? r.body : "";
    checks.push({ id: "robots-txt", pass: r.status < 400 && /user-agent/i.test(r.body) });
  } catch {
    checks.push({ id: "robots-txt", pass: false });
  }

  let sitemapOk = false;
  const sitemapUrls = [...robotsBody.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  for (const sm of [...sitemapUrls, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`].slice(0, 3)) {
    try {
      const r = await safeFetch(sm, { timeoutMs: 6000, maxBytes: 500_000 });
      if (r.status < 400 && /<(urlset|sitemapindex)\b/i.test(r.body)) {
        sitemapOk = true;
        break;
      }
    } catch {
      /* try the next one */
    }
  }
  checks.push({ id: "sitemap", pass: sitemapOk });

  return { checks, finalUrl: page.url };
}
