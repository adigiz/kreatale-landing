#!/usr/bin/env node
/**
 * Adds posts.category and gives the existing posts a category.
 *
 *   node scripts/migrations/2026-11-11-post-category.mjs          # dry run: shows what would change
 *   node scripts/migrations/2026-11-11-post-category.mjs --apply  # makes the change
 *
 * Safe to re-run: the column is added only if missing, and only posts without a
 * category are filled in. Category ids must match src/lib/blogCategories.ts.
 */
import fs from 'node:fs';
import postgres from 'postgres';

const APPLY = process.argv.includes('--apply');
const url = fs.readFileSync('.env.local', 'utf8').match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m)[1];
const sql = postgres(url, { max: 1 });

const BY_SLUG = {
  // Websites
  'a-good-company-website-starts-with-these-5-essentials': 'web',
  'website-company-yang-baik-dimulai-dari-5-hal-ini': 'web',
  'website-web-app-and-mobile-app-development-digital-solutions-by-kreatale': 'web',
  'jasa-website-web-app-dan-mobile-app-development-layanan-digital-dari-kreatale': 'web',
  'why-government-websites-feel-different-from-private-company-websites-in-terms-of-ui-ux': 'web',
  'mengapa-ui-ux-situs-pemerintah-terasa-berbeda-dengan-situs-swasta': 'web',
  // Apps
  '5-family-apps-that-help-preserve-connection-memories-and-legacy': 'apps',
  '5-aplikasi-keluarga-yang-membantu-menjaga-hubungan-kenangan-dan-warisan': 'apps',
  'what-are-the-most-important-elements-when-building-a-hospital-information-system': 'apps',
  'apa-saja-yang-paling-penting-saat-membangun-sistem-informasi-manajemen-rumah-sakit': 'apps',
  '4-essential-platforms-to-level-up-your-ui-ux-design-in-software-development': 'apps',
  '4-platform-yang-wajib-dicoba-untuk-membantu-desain-ui-ux-saat-membangun-software': 'apps',
  // Marketing & SEO
  'the-most-popular-social-media-platforms-and-smart-ways-to-use-them': 'seo',
  '5-media-sosial-terbesar-dan-cara-menggunakannya-dengan-bijak': 'seo',
  'the-role-of-ai-in-digital-marketing': 'seo',
  'mengubah-data-menjadi-strategi-ini-peran-ai-dalam-pemasaran-digital': 'seo',
  'penerapan-seo-untuk-meningkatkan-penjualan-dan-brand-awareness': 'seo',
  // Business & tech
  'early-2026-is-the-right-time-to-improve-your-business-digital-systems': 'business',
  'awal-tahun-2026-adalah-waktu-yang-tepat-untuk-benahi-sistem-digital-bisnis': 'business',
  'how-it-consultants-help-businesses-grow-more-efficiently': 'business',
  'bagaimana-it-consultant-membantu-bisnis-tumbuh-lebih-efisien': 'business',
  'does-working-in-the-tech-industry-really-make-money-here-s-the-reality': 'business',
  'apakah-kerja-di-bidang-it-benar-benar-menghasilkan-uang-ini-realitanya': 'business',
  'what-you-must-focus-on-when-building-a-software-startup': 'business',
  'hal-yang-harus-diperhatikan-saat-membangun-startup-software': 'business',
  'cloud-computing-can-boost-business-performance-here-s-a-simple-explanation': 'business',
  'cloud-computing-bisa-naikkan-performa-bisnis-simak-penjelasan-simpelnya': 'business',
  'why-your-business-could-fall-behind-tomorrow-if-you-don-t-go-digital-today': 'business',
  'mengapa-bisnismu-bisa-tertinggal-besok-jika-tidak-digital-hari-ini': 'business',
  // Behind the scenes
  'how-kreatale-works-when-clients-come-with-many-questions': 'studio',
  'bagaimana-kreatale-bekerja-saat-klien-datang-dengan-banyak-pertanyaan': 'studio',
};

const [{ exists }] = await sql`
  select exists (select 1 from information_schema.columns where table_name = 'posts' and column_name = 'category') as exists`;
console.log(`posts.category column: ${exists ? 'already there' : 'missing'}`);

if (!APPLY) {
  console.log(`Dry run. Would ${exists ? 'keep the column and ' : 'add the column, then '}set categories on up to ${Object.keys(BY_SLUG).length} posts that have none.`);
  console.log('Run again with --apply to make the change.');
  await sql.end();
  process.exit(0);
}

await sql.begin(async (tx) => {
  await tx`alter table posts add column if not exists category varchar(50)`;
  let n = 0;
  for (const [slug, category] of Object.entries(BY_SLUG)) {
    const r = await tx`update posts set category = ${category} where slug = ${slug} and category is null`;
    n += r.count;
  }
  console.log(`Column ready. Categories set on ${n} posts.`);
});
const counts = await sql`select coalesce(category, '(none)') as category, count(*)::int as n from posts group by 1 order by 2 desc`;
for (const c of counts) console.log(`  ${c.category}: ${c.n}`);
await sql.end();
