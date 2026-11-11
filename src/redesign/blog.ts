import type { RedesignSource } from "./RedesignPage";
import type { BlogPost } from "@/lib/blog";
import { BLOG_CATEGORIES, blogCategoryLabel } from "@/lib/blogCategories";

/**
 * Fills the blog slots left by scripts/sync-redesign.mjs (<!--@FEATURED-->, <!--@CARDS-->,
 * <!--@TITLE-->, …) with real posts from the CMS. Markup mirrors the prototype's sample posts.
 * The blog is the one part of the site with an Indonesian version, so its text is translated here.
 */

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function readMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function shortDate(iso?: string, locale = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const TEXT = {
  en: {
    readIt: "Read it",
    isNew: "New",
    minRead: "min read",
    all: "All",
    filterLabel: "Filter posts",
    empty: "No notes yet. The first ones are on their way.",
    team: "The Kreatale team",
  },
  id: {
    readIt: "Baca",
    isNew: "Baru",
    minRead: "menit baca",
    all: "Semua",
    filterLabel: "Saring tulisan",
    empty: "Belum ada catatan. Yang pertama segera terbit.",
    team: "Tim Kreatale",
  },
};
const text = (locale: string) => (locale === "id" ? TEXT.id : TEXT.en);

const postUrl = (slug: string) => `/__L__/blog/${encodeURIComponent(slug)}`;
const meta = (p: BlogPost, locale: string) =>
  `${esc(shortDate(p.publishedDate || p.createdAt, locale))}<span class="sep"></span>${readMinutes(p.content)} ${text(locale).minRead}`;
/**
 * Remote images go through Next's image optimizer (hosts allowed in next.config.ts), like the
 * old pages did with next/image. Some hosts block direct embedding, and it resizes and compresses.
 */
export const imgSrc = (src: string, width = 1200) =>
  /^https?:\/\//.test(src) ? `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75` : src;
const coverImg = (src: string) =>
  `<img src="${esc(imgSrc(src))}" alt="" loading="lazy" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover">`;
const ARROW =
  '<svg aria-hidden="true" height="13" viewBox="0 0 16 16" width="13"><path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"></path></svg>';
export const SQUIGGLE =
  '<svg aria-hidden="true" preserveAspectRatio="none" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2" viewBox="0 0 400 330"><path d="M -40 40 C 60 -40, 160 80, 60 150 C -20 210, 120 260, 200 180 C 280 100, 380 -20, 430 60 C 470 130, 280 230, 300 300 C 320 370, 440 300, 450 260" data-sq="1" fill="none" stroke="#BFD2FF" stroke-dasharray="0 99999" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="120"></path></svg>';

function card(p: BlogPost, i: number, covers: RedesignSource["covers"] = [], locale = "en") {
  const fallback = covers.length ? covers[i % covers.length] : { bg: "#0061FF", html: "" };
  const art = p.featuredImage
    ? coverImg(p.featuredImage)
    : `<div class="cover" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">${fallback.html}</div>`;
  const hover = p.excerpt ? esc(p.excerpt) : esc(p.title);
  const label = blogCategoryLabel(p.category, locale);
  const chip = label
    ? `<span class="pp-s" style="position: absolute; left: 14px; top: 14px; z-index: 3; border: 2px solid #0A0A0A">${esc(label)}</span>`
    : "";
  return `<a class="k-card" data-card="1" data-cat="${label ? p.category : "none"}" href="${postUrl(p.slug)}">
<div class="clip" data-clip="1" style="position: relative; background: ${p.featuredImage ? "#E5ECFF" : fallback.bg}; aspect-ratio: 4/3">
${art}
<div class="hov" data-hov="1" style="position: absolute; inset: 0; opacity: 0; background: #0061FF; color: #FFFFFF; display: flex; flex-direction: column; justify-content: flex-end; padding: 26px"><span style="font-weight: 700; font-size: 21px; line-height: 1.3; letter-spacing: -0.015em">${hover}</span><span class="mono" style="color: #BFD2FF; margin-top: 14px">${text(locale).readIt} →</span></div>
${SQUIGGLE}
${chip}
</div>
<div style="margin-top: 16px; font-weight: 800; font-size: 23px; line-height: 1.15; letter-spacing: -0.03em">${esc(p.title)}</div>
<div class="post-meta" style="margin-top: 10px">${meta(p, locale)}</div>
</a>`;
}

function featured(p: BlogPost, cover: string, locale: string) {
  const t = text(locale);
  const age = Date.now() - new Date(p.publishedDate || p.createdAt).getTime();
  const isNew = age < 45 * 24 * 3600 * 1000;
  const art = p.featuredImage ? coverImg(p.featuredImage) : cover;
  const label = blogCategoryLabel(p.category, locale);
  const chip = label ? `<span class="pp-s" style="border: 2px solid #0A0A0A">${esc(label)}</span>` : "";
  return `<a class="feat" data-feat="1" href="${postUrl(p.slug)}"><div style="position: relative; background: #0061FF; min-height: 420px; display: flex; align-items: center; justify-content: center; overflow: hidden">${art}${isNew ? `<span class="stk" style="left: 26px; top: 26px; transform: rotate(-5deg)">${t.isNew}</span>` : ""}</div><div style="padding: clamp(28px, 4vw, 52px); display: flex; flex-direction: column; justify-content: space-between; gap: 30px"><div>${chip}<h2 style="margin: ${chip ? "22px" : "0"} 0 0; font-weight: 800; font-size: clamp(34px, 3.6vw, 56px); line-height: 1.02; letter-spacing: -0.045em">${esc(p.title)}</h2>${p.excerpt ? `<p class="lead" style="margin: 18px 0 0">${esc(p.excerpt)}</p>` : ""}</div><div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap"><div class="post-meta">${meta(p, locale)}</div><span class="pill" style="background: #0061FF; color: #FFFFFF">${t.readIt} <span class="dot" style="background: #FFFFFF; color: #0061FF">${ARROW}</span></span></div></div></a>`;
}

const empty = (locale: string) =>
  `<div style="padding: 60px 0; text-align: center; font-size: 20px; color: #4B5563">${text(locale).empty}</div>`;

/** Filter chips in the prototype's markup; its script handles clicks through the filters.N bindings. */
function filterRow(defs: [string, string, number][], locale: string) {
  const chips = defs
    .map(
      ([id, label, n], i) =>
        `<button aria-pressed="${i === 0}" class="chip" data-dc-attr="data-on=filters.${i}.on;aria-pressed=filters.${i}.on" data-dc-on="click=filters.${i}.pick" data-on="${i === 0}" data-filter="${id}" type="button"><span data-dc-text="filters.${i}.label">${esc(label)}</span> <span style="opacity: .55; margin-left: 6px"><span data-dc-text="filters.${i}.n">${n}</span></span></button>`,
    )
    .join("");
  return `<div aria-label="${text(locale).filterLabel}" data-up="1" role="group" style="display: flex; gap: 8px; flex-wrap: wrap">${chips}</div>`;
}

/** A big heading whose letters animate in (the prototype's "More notes"), rebuilt for other words. */
const splitHeading = (words: string, attr: string) =>
  `<span class="duo"><span aria-hidden="true" class="o">${esc(words)}</span><span style="position: relative">${words
    .split(" ")
    .map((w) => `<span class="wd">${[...w].map((c) => `<span class="cm"><span ${attr}="1">${esc(c)}</span></span>`).join("")}</span>`)
    .join(" ")}</span></span>`;

/** The fixed text in the blog templates, in Indonesian. Each pair is an exact snippet of the template markup. */
const ID_TEMPLATE: [string, string][] = [
  ['<span data-hl="1">Notes</span>', '<span data-hl="1">Catatan</span>'],
  ['<span data-hl="1">from the</span>', '<span data-hl="1">dari</span>'],
  [">Written by the makers<", ">Ditulis oleh pembuatnya<"],
  [">No jargon<", ">Tanpa istilah ribet<"],
  [">Websites · Shops · SEO<", ">Website · Toko · SEO<"],
  [
    ">Guides and stories about building websites, online stores and apps, from the people who build them.<",
    ">Panduan dan cerita seputar membangun website, toko online, dan aplikasi, dari orang-orang yang membuatnya.<",
  ],
  ['margin-bottom: 18px">Latest<', 'margin-bottom: 18px">Terbaru<'],
  ['<div class="lab">Everything else</div>', '<div class="lab">Semua tulisan</div>'],
  ['<div class="lab">Keep reading</div>', '<div class="lab">Baca juga</div>'],
  [">Ask us anything<", ">Tanya apa saja<"],
  [">Got a question<br/>we should answer?<", ">Punya pertanyaan<br/>untuk kami jawab?<"],
  [
    ">Send it over. If it's useful to other people too, it might become the next post.<",
    ">Kirim saja. Kalau jawabannya berguna untuk orang lain juga, bisa jadi tulisan berikutnya.<",
  ],
  [">Ask a question <", ">Kirim pertanyaan <"],
  ['<span data-rise-s="1">Got a question</span>', '<span data-rise-s="1">Ada pertanyaan</span>'],
  ['color: #0061FF">about your project?<', 'color: #0061FF">soal proyek Anda?<'],
  [">Ask us <", ">Tanya kami <"],
  ['<span data-fline="1">Have a project</span>', '<span data-fline="1">Punya proyek</span>'],
  ['<span data-fline="1">in mind?</span>', '<span data-fline="1">yang ingin dibuat?</span>'],
  [
    ">Tell us what you're planning. We'll reply within one business day with questions, ideas and next steps.<",
    ">Ceritakan rencana Anda. Kami balas dalam satu hari kerja dengan pertanyaan, ide, dan langkah berikutnya.<",
  ],
  [">Start a project <", ">Mulai proyek <"],
  [">WhatsApp us<", ">Chat WhatsApp<"],
  [">← All notes<", ">← Semua catatan<"],
  [">In this post<", ">Di tulisan ini<"],
  ['aria-label="In this post"', 'aria-label="Di tulisan ini"'],
  [">Copy link<", ">Salin tautan<"],
];

function translateTemplate(page: RedesignSource, locale: string): RedesignSource {
  if (locale !== "id") return page;
  let html = page.html;
  for (const [from, to] of ID_TEMPLATE) html = html.replaceAll(from, to);
  // the "More notes" heading is split into letters for its animation, so it's rebuilt whole
  html = html.replace(/<span class="duo">[\s\S]*?data-mw="1">s<\/span><\/span><\/span><\/span><\/span>/, splitHeading("Catatan lain", "data-mw"));
  const script = page.script.replace("'Copied'", "'Tersalin'").replace("'Copy link'", "'Salin tautan'");
  return { ...page, html, script };
}

export function blogIndexPage(page: RedesignSource, posts: BlogPost[], locale = "en"): RedesignSource {
  const [first, ...rest] = posts;
  // only offer categories that have posts in the grid
  const defs: [string, string, number][] = [["all", text(locale).all, rest.length]];
  for (const c of BLOG_CATEGORIES) {
    const n = rest.filter((p) => p.category === c.id).length;
    if (n) defs.push([c.id, blogCategoryLabel(c.id, locale)!, n]);
  }
  const t = translateTemplate(page, locale);
  const html = t.html
    .replace("<!--@FEATURED-->", first ? featured(first, page.featuredCover || "", locale) : empty(locale))
    .replace("<!--@FILTERS-->", defs.length > 1 ? filterRow(defs, locale) : "")
    .replace("<!--@CARDS-->", rest.map((p, i) => card(p, i, page.covers, locale)).join("\n"));
  const script = t.script.replace("__BLOG_FILTERS__", JSON.stringify(defs));
  return { ...t, html, script };
}

/** Adds ids to the post's h2 headings and returns the contents list. */
function sections(content: string) {
  const used = new Set<string>();
  const toc: { id: string; text: string }[] = [];
  const body = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    let id = (attrs.match(/\sid="([^"]+)"/) || [])[1] ||
      text.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "section";
    let n = 2;
    while (used.has(id)) id = `${id}-${n++}`;
    used.add(id);
    toc.push({ id, text });
    const rest = attrs.replace(/\sid="[^"]*"/, "");
    return `<h2${rest} id="${id}" data-sec="${id}">${inner}</h2>`;
  });
  return { body, toc };
}

