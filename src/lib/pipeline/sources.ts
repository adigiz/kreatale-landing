// Turns the tracking data saved with each enquiry (contacts.source) into a channel name.

import type { EnquirySource } from "@/lib/notify";

const KNOWN: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)(claude\.ai|anthropic\.com)$/, "Claude"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "LinkedIn"],
  [/(^|\.)(facebook\.com|fb\.com|m\.facebook\.com)$/, "Facebook"],
  [/(^|\.)(instagram\.com|l\.instagram\.com)$/, "Instagram"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "X"],
  [/(^|\.)threads\.(net|com)$/, "Threads"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)(clutch\.co|upwork\.com|fiverr\.com|contra\.com)$/, "Directories"],
  [/(^|\.)kreatale\.com$/, "Direct"],
];

export function channelOf(src: EnquirySource | null | undefined): string {
  if (!src) return "Direct";
  const utm = src.utm?.utm_source?.trim();
  if (utm) return utm.charAt(0).toUpperCase() + utm.slice(1);
  if (src.utm?.gclid) return "Google Ads";
  if (src.utm?.fbclid) return "Facebook";
  if (src.referrer) {
    try {
      const host = new URL(src.referrer).hostname.replace(/^www\./, "");
      for (const [re, name] of KNOWN) if (re.test(host)) return name;
      return host;
    } catch {
      /* not a URL */
    }
  }
  if (src.landingPage?.includes("/blog/")) return "Direct to blog";
  return "Direct";
}

/** The first blog post a visitor landed on, if any (for "which posts bring enquiries"). */
export function landingBlogPost(src: EnquirySource | null | undefined): string | null {
  const m = src?.landingPage?.match(/\/(?:en|id)\/blog\/([^/?#]+)/);
  return m ? m[1] : null;
}
