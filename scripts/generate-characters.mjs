#!/usr/bin/env node
/**
 * Generate Kreatale hero characters with Alibaba Cloud Model Studio (Qwen-Image).
 *
 * Your API key stays on your machine. Run from the kreatale-landing folder:
 *
 *   export DASHSCOPE_API_KEY="sk-..."        # your Model Studio key
 *   node scripts/generate-characters.mjs
 *
 * Optional:
 *   DASHSCOPE_BASE   API host. Default: https://dashscope-intl.aliyuncs.com (Singapore).
 *                    If your console shows a workspace endpoint, use that instead, e.g.
 *                    https://<WorkspaceId>.ap-southeast-1.maas.aliyuncs.com
 *                    Beijing keys use https://dashscope.aliyuncs.com
 *   QWEN_IMAGE_MODEL Default: qwen-image-2.0-pro (falls back to qwen-image-plus if unavailable)
 *   ONLY             Comma-separated job names to run, e.g. ONLY=lineup,maker
 *
 * Output: public/illustrations/characters/<job>-<n>.png
 * Image URLs from the API expire after 24 hours, so this downloads them immediately.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

// Read the key from the environment, or from .env.local / .env in this folder (never printed).
async function readEnvKey() {
  for (const f of ['.env.local', '.env']) {
    try {
      const txt = await fs.readFile(path.join(process.cwd(), f), 'utf8');
      const m = txt.match(/^\s*DASHSCOPE_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m);
      if (m) return m[1].trim();
    } catch {}
  }
  return '';
}
const KEY = process.env.DASHSCOPE_API_KEY || (await readEnvKey());
if (!KEY) { console.error('No key found. Add DASHSCOPE_API_KEY=... to .env.local in this folder.'); process.exit(1); }
const BASE_FROM_FILE = await (async () => { try { const t = await fs.readFile(path.join(process.cwd(), '.env.local'), 'utf8'); const m = t.match(/^\s*DASHSCOPE_BASE\s*=\s*["']?([^"'\r\n]+)/m); return m ? m[1].trim() : ''; } catch { return ''; } })();
const BASE = (process.env.DASHSCOPE_BASE || BASE_FROM_FILE || 'https://dashscope-intl.aliyuncs.com').replace(/\/$/, '');
let MODEL = process.env.QWEN_IMAGE_MODEL || 'qwen-image-2.0-pro';
const OUT = path.join(process.cwd(), 'public/illustrations/characters');
const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);

// One shared style block keeps every character consistent.
const STYLE = [
  'Flat vector editorial illustration for a creative web studio.',
  'Thick uniform black outlines, hand-drawn feel, slightly wobbly confident lines.',
  'Strictly limited palette: cobalt blue #0061FF, black #0A0A0A, white #FFFFFF, pale blue #BFD2FF. Skin is white with black outline.',
  'Characters are lanky with long legs, small simple heads, minimal faces (dot eyes, small smile), stylish modern clothes, chunky sneakers.',
  'Full body, side or three-quarter view, mid-stride walking pose, playful and warm.',
  'Plain flat solid background color #F3F6FF. No text, no letters, no logos, no shadows, no gradients, no ground line.',
].join(' ');
const NEG = 'text, letters, words, watermark, logo, gradient, 3d render, photo, realistic, shading, drop shadow, extra limbs, deformed hands, busy background, frame, border';

const JOBS = [
  { name: 'lineup', size: '2688*1536', n: 3, prompt: `${STYLE} A lineup of four different young people walking left to right in a row, evenly spaced: (1) a woman holding up a paper napkin with a sketch on it, (2) a man carrying a giant pencil over his shoulder like a plank, (3) a woman swinging a big blue shopping bag, (4) a man holding a phone up high, looking at it. Each in different outfits using only the palette.` },
  { name: 'maker', size: '1728*2368', n: 2, prompt: `${STYLE} A single young man walking, carrying a giant yellow-free blue pencil over his shoulder like a plank, wearing a blue sweater and black trousers.` },
  { name: 'dreamer', size: '1728*2368', n: 2, prompt: `${STYLE} A single young woman walking, proudly holding up a paper napkin with a rough sketch of an idea on it, hair in a bun, striped white and blue t-shirt, blue wide trousers.` },
  { name: 'shopper', size: '1728*2368', n: 2, prompt: `${STYLE} A single young woman walking briskly, swinging a big blue shopping bag, short black hair, white oversized jacket, black trousers.` },
  { name: 'parts', size: '2688*1536', n: 2, prompt: `${STYLE} A rigging parts sheet of one young man in side view, blue sweater, black trousers, white sneakers, drawn as separate disconnected pieces laid out in a row with wide gaps between them, each piece fully drawn with its own outline and overlapping joint ends rounded: (1) head with neck, (2) torso in the blue sweater with no arms, (3) near arm straight down with hand, (4) far arm straight down with hand, (5) near leg straight down in black trouser with sneaker pointing right, (6) far leg straight down in black trouser with sneaker pointing right, (7) a giant blue pencil. Same character, same scale, every piece shown fully, nothing cut off.` },
  { name: 'parts2', size: '2688*1536', n: 3, prompt: `${STYLE} A character rigging parts sheet for one young man, strict side view facing right, laid out as seven separate disconnected pieces in one row with wide empty gaps, all at the same scale, each piece drawn fully with thick black outline and rounded joint ends so they can overlap when assembled: (1) head with short neck and white hair, (2) torso only in a blue sweater, side view, NO arms and NO sleeves hanging, plain waist, (3) upper arm in a blue sleeve, straight, no hand, (4) forearm with sleeve cuff and white hand, straight, (5) thigh in black trousers, straight, no shoe, (6) lower leg in black trouser with rolled cuff, straight, no shoe, (7) one white chunky sneaker pointing right. Flat colors only, no shading, no dots or circles at joints.` },
  { name: 'pet', size: '2048*2048', n: 2, prompt: `${STYLE} Only one single small cheerful scruffy dog in the whole picture, no people at all, no humans, side view trotting to the right with its tail up, white body with black patches and a blue collar, big friendly eyes, tongue out, same thick outline style.` },
];

async function call(job) {
  const body = {
    model: MODEL,
    input: { messages: [{ role: 'user', content: [{ text: job.prompt }] }] },
    parameters: { negative_prompt: NEG, size: job.size, n: job.n, prompt_extend: false, watermark: false },
  };
  const res = await fetch(`${BASE}/api/v1/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code) throw new Error(`${res.status} ${json.code || ''} ${json.message || ''}`.trim());
  const content = json?.output?.choices?.flatMap((c) => c?.message?.content || []) || [];
  return content.map((c) => c.image).filter(Boolean);
}

await fs.mkdir(OUT, { recursive: true });
for (const job of JOBS) {
  if (ONLY.length && !ONLY.includes(job.name)) continue;
  process.stdout.write(`- ${job.name} (${MODEL}) ... `);
  let urls;
  try { urls = await call(job); }
  catch (e) {
    if (MODEL === 'qwen-image-2.0-pro' && /model|not.?found|invalid/i.test(e.message)) {
      MODEL = 'qwen-image-plus'; process.stdout.write(`retrying with ${MODEL} ... `);
      try { urls = await call({ ...job, n: 1, size: '1664*928' }); } catch (e2) { console.log('failed: ' + e2.message); continue; }
    } else { console.log('failed: ' + e.message); continue; }
  }
  let i = 1;
  for (const u of urls) {
    const img = await fetch(u); const buf = Buffer.from(await img.arrayBuffer());
    const file = path.join(OUT, `${job.name}-${i++}.png`);
    await fs.writeFile(file, buf);
  }
  console.log(`saved ${urls.length}`);
}
console.log(`Done. Images are in ${path.relative(process.cwd(), OUT)}/`);
