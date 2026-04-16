"use client";

import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { useLayoutEffect, useMemo, useRef } from "react";

import { CASE_STUDIES } from "./fortes-data";
import { FortesSplitText } from "./FortesSplitText";

import "./fortes-case-studies-parity.css";

gsap.registerPlugin(Draggable);

const STRIP_REPEAT = 5;
const CASE_STRIP_SCROLL_DURATION = 165;

export function FortesCaseStudies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const flatSlides = useMemo(
    () =>
      Array.from({ length: STRIP_REPEAT }, (_, rep) =>
        CASE_STUDIES.map((study) => ({ study, rep, key: `${rep}-${study.n}` })),
      ).flat(),
    [],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrapper = stripRef.current;
    if (!section || !wrapper || typeof window === "undefined") return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    if (gsap.utils.toArray<HTMLElement>(".our-case-studies__item", wrapper).length === 0) return;

    const computeBounds = () => {
      const full = wrapper.scrollWidth;
      return { minX: window.innerWidth - full, maxX: 0 };
    };

    let { minX, maxX } = computeBounds();
    let scrollTween: gsap.core.Tween | null = null;
    let dragInst: ReturnType<typeof Draggable.create>[number] | null = null;

    const refreshBounds = () => {
      ({ minX, maxX } = computeBounds());
      dragInst?.applyBounds({ minX, maxX });
    };

    const createScrollTween = (startX?: number) => {
      const sx = startX ?? Number(gsap.getProperty(wrapper, "x"));
      gsap.set(wrapper, { x: sx });
      refreshBounds();
      scrollTween?.kill();
      scrollTween = gsap.to(wrapper, {
        x: minX,
        duration: CASE_STRIP_SCROLL_DURATION,
        ease: "none",
        onComplete: () => {
          gsap.set(wrapper, { x: maxX });
          scrollTween = createScrollTween(maxX);
        },
        overwrite: true,
      });
      return scrollTween;
    };

    dragInst = Draggable.create(wrapper, {
      type: "x",
      inertia: false,
      edgeResistance: 0.95,
      bounds: { minX, maxX },
      onDrag: () => {
        scrollTween?.pause();
      },
      onDragEnd: () => {
        scrollTween?.kill();
        scrollTween = createScrollTween(Number(gsap.getProperty(wrapper, "x")));
      },
    })[0];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!scrollTween) scrollTween = createScrollTween();
            else scrollTween.play();
          } else {
            scrollTween?.pause();
          }
        });
      },
      { rootMargin: "200px 0px -200px 0px" },
    );
    observer.observe(wrapper);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        scrollTween?.kill();
        gsap.set(wrapper, { x: 0 });
        refreshBounds();
        scrollTween = createScrollTween(0);
      }, 120);
    };
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        refreshBounds();
        scrollTween = createScrollTween();
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      observer.disconnect();
      dragInst?.kill();
      scrollTween?.kill();
      gsap.set(wrapper, { clearProps: "x" });
    };
  }, []);

  return (
    <section ref={sectionRef} className="our-case-studies" id="cases" aria-labelledby="fortes-case-studies-heading">
      <div className="container">
        <div className="our-case-studies__title-wrap">
          <h2
            id="fortes-case-studies-heading"
            className="our-case-studies__title split-anim-title"
            data-aos="text-anim"
          >
            <FortesSplitText text="Our Case Studies" />
          </h2>
          <div className="our-case-studies__descr split-anim-title" data-aos="text-anim" />
        </div>
      </div>
      <div className="our-case-studies__container">
        <div className="our-case-studies__slider">
          <div className="our-case-studies__wrapper">
            <div ref={stripRef} className="swiper-wrapper-case">
              {flatSlides.map(({ study, rep, key }) => {
                const idx = CASE_STUDIES.findIndex((s) => s.n === study.n);
                const itemClass = `item-${idx + 1}`;
                const aos = rep === 0;
                return (
                  <a key={key} href={study.href} className="our-case-studies__item">
                    <div className="our-case-studies__slide-content">
                      <div className="our-case-studies__subtitle">{study.n}</div>
                      <h3
                        className={`our-case-studies__title-item split-anim-title ${itemClass}`}
                        data-aos={aos ? "text-anim" : undefined}
                      >
                        <FortesSplitText text={study.title} />
                      </h3>
                      <div
                        className={`our-case-studies__text split-anim-title ${itemClass}`}
                        data-aos={aos ? "text-anim" : undefined}
                      >
                        <FortesSplitText text={study.tags} />
                      </div>
                    </div>
                    <div className="our-case-studies__parent">
                      <div
                        data-aos={aos ? "case-scale" : undefined}
                        data-aos-delay={aos ? String((idx + 1) * 100) : undefined}
                      >
                        <div className="our-case-studies__image">
                          {study.award ? (
                            <img
                              src={study.award.src}
                              className="our-case-studies__avard"
                              alt={study.award.alt}
                              loading="lazy"
                            />
                          ) : null}
                          <img
                            className="our-case-studies__slide-image"
                            src={study.img}
                            alt={`Case Study: ${study.title}`}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
