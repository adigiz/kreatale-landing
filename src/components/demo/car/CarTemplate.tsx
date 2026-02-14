"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface CarConfig {
  slug?: string; // Demo site slug for routing
  logo?: string;
  primaryColor?: string;
  websiteName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  currency?: string;
  location?: string;
  destinations?: Array<{
    name: string;
    region?: string;
    description?: string;
    image?: string;
    price?: string;
  }>;
  packages?: Array<{
    slug?: string; // Car slug for detail page routing
    title: string;
    image?: string;
    price?: string;
    location?: string;
    duration?: string;
    feature?: string;
    itinerary?: Array<{
      day: number;
      title: string;
      description?: string;
    }>;
  }>;
}

export function CarTemplate({ config }: { config: CarConfig }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const primaryColor = config.primaryColor || "#256af4";

  // Hero carousel slides - using first 3 destinations as hero slides
  const heroSlides = [
    {
      category: "The Mountain Pass",
      title: "Conquer the",
      titleItalic: "Altitude",
      subtitle: "Precision engineering meets raw nature. Elevate your journey.",
      ctaText: "Explore Alpine Routes",
      image:
        config.destinations?.[0]?.image ||
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070",
    },
    {
      category: "Urban Elegance",
      title: "Design in",
      titleItalic: "Motion",
      subtitle:
        "Sleek lines for the modern metropolis. Arrive in undeniable style.",
      ctaText: "View City Collection",
      image:
        config.destinations?.[1]?.image ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
    },
    {
      category: "Coastal Horizons",
      title: "Chasing the",
      titleItalic: "Sunset",
      subtitle: "Open roads, ocean air, and the purr of a perfect engine.",
      ctaText: "Discover Coastal Drives",
      image:
        config.destinations?.[2]?.image ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 antialiased">
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
        }
        .editorial-text {
          line-height: 1.1;
        }
        @keyframes kenburns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
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
                The Fleet
              </a>
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                Curated Brands
              </a>
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                Membership
              </a>
              <a
                className="text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                Journal
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <a
                className="hidden md:block text-xs uppercase tracking-widest font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                href="#"
              >
                Sign In
              </a>
              <button
                className="px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg text-white"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <section className="relative h-screen min-h-[650px] overflow-hidden bg-black">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1500 ${
              activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              alt={slide.category}
              className="w-full h-full object-cover"
              style={{
                animation:
                  activeSlide === index
                    ? "kenburns 20s ease-out infinite alternate"
                    : "none",
              }}
              src={slide.image}
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center max-w-5xl px-4 pb-24">
                <span className="inline-block text-white/80 tracking-[0.3em] text-xs font-medium uppercase mb-6 border-b border-white/30 pb-2">
                  {slide.category}
                </span>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 editorial-text drop-shadow-2xl">
                  {slide.title} <br />
                  <span className="italic font-light text-white/90">
                    {slide.titleItalic}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 font-light max-w-xl mx-auto drop-shadow-md tracking-wide">
                  {slide.subtitle}
                </p>
                <button
                  className="group relative px-8 py-3 overflow-hidden rounded-full bg-transparent border border-white/40 text-white shadow-lg transition-all hover:bg-white hover:text-black"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <span className="relative text-sm font-medium tracking-widest uppercase">
                    {slide.ctaText}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-[2px] w-12 bg-white/40 rounded-full overflow-hidden cursor-pointer"
              onClick={() => setActiveSlide(index)}
            >
              {activeSlide === index && (
                <div className="h-full bg-white w-full transition-all duration-6000"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-2">
                Handpicked Fleet
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Engineering masterpieces ready for your command.
              </p>
            </div>
            <a
              className="hidden md:flex items-center font-medium hover:opacity-80 transition-colors"
              href="#"
              style={{ color: primaryColor }}
            >
              View Full Collection{" "}
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.destinations?.slice(0, 6).map((car, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={
                      car.image ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400"
                    }
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded uppercase tracking-wider text-gray-900 dark:text-white">
                    Available Now
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        {car.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {car.region || "Grand Tourer"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="block font-bold text-lg"
                        style={{ color: primaryColor }}
                      >
                        {config.currency || "$"}
                        {car.price || "1,200"}
                      </span>
                      <span className="text-xs text-gray-400">/ day</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 py-4 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-gray-400 text-base">
                        speed
                      </span>{" "}
                      620 HP
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-gray-400 text-base">
                        timer
                      </span>{" "}
                      3.4s
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-gray-400 text-base">
                        settings
                      </span>{" "}
                      Auto
                    </div>
                  </div>
                  <Link
                    href={
                      config.slug && car.region
                        ? `/${config.slug}/${car.region.toLowerCase().replace(/\s+/g, "-")}`
                        : "#"
                    }
                    className="block w-full mt-2 py-3 border rounded-lg text-sm font-medium transition-colors text-center"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = primaryColor;
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Brands Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span
              className="font-medium tracking-widest text-xs uppercase"
              style={{ color: primaryColor }}
            >
              Manufacturers
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white mt-3">
              Curated Brands
            </h2>
            <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-auto mt-6"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-6 max-w-2xl mx-auto font-light">
              We partner exclusively with the world's most prestigious
              automotive houses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.packages?.slice(0, 4).map((brand, index) => (
              <Link
                key={index}
                href={
                  config.slug && brand.slug
                    ? `/${config.slug}/package/${brand.slug}`
                    : "#"
                }
                className="group relative bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row h-auto md:h-80"
              >
                <div className="w-full md:w-1/2 relative overflow-hidden">
                  <img
                    alt={brand.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={
                      brand.image ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
                <div className="w-full md:w-1/2 p-10 flex flex-col items-start justify-center">
                  <div className="mb-6 opacity-90">
                    <span className="font-serif font-bold text-3xl md:text-4xl text-gray-900 dark:text-white tracking-tighter">
                      {brand.title}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 font-light">
                    {brand.itinerary?.[0]?.description ||
                      "Premium automotive excellence."}
                  </p>
                  <div className="mt-auto">
                    <span
                      className="inline-flex items-center text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300"
                      style={{ color: primaryColor }}
                    >
                      View Details{" "}
                      <span className="material-icons text-sm ml-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div
                className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl"
                style={{ backgroundColor: `${primaryColor}20` }}
              ></div>
              <img
                alt="Interior cockpit of a luxury sports car"
                className="relative z-10 w-full rounded-lg shadow-2xl"
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <span
                className="material-icons text-5xl mb-6"
                style={{ color: primaryColor }}
              >
                format_quote
              </span>
              <blockquote className="font-serif text-3xl md:text-4xl leading-tight text-gray-900 dark:text-white mb-8">
                The perfect fusion of machine and landscape. An unforgettable
                journey that redefined my expectations of travel.
              </blockquote>
              <div>
                <cite className="not-italic font-bold text-lg text-gray-900 dark:text-white">
                  James Sterling
                </cite>
                <span className="block text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Member since 2019
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 md:py-48 flex items-center justify-center text-center overflow-hidden">
        <img
          alt="Scenic road"
          className="absolute inset-0 w-full h-full object-cover"
          src={
            config.heroImage ||
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070"
          }
        />
        <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/70"></div>
        <div className="relative z-10 px-4">
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-8">
            Command the Road
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg transform hover:-translate-y-1 text-white"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 25px ${primaryColor}30`,
              }}
            >
              Inquire with a Specialist
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="material-icons"
                  style={{ color: primaryColor }}
                >
                  speed
                </span>
                <span className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                  {config.websiteName || "Velocitá"}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Redefining luxury travel through curated driving experiences and
                an unrivaled fleet of world-class vehicles.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">
                Support
              </h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Contact Center
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="hover:opacity-80 transition-colors"
                    href="#"
                    style={{ color: "inherit" }}
                  >
                    Insurance Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">
                Newsletter
              </h4>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg py-3 px-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50"
                    placeholder="Email address"
                    type="email"
                  />
                </div>
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © 2023 {config.websiteName || "Velocitá"} Luxury Rentals. All
              rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                className="hover:opacity-80 transition-colors"
                href="#"
                style={{ color: "inherit" }}
              >
                Instagram
              </a>
              <a
                className="hover:opacity-80 transition-colors"
                href="#"
                style={{ color: "inherit" }}
              >
                Twitter
              </a>
              <a
                className="hover:opacity-80 transition-colors"
                href="#"
                style={{ color: "inherit" }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Material Icons Font */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
}
