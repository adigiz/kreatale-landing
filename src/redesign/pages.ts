import type { RedesignSource } from "./RedesignPage";
import { esc, letters } from "./blog";

/** Fills the slots of the legal template (docs/redesign/prototype/legal.html). */
export type LegalSection = { title: string; content: string; items?: Record<string, string> };

export function legalPage(
  page: RedesignSource,
  doc: { title: string; lastUpdated: string; sections: Record<string, LegalSection> },
): RedesignSource {
  const entries = Object.entries(doc.sections);
  const toc = entries
    .map(([id, s], i) => `<a data-on="${i === 0}" data-toc="${id}" href="#${id}">${esc(s.title)}</a>`)
    .join("");
  const body = entries
    .map(
      ([id, s]) =>
        `<h2 data-sec="${id}" id="${id}">${esc(s.title)}</h2><p>${esc(s.content)}</p>` +
        (s.items ? `<ul>${Object.values(s.items).map((v) => `<li>${esc(v)}</li>`).join("")}</ul>` : ""),
    )
    .join("\n");
  const html = page.html
    .replace("<!--@META-->", `<div class="post-meta" data-hp="1" style="margin-top: 34px">${esc(doc.lastUpdated)}</div>`)
    .replace("<!--@TITLE-->", letters(doc.title))
    .replace("<!--@TOC-->", toc)
    .replace("<!--@BODY-->", body);
  return { ...page, html };
}
