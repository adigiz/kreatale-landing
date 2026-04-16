import React from "react";

const MEAL_SUFFIX_RE = /\s*\(([A-Z]{2}(?:\/[A-Z]{2})*)\)\s*$/;

export function parseMealsFromTitle(title: string): {
  routeTitle: string;
  mealCodes: string[];
} {
  const m = title.match(MEAL_SUFFIX_RE);
  if (!m) return { routeTitle: title.trim(), mealCodes: [] };
  const codes = m[1].split("/").filter(Boolean);
  const routeTitle = title.slice(0, m.index).trim();
  return { routeTitle, mealCodes: codes };
}

function renderBoldSegments(text: string): React.ReactNode {
  const re = /\*\*([\s\S]*?)\*\*/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<React.Fragment key={k++}>{text.slice(last, m.index)}</React.Fragment>);
    }
    out.push(
      <strong
        key={k++}
        className="font-semibold text-gray-800 dark:text-gray-100"
      >
        {m[1].trim()}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push(<React.Fragment key={k++}>{text.slice(last)}</React.Fragment>);
  }
  return out.length > 0 ? out : text;
}

function splitMainAndNotes(raw: string): { main: string; notes: string[] } {
  const parts = raw.trim().split(/\s*\/\s*NOTE\s*:\s*/i);
  const main = (parts[0] ?? "").trim();
  const notes = parts.slice(1).map((p) => p.trim()).filter(Boolean);
  return { main, notes };
}

function mainParagraphs(main: string): string[] {
  const lines = main.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) return lines;
  return main ? [main] : [];
}

export function ItineraryDayDescription({
  text,
  noteSectionLabel,
  className = "",
}: {
  text: string;
  noteSectionLabel: string;
  className?: string;
}) {
  const { main, notes } = splitMainAndNotes(text);
  const paras = mainParagraphs(main);

  return (
    <div
      className={`space-y-2.5 text-gray-500 dark:text-gray-400 text-xs leading-relaxed ${className}`}
    >
      {paras.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderBoldSegments(p)}
        </p>
      ))}
      {notes.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {noteSectionLabel}
          </p>
          {notes.map((n, i) => (
            <p
              key={`note-${i}`}
              className="text-[11px] leading-snug text-gray-400 dark:text-gray-500 border-l-2 border-tour-accent/35 pl-3 py-0.5"
            >
              {renderBoldSegments(n)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function ItineraryDayHeading({
  title,
  dayNumber,
  dayLabel,
  mealHints,
}: {
  title: string;
  dayNumber?: number;
  dayLabel: string;
  mealHints: Record<string, string>;
}) {
  const { routeTitle, mealCodes } = parseMealsFromTitle(title);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3 mb-2">
      <div className="min-w-0 flex-1">
        {dayNumber != null && (
          <span className="text-[10px] font-bold text-tour-accent uppercase tracking-widest block mb-1">
            {dayLabel} {dayNumber}
          </span>
        )}
        <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug uppercase tracking-tight">
          {routeTitle}
        </h4>
      </div>
      {mealCodes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 shrink-0 sm:justify-end sm:max-w-[48%]">
          {mealCodes.map((code) => (
            <span
              key={code}
              title={mealHints[code] ?? code}
              className="text-[10px] px-2 py-0.5 rounded-md bg-tour-accent/12 text-tour-accent font-bold tracking-wide border border-tour-accent/15 cursor-default"
            >
              {code}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
