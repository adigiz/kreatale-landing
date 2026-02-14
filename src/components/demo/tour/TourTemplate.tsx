"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
// Using standard img tag as requested to keep styling exactly as is without handling Next/Image complexity yet.

export interface TourConfig {
  // Branding
  logo?: string;
  primaryColor?: string;
  // Hero
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  // Details
  price?: string;
  currency?: string;
  days?: string;
  location?: string;
  // Content
  destinations?: {
    name: string;
    image?: string;
    price?: string;
    region?: string;
    description?: string;
  }[];
  itinerary?: { day: number; title: string; description?: string }[];
  packages?: {
    title: string;
    slug?: string;
    image?: string;
    location?: string;
    duration?: string;
    feature?: string;
    price?: string;
    itinerary?: { day: number; title: string; description?: string }[];
  }[];
}

interface TourTemplateProps {
  config?: TourConfig;
}

export default function TourTemplate({ config }: TourTemplateProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;

  // Default values
  const heroTitle = config?.heroTitle || "The Art of Verified Travel.";
  const heroSubtitle =
    config?.heroSubtitle ||
    "We don't just plan trips; we craft narratives tailored to your unique travel style.";
  const heroImage =
    config?.heroImage ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=3242&auto=format&fit=crop";
  const price = config?.price || "4,500";
  const days = config?.days || "7 Days";
  const location = config?.location || "Oia, Greece";
  const primaryColor = config?.primaryColor || "#1173d4";
  const currency = config?.currency || "Rp";

  // Helper for price formatting
  const formatPrice = (p: string) => {
    if (!p) return "";
    // If it already starts with the currency, return as is
    if (p.startsWith(currency)) return p;
    // Otherwise add currency with a space if it's more than 2 chars (like Rp) or as is for $
    const separator = currency.length > 1 ? " " : "";
    return `${currency}${separator}${p}`;
  };

  const style = {
    "--tour-primary": primaryColor,
    "--tour-primary-hover": primaryColor, // Could darken this programmatically if needed
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className="font-sans text-tour-navy-dark dark:text-gray-100 bg-white dark:bg-tour-background-dark selection:bg-tour-primary/20 transition-colors duration-300"
    >
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-tour-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 lg:h-20 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            {config?.logo ? (
              <img
                src={config.logo}
                alt="Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tour-primary text-3xl group-hover:rotate-12 transition-transform duration-300">
                  travel_explore
                </span>
                <span className="text-xl lg:text-2xl font-tour-serif font-bold tracking-tight text-tour-navy-dark dark:text-white">
                  Voyage<span className="text-tour-primary">.</span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
            <a
              href="#"
              className="hover:text-tour-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-primary after:transition-all hover:after:w-full"
            >
              Destinations
            </a>
            <a
              href="#"
              className="hover:text-tour-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-primary after:transition-all hover:after:w-full"
            >
              Experiences
            </a>
            <a
              href="#"
              className="hover:text-tour-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-primary after:transition-all hover:after:w-full"
            >
              Journal
            </a>
            <a
              href="#"
              className="hover:text-tour-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-tour-primary after:transition-all hover:after:w-full"
            >
              Curated Trips
            </a>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="hidden lg:block text-gray-500 hover:text-tour-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="hidden lg:block px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:border-tour-primary hover:text-tour-primary transition-all rounded-sm">
              Inquire
            </button>
            {/* Mobile Menu Button */}
            <button className="lg:hidden flex items-center justify-center w-10 h-10 text-tour-navy-dark dark:text-white hover:text-tour-primary transition-colors">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </nav>

      <header className="relative w-full flex flex-col lg:flex-row pt-16 lg:pt-20 lg:h-screen">
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-full relative bg-gray-900 group overflow-hidden">
          <img
            alt="Luxury private yacht sailing in turquoise waters"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tour-navy-dark/40 via-transparent to-transparent lg:from-tour-navy-dark/80 lg:via-tour-navy-dark/20"></div>
          <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] lg:text-xs font-bold uppercase tracking-widest rounded-full">
              Featured Experience
            </span>
          </div>
          <div className="absolute bottom-8 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 text-white max-w-xl">
            <h2 className="text-3xl md:text-5xl font-tour-serif italic mb-2 lg:mb-4 leading-tight shadow-black/20 drop-shadow-lg">
              {heroTitle}
            </h2>
            <p className="hidden lg:block text-gray-200 text-sm md:text-base font-light tracking-wide border-l-2 border-tour-primary pl-4">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 lg:gap-8 mt-6 lg:mt-8 text-xs lg:text-sm font-bold tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-primary">
                  calendar_month
                </span>
                <span>{days}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-primary">
                  location_on
                </span>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tour-primary">
                  payments
                </span>
                <span>From {formatPrice(price)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:h-full bg-white dark:bg-tour-background-dark flex items-center justify-center px-6 py-10 lg:p-16">
          <div className="max-w-xl w-full">
            <span className="text-tour-primary font-bold uppercase tracking-widest text-xs mb-3 lg:mb-4 block">
              Curated Luxury
            </span>
            <h1 className="text-4xl lg:text-7xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-4 lg:mb-8 leading-[1.15] lg:leading-[1.1]">
              Redefining the <br />
              <span className="italic text-tour-primary">Art of Travel.</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-8">
              We don&apos;t just plan trips; we craft narratives. From the
              secluded vineyards of Tuscany to the icy fjords of Norway, Voyage
              curates moments that linger long after you return home.
              <span className="hidden lg:inline">
                {" "}
                Experience the world with unparalleled access and effortless
                elegance.
              </span>
            </p>

            {/* Mobile Carousel for Signature Collections */}
            <div className="mb-8 lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-tour-navy-dark dark:text-white border-b-2 border-tour-primary/20 pb-1">
                  Signature Collections
                </h3>
                <div className="text-xs text-gray-400">Swipe</div>
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
                    Private Jet
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
                    Safari
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
                    Alpine
                  </h4>
                </div>
              </div>
            </div>

            {/* Desktop Signature Collections Grid */}
            <div className="mb-12 hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-tour-navy-dark dark:text-white border-b-2 border-tour-primary/20 pb-1">
                  Signature Collections
                </h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-tour-primary hover:border-tour-primary transition-all">
                    <span className="material-symbols-outlined text-sm">
                      arrow_back
                    </span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-tour-primary hover:border-tour-primary transition-all">
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Private Jet Expeditions"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuxgniqTw76Q3UpeX1kbMvjvazOnuhMrqEzAxVdWsBnoQhuhFDhaWMCDIGPlIVMBJu8SGW3CqsiXSzt4KzYSdgiCgyL_-Vu5uTjYKFE89PAijVY4jDLQt-Wjwtc2OBK-vYh6fabQH7b4Exd-bcYu4vbaEfT98G4AbysWUKVIX6M6HhJeb9VNgfh_xmiWTG_hAp0k2ymUSDXU9ByS53Fu_SCKgDe3KPSH1liQu4ixirCbcDRWSDES79i_D8ZH8LWTb4tPLH3uJ2Q3Q"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-primary transition-colors">
                    Private Jet
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                    Expeditions
                  </p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Safari Reserves"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBedXaQtpBd_YDmUr6ORZNgm_XuI2y4VGnx7xSx3wi84u8KnwMN2cFQLGwPPZ_6472Fbo6PwyBECByD2xmE9jjgwOc68izSIAezvOjwTsa4x_0ozR5zc7-LQsxfV7rSRLkpTU_Gmx3_b-R0kmO1dZVaXj8eaKOoToYfmzoHIx4U4LOY3xUaBYcc-jB1Dn_qRRmTglkz_jomdbkj0OombmnuNheEacAZmvxEXERvg0kkXrzkWa56tsQBQiyRFIaAJb87mYu6aWWCLI"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-primary transition-colors">
                    Safari
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                    Reserves
                  </p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt="Alpine Retreats"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk-0y9mh6tzY042cqehTqMCqcWcmFeUhj8POg7jnq6Jp_WfsdCOiuwfit9GNcok8J5jaEn6dQX5L3fGq1X5ov6CaNKbceKBCBRrlIXNz5YXbXql4vu0U13d_SK-E8OJWewsMF7f_xOB7t8-CIprhk_2n8ITABSwbrogtpKKY_as6hvg-QjouEmheDz0xTr41T8gSqsTE4FkJtqXI7zJjqjUq3P9_PtuiaNelb0a2f_cgXcOVX-6TqYDgPxv45yljPn36VeMsuGMFQ"
                    />
                    <div className="absolute inset-0 bg-tour-navy-dark/0 group-hover:bg-tour-navy-dark/10 transition-colors"></div>
                  </div>
                  <h4 className="font-tour-serif text-sm font-semibold text-tour-navy-dark dark:text-white group-hover:text-tour-primary transition-colors">
                    Alpine
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                    Retreats
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <button className="bg-tour-primary hover:bg-tour-primary-hover text-white py-4 lg:px-8 rounded-sm font-medium transition-all shadow-lg shadow-tour-primary/20 hover:shadow-tour-primary/30 flex items-center justify-center gap-2 group w-full lg:w-auto">
                <span>Start Your Journey</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <Link
                href={`/${locale}/demo/${slug}/detail`}
                className="py-4 lg:px-8 border border-gray-200 dark:border-gray-700 hover:border-tour-navy-dark dark:hover:border-white rounded-sm font-medium text-tour-navy-dark dark:text-white transition-all w-full lg:w-auto bg-white dark:bg-transparent flex items-center justify-center"
              >
                View Journal
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 bg-gray-50 dark:bg-tour-navy-light/10">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex items-end justify-between mb-12 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div>
              <span className="text-tour-primary font-bold uppercase tracking-widest text-xs mb-2 block">
                Handpicked Journeys
              </span>
              <h3 className="text-3xl md:text-4xl font-tour-serif text-tour-navy-dark dark:text-white">
                Curated Tour Packages
              </h3>
            </div>
            <a
              href="#"
              className="text-sm font-bold uppercase tracking-widest text-tour-primary hover:text-tour-navy-dark dark:hover:text-white transition-colors flex items-center gap-1"
            >
              View All{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config?.packages && config.packages.length > 0 ? (
              config.packages.map((pkg, idx) => {
                // Generate a simple slug from title if not present
                const pkgSlug =
                  pkg.slug ||
                  pkg.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");

                return (
                  <div
                    key={idx}
                    className="group bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300"
                  >
                    <div className="h-80 w-full overflow-hidden relative">
                      <img
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={pkg.image}
                      />
                      {pkg.location && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                            {pkg.location}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <h4 className="text-2xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2">
                        {pkg.title}
                      </h4>
                      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                        {pkg.duration && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">
                              calendar_month
                            </span>
                            <span>{pkg.duration}</span>
                          </div>
                        )}
                        {pkg.feature && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">
                              {pkg.feature.toLowerCase().includes("flight") ||
                              pkg.feature.toLowerCase().includes("class")
                                ? "flight_class"
                                : pkg.feature.toLowerCase().includes("spa") ||
                                    pkg.feature.toLowerCase().includes("onsen")
                                  ? "spa"
                                  : pkg.feature
                                        .toLowerCase()
                                        .includes("safari") ||
                                      pkg.feature
                                        .toLowerCase()
                                        .includes("camera")
                                    ? "photo_camera"
                                    : "star"}
                            </span>
                            <span>{pkg.feature}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Starting From
                          </p>
                          <p className="text-xl font-tour-serif font-semibold text-tour-primary">
                            {formatPrice(pkg.price || "")}
                          </p>
                        </div>
                        <Link
                          href={`/${locale}/demo/${slug}/package/${pkgSlug}`}
                          className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">
                            arrow_outward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // FALLBACK (Original Hardcoded Content)
              <>
                {/* Card 1 */}
                <div className="group bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                  <div className="h-80 w-full overflow-hidden relative">
                    <img
                      alt="Amalfi Coast Escape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCp4p7WeLLEjMCN5TiCmNRCWON91Rwp4SHC2XF0XZihLjl5xKIkW9A0REWzsqfrbk2Kk7QT-tn6HOSqua1gk67nXuFB2AHBk-ILYndaJLvFQ4YzcJKXXPXYx5EKJI1ypzoGFZsviNVIM9ki4S-WHUUC075R5-D5aRrHd-VU6wyTRV_mTHbjN41RPq3kHBNB3YZNVO3UDhIk2j0spcj8lK98pFEpbVjcQSwQRcV5-gK9GZkX2VR-uqRRL3NEl7prUm3jjbs7Jhz4wk"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                        Italy
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2">
                      Amalfi Coast Escape
                    </h4>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          calendar_month
                        </span>
                        <span>10 Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          flight_class
                        </span>
                        <span>Business Class</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Starting From
                        </p>
                        <p className="text-xl font-tour-serif font-semibold text-tour-primary">
                          Rp 14,200
                        </p>
                      </div>
                      <Link
                        href={`/${locale}/demo/${slug}/package/amalfi-coast`}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">
                          arrow_outward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="group bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                  <div className="h-80 w-full overflow-hidden relative">
                    <img
                      alt="Kyoto Zen Retreat"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcSMBd4G8lS8bxdnjsgyWqVYjTFEqFXnOluD3-hhMQ-otYChltQ2dFN622iPkvgEKef27U8uN-vBhjxMSKoQMY-5dTzhpO8WM2a9daxVHSr2nMdBv4PHJsuANsPOcZtdmJeAgguAtrw_M0cQVtZoe4QzN81c8zED8ryItB4m6AlyHRxokKZxk8hF6kuYkrjLKiTYUT9v7WIm7EqE7h3urUeok6vDRyJWEgoiq3gcEesCtyMrsZL60TyffKeeMt5QAlwGPOB36QK0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                        Japan
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2">
                      Timeless Kyoto
                    </h4>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          calendar_month
                        </span>
                        <span>9 Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          spa
                        </span>
                        <span>Private Onsen</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Starting From
                        </p>
                        <p className="text-xl font-tour-serif font-semibold text-tour-primary">
                          Rp 9,800
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all">
                        <span className="material-symbols-outlined text-lg">
                          arrow_outward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="group bg-white dark:bg-tour-navy-dark border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-tour-navy-dark/10 transition-all duration-300">
                  <div className="h-80 w-full overflow-hidden relative">
                    <img
                      alt="Serengeti Safari"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7526hg4wnagGUvoFcdfgcipg4xjJAZHdE1pW6AzkrKsXgtYhMsCthqKJG5Upb29XYOdaA-GrkFnmu3ftJPY8zdLeE8ZP1Snn9KBdI4zM8Bgr1LdpFwAoUEr_eeHvFdx-s0uMRUIyA4zdItN1TaBDoUgoeFSbeUx4uCqAD669av2lgzg0XMXieoqm0Pndz4Q79MbCuCu5DPgO_fn4QQq744fFBwlQW3-OpK09n-xkzmkIERjf83XwTUivkyjFGJdKCP3O4XQLv4rY"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                        Tanzania
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-tour-serif font-medium text-tour-navy-dark dark:text-white mb-2">
                      Serengeti & Beyond
                    </h4>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          calendar_month
                        </span>
                        <span>12 Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">
                          photo_camera
                        </span>
                        <span>Guided Safari</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Starting From
                        </p>
                        <p className="text-xl font-tour-serif font-semibold text-tour-primary">
                          Rp 12,500
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-tour-navy-dark dark:text-white group-hover:bg-tour-navy-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-tour-navy-dark transition-all">
                        <span className="material-symbols-outlined text-lg">
                          arrow_outward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-tour-background-dark">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-tour-primary font-bold uppercase tracking-widest text-xs mb-3 block">
              Wanderlust
            </span>
            <h3 className="text-4xl md:text-5xl font-tour-serif text-tour-navy-dark dark:text-white mb-6">
              Top Destinations
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto font-light">
              Explore the world&apos;s most captivating regions, hand-selected
              for their cultural depth and natural beauty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[800px] md:h-[600px] lg:h-[600px]">
            {config?.destinations && config.destinations.length > 0 ? (
              config.destinations.map((dest, idx) => (
                <div
                  key={idx}
                  className="relative group h-full overflow-hidden cursor-pointer rounded-sm"
                >
                  <img
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src={
                      dest.image ||
                      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/80 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2 block">
                      {dest.region || "Global"}
                    </span>
                    <h4 className="text-3xl font-tour-serif text-white mb-2">
                      {dest.name}
                    </h4>
                    {dest.description && (
                      <p className="text-gray-200 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                        {dest.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Default Hardcoded Destinations (Fallback)
              <>
                {/* Destination 1 */}
                <Link
                  href={`/${locale}/demo/${slug}/detail`}
                  className="relative group h-full overflow-hidden cursor-pointer rounded-sm block"
                >
                  <img
                    alt="Santorini, Greece"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2938&auto=format&fit=crop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tour-navy-dark/90 via-tour-navy-dark/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] uppercase font-bold tracking-widest mb-1 block text-tour-primary">
                      Greece
                    </span>
                    <h3 className="text-2xl font-tour-serif italic mb-2">
                      Santorini
                    </h3>
                    <div className="h-0.5 w-0 bg-white group-hover:w-12 transition-all duration-500"></div>
                  </div>
                </Link>

                {/* Destination 2 */}
                <div className="relative group h-full overflow-hidden cursor-pointer rounded-sm">
                  <img
                    alt="Kyoto Streets"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyU6OxNe7z0NQ7uEX7VvsNZF2iAhNR8klSv7Vct6lzgoErV9IXpp33UQQVtwXMJyp_y2uMOK5fLmiacjxT3k4MSaHd90rg_QMcxnBoOXrnlnSj_3Ughj02WxucNKrhj0xO8etNtBcKs_NoANyJtf9z-nSQw__45j5-iLdZhfx2ZEzb9dFg0XK98xle8U3SHXmWgqTm4wBU9dLjXUm730YIb09gqaQ1dk85n4zis4rQxwm7sz0R3_hWn4lZlLyLulVLkE3kmRoEH4Y"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-tour-primary mb-2 block">
                      Asia
                    </span>
                    <h4 className="text-3xl font-tour-serif text-white mb-2">
                      Kyoto
                    </h4>
                    <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      Walk through history in the ancient capital of culture and
                      tradition.
                    </p>
                  </div>
                </div>

                {/* Destination 3 */}
                <div className="relative group h-full overflow-hidden cursor-pointer rounded-sm">
                  <img
                    alt="Luxury Interior"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-tour-primary mb-2 block">
                      Global
                    </span>
                    <h4 className="text-3xl font-tour-serif text-white mb-2">
                      Private Villas
                    </h4>
                    <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      Exclusive estates offering privacy and unparalleled luxury
                      worldwide.
                    </p>
                  </div>
                </div>

                {/* Destination 4 */}
                <div className="relative group h-full overflow-hidden cursor-pointer rounded-sm">
                  <img
                    alt="The Swiss Alps"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnTmx0MTw7u-lpY9UBYiBdBQWVs_38vwcDSqQnKVjoDA6MGKzNBvonFr52thJ0isqSC_n74JRW5L449taqrvYMHuZeHGBwFklTKXX_mx6tACLUn6ZeHSkXBT1dWb0qpk_-Ur647zgo8vgHnrR9Un5gTgX9pPdDgJrYGwNetI7hf67ybUdJ0WIIrW29MoKb5Kph-SFDOIZWQChOZDUeom5hEu755GTT5C5ox_zr1aV7HCaaG1fCQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tour-navy-dark/90 opacity-90 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-tour-primary mb-2 block">
                      Europe
                    </span>
                    <h4 className="text-3xl font-tour-serif text-white mb-2">
                      Swiss Alps
                    </h4>
                    <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      Pristine peaks and luxury chalets for the discerning
                      winter enthusiast.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-tour-navy-light/5">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/5] rounded-sm overflow-hidden relative shadow-2xl">
                <img
                  alt="Lifestyle Travel Moment"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALyA5-VyX0cZKdMb6JFFoilDp9FunF9YfqCRJCi258tFXwjEY98qei8omSiho4St9aOU-MD_cjg1M4970T6lf180J30f4bRYh8DFpUeFXWNyTgHwR0rE-bBgMpMkzHYNS5wB3TvMGBZ_-Rrhi641YwJ0hP439UmaLV5aHAKmUg3hw-LenCwIpxLzg_mgyXFMwFFmd114zILlP3PUNXKMlwPlgwOgL4AY-mpTLPB34YoENM7nhw5GERWXcaZcohMwv0iaVva6Vugh8"
                />
                <div className="absolute inset-0 bg-tour-navy-dark/10"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white dark:bg-tour-navy-dark flex items-center justify-center rounded-full shadow-lg z-10 hidden md:flex">
                  <span className="material-symbols-outlined text-4xl text-tour-primary">
                    format_quote
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-tour-primary font-bold uppercase tracking-widest text-xs mb-6 block">
                The Voyage Experience
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-tour-serif leading-tight text-tour-navy-dark dark:text-white mb-10 italic">
                &quot;It wasn&apos;t just a vacation; it was a masterclass in
                living well. Every detail was anticipated before we even knew we
                wanted it. The Voyage team redefines hospitality.&quot;
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    alt="Client Portrait"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsHyqewONwlavQwN_YnhdGQG1Dif_3qOpyoiWuMDggfAlfMov0E-EVbqhBjZqYjmtuwrKpbK-3ujhO71AAejf0WPtAmZZXHRQEdUGMR1bmtrzqxy3MPjvnoDsMLa2YDDZmqUQYIT-BlU3wqCnBR304YME6vzSZ-itrXava9Uh_un-C25EGZSFzffAWrA-okxHTftYuGkmqVITUp9j4hUkWLUJd5tRfx40yRrIfU5wbcGpY9pQM5KuVQfv3nYBz3EUFcOGyttVjQgU"
                  />
                </div>
                <div>
                  <p className="font-bold text-tour-navy-dark dark:text-white text-lg font-tour-serif">
                    Alexandra Hamilton
                  </p>
                  <p className="text-xs text-tour-primary uppercase tracking-wider font-bold">
                    Private Charter Client, 2024
                  </p>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <div>
                  <p className="text-3xl font-tour-serif text-tour-navy-dark dark:text-white mb-1">
                    98%
                  </p>
                  <p className="text-sm text-gray-500">5-Star Reviews</p>
                </div>
                <div>
                  <p className="text-3xl font-tour-serif text-tour-navy-dark dark:text-white mb-1">
                    12k+
                  </p>
                  <p className="text-sm text-gray-500">Happy Travelers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full h-[600px] overflow-hidden group">
        <img
          alt="Luxury Resort Pool"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q"
        />
        <div className="absolute inset-0 bg-tour-navy-dark/70 transition-opacity duration-500 group-hover:bg-tour-navy-dark/60"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          <span className="text-tour-primary font-bold uppercase tracking-widest text-sm mb-6 block animate-fade-in-up">
            Your Next Chapter
          </span>
          <h2 className="text-5xl md:text-7xl font-tour-serif text-white mb-8 leading-tight">
            Start Your Journey Today
          </h2>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed">
            Your next extraordinary journey awaits. Let us craft a bespoke
            itinerary tailored exclusively to your desires, ensuring every
            moment is unforgettable.
          </p>
          <button className="bg-tour-primary hover:bg-white hover:text-tour-navy-dark text-white px-12 py-5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-tour-primary/30 hover:shadow-white/20 transform hover:-translate-y-1">
            Talk to a Consultant
          </button>
        </div>
      </section>

      <footer className="bg-white dark:bg-tour-background-dark pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tour-primary text-3xl">
                  travel_explore
                </span>
                <span className="text-2xl font-tour-serif font-bold tracking-tight text-tour-navy-dark dark:text-white">
                  Voyage<span className="text-tour-primary">.</span>
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                Curating the world&apos;s most exceptional travel experiences
                for the discerning modern explorer. We believe in travel that
                transforms.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-tour-navy-dark dark:text-white hover:bg-tour-primary hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    public
                  </span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-tour-navy-dark dark:text-white hover:bg-tour-primary hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    photo_camera
                  </span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-tour-navy-dark dark:text-white hover:bg-tour-primary hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    mail
                  </span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-tour-serif font-medium text-lg text-tour-navy-dark dark:text-white mb-6">
                Explore
              </h5>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-tour-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-primary rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-tour-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-primary rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    Signature Tours
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-tour-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-primary rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    Private Charters
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-tour-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-tour-primary rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    The Journal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-tour-serif font-medium text-lg text-tour-navy-dark dark:text-white mb-6">
                Newsletter
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Join our inner circle for exclusive updates and hidden gems.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm px-4 py-3 focus:ring-1 focus:ring-tour-primary focus:border-tour-primary transition-all"
                  placeholder="Email Address"
                />
                <button className="bg-tour-navy-dark hover:bg-tour-primary text-white px-4 py-3 rounded-sm transition-colors text-sm font-bold uppercase tracking-wide">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              © 2024 Voyage Luxury Travel. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-tour-navy-dark dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-tour-navy-dark dark:hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-0 w-full bg-white dark:bg-tour-background-dark border-t border-gray-100 dark:border-gray-800 p-4 z-50 flex justify-between items-center shadow-sticky-footer lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
            Questions?
          </span>
          <span className="text-sm font-tour-serif font-bold text-tour-navy-dark dark:text-white">
            Contact Concierge
          </span>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <span className="material-symbols-outlined text-xl">chat</span>
          </button>
          <button className="bg-tour-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tour-primary-hover shadow-lg shadow-tour-primary/30 transition-colors">
            <span className="material-symbols-outlined text-xl">call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
