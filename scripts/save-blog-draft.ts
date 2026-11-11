/**
 * Saves a finished blog post into the CMS as a DRAFT (never published).
 * A person reviews and publishes it from the admin panel.
 *
 * Usage: npm run blog:draft -- docs/marketing/drafts/<slug>.<locale>.html
 *
 * File format: an HTML comment with JSON metadata on the first line, then the post body as HTML
 * (h2, h3, p, ul/ol, blockquote, table, a, strong, em; no <h1>, since the page renders the title):
 *
 *   <!--meta {"title": "...", "slug": "...", "excerpt": "...", "category": "web", "locale": "en"} -->
 *   <p>...</p>
 *
 * The author is the user with BLOG_AUTHOR_EMAIL from .env.local, or the first admin user.
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import { eq, inArray } from "drizzle-orm";
import { db, users } from "../src/lib/cms/db";
import { createPost, getPostBySlug } from "../src/lib/cms/queries/posts";
import { BLOG_CATEGORY_IDS } from "../src/lib/blogCategories";

config({ path: ".env.local" });

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Pass the draft file path, e.g. docs/marketing/drafts/my-post.en.html");
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^\s*<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error("Missing <!--meta {...} --> header on the first line");
  const meta = JSON.parse(m[1]);
  const content = raw.slice(m[0].length).trim();

  for (const k of ["title", "slug", "excerpt", "category", "locale"]) if (!meta[k]) throw new Error(`meta.${k} is required`);
  if (!(BLOG_CATEGORY_IDS as readonly string[]).includes(meta.category)) throw new Error(`category must be one of ${BLOG_CATEGORY_IDS.join(", ")}`);
  if (!["en", "id"].includes(meta.locale)) throw new Error("locale must be en or id");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) throw new Error("slug must be lowercase-with-dashes");
  if (/<h1[\s>]/i.test(content)) throw new Error("Remove <h1>; the page renders the title");
  if (/\[(placeholder|todo|tbd)[^\]]*\]/i.test(content)) console.warn("Note: draft still contains [placeholder] markers. Fill them before publishing.");

  if (await getPostBySlug(meta.slug, meta.locale)) throw new Error(`A post with slug "${meta.slug}" (${meta.locale}) already exists. Not overwriting.`);

  const email = process.env.BLOG_AUTHOR_EMAIL;
  const [author] = email
    ? await db.select().from(users).where(eq(users.email, email)).limit(1)
    : await db.select().from(users).where(inArray(users.role, ["super_admin", "admin"] as any)).limit(1);
  if (!author) throw new Error("No author found. Set BLOG_AUTHOR_EMAIL in .env.local to a CMS user's email.");

  const post = await createPost({
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt,
    category: meta.category,
    locale: meta.locale,
    content,
    featuredImage: meta.featuredImage ?? null,
    authorId: author.id,
    status: "draft",
  } as any);
  console.log(`Saved draft "${meta.title}" (${meta.locale}) (id ${post.id}). Review and publish it in the admin panel.`);
  process.exit(0);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
