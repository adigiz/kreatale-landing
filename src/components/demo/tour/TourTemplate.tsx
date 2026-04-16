"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { tourDemoPaths } from "@/lib/tour-demo-paths";
import TourDemoShell from "./TourDemoShell";
import type { TourConfig } from "./tour-config";
import {
  TourCtaSection,
  TourDestinationsSection,
  TourExperienceSection,
  TourPackagesSection,
} from "./tour-sections";
import { cmsField, PACKAGE_IMG_FALLBACK } from "./tour-utils";
import { TOUR_DICTIONARY } from "./translations";

export type { TourConfig } from "./tour-config";

const DICTIONARY = TOUR_DICTIONARY;

interface TourTemplateProps {
  config?: TourConfig;
}

export default function TourTemplate({ config }: TourTemplateProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;

  const language = config?.language || "en";
  const t = DICTIONARY[language];

  const brandName = config?.websiteName?.trim() ?? "";
  const displayBrand = brandName || "Dwidayatour";

  const heroTitle =
    config?.heroTitle?.trim() || "The Art of Verified Travel.";
  const heroSubtitle =
    config?.heroSubtitle?.trim() ||
    "We don't just plan trips; we craft narratives tailored to your unique travel style.";
  const heroImage = cmsField(config?.heroImage, PACKAGE_IMG_FALLBACK);

  const mainHeadline = config?.heroHeadline?.trim() || t.hero.title;
  const mainHeadlineItalic =
    config?.heroHeadlineItalic?.trim() || t.hero.titleItalic;

  const price = cmsField(config?.price, "4,500");
  const days = cmsField(config?.days, "7 Days");
  const location = cmsField(config?.location, "Oia, Greece");

  const currency =
    config?.currency?.trim() || (language === "id" ? "Rp" : "$");

  const paths = tourDemoPaths(locale, slug);
  const consultWhatsAppUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    "",
  )}?text=${encodeURIComponent(
    "Hi! I'd like to speak with a travel consultant.",
  )}`;

  const heroDescription = t.hero.description.replace(/Voyage/g, displayBrand);
  const heroDescriptionExtended = t.hero.descriptionExtended.replace(
    /Voyage/g,
    displayBrand,
  );

  const formatPrice = (p: string) => {
    if (!p) return "";
    if (p.startsWith(currency)) return p;
    const separator = currency.length > 1 ? " " : "";
    return `${currency}${separator}${p}`;
  };

  return (
    <TourDemoShell config={config}>
      <header className="relative w-full min-w-0 flex flex-col lg:flex-row lg:items-stretch pt-16 lg:pt-20 lg:min-h-[min(100dvh,100vh)]">
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-auto lg:min-h-[min(100dvh,100vh)] relative bg-gray-900 group overflow-hidden shrink-0">
          <img
            alt="Luxury private yacht sailing in turquoise waters"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tour-navy-dark/40 via-transparent to-transparent lg:from-tour-navy-dark/80 lg:via-tour-navy-dark/20"></div>
          <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] lg:text-xs font-bold uppercase tracking-widest rounded-full">
              {t.hero.featured}
            </span>
          </div>
          <div className="absolute bottom-8 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 text-white max-w-xl">
            {heroTitle ? (
              <h2 className="text-3xl md:text-5xl font-tour-serif italic mb-2 lg:mb-4 leading-tight shadow-black/20 drop-shadow-lg">
                {heroTitle}
              </h2>
            ) : null}
            {heroSubtitle ? (
              <p className="hidden lg:block text-gray-200 text-sm md:text-base font-light tracking-wide border-l-2 border-tour-accent pl-4">
                {heroSubtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4 lg:gap-8 mt-6 lg:mt-8 text-xs lg:text-sm font-bold tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-accent">
                  calendar_month
                </span>
                <span>{days}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-accent">
                  location_on
                </span>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-accent">
                  payments
                </span>
                <span>From {formatPrice(price)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 lg:w-1/2 bg-white dark:bg-tour-background-dark flex items-center justify-center px-6 py-10 lg:px-8 xl:px-10 lg:py-10 lg:items-center lg:justify-center overflow-x-hidden">
          <div className="max-w-xl w-full min-w-0">
            <span className="text-tour-accent font-bold uppercase tracking-widest text-xs mb-3 lg:mb-4 block">
              {t.hero.curatedLuxury}
            </span>
            <h1 className="text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-4 lg:mb-5 leading-[1.15] lg:leading-[1.1] break-words hyphens-auto">
              {mainHeadline} <br />
              <span className="italic text-tour-accent">{mainHeadlineItalic}</span>
            </h1>
            <p className="text-base lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-6 lg:mb-6 break-words">
              {heroDescription}
              <span className="hidden lg:inline">
                {" "}
                {heroDescriptionExtended}
              </span>
            </p>

            <div className="mb-8 lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-tour-navy-dark dark:text-white border-b-2 border-tour-accent/20 pb-1">
                  {t.signature.title}
                </h3>
                <div className="text-xs text-gray-400">{t.signature.swipe}</div>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
                <div className="min-w-[140px] w-[140px] snap-start group cursor-pointer flex-shrink-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm">
                    <img
                      alt="Private Jet Expeditions"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuxgniqTw76Q3UpeX1kbMvjvazOnuhMrqEzAxVdWsBnoQhuhFDhaWMCDIGPlIVMBJu8SGW3CqsiXSzt4KzYSdgiCgyL_-Vu5uTjYKFE89PAijVY4jDLQt-Wjwtc2OBK-vYh6fabQH7b4Exd-bcYu4vbaEfT98G4AbysWUKVIX6M6HhJeb9VNgfh_xmiWTG_hAp0k2ymUSDXU9ByS53Fu_SCKgDe3KPSH1liQu4ixirCbcDRWSDES79i_D8ZH8LWTb4tPLH3uJ2Q3Q"
                    />
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white">
                    {t.collections.privateJet}
                  </h4>
                </div>
                <div className="min-w-[140px] w-[140px] snap-start group cursor-pointer flex-shrink-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm">
                    <img
                      alt="Safari Reserves"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBedXaQtpBd_YDmUr6ORZNgm_XuI2y4VGnx7xSx3wi84u8KnwMN2cFQLGwPPZ_6472Fbo6PwyBECByD2xmE9jjgwOc68izSIAezvOjwTsa4x_0ozR5zc7-LQsxfV7rSRLkpTU_Gmx3_b-R0kmO1dZVaXj8eaKOoToYfmzoHIx4U4LOY3xUaBYcc-jB1Dn_qRRmTglkz_jomdbkj0OombmnuNheEacAZmvxEXERvg0kkXrzkWa56tsQBQiyRFIaAJb87mYu6aWWCLI"
                    />
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white">
                    {t.collections.safari}
                  </h4>
                </div>
                <div className="min-w-[140px] w-[140px] snap-start group cursor-pointer flex-shrink-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm">
                    <img
                      alt="Alpine Retreats"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk-0y9mh6tzY042cqehTqMCqcWcmFeUhj8POg7jnq6Jp_WfsdCOiuwfit9GNcok8J5jaEn6dQX5L3fGq1X5ov6CaNKbceKBCBRrlIXNz5YXbXql4vu0U13d_SK-E8OJWewsMF7f_xOB7t8-CIprhk_2n8ITABSwbrogtpKKY_as6hvg-QjouEmheDz0xTr41T8gSqsTE4FkJtqXI7zJjqjUq3P9_PtuiaNelb0a2f_cgXcOVX-6TqYDgPxv45yljPn36VeMsuGMFQ"
                    />
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white">
                    {t.collections.alpine}
                  </h4>
                </div>
              </div>
            </div>

            <div className="mb-8 hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-tour-navy-dark dark:text-white border-b-2 border-tour-accent/20 pb-1">
                  {t.signature.title}
                </h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-tour-accent hover:border-tour-accent transition-all">
                    <span className="material-symbols-outlined text-sm">
                      arrow_back
                    </span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-tour-accent hover:border-tour-accent transition-all">
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 min-w-0">
                <div className="group cursor-pointer min-w-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Private Jet Expeditions"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuxgniqTw76Q3UpeX1kbMvjvazOnuhMrqEzAxVdWsBnoQhuhFDhaWMCDIGPlIVMBJu8SGW3CqsiXSzt4KzYSdgiCgyL_-Vu5uTjYKFE89PAijVY4jDLQt-Wjwtc2OBK-vYh6fabQH7b4Exd-bcYu4vbaEfT98G4AbysWUKVIX6M6HhJeb9VNgfh_xmiWTG_hAp0k2ymUSDXU9ByS53Fu_SCKgDe3KPSH1liQu4ixirCbcDRWSDES79i_D8ZH8LWTb4tPLH3uJ2Q3Q"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-xs sm:text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-accent transition-colors break-words">
                    {t.collections.privateJet}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 break-words">
                    {t.collections.expeditions}
                  </p>
                </div>
                <div className="group cursor-pointer min-w-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Safari Reserves"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBedXaQtpBd_YDmUr6ORZNgm_XuI2y4VGnx7xSx3wi84u8KnwMN2cFQLGwPPZ_6472Fbo6PwyBECByD2xmE9jjgwOc68izSIAezvOjwTsa4x_0ozR5zc7-LQsxfV7rSRLkpTU_Gmx3_b-R0kmO1dZVaXj8eaKOoToYfmzoHIx4U4LOY3xUaBYcc-jB1Dn_qRRmTglkz_jomdbkj0OombmnuNheEacAZmvxEXERvg0kkXrzkWa56tsQBQiyRFIaAJb87mYu6aWWCLI"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-xs sm:text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-accent transition-colors break-words">
                    {t.collections.safari}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 break-words">
                    {t.collections.reserves}
                  </p>
                </div>
                <div className="group cursor-pointer min-w-0">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Alpine Retreats"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk-0y9mh6tzY042cqehTqMCqcWcmFeUhj8POg7jnq6Jp_WfsdCOiuwfit9GNcok8J5jaEn6dQX5L3fGq1X5ov6CaNKbceKBCBRrlIXNz5YXbXql4vu0U13d_SK-E8OJWewsMF7f_xOB7t8-CIprhk_2n8ITABSwbrogtpKKY_as6hvg-QjouEmheDz0xTr41T8gSqsTE4FkJtqXI7zJjqjUq3P9_PtuiaNelb0a2f_cgXcOVX-6TqYDgPxv45yljPn36VeMsuGMFQ"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-xs sm:text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-accent transition-colors break-words">
                    {t.collections.alpine}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 break-words">
                    {t.collections.retreats}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-0 w-full sm:flex-row sm:flex-wrap sm:items-stretch">
              <a
                href={consultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-tour-accent hover:bg-tour-accent-hover text-white py-4 px-4 sm:px-6 lg:px-8 rounded-sm font-medium transition-all shadow-lg shadow-tour-accent/20 hover:shadow-tour-accent/30 flex items-center justify-center gap-2 group w-full min-w-0 sm:flex-1 sm:basis-[min(100%,280px)] text-center whitespace-normal"
              >
                <span className="leading-snug">{t.hero.startJourney}</span>
                <span className="material-symbols-outlined text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
              <Link
                href={paths.travelTips}
                className="py-4 px-4 sm:px-6 lg:px-8 border border-gray-200 dark:border-gray-700 hover:border-tour-navy-dark dark:hover:border-white rounded-sm font-medium text-tour-navy-dark dark:text-white transition-all w-full min-w-0 sm:flex-1 sm:basis-[min(100%,280px)] bg-white dark:bg-transparent flex items-center justify-center text-center whitespace-normal leading-snug"
              >
                {t.hero.viewTravelTips}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <TourPackagesSection config={config} locale={locale} slug={slug} />
      <TourDestinationsSection config={config} locale={locale} slug={slug} />
      <TourExperienceSection config={config} locale={locale} slug={slug} />
      <TourCtaSection config={config} />
    </TourDemoShell>
  );
}
