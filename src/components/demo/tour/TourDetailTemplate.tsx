"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TOUR_DETAIL_DICTIONARY } from "./detailTranslations";
import {
  ItineraryDayDescription,
  ItineraryDayHeading,
} from "./ItineraryDayContent";

export interface TourDetailConfig {
  title?: string;
  subtitle?: string;
  location?: string;
  price?: string;
  currency?: string;
  image?: string;
  images?: string[];
  description?: string;
  itinerary?: {
    day?: number;
    title: string;
    description?: string;
    tags?: string[];
  }[];
  features?: string[];
  language?: "en" | "id";
  primaryColor?: string;
  accentColor?: string;
  accentHoverColor?: string;
  logo?: string;
  backUrl?: string;
}

const DICTIONARY = TOUR_DETAIL_DICTIONARY;

const FEATURE_BADGE_RULES: { needle: string; icon: string }[] = [
  { needle: "high-speed wi-fi", icon: "wifi" },
  { needle: "wifi", icon: "wifi" },
  { needle: "private pool", icon: "pool" },
  { needle: "pool", icon: "pool" },
  { needle: "fine dining", icon: "restaurant" },
  { needle: "dining", icon: "restaurant" },
  { needle: "transfers", icon: "local_taxi" },
  { needle: "transfer", icon: "local_taxi" },
];

function featureBadgeMaterialIcon(feature: string): string {
  const f = feature.toLowerCase();
  for (const { needle, icon } of FEATURE_BADGE_RULES) {
    if (f.includes(needle)) return icon;
  }
  return "star";
}

