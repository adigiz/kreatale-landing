# Kreatale landing (kreatale.com)

## Redesign in progress
Read `docs/redesign/redesign-brief.md` first. It holds the settled direction, the page-by-page spec and the build order.

**The working design is `docs/redesign/prototype/`.** It's plain HTML + CSS + GSAP/Lenis, and each page opens straight in a browser (`npx serve docs/redesign/prototype`). See its README for how the pages are built.
- When the user asks to change the design, edit these prototype files and check them in a browser.
- When building the real site, port from them into the Next.js app (`src/app/[locale]`), keeping the markup, classes, copy and `data-*` animation hooks. Move the GSAP code into `useGSAP` / `gsap.context` effects.

## Image generation (you can run this)
Character and illustration images are generated with Alibaba Model Studio (Qwen-Image) by `scripts/generate-characters.mjs`. You are allowed to run it yourself:

    node scripts/generate-characters.mjs            # all jobs
    node scripts/generate-characters.mjs maker      # one job: lineup, maker, dreamer, shopper, pet

- The API key is `DASHSCOPE_API_KEY` in `.env.local`. The script reads it itself. Never print, log, echo or commit the key, and never read `.env.local` aloud.
- The optional `DASHSCOPE_BASE` in `.env.local` switches region. The default is `https://dashscope-intl.aliyuncs.com`; the China region is `https://dashscope.aliyuncs.com`.
- The model is `qwen-image-2.0-pro`, falling back to `qwen-image-plus`.
- Output goes to `public/illustrations/characters/`.
- To change what gets generated, edit the prompts in the `jobs` list in the script.
- After generating, open the images to check them against the brief: Kreatale Blue `#0061FF`, black, white and greys, flat, bold and friendly, no text, and nothing copied from Two26's illustrations. Regenerate any that miss, then show the user before using them on the site.
- If you get a model-not-supported or permission error, the key is probably a token-plan or text-only key. Tell the user they need a standard pay-as-you-go Model Studio API key, and don't retry in a loop.

## Stack
Next.js (App Router, `src/app/[locale]`), Tailwind, and GSAP in node_modules. Brand tokens are in `src/app/globals.css` (`--primary: #0061FF`). Project data is in `src/lib/projectsData.json`.

## Blog and marketing
- `.claude/agents/seo-marketing.md`: SEO audits, keywords, page copy.
- `.claude/agents/blog-writer.md`: writes a full post and saves it to the CMS as a **draft** via `npm run blog:draft`. It never publishes.
- `.claude/agents/content-reviewer.md`: independent check on every draft before it's saved.
- Real facts about the studio live in `docs/marketing/studio-knowledge.md`, and topic ideas in `docs/marketing/client-questions.md`.
