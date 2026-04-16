"use client";

import { useCallback, useRef, useState } from "react";
import { EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css/effect-fade";

import { EXPERTISE_SLIDES } from "./fortes-data";
import "./fortes-expertise-parity.css";

export function FortesExpertise() {
  const [mobileIdx, setMobileIdx] = useState(0);
  const prevMobileIdx = useRef(0);

  const [hoverDesktopIdx, setHoverDesktopIdx] = useState<number | null>(null);

  const onMobileSlideChange = useCallback((s: SwiperType) => {
    const cur = s.realIndex;
    const prev = prevMobileIdx.current;
    if (cur === prev) return;
    prevMobileIdx.current = cur;
    setMobileIdx(cur);
  }, []);

  const onDesktopBlockEnter = useCallback((i: number) => {
    setHoverDesktopIdx(i);
  }, []);

  const onDesktopBlocksLeave = useCallback(() => {
    setHoverDesktopIdx(null);
  }, []);

  return (
    <div id="expertise">
      <section className="our-expertise-new" aria-label="Our expertise">
        <div className="our-expertise-new__container">
          <div className="our-expertise-new__wrapper">
            <h2 className="our-expertise-new__heading">Our Expertise</h2>
            <div
              className="our-expertise-new__blocks"
              onMouseLeave={onDesktopBlocksLeave}
              role="list"
            >
              {EXPERTISE_SLIDES.map((slide, i) => {
                const active = hoverDesktopIdx === i;
                const notActive = hoverDesktopIdx !== null && hoverDesktopIdx !== i;
                const cls = `our-expertise-new__block${active ? " active" : ""}${
                  notActive ? " not-active" : ""
                }`;
                return (
                  <a
                    key={slide.letter}
                    href={slide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                    onMouseEnter={() => onDesktopBlockEnter(i)}
                    role="listitem"
                  >
                    {slide.video ? (
                      <video
                        className="our-expertise-new__block-video"
                        preload="auto"
                        src={slide.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        className="our-expertise-new__block-image"
                        src={slide.image!}
                        alt={slide.alt}
                      />
                    )}
                    <div className="our-expertise-new__block-bottom">
                      <h3 className="our-expertise-new__block-title">
                        {slide.titleLines[0]}
                        <br />
                        {slide.titleLines[1]}
                      </h3>
                      <div className="our-expertise-new__block-text">{slide.description}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="our-expertise" aria-label="Our expertise">
        <div className="our-expertise__container">
          <div className="our-expertise__wrapper">
            <h2 className="our-expertise__heading">Our Expertise</h2>
            <div className="our-expertise__scroll-slider">
              <div className="our-expertise__text-block-left">
                {EXPERTISE_SLIDES.map((slide, i) => (
                  <a
                    key={slide.letter}
                    href={slide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`our-expertise__title${i === mobileIdx ? " active" : ""}`}
                  >
                    <div className="our-expertise__title-letter split-anim-title">{slide.letter}</div>
                    <h3 className="our-expertise__title-word split-anim-title">
                      {slide.titleLines[0]}
                      <br />
                      {slide.titleLines[1]}
                    </h3>
                  </a>
                ))}
              </div>

              <Swiper
                className="our-expertise__swiper swiper"
                modules={[EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={400}
                loop
                slidesPerView={1}
                centeredSlides
                grabCursor
                onSwiper={(s) => {
                  prevMobileIdx.current = s.realIndex;
                  setMobileIdx(s.realIndex);
                }}
                onSlideChange={onMobileSlideChange}
              >
                {EXPERTISE_SLIDES.map((slide, i) => (
                  <SwiperSlide key={slide.letter} data-index={i}>
                    {slide.video ? (
                      <video
                        preload="auto"
                        src={slide.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img src={slide.image!} alt={slide.alt} />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="our-expertise__text-block-right">
                {EXPERTISE_SLIDES.map((slide, i) => (
                  <div
                    key={slide.letter}
                    className={`our-expertise__description${i === mobileIdx ? " active" : ""}`}
                  >
                    {slide.description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
