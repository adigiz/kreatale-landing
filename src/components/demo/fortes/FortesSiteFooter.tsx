"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FORTES_DEMO_KREATALE_LOGO_SVG, FORTES_MEDIA } from "./fortes-constants";
import { FORTES_FOOTER } from "./fortes-data";

export function FortesSiteFooter() {
  const [logoVisible, setLogoVisible] = useState(false);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = logoWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setLogoVisible(true);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="footer__image-wrap">
        <div className="footer__image">
          <Image
            src={FORTES_MEDIA.footerHouseImage}
            alt=""
            width={1920}
            height={468}
            className="footer__image-img"
            data-aos="footer-img"
            data-aos-delay="200"
            unoptimized
          />
        </div>
      </div>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__content">
            <div className="footer__columns-wrapper">
              <div className="footer__column-menu">
                <h3 className="footer__column-menu-title" data-aos="footer-overflow">
                  Menu
                </h3>
                <ul className="footer__column-menu-list">
                  {FORTES_FOOTER.menu.map((item, i) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="footer__link"
                        data-aos="footer-overflow"
                        data-aos-delay={String(i * 50)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer__column-services">
                <h3 className="footer__column-services-title" data-aos="footer-overflow" data-aos-delay="300">
                  Services
                </h3>
                <ul className="footer__column-services-list">
                  {FORTES_FOOTER.services.map((item, i) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="footer__link"
                        data-aos-delay={String(150 + i * 50)}
                        data-aos="footer-overflow"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer__info">
              <div className="footer__contact-us">
                <div className="footer__contact-us-title" data-aos="footer-overflow" data-aos-delay="500">
                  Contact us
                </div>
                <div className="footer__contact-us-email-phone">
                  <div className="footer__contact-us-email" data-aos="footer-overflow" data-aos-delay="500">
                    <a href={`mailto:${FORTES_FOOTER.email}`} data-aos-delay="400">
                      {FORTES_FOOTER.email}
                    </a>
                  </div>
                  <div className="footer__contact-us-phone" data-aos="footer-overflow" data-aos-delay="500">
                    <a href={`tel:${FORTES_FOOTER.phoneTel}`}>{FORTES_FOOTER.phoneDisplay}</a>
                  </div>
                </div>
              </div>

              <div className="footer__location">
                <div className="footer__location-title" data-aos="footer-overflow" data-aos-delay="600">
                  Location
                </div>
                <div className="footer__location-address">
                  <p className="footer__address" data-aos="text-anim">
                    {FORTES_FOOTER.address}
                  </p>
                </div>
              </div>

              <div className="footer__socials-wrapper">
                <div className="footer__location-title" data-aos="footer-overflow" data-aos-delay="600">
                  Social
                </div>
                <div className="footer__socials">
                  <a
                    className="footer__socials-link"
                    href={FORTES_FOOTER.social[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={FORTES_FOOTER.social[0].label}
                  >
                    <Image
                      src={FORTES_MEDIA.footerSocialLinkedIn}
                      className="icon"
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                    />
                  </a>
                  <a
                    className="footer__socials-link"
                    href={FORTES_FOOTER.social[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={FORTES_FOOTER.social[1].label}
                  >
                    <Image
                      src={FORTES_MEDIA.footerSocialInstagram}
                      className="icon"
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__logo" ref={logoWrapRef}>
            <Image
              src={FORTES_DEMO_KREATALE_LOGO_SVG}
              alt="Kreatale"
              width={173}
              height={24}
              className={`footer__logo-img${logoVisible ? " footer__logo-img--visible" : ""}`}
              unoptimized
            />
          </div>
        </div>
      </footer>
    </>
  );
}
