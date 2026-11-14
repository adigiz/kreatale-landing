import Script from "next/script";

export type RedesignSource = {
  title: string;
  css: string;
  html: string;
  script: string;
  libs: string[];
  /** blog only: sample cover illustrations used when a post has no image */
  covers?: { bg: string; html: string }[];
  featuredCover?: string;
};

const LIB_GLOBALS: Record<string, string> = {
  "gsap.min.js": "gsap",
  "ScrollTrigger.min.js": "ScrollTrigger",
  "Draggable.min.js": "Draggable",
  "lenis.min.js": "Lenis",
};

/**
 * The prototype loads its fonts from Google Fonts. Here the root layout already self-hosts the
 * same two families with next/font (preloaded, no render-blocking request to Google), so the
 * family names are pointed at those instead.
 */
const localFonts = (s: string) =>
  s
    .replaceAll('"Plus Jakarta Sans"', "var(--font-jakarta)")
    .replaceAll('"Geist Mono"', "var(--font-geist-mono)")
    // SVG text names the font in an attribute, which can't hold var()
    .replaceAll(
      'font-family="Plus Jakarta Sans, sans-serif"',
      'style="font-family: var(--font-jakarta), sans-serif"',
    );

/**
 * Images after the page's first section load only when scrolled near (the hero's stay eager,
 * so a hero image can still be the first thing painted).
 */
const lazyBelowHero = (html: string) => {
  const cut = html.indexOf("</section>");
  if (cut < 0) return html;
  return (
    html.slice(0, cut) +
    html
      .slice(cut)
      .replace(
        /<img (?![^>]*\bloading=)/g,
        '<img loading="lazy" decoding="async" ',
      )
  );
};

/**
 * Renders one page of the redesign prototype.
 * The markup is server-rendered as-is; the page's own script (GSAP + Lenis setup,
 * clock, filters, form chips) runs once the animation libraries have loaded.
 * Links between redesign pages are plain <a> tags, so each page boots fresh.
 */
export default function RedesignPage({
  page,
  locale,
  id,
}: {
  page: RedesignSource;
  locale: string;
  id: string;
}) {
  // Only the blog has an Indonesian version; every other link goes to the English site.
  const withLocale = (s: string) =>
    s.replaceAll("/__L__/blog", `/${locale}/blog`).replaceAll("/__L__", "/en");
  const globals = page.libs.map((l) => LIB_GLOBALS[l]).filter(Boolean);
  const ready = globals.map((g) => `window.${g}`).join(" && ") || "true";
  // Runs after hydration: drop images that failed to load (e.g. a host that blocks embedding),
  // so the card's fallback underneath shows instead of a broken-image box.
  const dropBroken = `document.querySelectorAll('.kreatale-redesign img:not([data-src])').forEach(function(img){ var bad=function(){ img.remove(); }; if (img.complete && !img.naturalWidth) bad(); else img.addEventListener('error', bad); });`;
  // Remembers where this visit started (first page, the site that sent them, UTM tags) for the
  // rest of the tab's session, so the contact form can say where an enquiry came from.
  const firstTouch = `try{ if(!sessionStorage.getItem('kt_src')){ var q=new URLSearchParams(location.search), utm={}; ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(function(k){ var v=q.get(k); if(v) utm[k]=v; }); var ref=document.referrer; try{ if(ref && new URL(ref).host===location.host) ref=''; }catch(e){} sessionStorage.setItem('kt_src', JSON.stringify({ landingPage: location.pathname + location.search, referrer: ref, utm: utm })); } }catch(e){}`;
  const boot = `${firstTouch}\n${dropBroken}\n(function wait(){ if(!(${ready})) return setTimeout(wait, 30);\n${withLocale(page.script)}\n})();`;

  return (
    <>
      <style
        // the prototype's page stylesheet, with its fonts pointed at the self-hosted copies
        dangerouslySetInnerHTML={{ __html: localFonts(withLocale(page.css)) }}
      />
      <div
        className="kreatale-redesign"
        dangerouslySetInnerHTML={{
          __html: lazyBelowHero(localFonts(withLocale(page.html))),
        }}
      />
      {page.libs.map((l) => (
        <Script key={l} src={`/redesign/js/${l}`} strategy="afterInteractive" />
      ))}
      <Script id={`redesign-${id}`} strategy="afterInteractive">
        {boot}
      </Script>
    </>
  );
}
