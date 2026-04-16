"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { CAR_DETAIL_DICTIONARY } from "./detailTranslations";
import { CAR_DICTIONARY } from "./translations";
import { CarDemoBreadcrumbs } from "./CarDemoBreadcrumbs";
import { CarDemoNavbar } from "./CarDemoNavbar";
import { parseMoneyAmount, rentalDayCount } from "./car-utils";

export interface CarDetailConfig {
  // Car details
  name: string;
  category?: string;
  description?: string;
  price: string;
  currency?: string;
  heroImage?: string;

  // Specifications
  specs?: {
    acceleration?: string;
    topSpeed?: string;
    power?: string;
    transmission?: string;
  };

  // Features
  features?: string[];
  inclusions?: string[];

  // Gallery
  gallery?: string[];

  // Branding
  logo?: string;
  primaryColor?: string;

  websiteName?: string;
  language?: "en" | "id";
  /** e.g. `/en/demos/my-slug` — enables real nav links inside the demo */
  demoBasePath?: string;
  /** When set, breadcrumb shows Home → Fleet → Brand → Vehicle */
  breadcrumbBrand?: { title: string; path: string };
}

const DICTIONARY = CAR_DETAIL_DICTIONARY;

export function CarDetailPage({ config }: { config: CarDetailConfig }) {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const primaryColor = config.primaryColor || "#256af4";
  const language = config.language || "en";
  const t = DICTIONARY[language];
  const tSite = CAR_DICTIONARY[language];
  const base = config.demoBasePath || "";
  const numberLocale = language === "id" ? "id-ID" : "en-US";
  const dailyAmount = parseMoneyAmount(config.price);
  const days = rentalDayCount(pickupDate, dropoffDate);
  const subtotal = dailyAmount * days;
  const fees = 165;
  const total = subtotal + fees;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 antialiased">
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
        }
        .editorial-text {
          line-height: 1.1;
        }
      `}</style>

      <CarDemoNavbar
        demoBase={base}
        websiteName={config.websiteName}
        logo={config.logo}
        primaryColor={primaryColor}
        language={language}
        ctaLabel={t.nav.myBookings}
      />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-black">
        <div className="absolute inset-0 w-full h-full z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10"></div>
          <img
            alt={config.name}
            className="w-full h-full object-cover"
            src={
              config.heroImage ||
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070"
            }
          />
          <div className="absolute inset-0 flex items-end justify-start z-20 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div>
                  {config.category && (
                    <span
                      className="inline-block tracking-[0.2em] text-xs font-bold uppercase mb-4 border-l-2 pl-3 text-white"
                      style={{ borderColor: primaryColor }}
                    >
                      {config.category}
                    </span>
                  )}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-2 editorial-text drop-shadow-2xl">
                    {config.name}
                  </h1>
                  {config.description && (
                    <p className="text-white/80 text-lg font-light tracking-wide max-w-xl mt-4">
                      {config.description}
                    </p>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg text-white min-w-[200px]">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
                    {t.hero.dayRate}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-medium">
                      {config.currency || "$"}
                      {config.price}
                    </span>
                    <span className="text-white/60 font-light">
                      {t.hero.perDay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-30 -mt-10 bg-gray-50 dark:bg-gray-900 rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {base ? (
            <CarDemoBreadcrumbs
              className="mb-10"
              ariaLabel={tSite.breadcrumb.ariaLabel}
              primaryColor={primaryColor}
              items={[
                {
                  label: config.websiteName || "Velocitá",
                  href: base,
                },
                { label: tSite.breadcrumb.fleet, href: `${base}/fleet` },
                ...(config.breadcrumbBrand
                  ? [
                      {
                        label: config.breadcrumbBrand.title,
                        href: config.breadcrumbBrand.path,
                      },
                    ]
                  : []),
                { label: config.name },
              ]}
            />
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-16">
              {/* Specifications */}
              {config.specs && (
                <section>
                  <h3 className="text-2xl text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    {t.specs.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {config.specs.acceleration && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-shadow">
                        <span
                          className="material-icons text-3xl mb-3"
                          style={{ color: primaryColor }}
                        >
                          speed
                        </span>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                          {t.specs.acceleration}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {config.specs.acceleration}
                        </p>
                      </div>
                    )}
                    {config.specs.topSpeed && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-shadow">
                        <span
                          className="material-icons text-3xl mb-3"
                          style={{ color: primaryColor }}
                        >
                          timer
                        </span>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                          {t.specs.topSpeed}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {config.specs.topSpeed}
                        </p>
                      </div>
                    )}
                    {config.specs.power && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-shadow">
                        <span
                          className="material-icons text-3xl mb-3"
                          style={{ color: primaryColor }}
                        >
                          bolt
                        </span>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                          {t.specs.power}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {config.specs.power}
                        </p>
                      </div>
                    )}
                    {config.specs.transmission && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-shadow">
                        <span
                          className="material-icons text-3xl mb-3"
                          style={{ color: primaryColor }}
                        >
                          settings
                        </span>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                          {t.specs.trans}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {config.specs.transmission}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Features & Inclusions */}
              {(config.features || config.inclusions) && (
                <section>
                  <div className="grid md:grid-cols-2 gap-12">
                    {config.features && (
                      <div>
                        <h3 className="text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <span
                            className="material-icons text-lg"
                            style={{ color: primaryColor }}
                          >
                            stars
                          </span>
                          {t.features.title}
                        </h3>
                        <ul className="space-y-4">
                          {config.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: primaryColor }}
                              ></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {config.inclusions && (
                      <div>
                        <h3 className="text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <span
                            className="material-icons text-lg"
                            style={{ color: primaryColor }}
                          >
                            verified_user
                          </span>
                          {t.features.inclusions}
                        </h3>
                        <ul className="space-y-4">
                          {config.inclusions.map((inclusion, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm"
                            >
                              <span className="material-icons text-green-500 text-base">
                                check_circle
                              </span>
                              {inclusion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {config.gallery && config.gallery.length > 0 && (
                <section>
                  <h3 className="text-2xl text-gray-900 dark:text-white mb-6">
                    {t.gallery.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.gallery.map((image, index) => (
                      <div
                        key={index}
                        className={`${index === 0 ? "md:col-span-2 h-96" : "h-64"} overflow-hidden rounded-xl`}
                      >
                        <img
                          alt={`${config.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          src={image}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800">
                  <div className="mb-6">
                    <h3 className="text-2xl text-gray-900 dark:text-white">
                      {t.booking.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {t.booking.subtitle}
                    </p>
                  </div>
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                        {t.booking.pickup}
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                        {t.booking.dropoff}
                      </label>
                      <input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                      />
                    </div>
                    <div className="pt-4 pb-4 border-t border-b border-gray-100 dark:border-gray-800 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{t.booking.dailyRate}</span>
                        <span>
                          {config.currency || "$"}
                          {dailyAmount.toLocaleString(numberLocale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          {t.booking.subtotal} ({days}{" "}
                          {days === 1 ? t.booking.day : t.booking.days})
                        </span>
                        <span>
                          {config.currency || "$"}
                          {subtotal.toLocaleString(numberLocale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{t.booking.insurance}</span>
                        <span>{t.booking.included}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{t.booking.taxes}</span>
                        <span>
                          {config.currency || "$"}
                          {fees.toLocaleString(numberLocale)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {t.booking.total}
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {config.currency || "$"}
                        {total.toLocaleString(numberLocale)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="w-full py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-lg text-white"
                      style={{
                        backgroundColor: primaryColor,
                        boxShadow: `0 10px 25px ${primaryColor}30`,
                      }}
                    >
                      {t.booking.reserve}
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 py-3 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <span className="material-icons text-lg">chat</span>
                      {t.booking.whatsapp}
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                      <span className="material-icons text-[10px] align-middle mr-1">
                        lock
                      </span>
                      {t.booking.secure}
                    </p>
                  </div>
                </div>
                <div
                  className="border border-opacity-10 p-6 rounded-xl flex items-start gap-4"
                  style={{
                    backgroundColor: `${primaryColor}08`,
                    borderColor: `${primaryColor}40`,
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                    <span
                      className="material-icons"
                      style={{ color: primaryColor }}
                    >
                      support_agent
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                      {t.concierge.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {t.concierge.desc}
                    </p>
                    <a
                      className="text-xs font-bold mt-2 inline-block hover:underline"
                      href="#"
                      style={{ color: primaryColor }}
                    >
                      {t.concierge.contact}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
