"use client";

import { Fragment, useLayoutEffect, useMemo, useRef } from "react";

type Token = { type: "word"; value: string } | { type: "br" };

function tokenizeForSplit(text: string): Token[] {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const out: Token[] = [];
  for (const p of parts) {
    if (p === "|") out.push({ type: "br" });
    else out.push({ type: "word", value: p });
  }
  return out;
}

/**
 * Splits on whitespace; the literal token `|` becomes a line break (`.brl`).
 * After layout, words get `count-{n}` on `.split-anim__inner` for staggered CSS.
 */
export function FortesSplitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const tokens = useMemo(() => tokenizeForSplit(text), [text]);
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const inners = root.querySelectorAll<HTMLElement>(".split-anim__inner");
    if (inners.length === 0) return;

    const assignLines = () => {
      let line = 1;
      let lastTop = Number.NEGATIVE_INFINITY;
      inners.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (lastTop === Number.NEGATIVE_INFINITY) {
          lastTop = top;
        } else if (Math.abs(top - lastTop) > 3) {
          line += 1;
          lastTop = top;
        }
        el.className = `split-anim__inner count-${line}`;
      });
    };

    assignLines();
    const ro = new ResizeObserver(() => assignLines());
    ro.observe(root);
    return () => ro.disconnect();
  }, [tokens]);

  return (
    <span ref={rootRef} className={className}>
      {tokens.map((tok, i) => {
        if (tok.type === "br") {
          return <span key={`br-${i}`} className="brl" />;
        }
        return (
          <Fragment key={`w-${i}-${tok.value}`}>
            <span className="split-anim">
              <span className="split-anim__inner count-1">{tok.value}</span>
            </span>
            {i < tokens.length - 1 ? <span> </span> : null}
          </Fragment>
        );
      })}
    </span>
  );
}