export const letters = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (w) =>
        `<span class="wd">${[...w].map((c) => `<span class="cm"><span data-hch="1">${esc(c)}</span></span>`).join("")}</span>`,
    )
    .join(" ");

export function blogPostPage(
  page: RedesignSource,
  post: BlogPost,
  more: BlogPost[],
  covers: RedesignSource["covers"],
  cover: string,
  locale = "en",
): RedesignSource {
  const { body, toc } = sections(post.content);
  const author = post.author || text(locale).team;
  const label = blogCategoryLabel(post.category, locale);
  const authorBlock = `<div data-hp="1" style="display: flex; align-items: center; gap: 14px; margin-top: 34px"><span style="width: 48px; height: 48px; border-radius: 50%; background: #0A0A0A; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-weight: 800">${esc(author.trim()[0]?.toUpperCase() || "K")}</span><div><div style="font-weight: 800">${esc(author)}</div><div style="font-size: 14px; color: #4B5563">Kreatale</div></div></div>`;
  const coverHtml = post.featuredImage ? coverImg(post.featuredImage) : cover.replace(/width: 30%/, "width: 22%");
  const tocHtml = toc.length
    ? toc.map((t, i) => `<a data-on="${i === 0}" data-toc="${t.id}" href="#${t.id}">${esc(t.text)}</a>`).join("")
    : "";
  const t = translateTemplate(page, locale);
  let html = t.html
    .replace(
      "<!--@META-->",
      `<div class="post-meta" data-hp="1" style="margin-top: 34px">${
        label ? `<span class="pp-s" style="background: #0061FF; color: #FFFFFF">${esc(label)}</span>` : ""
      }${meta(post, locale)}</div>`,
    )
    .replace("<!--@TITLE-->", letters(post.title))
    .replace("<!--@AUTHOR-->", authorBlock)
    .replace("<!--@COVER-->", coverHtml)
    .replace("<!--@TOC-->", tocHtml)
    .replace("<!--@BODY-->", body)
    .replace("<!--@MORE-->", more.map((p, i) => card(p, i, covers, locale)).join("\n"));
  // short posts without sections don't need a contents list
  if (!toc.length) html = html.replace('<aside class="toc-wrap"', '<aside class="toc-wrap" data-empty="1"') + "<style>.toc-wrap[data-empty] > .lab,.toc-wrap[data-empty] > .toc{display:none}</style>";
  return { ...t, html };
}
