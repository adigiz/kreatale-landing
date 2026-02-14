"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

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
}

const DICTIONARY = {
  en: {
    nav: {
      fleet: "The Fleet",
      brands: "Curated Brands",
      membership: "Membership",
      signIn: "Sign In",
      myBookings: "My Bookings",
    },
    hero: {
      dayRate: "Day Rate",
      perDay: "/ day",
    },
    specs: {
      title: "Specifications",
      acceleration: "0-100 km/h",
      topSpeed: "Top Speed",
      power: "Power",
      trans: "Trans",
    },
    features: {
      title: "Vehicle Features",
      inclusions: "Rental Inclusions",
    },
    gallery: {
      title: "Gallery",
    },
    booking: {
      title: "Reserve Your Drive",
      subtitle: "Instant confirmation for dates available.",
      pickup: "Pick-up Date",
      dropoff: "Drop-off Date",
      dailyRate: "Daily Rate",
      insurance: "Insurance",
      included: "Included",
      taxes: "Taxes & Fees",
      total: "Est. Total",
      reserve: "Reserve Now",
      whatsapp: "Inquire via WhatsApp",
      secure: "Secure booking powered by Stripe",
    },
    concierge: {
      title: "Need specific arrangements?",
      desc: "Our concierge team can arrange custom delivery locations or special event packages.",
      contact: "Contact Concierge",
    },
  },
  id: {
    nav: {
      fleet: "Armada",
      brands: "Merek Pilihan",
      membership: "Keanggotaan",
      signIn: "Masuk",
      myBookings: "Pesanan Saya",
    },
    hero: {
      dayRate: "Tarif Harian",
      perDay: "/ hari",
    },
    specs: {
      title: "Spesifikasi",
      acceleration: "0-100 km/jam",
      topSpeed: "Kecepatan Maks",
      power: "Tenaga",
      trans: "Transmisi",
    },
    features: {
      title: "Fitur Kendaraan",
      inclusions: "Termasuk Sewa",
    },
    gallery: {
      title: "Galeri",
    },
    booking: {
      title: "Pesan Perjalanan Anda",
      subtitle: "Konfirmasi instan untuk tanggal yang tersedia.",
      pickup: "Tanggal Pengambilan",
      dropoff: "Tanggal Pengembalian",
      dailyRate: "Tarif Harian",
      insurance: "Asuransi",
      included: "Termasuk",
      taxes: "Pajak & Biaya",
      total: "Est. Total",
      reserve: "Pesan Sekarang",
      whatsapp: "Tanya via WhatsApp",
      secure: "Pemesanan aman didukung oleh Stripe",
    },
    concierge: {
      title: "Butuh pengaturan khusus?",
      desc: "Tim concierge kami dapat mengatur lokasi pengiriman khusus atau paket acara spesial.",
      contact: "Hubungi Concierge",
    },
  },
};

export function CarDetailPage({ config }: { config: CarDetailConfig }) {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const primaryColor = config.primaryColor || "#256af4";
  const language = config.language || "en";
  const t = DICTIONARY[language];

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

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="h-8 w-auto" />
              ) : (
                <>
                  <span
                    className="material-icons text-2xl"
                    style={{ color: primaryColor }}
                  >
                    speed
                  </span>
                  <span className="font-serif font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                    {config.websiteName || "Velocitá"}
                  </span>
                </>
              )}
            </div>
            <div className="hidden md:flex space-x-10 items-center">
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                {t.nav.fleet}
              </a>
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                {t.nav.brands}
              </a>
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                {t.nav.membership}
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <a
                className="hidden md:block text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                {t.nav.signIn}
              </a>
              <button
                className="px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {t.nav.myBookings}
              </button>
            </div>
          </div>
        </div>
      </nav>

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
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-2 editorial-text drop-shadow-2xl">
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
                    <span className="font-serif text-4xl md:text-5xl font-medium">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-16">
              {/* Specifications */}
              {config.specs && (
                <section>
                  <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
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
                        <p className="text-xl font-bold text-gray-900 dark:text-white font-serif">
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
                        <p className="text-xl font-bold text-gray-900 dark:text-white font-serif">
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
                        <p className="text-xl font-bold text-gray-900 dark:text-white font-serif">
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
                        <p className="text-xl font-bold text-gray-900 dark:text-white font-serif">
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
                        <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                        <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                  <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-6">
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
                    <h3 className="font-serif text-2xl text-gray-900 dark:text-white">
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
                          {config.price}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{t.booking.insurance}</span>
                        <span>{t.booking.included}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{t.booking.taxes}</span>
                        <span>{config.currency || "$"}165</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {t.booking.total}
                      </span>
                      <span
                        className="font-serif text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {config.currency || "$"}
                        {parseInt(config.price) + 165}
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

      {/* Material Icons Font */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
}
