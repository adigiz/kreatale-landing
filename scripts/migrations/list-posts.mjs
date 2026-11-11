// Read-only: lists posts (locale, status, slug, title) to plan category assignments.
import fs from 'node:fs';
import postgres from 'postgres';
const url = fs.readFileSync('.env.local', 'utf8').match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m)[1];
const sql = postgres(url, { max: 1 });
const rows = await sql`select locale, status, slug, title from posts order by locale, created_at desc`;
for (const r of rows) console.log([r.locale, r.status, r.slug, r.title].join(' | '));
await sql.end();
