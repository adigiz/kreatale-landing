"use client";

import React from "react";

export default function TourDetailTemplate() {
  return (
    <div className="bg-tour-background-light dark:bg-tour-background-dark font-tour-sans text-gray-800 dark:text-gray-100 antialiased overflow-hidden h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full z-50 bg-white/95 dark:bg-tour-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex-none sticky top-0">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          <button className="p-2 -ml-2 text-gray-500 hover:text-tour-primary transition-colors">
            <span className="material-icons">arrow_back</span>
          </button>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-lg font-bold tracking-tight text-tour-navy-dark dark:text-white">
              Voyage<span className="text-tour-primary">.</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-tour-primary transition-colors">
              <span className="material-icons">favorite_border</span>
            </button>
            <button className="p-2 -mr-2 text-gray-500 hover:text-tour-primary transition-colors">
              <span className="material-icons">share</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area: Split Screen */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-[1920px] mx-auto">
        {/* Left Pane: Visual Gallery (Scrollable) */}
        <section className="w-full lg:w-1/2 lg:h-full h-[45vh] flex-none relative bg-gray-900 lg:overflow-y-auto no-scrollbar group">
          {/* Image 1: Hero */}
          <img
            alt="Scenic view of Santorini architecture at sunset"
            className="w-full h-full object-cover transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyU6OxNe7z0NQ7uEX7VvsNZF2iAhNR8klSv7Vct6lzgoErV9IXpp33UQQVtwXMJyp_y2uMOK5fLmiacjxT3k4MSaHd90rg_QMcxnBoOXrnlnSj_3Ughj02WxucNKrhj0xO8etNtBcKs_NoANyJtf9z-nSQw__45j5-iLdZhfx2ZEzb9dFg0XK98xle8U3SHXmWgqTm4wBU9dLjXUm730YIb09gqaQ1dk85n4zis4rQxwm7sz0R3_hWn4lZlLyLulVLkE3kmRoEH4Y"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 lg:hidden"></div>
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 dark:bg-tour-surface-dark/90 text-tour-navy-dark dark:text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-sm">
              Featured
            </span>
          </div>
          {/* Mobile Dots */}
          <div className="absolute bottom-4 right-4 flex gap-1 lg:hidden">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>

          {/* Desktop Only Images */}
          <div className="hidden lg:block">
            {/* Image 2: Interior */}
            <div className="h-[60vh] w-full relative mt-1">
              <img
                alt="Luxury hotel room interior with sea view"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKj5ZVb4T5xEiHYTrSd1FtMwsQjtD0MXDxRhio51c3PPeIuAZ-0nFozR0f3-nefQqQ0sL0ASCLnVhpUpSaHjjIm8ZPsBDjT_d0ENR7lV81LiEAXPrhwoAFPYZ1pobP1908hXsX_UsQLaujrMmFrGvAX7ycTHkPNTM76Q4NX23yyhWs--67bWpc9ab5OcuPFDhq2-ge6oNkOX1ffZgX3uWqcdjtyu-EQEou6_6-mDauqsnM4EL2YsdG6oPI6I0KmGJdhHJ7nuhjZ7Q"
              />
            </div>
            {/* Image 3: Food */}
            <div className="h-[60vh] w-full relative mt-1">
              <img
                alt="Fine dining table setup with wine by the ocean"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIhnr5zKZciLL26qeAUY7kX2XbNC2aIbceu1LH-aZr0IXLQiOQpnViFB30v6-VrTkWC9jwqt6op1st0DE84u1oBB9_eZDdrg3tR4C_dnZjm4jvr0dDn00rCnZ5mMLl3AuOsbQmSxrEGEKXYvGU19B1_BDOXdTVvkiqCxmN_qMcgH_iGIxQTHrcX3N2Xrx9faeIhSCC8hDgj_E1X1WtgqyEjlaIX-zES871BmYpf2Nb8VcMAHogK2dw8UTp1lDst2KwRgyo1GJKclA"
              />
            </div>
          </div>
        </section>

        {/* Right Pane: Content & Booking (Sticky/Scrollable) */}
        <section className="w-full lg:w-1/2 h-full bg-tour-background-light dark:bg-tour-background-dark flex flex-col relative z-10 lg:border-l border-gray-200 dark:border-gray-800 -mt-6 lg:mt-0 rounded-t-3xl lg:rounded-none shadow-xl lg:shadow-none overflow-hidden">
          <div className="w-full flex justify-center pt-3 pb-1 lg:hidden bg-tour-background-light dark:bg-tour-background-dark">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
          {/* Scrollable Content Container */}
          <div
            className="flex-1 overflow-y-auto px-6 pb-32 pt-2 lg:p-12"
            id="content-scroll"
          >
            {/* Breadcrumbs */}
            <nav className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider font-semibold">
              <a href="#" className="hover:text-tour-primary">
                Europe
              </a>
              <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
              <a href="#" className="hover:text-tour-primary">
                Greece
              </a>
              <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-white">
                Luxury Escapes
              </span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight max-w-xl">
                  Aegean Odyssey: <br />
                  <span className="text-tour-primary bg-clip-text text-transparent bg-gradient-to-r from-tour-primary to-blue-400">
                    7 Days of Luxury
                  </span>
                </h1>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    $4,500
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per person
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-yellow-500 text-lg">
                    star
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    4.96
                  </span>
                  <span className="text-gray-400">(128 reviews)</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-tour-primary text-lg">
                    schedule
                  </span>
                  <span>7 Days, 6 Nights</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-tour-primary text-lg">
                    flight_takeoff
                  </span>
                  <span>Santorini & Mykonos</span>
                </div>
              </div>
            </header>
            <hr className="border-gray-200 dark:border-gray-800 mb-10" />

            {/* Overview */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Experience Overview
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Immerse yourself in the sapphire waters and whitewashed
                architecture of the Cyclades. This curated journey combines the
                vibrant nightlife of Mykonos with the romantic serenity of
                Santorini. Enjoy private yacht charters, exclusive wine tastings
                in volcanic vineyards, and dining experiences reserved only for
                the few.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white dark:bg-tour-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="material-icons text-tour-primary text-base">
                    wifi
                  </span>{" "}
                  Wi-Fi
                </span>
                <span className="px-4 py-2 bg-white dark:bg-tour-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="material-icons text-tour-primary text-base">
                    pool
                  </span>{" "}
                  Private Pool
                </span>
                <span className="px-4 py-2 bg-white dark:bg-tour-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="material-icons text-tour-primary text-base">
                    restaurant
                  </span>{" "}
                  Breakfast Included
                </span>
                <span className="px-4 py-2 bg-white dark:bg-tour-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="material-icons text-tour-primary text-base">
                    local_taxi
                  </span>{" "}
                  Transfers
                </span>
              </div>
            </div>

            {/* Itinerary */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Daily Itinerary
                </h3>
                <button className="text-sm font-medium text-tour-primary hover:text-tour-primary-hover underline underline-offset-4">
                  Download PDF
                </button>
              </div>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-0 left-[23px] w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                {/* Day 1 */}
                <div className="relative pl-12 pb-12 group">
                  {/* Dot */}
                  <div className="absolute left-[17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-tour-primary bg-white dark:bg-tour-background-dark z-10 group-hover:bg-tour-primary transition-colors"></div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-tour-primary transition-colors cursor-pointer">
                    Day 1: Arrival & Welcome Champagne
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    Private transfer from JTR Airport to your cliffside suite in
                    Oia. Evening welcome reception with local wines and a sunset
                    viewing from the private terrace.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">bed</span> 5-Star
                      Accommodation
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">
                        dinner_dining
                      </span>{" "}
                      Dinner Included
                    </span>
                  </div>
                </div>
                {/* Day 2 */}
                <div className="relative pl-12 pb-12 group">
                  <div className="absolute left-[17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-tour-primary bg-white dark:bg-tour-background-dark z-10 group-hover:bg-tour-primary transition-colors"></div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-tour-primary transition-colors cursor-pointer">
                    Day 2: Catamaran Cruise
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    Embark on a luxury catamaran for a day sailing around the
                    caldera. Stops at the Red Beach and White Beach for swimming
                    and snorkeling. Fresh BBQ lunch served on board.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">sailing</span> 6
                      Hours
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">
                        lunch_dining
                      </span>{" "}
                      Lunch Included
                    </span>
                  </div>
                </div>
                {/* Day 3 */}
                <div className="relative pl-12 pb-12 group">
                  <div className="absolute left-[17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-tour-primary bg-white dark:bg-tour-background-dark z-10 group-hover:bg-tour-primary transition-colors"></div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-tour-primary transition-colors cursor-pointer">
                    Day 3: Private Vineyard Tour
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    Explore the unique volcanic vineyards of Santorini. A guided
                    tour with a sommelier through three award-winning wineries,
                    tasting the indigenous Assyrtiko grape.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">wine_bar</span> 3
                      Wineries
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">
                        directions_car
                      </span>{" "}
                      Private Driver
                    </span>
                  </div>
                </div>
                {/* Day 4-7 Summary */}
                <div className="relative pl-12 group">
                  <div className="absolute left-[17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-tour-background-dark z-10"></div>
                  <h4 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">
                    Days 4-7: Mykonos & Departure
                  </h4>
                  <button className="text-tour-primary text-sm font-semibold hover:underline">
                    View Full Itinerary
                  </button>
                </div>
              </div>
            </div>

            {/* Important Info Accordion (Visual Only) */}
            <div className="space-y-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-tour-surface-darker hover:bg-gray-100 dark:hover:bg-tour-surface-dark transition-colors">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                    Cancellation Policy
                  </span>
                  <span className="material-icons text-gray-400 text-lg">
                    expand_more
                  </span>
                </button>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-tour-surface-darker hover:bg-gray-100 dark:hover:bg-tour-surface-dark transition-colors">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                    Visa Requirements
                  </span>
                  <span className="material-icons text-gray-400 text-lg">
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Booking Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-tour-surface-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between gap-6">
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">
                  Total Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    $4,500
                  </span>
                  <span className="text-sm text-gray-500">/ person</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <button className="hidden lg:flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-tour-surface-darker transition-colors">
                  <span className="material-icons">favorite_border</span>
                </button>
                <button className="hidden lg:flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-tour-surface-darker transition-colors">
                  <span className="material-icons">share</span>
                </button>
                <button className="bg-tour-primary hover:bg-tour-primary-hover text-white px-8 py-3.5 rounded-lg font-bold shadow-lg shadow-tour-primary/30 transition-all transform active:scale-95 flex items-center gap-2 flex-1 sm:flex-none justify-center">
                  <span>Book Now</span>
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 w-full bg-white dark:bg-tour-background-dark border-t border-gray-100 dark:border-gray-800 p-4 z-50 flex justify-between items-center shadow-sticky-footer lg:hidden">
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            Total (7 Days)
          </p>
          <p className="text-xl font-bold text-tour-navy-dark dark:text-white">
            $4,500
          </p>
        </div>
        <button className="bg-tour-primary text-white px-6 py-3 rounded-sm font-bold text-sm shadow-lg shadow-tour-primary/20">
          Reserve
        </button>
      </div>
    </div>
  );
}