export default function TourDetailTemplate({
  config,
}: {
  config?: TourDetailConfig;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const startTranslateYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const language = config?.language || "en";
  const t = DICTIONARY[language];
  const currency = config?.currency || (language === "id" ? "Rp" : "$");
  const price = config?.price || (language === "id" ? "70.000.000" : "4,500");
  const title = config?.title || t.header.title;
  const subtitle = config?.subtitle || t.header.subtitle;
  const location = config?.location || t.header.location;
  const description = config?.description || t.overview.description;
  const heroImage = config?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAyU6OxNe7z0NQ7uEX7VvsNZF2iAhNR8klSv7Vct6lzgoErV9IXpp33UQQVtwXMJyp_y2uMOK5fLmiacjxT3k4MSaHd90rg_QMcxnBoOXrnlnSj_3Ughj02WxucNKrhj0xO8etNtBcKs_NoANyJtf9z-nSQw__45j5-iLdZhfx2ZEzb9dFg0XK98xle8U3SHXmWgqTm4wBU9dLjXUm730YIb09gqaQ1dk85n4zis4rQxwm7sz0R3_hWn4lZlLyLulVLkE3kmRoEH4Y";
  const images = config?.images || [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIhnr5zKZciLL26qeAUY7kX2XbNC2aIbceu1LH-aZr0IXLQiOQpnViFB30v6-VrTkWC9jwqt6op1st0DE84u1oBB9_eZDdrg3tR4C_dnZjm4jvr0dDn00rCnZ5mMLl3AuOsbQmSxrEGEKXYvGU19B1_BDOXdTVvkiqCxmN_qMcgH_iGIxQTHrcX3N2Xrx9faeIhSCC8hDgj_E1X1WtgqyEjlaIX-zES871BmYpf2Nb8VcMAHogK2dw8UTp1lDst2KwRgyo1GJKclA",
  ];
  const itinerary = config?.itinerary || [
    { day: 1, title: t.itinerary.day1.title, description: t.itinerary.day1.desc, tags: [t.itinerary.day1.tag1, t.itinerary.day1.tag2] },
    { day: 2, title: t.itinerary.day2.title, description: t.itinerary.day2.desc, tags: [t.itinerary.day2.tag1, t.itinerary.day2.tag2] },
    { day: 3, title: t.itinerary.day3.title, description: t.itinerary.day3.desc, tags: [t.itinerary.day3.tag1, t.itinerary.day3.tag2] },
    { day: 4, title: t.itinerary.day4.title, description: t.itinerary.day4.desc, tags: [t.itinerary.day4.tag1, t.itinerary.day4.tag2] },
    { day: 5, title: t.itinerary.day5.title, description: t.itinerary.day5.desc, tags: [t.itinerary.day5.tag1, t.itinerary.day5.tag2] },
    { day: 6, title: t.itinerary.day6.title, description: t.itinerary.day6.desc, tags: [t.itinerary.day6.tag1, t.itinerary.day6.tag2] },
    { day: 7, title: t.itinerary.day7.title, description: t.itinerary.day7.desc, tags: [t.itinerary.day7.tag1, t.itinerary.day7.tag2] },
  ];
  const features = config?.features || ["High-Speed Wi-Fi", "Private Pool", "Fine Dining", "Transfers"];
  const primaryColor = config?.primaryColor || "#2747A0";
  const accentColor = config?.accentColor ?? "#F47920";
  const accentHoverColor = config?.accentHoverColor ?? "#DC6A18";
  const backUrl = config?.backUrl;

  const style = {
    "--tour-primary": primaryColor,
    "--tour-primary-hover": primaryColor,
    "--tour-accent": accentColor,
    "--tour-accent-hover": accentHoverColor,
  } as React.CSSProperties;

  const mealHints = t.itinerary.meals as Record<string, string>;

  const getPositions = () => {
    if (typeof window === "undefined") {
      return { collapsed: 0, expanded: 0 };
    }
    const viewportHeight = window.innerHeight;
    const navbarHeight = 64;
    const imageHeight = viewportHeight * 0.45;
    const negativeMargin = 24;
    const collapsed = 0;
    const expanded = -(imageHeight - negativeMargin - navbarHeight);
    return { collapsed, expanded };
  };

  useEffect(() => {
    const handle = dragHandleRef.current;
    const sheet = sheetRef.current;
    if (!handle || !sheet) return;

    let hasMoved = false;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (window.innerWidth >= 1024) return;
      hasMoved = false;
      handle.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      setIsDragging(true);
      startYRef.current = e.clientY;
      currentYRef.current = e.clientY;
      const { collapsed, expanded } = getPositions();
      startTranslateYRef.current = isExpanded ? expanded : collapsed;
      sheet.style.transition = "none";
      sheet.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (window.innerWidth >= 1024) return;
      const deltaY = Math.abs(startYRef.current - e.clientY);
      if (deltaY > 5) {
        hasMoved = true;
        e.preventDefault();
        e.stopPropagation();
      }
      currentYRef.current = e.clientY;
      const moveDeltaY = startYRef.current - e.clientY;
      const { collapsed, expanded } = getPositions();
      const newTranslateY = Math.max(expanded, Math.min(collapsed, startTranslateYRef.current - moveDeltaY));
      
      sheet.style.transform = `translateY(${newTranslateY}px)`;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (window.innerWidth >= 1024) {
        isDraggingRef.current = false;
        setIsDragging(false);
        return;
      }
      handle.releasePointerCapture(e.pointerId);
      isDraggingRef.current = false;
      setIsDragging(false);
      
      const sheet = sheetRef.current;
      if (!sheet) return;
      
      sheet.style.cursor = "";
      
      if (!hasMoved) {
        setIsExpanded((prev) => !prev);
        return;
      }
      
      sheet.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      
      const { collapsed, expanded } = getPositions();
      const currentTranslateY = startTranslateYRef.current - (startYRef.current - currentYRef.current);
      const threshold = (collapsed + expanded) / 2;
      
      if (currentTranslateY < threshold) {
        sheet.style.transform = `translateY(${expanded}px)`;
        setIsExpanded(true);
      } else {
        sheet.style.transform = `translateY(${collapsed}px)`;
        setIsExpanded(false);
      }
    };

    handle.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      handle.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isExpanded]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || isDragging || isDraggingRef.current) return;

    if (window.innerWidth >= 1024) {
      sheet.style.transform = "";
      sheet.style.transition = "";
      return;
    }
    
    const { collapsed, expanded } = getPositions();
    const targetY = isExpanded ? expanded : collapsed;
    sheet.style.transform = `translateY(${targetY}px)`;
    sheet.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    sheet.style.position = "relative";
  }, [isExpanded, isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDragging]);

  return (
    <div
      style={style}
      className="bg-tour-background-light dark:bg-tour-background-dark font-tour-sans text-gray-800 dark:text-gray-100 antialiased overflow-hidden h-screen flex flex-col"
    >
      <nav className="w-full z-50 bg-white/95 dark:bg-tour-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex-none sticky top-0">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          {backUrl ? (
            <Link href={backUrl} className="p-2 -ml-2 text-gray-500 hover:text-tour-accent transition-colors">
              <span className="material-icons">arrow_back</span>
            </Link>
          ) : (
            <button className="p-2 -ml-2 text-gray-500 hover:text-tour-accent transition-colors">
              <span className="material-icons">arrow_back</span>
            </button>
          )}
          <div className="flex items-center gap-1 cursor-pointer">
            {config?.logo ? (
              <img src={config.logo} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-lg font-bold tracking-tight text-tour-navy-dark dark:text-white">
                {t.nav.voyage}
                <span className="text-tour-accent">.</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-tour-accent transition-colors">
              <span className="material-icons">favorite_border</span>
            </button>
            <button className="p-2 -mr-2 text-gray-500 hover:text-tour-accent transition-colors">
              <span className="material-icons">share</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden w-full max-w-[1920px] mx-auto">
        <section className="w-full lg:w-1/2 lg:h-full h-[45vh] flex-none relative bg-gray-900 lg:overflow-y-auto no-scrollbar group">
          <img
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 lg:hidden"></div>
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 dark:bg-tour-surface-dark/90 text-tour-navy-dark dark:text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-sm">
              {t.nav.featured}
            </span>
          </div>
          {images.length > 0 && (
            <div className="absolute bottom-4 right-4 flex gap-1 lg:hidden">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-white" : "bg-white/50"}`}
                ></div>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="hidden lg:block">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="h-[60vh] w-full relative mt-1">
                  <img alt={`${title} - Image ${idx + 2}`} className="w-full h-full object-cover" src={img} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          ref={sheetRef}
          className="w-full lg:w-1/2 lg:h-full bg-tour-background-light dark:bg-tour-background-dark flex flex-col relative z-40 lg:z-10 lg:border-l border-gray-200 dark:border-gray-800 -mt-6 lg:mt-0 rounded-t-3xl lg:rounded-none shadow-xl lg:shadow-none overflow-hidden lg:overflow-y-auto lg:transform-none"
          style={{
            willChange: isDragging ? "transform" : "auto",
            minHeight: "calc(100vh - 45vh)",
          }}
        >
          <div
            className="flex flex-col flex-1 lg:h-full lg:overflow-y-auto"
            style={{
              maxHeight: isExpanded ? "calc(100vh - 64px - 80px)" : undefined,
              minHeight: 0,
              height: isExpanded ? "calc(100vh - 64px - 80px)" : undefined,
            }}
          >
            <div
              ref={dragHandleRef}
              className="w-full flex justify-center pt-3 pb-1 lg:hidden bg-tour-background-light dark:bg-tour-background-dark cursor-grab select-none z-10 flex-shrink-0"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full pointer-events-none"></div>
            </div>
            <div
              className="flex-1 overflow-y-auto px-6 pb-32 pt-2 lg:p-12 lg:pb-4"
              id="content-scroll"
              style={{
                touchAction: isDragging ? "none" : "pan-y",
                WebkitOverflowScrolling: "touch",
                maxHeight: isExpanded ? "calc(100vh - 64px - 80px)" : undefined,
              }}
            >
            <header className="mb-6 lg:mb-10">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-tour-accent uppercase tracking-wider mb-1">
                  <span className="material-icons text-sm">location_on</span>
                  {location}
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold font-serif text-tour-navy-dark dark:text-white leading-tight">
                  {title}
                  <br />{" "}
                  <span className="text-tour-accent font-light">
                    {subtitle}
                  </span>
                </h1>
              </div>
              <div className="flex items-center justify-between mt-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t.footer.totalPrice}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currency}
                      {price}
                    </span>
                    <span className="text-sm text-gray-500">/ {t.header.perPerson}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-tour-surface-dark px-3 py-2 rounded-lg">
                  <span className="material-icons text-yellow-500 text-sm">
                    star
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    4.96
                  </span>
                  <span className="text-xs text-gray-500">(128 {t.header.reviews})</span>
                </div>
              </div>
            </header>

            {features.length > 0 && (
              <div className="mb-8 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                <div className="flex gap-3 min-w-max">
                  {features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2.5 bg-blue-50 dark:bg-tour-surface-dark border border-blue-100 dark:border-gray-700 rounded-full text-xs font-semibold text-tour-navy-dark dark:text-blue-200 flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="material-icons text-tour-accent text-sm">
                        {featureBadgeMaterialIcon(feature)}
                      </span>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {description && (
              <div className="mb-10">
                <h3 className="text-lg font-bold font-serif text-tour-navy-dark dark:text-white mb-3">
                  {t.overview.experience}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
                  {description}
                </p>
              </div>
            )}

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-serif text-tour-navy-dark dark:text-white">
                  {t.itinerary.title}
                </h3>
                <span className="text-xs font-medium text-tour-accent uppercase tracking-wider">
                  {itinerary.length} Days
                </span>
              </div>
              <div className="relative pl-2">
                <div className="absolute top-2 bottom-0 left-[7px] w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                {(showFullItinerary ? itinerary : itinerary.slice(0, 3)).map((day, idx) => (
                  <div key={idx} className="relative pl-8 pb-8 group">
                    <div
                      className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-tour-background-dark shadow-sm z-10 ${
                        idx === 0
                          ? "bg-tour-accent"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{ marginLeft: "-8px" }}
                    ></div>
                    <div
                      className={`bg-white dark:bg-tour-surface-darker p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm ${
                        !showFullItinerary && idx === 2 ? "opacity-75" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div className="min-w-0 flex-1">
                          <ItineraryDayHeading
                            title={day.title}
                            dayNumber={day.day}
                            dayLabel={t.itinerary.dayLabel}
                            mealHints={mealHints}
                          />
                        </div>
                        <span className="material-icons text-gray-400 text-sm shrink-0 transform transition-transform group-hover:rotate-180">
                          expand_more
                        </span>
                      </div>
                      {day.description && (
                        <div
                          className={`relative mb-3 ${
                            !showFullItinerary && idx === 2
                              ? "max-h-[5.5rem] overflow-hidden"
                              : ""
                          }`}
                        >
                          <ItineraryDayDescription
                            text={day.description}
                            noteSectionLabel={t.itinerary.noteSection}
                          />
                          {!showFullItinerary && idx === 2 ? (
                            <div
                              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-tour-surface-darker dark:via-tour-surface-darker/95"
                              aria-hidden
                            />
                          ) : null}
                        </div>
                      )}
                      {day.tags && day.tags.length > 0 && (
                        <div className="flex gap-2">
                          {day.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-[10px] px-2 py-1 bg-gray-50 dark:bg-tour-surface-dark rounded text-gray-500 uppercase font-bold tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {itinerary.length > 3 && (
                  <div className="relative pl-8">
                    <button
                      onClick={() => setShowFullItinerary(!showFullItinerary)}
                      className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-tour-navy-dark dark:text-white hover:bg-gray-50 dark:hover:bg-tour-surface-dark transition-colors flex items-center justify-center gap-2"
                    >
                      {showFullItinerary ? (
                        <>
                          <span className="material-icons text-sm">expand_less</span>
                          {t.itinerary.showLess}
                        </>
                      ) : (
                        <>
                          {t.itinerary.viewFull} ({itinerary.length} {t.itinerary.days})
                          <span className="material-icons text-sm">expand_more</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-24 lg:hidden"></div>
            </div>
          </div>

          <div className="hidden lg:block sticky bottom-0 bg-white dark:bg-tour-surface-dark border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-4">
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                  {t.footer.totalForGuest}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {currency}
                    {price}
                  </span>
                </div>
              </div>
              <button className="bg-tour-accent hover:bg-tour-accent-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-tour-accent/25 active:scale-95 transition-all flex items-center gap-2">
                <span>{t.footer.bookNow}</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <div className="fixed lg:hidden bottom-0 left-0 right-0 bg-white dark:bg-tour-surface-dark border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                {t.footer.totalForGuest}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {currency}
                  {price}
                </span>
              </div>
            </div>
            <button className="bg-tour-accent hover:bg-tour-accent-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-tour-accent/25 active:scale-95 transition-all flex items-center gap-2">
              <span>{t.footer.bookNow}</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
