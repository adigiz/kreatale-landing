"use client";

import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FORTES_MEDIA } from "./fortes-constants";
import { TESTIMONIALS } from "./fortes-data";
import { FortesSplitText } from "./FortesSplitText";

import "./fortes-what-people-think-parity.css";

const SHOW_REVIEW_DELAY_MS: readonly number[] = [100, 100, 300, 300, 200, 200, 300];
const TESTIMONIALS_TITLE_SPLIT = "what people | think about us";
const REVIEWS_LERP = 0.04;
const REVIEWS_TRACK_MIN_PX = 1024;

export function FortesTestimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reviewsDeskRef = useRef<HTMLImageElement | null>(null);

  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const isHoveringRef = useRef(false);
  const animatingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const rafRef = useRef(0);

  const tooltipOpen = useCallback(
    (i: number) => lockedIndex === i || (lockedIndex === null && hoverIndex === i),
    [lockedIndex, hoverIndex],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const reviews = reviewsDeskRef.current;
    if (!section || !reviews) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = () => window.innerWidth >= REVIEWS_TRACK_MIN_PX;

    const animate = () => {
      if (reducedMotion || !wideEnough() || !isVisibleRef.current) {
        animatingRef.current = false;
        return;
      }

      const currentX = currentXRef.current;
      const currentY = currentYRef.current;
      const mouseX = mouseXRef.current;
      const mouseY = mouseYRef.current;
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const needsUpdate = Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25;
      const isHovering = isHoveringRef.current;

      if (isHovering || needsUpdate) {
        currentXRef.current += dx * REVIEWS_LERP;
        currentYRef.current += dy * REVIEWS_LERP;
        reviews.style.transform = `translate3d(${currentXRef.current}px, ${currentYRef.current}px, 0)`;
        rafRef.current = requestAnimationFrame(animate);
      } else {
        animatingRef.current = false;
      }
    };

    const kick = () => {
      if (reducedMotion || !isVisibleRef.current || !wideEnough()) return;
      if (animatingRef.current) return;
      animatingRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    };

    const pointerInsideSection = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!wideEnough() || reducedMotion) return;
      if (!pointerInsideSection(e)) return;
      isHoveringRef.current = true;
      const sr = section.getBoundingClientRect();
      const px = e.clientX - sr.left;
      const py = e.clientY - sr.top;
      const ir = reviews.getBoundingClientRect();
      if (ir.width < 2 || ir.height < 2) return;
      const centerX = ir.left - sr.left + ir.width / 2;
      const centerY = ir.top - sr.top + ir.height / 2;
      mouseXRef.current = px - centerX + currentXRef.current;
      mouseYRef.current = py - centerY + currentYRef.current;
      kick();
    };

    const onLeave = () => {
      isHoveringRef.current = false;
    };

    const onResize = () => {
      if (!wideEnough()) {
        reviews.style.transform = "";
        currentXRef.current = 0;
        currentYRef.current = 0;
      }
    };

    const onImgLoad = () => {
      kick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = Boolean(entry?.isIntersecting);
        if (isVisibleRef.current && isHoveringRef.current) {
          kick();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    reviews.addEventListener("load", onImgLoad, { passive: true });
    if (reviews.complete) onImgLoad();

    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointermove", onPointerMove, { passive: true, capture: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      io.disconnect();
      reviews.removeEventListener("load", onImgLoad);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      reviews.style.transform = "";
    };
  }, []);

  useEffect(() => {
    const onDocClick = () => {
      if (lockedIndex === null) return;
      setLockedIndex(null);
    };
    const onKey = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === "Escape") setLockedIndex(null);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [lockedIndex]);

  const closeAllTooltips = useCallback(() => {
    setHoverIndex(null);
    setLockedIndex(null);
  }, []);

  const onHeadingClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>, i: number) => {
      e.stopPropagation();
      if (lockedIndex === i) {
        closeAllTooltips();
        return;
      }
      setHoverIndex(null);
      setLockedIndex(i);
    },
    [lockedIndex, closeAllTooltips],
  );

  return (
    <section ref={sectionRef} className="what-think-people-about-us" aria-label="Testimonials">
      <div className="what-think-people-about-us__blur-wrapper">
        <img
          ref={reviewsDeskRef}
          src={FORTES_MEDIA.testimonialsBgDesk}
          className="desk"
          alt=""
          width={1600}
          height={900}
          decoding="async"
        />
        <img
          src={FORTES_MEDIA.testimonialsBgMob}
          className="mob"
          alt=""
          width={800}
          height={600}
          decoding="async"
        />
      </div>
      <div className="what-think-people-about-us__container">
        <h2 className="what-think-people-about-us__title split-anim-title" data-aos="text-anim">
          <FortesSplitText text={TESTIMONIALS_TITLE_SPLIT} />
        </h2>
        <div className="what-think-people-about-us__wrapper">
          {TESTIMONIALS.map((t, i) => {
            const delay = SHOW_REVIEW_DELAY_MS[i] ?? 100;
            const open = tooltipOpen(i);
            const tooltipBody = `${t.text}\n\n${t.date}`;
            const onHeadingKey = (e: KeyboardEvent<HTMLButtonElement>) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              if (lockedIndex === i) closeAllTooltips();
              else {
                setHoverIndex(null);
                setLockedIndex(i);
              }
            };
            return (
              <div
                key={`${t.name}-${i}`}
                className={`what-think-people-about-us__item item-${i}${open ? " active" : ""}`}
              >
                <button
                  type="button"
                  className="what-think-people-about-us__heading"
                  aria-expanded={open}
                  onClick={(e) => onHeadingClick(e, i)}
                  onKeyDown={onHeadingKey}
                  onMouseEnter={() => {
                    if (lockedIndex !== null) return;
                    setHoverIndex(i);
                  }}
                  onMouseLeave={() => {
                    if (lockedIndex !== null) return;
                    setHoverIndex((h) => (h === i ? null : h));
                  }}
                >
                  <div className="what-think-people-about-us__name" data-aos="show-review" data-aos-delay={delay}>
                    {t.name}
                  </div>
                  <div className="what-think-people-about-us__company" data-aos="show-review" data-aos-delay={delay}>
                    {t.company}
                  </div>
                </button>
                <div className={`what-think-people-about-us__tooltip${open ? " active" : ""}`}>{tooltipBody}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
