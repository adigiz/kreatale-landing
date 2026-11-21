// Plain-English explanations for every problem the audit can find. Report copy only ever comes
// from this dictionary, never generated text. impact: 3 = fix first, 1 = nice to have.

export type Fix = { title: string; why: string; impact: 1 | 2 | 3; area: "speed" | "search" | "access" | "trust" };

export const FIXES: Record<string, Fix> = {
  // our HTML checks
  https: { title: "Serve the site over HTTPS", why: "Browsers mark plain-http pages as \"Not secure\", which puts visitors off, and Google prefers secure pages.", impact: 3, area: "trust" },
  "http-redirect": { title: "Send http:// visitors to https://", why: "People who type the address without https land on an insecure copy of the page instead of the secure one.", impact: 2, area: "trust" },
  title: { title: "Write a clear page title (10 to 65 characters)", why: "The title is the blue link people click in Google. Too short says nothing; too long gets cut off.", impact: 3, area: "search" },
  "meta-description": { title: "Write a meta description of 50 to 170 characters", why: "It's the grey text under your link in search results. Without one, Google picks a random snippet from the page.", impact: 2, area: "search" },
  viewport: { title: "Make the page fit phone screens", why: "Without a viewport tag, phones show a shrunken desktop page that people have to pinch and zoom.", impact: 3, area: "access" },
  lang: { title: "Tell browsers which language the page is in", why: "Screen readers and translation tools use it to read the page correctly.", impact: 1, area: "access" },
  canonical: { title: "Add a canonical link", why: "It tells Google which address is the real one when the same page is reachable in several ways, so ranking isn't split.", impact: 1, area: "search" },
  "og-tags": { title: "Add a share title and image", why: "When someone shares your link on WhatsApp, Facebook or LinkedIn, this controls the preview. Without it the preview is blank or random.", impact: 2, area: "search" },
  "single-h1": { title: "Use exactly one main heading", why: "One clear H1 tells visitors and search engines what the page is about.", impact: 1, area: "search" },
  "structured-data": { title: "Add structured data about your business", why: "It helps Google show your name, address, opening hours or reviews directly in results.", impact: 1, area: "search" },
  "image-alt": { title: "Describe your images with alt text", why: "Blind visitors hear the description, and Google uses it to understand the image.", impact: 2, area: "access" },
  favicon: { title: "Add a favicon", why: "The small icon in browser tabs and on Google's mobile results makes the site look finished and easy to find among open tabs.", impact: 1, area: "trust" },
  "robots-txt": { title: "Add a robots.txt file", why: "It tells search engines what they may crawl and where your sitemap is.", impact: 1, area: "search" },
  sitemap: { title: "Publish an XML sitemap", why: "A sitemap lists every page so Google finds new and updated pages sooner.", impact: 2, area: "search" },

  // Lighthouse: speed
  "largest-contentful-paint": { title: "Show the main content sooner", why: "The biggest thing on screen (usually the hero image or headline) takes too long to appear. Visitors leave slow pages.", impact: 3, area: "speed" },
  "first-contentful-paint": { title: "Show something on screen sooner", why: "Visitors stare at a blank page for too long before anything appears.", impact: 2, area: "speed" },
  "speed-index": { title: "Make the page fill in faster", why: "The page takes too long to look complete while it loads.", impact: 2, area: "speed" },
  "total-blocking-time": { title: "Cut heavy JavaScript", why: "Scripts keep the browser busy, so taps and clicks feel stuck while the page loads.", impact: 3, area: "speed" },
  "cumulative-layout-shift": { title: "Stop the layout jumping around", why: "Content moves while loading, so people tap the wrong thing. Usually caused by images or ads without a fixed size.", impact: 2, area: "speed" },
  "render-blocking-resources": { title: "Load CSS and scripts without blocking the page", why: "The browser waits for these files before it shows anything.", impact: 2, area: "speed" },
  "uses-optimized-images": { title: "Compress your images", why: "Images are larger files than they need to be, which slows the page, especially on mobile data.", impact: 2, area: "speed" },
  "modern-image-formats": { title: "Use modern image formats (WebP or AVIF)", why: "They look the same at a fraction of the file size of JPEG or PNG.", impact: 2, area: "speed" },
  "uses-responsive-images": { title: "Serve smaller images to phones", why: "Phones download desktop-sized images and then shrink them.", impact: 2, area: "speed" },
  "offscreen-images": { title: "Lazy-load images further down the page", why: "Images nobody has scrolled to yet are slowing down the first view.", impact: 1, area: "speed" },
  "unused-javascript": { title: "Remove unused JavaScript", why: "The page downloads code it never runs, often from plugins or third-party widgets.", impact: 2, area: "speed" },
  "unused-css-rules": { title: "Remove unused CSS", why: "The page downloads styles it doesn't use.", impact: 1, area: "speed" },
  "server-response-time": { title: "Speed up the server", why: "The server takes too long to send the first byte. Better hosting or caching usually fixes it.", impact: 3, area: "speed" },
  "uses-text-compression": { title: "Turn on compression (gzip or Brotli)", why: "Text files are sent uncompressed, so they take longer to download. It's usually a single server setting.", impact: 2, area: "speed" },
  "font-display": { title: "Show text while web fonts load", why: "Text stays invisible until the custom font arrives.", impact: 1, area: "speed" },

  // Lighthouse: SEO
  "is-crawlable": { title: "Let search engines index this page", why: "The page tells Google not to index it, so it can't appear in search results.", impact: 3, area: "search" },
  "document-title": { title: "Add a page title", why: "Without a title, Google has nothing to show as the link text.", impact: 3, area: "search" },
  "meta-description:lh": { title: "Add a meta description", why: "It's the text under your link in Google.", impact: 2, area: "search" },
  "http-status-code": { title: "Fix the page's error status", why: "The page returns an error code, so search engines may drop it.", impact: 3, area: "search" },
  "link-text": { title: "Use descriptive link text", why: "Links that say \"click here\" or \"read more\" don't tell people or Google where they go.", impact: 1, area: "search" },
  "crawlable-anchors": { title: "Make links crawlable", why: "Some links can't be followed by search engines, so the pages behind them may never be found.", impact: 1, area: "search" },
  hreflang: { title: "Fix the language alternates", why: "The tags that point to other-language versions of the page are invalid.", impact: 1, area: "search" },
  "robots-txt:lh": { title: "Fix robots.txt", why: "Google can't read your robots.txt file properly.", impact: 2, area: "search" },
  "tap-targets": { title: "Make buttons and links easier to tap", why: "Tap targets are too small or too close together on phones.", impact: 2, area: "access" },

  // Lighthouse: accessibility
  "color-contrast": { title: "Increase text contrast", why: "Some text is hard to read against its background, especially outdoors on a phone.", impact: 2, area: "access" },
  "image-alt:lh": { title: "Add alt text to images", why: "Screen readers can't describe images without it.", impact: 2, area: "access" },
  "button-name": { title: "Give buttons a readable name", why: "Screen readers announce some buttons as just \"button\".", impact: 2, area: "access" },
  "link-name": { title: "Give links a readable name", why: "Screen readers can't tell where some links go.", impact: 2, area: "access" },
  label: { title: "Label your form fields", why: "Form fields without labels are hard to fill in with a screen reader, and you lose enquiries.", impact: 2, area: "access" },
  "html-has-lang": { title: "Set the page language", why: "Screen readers may read the page in the wrong accent or language.", impact: 1, area: "access" },
  "heading-order": { title: "Put headings in order", why: "Skipped heading levels make the page harder to navigate with assistive tech.", impact: 1, area: "access" },
  "meta-viewport": { title: "Allow zooming on phones", why: "The page blocks pinch-to-zoom, which people with low vision rely on.", impact: 2, area: "access" },

  // Lighthouse: best practices
  "is-on-https": { title: "Load everything over HTTPS", why: "Some files load insecurely, which can trigger browser warnings.", impact: 3, area: "trust" },
  "errors-in-console": { title: "Fix browser errors", why: "The page throws JavaScript errors, which can break features for some visitors.", impact: 1, area: "trust" },
  "image-aspect-ratio": { title: "Stop stretching images", why: "Some images are shown at the wrong proportions and look distorted.", impact: 1, area: "trust" },
  "image-size-responsive": { title: "Serve sharper images", why: "Some images are too low-resolution for the screen and look blurry.", impact: 1, area: "trust" },
  deprecations: { title: "Replace outdated browser features", why: "The site uses features browsers are removing, so things may stop working.", impact: 1, area: "trust" },
  "third-party-cookies": { title: "Review third-party cookies", why: "Browsers are phasing out third-party cookies, which may break embedded tools.", impact: 1, area: "trust" },
};

// Lighthouse ids that clash with our own check ids map to the ":lh" entries above.
const LH_ALIAS: Record<string, string> = { "meta-description": "meta-description:lh", "image-alt": "image-alt:lh", "robots-txt": "robots-txt:lh" };

export function fixForLighthouse(id: string): Fix | undefined {
  return FIXES[LH_ALIAS[id] ?? id];
}
