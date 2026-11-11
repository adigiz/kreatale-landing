#!/usr/bin/env node
/**
 * Removes the demo sites data after the feature was taken out of the code.
 * Drops the demo_sites table and deletes preview tokens for demo sites.
 *
 *   node scripts/migrations/2026-11-11-drop-demo-sites.mjs          # dry run
 *   node scripts/migrations/2026-11-11-drop-demo-sites.mjs --apply  # make the change
 */
import fs from 'node:fs';
import postgres from 'postgres';

const APPLY = process.argv.includes('--apply');
const url = fs.readFileSync('.env.local', 'utf8').match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m)[1];
const sql = postgres(url, { max: 1 });

const refs = await sql`
  select tc.table_name, tc.constraint_name from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu on ccu.constraint_name = tc.constraint_name
  where tc.constraint_type = 'FOREIGN KEY' and ccu.table_name = 'demo_sites' and tc.table_name <> 'demo_sites'`;
const [{ exists }] = await sql`select to_regclass('public.demo_sites') is not null as exists`;
const [{ n: rows }] = exists ? await sql`select count(*)::int as n from demo_sites` : [{ n: 0 }];
const [{ n: tokens }] = await sql`select count(*)::int as n from preview_tokens where content_type = 'demo-site'`;
console.log(`demo_sites table: ${exists ? `${rows} rows` : 'already gone'} | demo preview tokens: ${tokens} | other tables referencing it: ${refs.length ? refs.map((r) => r.table_name).join(', ') : 'none'}`);

if (refs.length) { console.log('Stopping: other tables reference demo_sites.'); await sql.end(); process.exit(1); }
if (!APPLY) { console.log('Dry run. Run again with --apply to delete.'); await sql.end(); process.exit(0); }

await sql.begin(async (tx) => {
  const del = await tx`delete from preview_tokens where content_type = 'demo-site'`;
  await tx`drop table if exists demo_sites`;
  console.log(`Deleted ${del.count} preview tokens and dropped demo_sites.`);
});
await sql.end();
