"use client";

import AOS from "aos";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FORTES_MEDIA, FORTES_ORIGIN } from "./fortes-constants";
import { FAQ_ITEMS } from "./fortes-data";

import "./fortes-faq-parity.css";

const FAQ_INITIAL_VISIBLE = 4;
const FAQ_BLUR_PARALLAX_RANGE = 72;
const FAQ_BLUR_LERP = 0.08;

function FaqItem({
  question,
  answer,
  globalIndex,
  openIndex,
  onToggle,
}: {
  question: string;
  answer: string;
  globalIndex: number;
  openIndex: number | null;
  onToggle: (index: number) => void;
}) {
  const isOpen = openIndex === globalIndex;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onToggle(globalIndex);
    },
    [globalIndex, onToggle],
  );

  return (
    <div className="faq-home__item">
      <button
        type="button"
        className={`faq-home__heading${isOpen ? " active" : ""}`}
        aria-expanded={isOpen}
        onClick={() => onToggle(globalIndex)}
        onKeyDown={onKeyDown}
      >
        {question}
        <span className="faq-home__icon" aria-hidden />
      </button>
      <div className={`faq-home__text${isOpen ? " active" : ""}`}>{answer}</div>
    </div>
  );
}

export function FortesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [extraExpanded, setExtraExpanded] = useState(false);

  const blurPanRef = useRef<HTMLDivElement | null>(null);
  const blurTargetRef = useRef({ x: 0, y: 0 });
  const blurPosRef = useRef({ x: 0, y: 0 });
  const blurRafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mq = window.matchMedia("(min-width: 993px)");
    const pan = blurPanRef.current;
    if (!pan) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!mq.matches) return;
      const nx = e.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const ny = e.clientY / Math.max(window.innerHeight, 1) - 0.5;
      blurTargetRef.current = {
        x: nx * 2 * FAQ_BLUR_PARALLAX_RANGE,
        y: ny * 2 * FAQ_BLUR_PARALLAX_RANGE,
      };
    };

    const tick = () => {
      if (mq.matches) {
        const t = blurTargetRef.current;
        const p = blurPosRef.current;
        p.x += (t.x - p.x) * FAQ_BLUR_LERP;
        p.y += (t.y - p.y) * FAQ_BLUR_LERP;
        pan.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`;
      }
      blurRafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    blurRafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(blurRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!extraExpanded) return;
    requestAnimationFrame(() => {
      AOS.refresh();
    });
  }, [extraExpanded]);

  const initial = FAQ_ITEMS.slice(0, FAQ_INITIAL_VISIBLE);
  const extra = FAQ_ITEMS.slice(FAQ_INITIAL_VISIBLE);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const toggleExtra = useCallback(() => {
    setExtraExpanded((prev) => {
      const next = !prev;
      if (!next) {
        setOpenIndex((i) => (i !== null && i >= FAQ_INITIAL_VISIBLE ? null : i));
      }
      return next;
    });
  }, []);

  return (
    <section id="faq" className="faq-home">
      <div className="faq-home__blur-wrapper">
        <div ref={blurPanRef} className="faq-home__blur-pan">
          <img src={FORTES_MEDIA.faqBg} alt="" width={1600} height={900} decoding="async" />
        </div>
      </div>
      <div className="faq-home__container container-1320">
        <h2 className="faq-home__title" data-aos="faq-overflow">
          FAQ
        </h2>
        <div className="faq-home__wrapper">
          {initial.map((item, i) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              globalIndex={i}
              openIndex={openIndex}
              onToggle={toggle}
            />
          ))}
          {extra.length > 0 ? (
            <div className={`faq-home__inner${extraExpanded ? " active" : ""}`}>
              {extra.map((item, i) => {
                const globalIndex = FAQ_INITIAL_VISIBLE + i;
                return (
                  <FaqItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    globalIndex={globalIndex}
                    openIndex={openIndex}
                    onToggle={toggle}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
        {extra.length > 0 ? (
          <div className="faq-home__btn">
            <button
              type="button"
              className="faq-home__btn-link"
              data-aos="faq-overflow"
              onClick={toggleExtra}
            >
              {extraExpanded ? "Show less" : "View all"}
            </button>
          </div>
        ) : (
          <div className="faq-home__btn">
            <a
              className="faq-home__btn-link"
              data-aos="faq-overflow"
              href={`${FORTES_ORIGIN}/contacts/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
