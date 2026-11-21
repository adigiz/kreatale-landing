// Dry run of the website audit engine, no database. Usage: npx tsx scripts/audit-try.ts example.com [--json]
import { runAudit } from "../src/lib/audit/run";

const [url, flag] = process.argv.slice(2);
if (!url) {
  console.error("Usage: npx tsx scripts/audit-try.ts <url> [--json]");
  process.exit(1);
}
const t = Date.now();
runAudit(url)
  .then((r) => {
    if (flag === "--json") return console.log(JSON.stringify(r, null, 2));
    console.log(`${r.finalUrl}  overall ${r.overall}  (${((Date.now() - t) / 1000).toFixed(1)}s)`);
    console.log("mobile ", r.scores.mobile);
    console.log("desktop", r.scores.desktop);
    console.log("lab    ", r.vitals.lab);
    console.log("field  ", r.vitals.field);
    console.log("checks ", r.checks.map((c) => `${c.pass ? "✓" : "✗"} ${c.id}${c.value ? ` (${c.value})` : ""}`).join("\n        "));
    console.log("fixes  ", r.fixes.map((f) => `[${f.impact}] ${f.title}${f.detail ? ` — ${f.detail}` : ""}`).join("\n        "));
    if (r.errors.length) console.log("errors ", r.errors);
  })
  .catch((e) => {
    console.error("FAILED:", e.message);
    process.exit(1);
  });
