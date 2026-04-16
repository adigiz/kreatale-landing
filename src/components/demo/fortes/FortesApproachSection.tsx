"use client";

import { useCallback, useId, useState } from "react";

import { FORTES_MEDIA } from "./fortes-constants";
import { SEO_SECTION } from "./fortes-data";

import "./fortes-approach-parity.css";

export function FortesApproachSection() {
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const readMoreTextId = useId();
  const readMoreBtnId = useId();

  const toggleReadMore = useCallback(() => {
    setReadMoreOpen((o) => !o);
  }, []);

  return (
    <div id="approach" className="fortes-approach-stack">
      <section className="our-approach-3d" aria-label="Our approach to 3D rendering services">
        <div className="our-approach-3d__container">
          <div className="our-approach-3d__custom-heading">
            <div className="our-approach-3d__heading-top our-approach-3d--heading-title">
              <span className="our-approach-3d--word-1" data-aos="seo-overflow">
                {SEO_SECTION.approachHeadingTop[0]}
              </span>{" "}
              <span className="our-approach-3d--word-2" data-aos="seo-overflow">
                {SEO_SECTION.approachHeadingTop[1]}
              </span>
            </div>

            <div className="our-approach-3d__heading-middle-image">
              <span
                className="our-approach-3d__heading-middle our-approach-3d--heading-title"
                data-aos="seo-overflow"
              >
                {SEO_SECTION.approachMiddle}
              </span>
              <div className="our-approach-3d__image-wrap">
                <img
                  className="our-approach-3d__image-heading desctope"
                  src={FORTES_MEDIA.approachHeadingImage}
                  alt={SEO_SECTION.approachImageAlt}
                  width={689}
                  height={164}
                  data-aos="image-width"
                />
              </div>
            </div>

            <div className="our-approach-3d__heading-bottom our-approach-3d--heading-title">
              <span className="our-approach-3d--word-1" data-aos="seo-overflow">
                {SEO_SECTION.approachHeadingBottom[0]}
              </span>{" "}
              <span className="our-approach-3d--word-2" data-aos="seo-overflow">
                {SEO_SECTION.approachHeadingBottom[1]}
              </span>
            </div>

            <img
              className="our-approach-3d__image-heading mob"
              src={FORTES_MEDIA.approachHeadingImage}
              alt={SEO_SECTION.approachImageAlt}
              width={800}
              height={164}
              data-aos="image-width"
            />
          </div>

          <div className="our-approach-3d__text-columns">
            <div className="our-approach-3d__colimn-left" data-aos="show-up-seo">
              {SEO_SECTION.introColumns[0]}
            </div>
            <div className="our-approach-3d__column-right" data-aos="show-up-seo">
              {SEO_SECTION.introColumns[1]}
            </div>
          </div>
        </div>
      </section>

      <section className="read-more" aria-labelledby="fortes-read-more-title">
        <div className="read-more__container">
          <div className="read-more__wrapper">
            <h2 className="read-more__title" id="fortes-read-more-title">
              <p>{SEO_SECTION.readMoreTitle[0]}</p>
              <p>{SEO_SECTION.readMoreTitle[1]}</p>
            </h2>
            <div className="read-more__text-wrapper">
              <div
                id={readMoreTextId}
                className={`read-more__text${readMoreOpen ? " open" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: SEO_SECTION.readMoreParagraphInnerHtml.map((h) => `<p>${h}</p>`).join(""),
                }}
              />
              <button
                id={readMoreBtnId}
                type="button"
                className="read-more__button"
                aria-expanded={readMoreOpen}
                aria-controls={readMoreTextId}
                onClick={toggleReadMore}
              >
                Read more
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
