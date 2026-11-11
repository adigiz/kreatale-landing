#!/usr/bin/env node
/**
 * Port the redesign prototype (docs/redesign/prototype) into the Next.js app.
 *
 *   node scripts/sync-redesign.mjs
 *
 * The prototype stays the source of truth. For every page this script:
 *   - copies assets/img and assets/js to public/redesign/
 *   - extracts the page <style>, the <body> markup and the final inline <script>
 *   - rewrites asset paths (assets/... -> /redesign/...) and page links
 *     (work.html -> /__L__/work, where __L__ is replaced with the locale at render time)
 *   - writes src/redesign/generated/<page>.ts
 * Re-run it after editing the prototype.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'docs/redesign/prototype');
const OUT = path.join(ROOT, 'src/redesign/generated');
const PUB = path.join(ROOT, 'public/redesign');

const PAGES = {
  index: '',
  work: '/work',
  'case-gala-esports': '/work/gala-esports',
  services: '/services',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
  'blog-post': '/blog', // sample article; real articles live at /blog/[slug]
  faq: '/faq',
  legal: '/privacy', // template for /privacy and /terms
  404: '',
};

/**
 * Blog pages hold sample posts. Swap those regions for <!--@NAME--> slots that
 * src/redesign/blog.ts fills from the CMS, and keep the sample covers as fallback art.
 */
function templateBlog(name, html, script) {
  const slots = [];
  const extra = {};
  const swap = (re, to, label) => {
    if (!re.test(html)) throw new Error(`${name}: could not find the ${label} region`);
    html = html.replace(re, to);
    slots.push(label);
  };
  if (name === 'blog') {
    extra.featuredCover = (html.match(/<a class="feat"[\s\S]*?(<div class="logo"[\s\S]*?<\/svg><\/div>)/) || [])[1] || '';
    extra.covers = [...html.matchAll(/<div class="clip" data-clip="1" style="position: relative; background: (#[0-9A-Fa-f]{6}); aspect-ratio: 4\/3">\n<div class="cover"[^>]*>(<div class="logo"[\s\S]*?<\/svg><\/div>)<\/div>/g)].map((m) => ({ bg: m[1], html: m[2] }));
    swap(/<a class="feat"[\s\S]*?<\/a>\n<\/section>/, '<!--@FEATURED-->\n</section>', 'FEATURED');
    swap(/<div aria-label="Filter posts"[^\n]*?<\/button><\/div>/, '<!--@FILTERS-->', 'FILTERS');
    swap(/(<div class="grid3" style="margin-top: 50px">)[\s\S]*?<\/a>\n<\/div>/, '$1<!--@CARDS-->\n</div>', 'CARDS');
    swap(/<div data-up="1" style="text-align: center; margin-top: 56px"><button class="pill"[^\n]*\n/, '', 'LOADMORE');
    if (!/const defs = \[\[.*?\]\];/.test(script)) throw new Error('blog: filter defs not found');
    script = script.replace(/const defs = \[\[.*?\]\];/, 'const defs = __BLOG_FILTERS__;');
  }
  if (name === 'legal') {
    swap(/<div class="post-meta" data-hp="1" style="margin-top: 34px">[^\n]*?<\/div>/, '<!--@META-->', 'META');
    swap(/(<h1 style="margin: 22px 0 0; max-width: 1150px;[^>]*>)[\s\S]*?(<\/h1>)/, '$1<!--@TITLE-->$2', 'TITLE');
    swap(/(<nav aria-label="On this page" class="toc">)[\s\S]*?(<\/nav>)/, '$1<!--@TOC-->$2', 'TOC');
    swap(/(<article class="prose">)[\s\S]*?(<\/article>)/, '$1<!--@BODY-->$2', 'BODY');
  }
  if (name === 'blog-post') {
    swap(/<div class="post-meta" data-hp="1" style="margin-top: 34px">[^\n]*?<\/div>/, '<!--@META-->', 'META');
    swap(/(<h1 style="margin: 22px 0 0; max-width: 1150px;[^>]*>)[\s\S]*?(<\/h1>)/, '$1<!--@TITLE-->$2', 'TITLE');
    swap(/<div data-hp="1" style="display: flex; align-items: center; gap: 14px; margin-top: 34px">[\s\S]*?<\/div><\/div><\/div>/, '<!--@AUTHOR-->', 'AUTHOR');
    swap(/(<div data-acover="1" style="[^"]*">)[\s\S]*?(<\/div>\n<\/section>)/, '$1<!--@COVER-->$2', 'COVER');
    swap(/(<nav aria-label="In this post" class="toc">)[\s\S]*?(<\/nav>)/, '$1<!--@TOC-->$2', 'TOC');
    swap(/(<article class="prose">)[\s\S]*?(<\/article>)/, '$1<!--@BODY-->$2', 'BODY');
    swap(/(<div class="grid3">)[\s\S]*?<\/a>\n<\/div>/, '$1<!--@MORE-->\n</div>', 'MORE');
    // the sample's closing line was specific to its topic
    html = html.replace('Still not sure', 'Got a question').replace('which one fits?', 'about your project?');
  }
  return { html, script, extra, slots };
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(a, b);
    else await fs.copyFile(a, b);
  }
}

const pageRe = new RegExp(`\\b(${Object.keys(PAGES).map((k) => k.replace(/-/g, '\\-')).join('|')})\\.html`, 'g');
function rewrite(text) {
  return text
    .replace(/(["'(])assets\/(img|js)\//g, '$1/redesign/$2/')
    .replace(pageRe, (_, name) => `/__L__${PAGES[name]}`)
    .replace(/\/__L__#/g, '/__L__/#');
}

await fs.rm(PUB, { recursive: true, force: true });
await copyDir(path.join(SRC, 'assets/img'), path.join(PUB, 'img'));
await copyDir(path.join(SRC, 'assets/js'), path.join(PUB, 'js'));
await fs.mkdir(OUT, { recursive: true });

for (const name of Object.keys(PAGES)) {
  const file = await fs.readFile(path.join(SRC, `${name}.html`), 'utf8');
  const title = (file.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || 'Kreatale';
  const css = (file.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  const body = (file.match(/<body[^>]*>([\s\S]*)<\/body>/) || [])[1] || '';
  const lastScript = body.lastIndexOf('<script>');
  let html = body.slice(0, lastScript).trim();
  let script = body.slice(lastScript + '<script>'.length, body.lastIndexOf('</script>')).trim();
  let extra = {};
  if (['blog', 'blog-post', 'legal'].includes(name)) {
    const t = templateBlog(name, html, script);
    ({ html, script, extra } = t);
    console.log(`${name}: slots ${t.slots.join(', ')}`);
  }
  const libs = [...file.matchAll(/<script src="assets\/js\/([^"]+)"><\/script>/g)].map((m) => m[1]);
  const covers = (extra.covers || []).map((c) => ({ bg: c.bg, html: rewrite(c.html) }));
  const out = `// Generated by scripts/sync-redesign.mjs from docs/redesign/prototype/${name}.html. Do not edit by hand.
const page = ${JSON.stringify({ title, css: rewrite(css), html: rewrite(html), script: rewrite(script), libs, covers, featuredCover: rewrite(extra.featuredCover || '') })};
export default page;
`;
  await fs.writeFile(path.join(OUT, `${name}.ts`), out);
  console.log(`${name}: ${(html.length / 1024).toFixed(0)} KB markup, libs ${libs.join(', ')}`);
}
