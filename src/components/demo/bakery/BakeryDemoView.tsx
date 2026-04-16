"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import type { BakeryConfig } from "./bakery-config";
import { DUMMY_BAKERY_CONFIG } from "@/lib/cms/dummy/bakery";

const coral = "bg-[#e07a5f] hover:bg-[#c96a52] text-white";
const greenTitle = "text-[#2d6a4f]";
const muted = "text-neutral-600";

/** Recipe & category art from bromabakery.com (homepage / index HTML, wp-content/uploads). */
const IMG = {
  hero: "https://bromabakery.com/wp-content/uploads/2026/03/Strawberry-Crunch-Cake-6-1067x1494.jpg",
  carrotBanana:
    "https://bromabakery.com/wp-content/uploads/2026/03/Carrot-Cake-Banana-Bread-5-628x879.jpg",
  lemonCookies:
    "https://bromabakery.com/wp-content/uploads/2026/03/Frosted-Lemon-Sugar-Cookies-5-628x879.jpg",
  thinMints:
    "https://bromabakery.com/wp-content/uploads/2020/01/Healthy-Thin-Mints-2-613x920.jpg",
  carrotBest:
    "https://bromabakery.com/wp-content/uploads/2020/02/The-Best-Carrot-Cake-4-613x920.jpg",
  carrotCookies:
    "https://bromabakery.com/wp-content/uploads/2023/04/Domino-Broma-Easter-Carrot-Cake-Cookies-2-1-614x920.jpg",
  carrotCardamom:
    "https://bromabakery.com/wp-content/uploads/2020/09/Cardamom-Carrot-Cake-5-613x920.jpg",
  carrotMuffins:
    "https://bromabakery.com/wp-content/uploads/2023/02/Carrot-Cake-Muffins-4-614x920.jpg",
  catCookies:
    "https://bromabakery.com/wp-content/uploads/2022/02/Brown-Butter-Oatmeal-Chocolate-Chip-Cookies-2-613x920.jpg",
  catCake:
    "https://bromabakery.com/wp-content/uploads/2020/07/Zucchini-Bread-Cake-3-400x600.jpg",
  catMuffins:
    "https://bromabakery.com/wp-content/uploads/2020/03/Blueberry-Muffins-2-613x920.jpg",
  catPie:
    "https://bromabakery.com/wp-content/uploads/2020/07/Homemade-Cherry-Pie-3-400x600.jpg",
  catBrownies:
    "https://bromabakery.com/wp-content/uploads/2022/02/Nutella-Brownies-2-613x920.jpg",
  catCheese:
    "https://bromabakery.com/wp-content/uploads/2021/05/How-to-Make-The-Perfect-Cheesecake-14-613x920.jpg",
  catIce:
    "https://bromabakery.com/wp-content/uploads/2020/05/chocolate-oreo-ice-cream-3-613x920.jpg",
  catRecipeIndex:
    "https://bromabakery.com/wp-content/uploads/2020/06/Blender-Chocolate-Mousse-6-613x920.jpg",
  founder:
    "https://bromabakery.com/wp-content/uploads/2022/02/Sarah-Broma-Headshot.jpg",
  cookbook:
    "https://bromabakery.com/wp-content/uploads/2024/03/cookbook-628x740.png",
  craving1:
    "https://bromabakery.com/wp-content/uploads/2020/05/peanut-buter-pretzel-caramel-bars-5-613x920.jpg",
  craving2:
    "https://bromabakery.com/wp-content/uploads/2019/08/Cosmic-Brownies-3-613x920.jpg",
  craving3:
    "https://bromabakery.com/wp-content/uploads/2023/05/Cherry-Galette-5-614x920.jpg",
  craving4:
    "https://bromabakery.com/wp-content/uploads/2022/02/Nutella-Brownies-2-613x920.jpg",
  craving5:
    "https://bromabakery.com/wp-content/uploads/2023/05/Lemon-Crinkle-Cookies-6-614x920.jpg",
  craving6:
    "https://bromabakery.com/wp-content/uploads/2019/08/Cinnamon-Roll-Blondies-2-613x920.jpg",
  craving7:
    "https://bromabakery.com/wp-content/uploads/2022/08/Single-Serve-Peanut-Butter-Cookie-400x600.jpg",
  craving8:
    "https://bromabakery.com/wp-content/uploads/2019/12/Healthier-Cherry-Cheesecake-7-400x600.jpg",
  top1:
    "https://bromabakery.com/wp-content/uploads/2020/03/The-Best-Chocolate-Chip-Cookies-6-613x920.jpg",
  top2:
    "https://bromabakery.com/wp-content/uploads/2022/01/Gluten-Free-Vegan-Chocolate-Cake-4-613x920.jpg",
  top3:
    "https://bromabakery.com/wp-content/uploads/2023/03/Browned-Butter-Brownies-2-614x920.jpg",
  kitchen1:
    "https://bromabakery.com/wp-content/uploads/2024/07/Apple-Fritter-Cookies-5-1067x1600.jpg",
  kitchen2:
    "https://bromabakery.com/wp-content/uploads/2019/08/Cosmic-Brownies-3-1067x1600.jpg",
  kitchen3:
    "https://bromabakery.com/wp-content/uploads/2021/03/Banana-Bread-Chocolate-Chip-Cookies-3-1067x1600.jpg",
  kitchen4:
    "https://bromabakery.com/wp-content/uploads/2020/09/Apple-Cider-Donut-Bundt-Cake-8-1067x1600.jpg",
  seasonal1:
    "https://bromabakery.com/wp-content/uploads/2022/03/Double-Chocolate-Cookies-6-613x920.jpg",
  seasonal2:
    "https://bromabakery.com/wp-content/uploads/2021/05/How-to-Make-The-Perfect-Cheesecake-14-613x920.jpg",
  seasonal3:
    "https://bromabakery.com/wp-content/uploads/2026/01/Toffee-Chocolate-Chunk-Cookies-4-628x879.jpg",
  seasonal4:
    "https://bromabakery.com/wp-content/uploads/2020/12/Scotcheroos-2-613x920.jpg",
  seasonal5:
    "https://bromabakery.com/wp-content/uploads/2021/01/Healthy-Banana-Bread-3-613x920.jpg",
  seasonal6:
    "https://bromabakery.com/wp-content/uploads/2014/11/PMint-Brownies-5-613x920.jpg",
};

function ReadNow({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${coral} ${className}`}
    >
      Read Now
    </span>
  );
}

/** Hero primary CTA: light pink pill, dark text (Broma-style). */
function HeroReadNow({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#f2d4dc] px-7 py-2.5 text-sm font-medium tracking-wide text-neutral-900 transition-colors hover:bg-[#ebc8d2] ${className}`}
    >
      read now
    </span>
  );
}

const HERO_SIDE_RECIPES = [
  {
    cat: "Quick Breads",
    title: "Carrot Cake Banana Bread",
    img: IMG.carrotBanana,
  },
  {
    cat: "Cookies",
    title: "Frosted Lemon Sugar Cookies",
    img: IMG.lemonCookies,
  },
  {
    cat: "Cookies",
    title: "Homemade Thin Mints",
    img: IMG.thinMints,
  },
] as const;

function resolveBakeryDisplay(config?: BakeryConfig) {
  const d = DUMMY_BAKERY_CONFIG;
  const m = { ...d, ...config };
  return {
    ...m,
    websiteName: m.websiteName?.trim() || d.websiteName,
    heroKicker: m.heroKicker?.trim() || d.heroKicker,
    heroTitle: m.heroTitle?.trim() || d.heroTitle,
    heroBody:
      m.heroBody?.trim() ||
      m.heroSubtitle?.trim() ||
      d.heroBody,
    heroImage: m.heroImage?.trim() || d.heroImage,
  };
}

export function BakeryDemoView({ config }: { config?: BakeryConfig }) {
  const c = resolveBakeryDisplay(config);
  const heroSrc = (c.heroImage || IMG.hero).trim();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navMain = [
    { label: "Recipes", href: "#recipes" },
    { label: "Cookbook", href: "#cookbook" },
    { label: "YouTube", href: "#" },
    { label: "About", href: "#founder" },
    { label: "Newsletter", href: "#newsletter" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf7f2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="#"
            className="bakery-display text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          >
            {c.websiteName || "Broma Bakery"}
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wide text-neutral-800 lg:flex">
            {navMain.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-[#e07a5f] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="p-1 text-neutral-700 hover:text-[#e07a5f]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="p-2 text-neutral-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-neutral-800"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/5 bg-[#faf7f2] px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium uppercase tracking-wide">
              {navMain.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero — copy | tall hero shot | stacked recipe cards (Broma layout) */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-8 xl:gap-x-12">
            <div className="flex flex-col justify-center lg:col-span-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {c.heroKicker}
              </p>
              <h1 className="bakery-section-title text-4xl leading-[1.08] text-neutral-900 sm:text-5xl lg:text-[2.75rem] lg:leading-[1.06]">
                {c.heroTitle}
              </h1>
              <p className={`mt-5 text-base leading-relaxed text-neutral-800 sm:text-[17px]`}>
                {c.heroBody}
              </p>
              <Link href="#" className="mt-8 w-fit">
                <HeroReadNow />
              </Link>
            </div>

            <div className="relative min-h-[320px] w-full overflow-hidden rounded-sm lg:col-span-5 lg:min-h-[520px] xl:min-h-[580px]">
              <Image
                src={heroSrc}
                alt={c.heroTitle || "Featured recipe"}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            </div>

            <div
              id="recipes"
              className="flex flex-col justify-center gap-6 sm:gap-7 lg:col-span-4"
            >
              {HERO_SIDE_RECIPES.map((item) => (
                <Link
                  key={item.title}
                  href="#"
                  className="group flex gap-3 sm:gap-4"
                >
                  <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sm sm:h-[100px] sm:w-[100px]">
                    <Image
                      src={item.img}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="100px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:text-[11px]">
                      {item.cat}
                    </span>
                    <span className="bakery-display mt-1.5 text-base font-semibold leading-snug text-neutral-900 sm:text-lg">
                      {item.title}
                    </span>
                    <span className="mt-2 text-xs font-normal text-neutral-900">
                      read now →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* eat your vegetables */}
        <section className="bg-[#e8f0ea] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`bakery-section-title mb-12 text-center text-4xl italic sm:text-5xl ${greenTitle}`}
            >
              eat your vegetables.
            </h2>
            <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-[#2d6a4f]/80">
              carrot cake season
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  cat: "Cakes & Cupcakes",
                  title: "The Best Carrot Cake Recipe",
                  img: IMG.carrotBest,
                },
                {
                  cat: "Cookies",
                  title: "Carrot Cake Cookies",
                  img: IMG.carrotCookies,
                },
                {
                  cat: "Cakes & Cupcakes",
                  title: "Cardamom Spiced Carrot Cake",
                  img: IMG.carrotCardamom,
                },
                {
                  cat: "Muffins",
                  title: "Carrot Cake Muffins",
                  img: IMG.carrotMuffins,
                },
              ].map((item) => (
                <Link key={item.title} href="#" className="group block">
                  <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-sm shadow">
                    <Image
                      src={item.img}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase text-[#e07a5f]">
                    {item.cat}
                  </p>
                  <p className="bakery-display mt-1 text-xl font-medium text-neutral-900">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
            <p className="mt-12 text-center text-sm font-semibold uppercase tracking-widest text-[#2d6a4f]/80">
              carrot cake season
            </p>
          </div>
        </section>

        {/* Browse categories */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`bakery-section-title mb-10 text-center text-3xl sm:text-4xl ${greenTitle}`}
            >
              browse categories
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {[
                { label: "Cookies", img: IMG.catCookies },
                { label: "Cakes", img: IMG.catCake },
                { label: "Muffins", img: IMG.catMuffins },
                { label: "Pies & Tarts", img: IMG.catPie },
                { label: "Brownies", img: IMG.catBrownies },
                { label: "Cheesecake", img: IMG.catCheese },
                { label: "Ice Cream", img: IMG.catIce },
                { label: "Search Recipe Index", img: IMG.catRecipeIndex },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="#"
                  className="group relative aspect-square overflow-hidden rounded-sm"
                >
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 bakery-display text-lg font-medium text-white drop-shadow">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section
          id="founder"
          className="border-t border-black/5 bg-[#faf7f2] py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-sm shadow-lg">
              <Image
                src={IMG.founder}
                alt="Sarah in the kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e07a5f]">
                founder
              </p>
              <p className="bakery-section-title mt-2 text-sm font-normal uppercase tracking-wide text-neutral-500">
                of broma
              </p>
              <h2 className="bakery-section-title mt-6 text-4xl text-neutral-900">
                Hi I’m Sarah. Welcome 🙂
              </h2>
              <p className={`mt-6 text-lg leading-relaxed ${muted}`}>
                Hi and welcome! As the name suggests, Broma is a (mostly) baking
                blog that I started way back in 2010. At that time I was a
                college student who equally missed having a creative outlet and
                her mom’s baked goods. So I decided to chronicle my favorite
                recipes on a little blog I called Broma Bakery.
              </p>
              <div className="mt-8">
                <Link href="#">
                  <ReadNow />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cookbook */}
        <section id="cookbook" className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm shadow-xl">
              <Image
                src={IMG.cookbook}
                alt="Sweet tooth cookbook"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2
                className={`bakery-section-title text-4xl sm:text-5xl ${greenTitle}`}
              >
                my cookbook is
                <br />
                here!
              </h2>
              <h3 className="bakery-display mt-6 text-2xl text-neutral-900">
                get it now at these links!
              </h3>
              <p className={`mt-4 text-lg ${muted}`}>
                100 stunning, delicious, easy recipes
                <br />
                for everyone who saves room for dessert
              </p>
              <div className="mt-8">
                <Link href="#">
                  <span
                    className={`inline-block rounded-sm px-8 py-3 text-sm font-bold uppercase tracking-wide ${coral}`}
                  >
                    order now
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by craving */}
        <section className="bg-[#faf7f2] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`bakery-section-title mb-10 text-center text-3xl sm:text-4xl ${greenTitle}`}
            >
              browse by craving
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { tag: "salty-sweet", img: IMG.craving1 },
                { tag: "nostalgic", img: IMG.craving2 },
                { tag: "fruity", img: IMG.craving3 },
                { tag: "indulgent", img: IMG.craving4 },
                { tag: "tart", img: IMG.craving5 },
                { tag: "spiced", img: IMG.craving6 },
                { tag: "nutty", img: IMG.craving7 },
                { tag: "healthier", img: IMG.craving8 },
              ].map((item) => (
                <Link
                  key={item.tag}
                  href="#"
                  className="group relative aspect-[5/3] overflow-hidden rounded-sm"
                >
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
                  <span className="absolute bottom-4 left-4 bakery-display text-2xl capitalize text-white">
                    {item.tag}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-10 text-center">
              <Link
                href="#"
                className="text-sm font-bold uppercase tracking-wide text-[#2d6a4f] underline decoration-2 underline-offset-4"
              >
                Search Recipe Index
              </Link>
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section
          id="newsletter"
          className="bg-[#f5e6e8] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2
              className={`bakery-section-title text-3xl sm:text-4xl ${greenTitle}`}
            >
              craving more?
            </h2>
            <h3 className="bakery-display mt-4 text-xl uppercase tracking-wide text-neutral-800">
              JOIN OUR COMMUNITY
            </h3>
            <p className={`mt-4 text-base ${muted}`}>
              Never miss a recipe again! Be the first to know about new
              recipes, merch drops, insider baking tips, and all things Broma.
            </p>
            <form
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Name *"
                className="rounded-sm border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#e07a5f]/40"
                aria-label="Name"
              />
              <input
                type="email"
                placeholder="Email *"
                className="rounded-sm border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#e07a5f]/40"
                aria-label="Email"
              />
              <button
                type="submit"
                className={`rounded-sm px-8 py-3 text-sm font-bold uppercase tracking-wide ${coral}`}
              >
                submit
              </button>
            </form>
          </div>
        </section>

        {/* Top recipes */}
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`bakery-section-title text-center text-3xl sm:text-4xl ${greenTitle}`}
            >
              top recipes of all time
            </h2>
            <p className="mt-6 text-center">
              <Link
                href="#"
                className="text-sm font-bold uppercase tracking-wide text-[#2d6a4f] underline decoration-2 underline-offset-4"
              >
                browse all recipes
              </Link>
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  cat: "Cookies",
                  title: "The BEST Chocolate Chip Cookies",
                  img: IMG.top1,
                },
                {
                  cat: "Cakes & Cupcakes",
                  title: "Vegan Gluten Free Chocolate Cake",
                  img: IMG.top2,
                },
                {
                  cat: "Brownies",
                  title: "Brown Butter Brownies",
                  img: IMG.top3,
                },
              ].map((item) => (
                <Link key={item.title} href="#" className="group block text-center">
                  <div className="relative mx-auto mb-4 aspect-square max-w-sm overflow-hidden rounded-sm shadow">
                    <Image
                      src={item.img}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase text-[#e07a5f]">
                    {item.cat}
                  </p>
                  <p className="bakery-display mt-2 text-xl font-medium text-neutral-900">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* In our kitchen */}
        <section className="border-t border-black/5 bg-[#faf7f2] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`bakery-section-title mb-12 text-center text-3xl sm:text-4xl ${greenTitle}`}
            >
              in our kitchen
            </h2>
            <div className="grid gap-10 sm:grid-cols-2">
              {[
                {
                  cat: "Cookies",
                  title: "Apple Fritter Cookies",
                  body: "It’s apple season! These soft apple fritter cookies are bursting with fresh, juicy apples and finished off with a salty-sweet maple glaze.",
                  img: IMG.kitchen1,
                },
                {
                  cat: "Brownies",
                  title: "Copycat Cosmic Brownies",
                  body: "These fudgy Cosmic Brownies will take you back to your childhood and those chocolatey intergalactic brownies in your lunchbox.",
                  img: IMG.kitchen2,
                },
                {
                  cat: "Cookies",
                  title: "Banana Bread Chocolate Chip Cookies",
                  body: "All the delicious flavor of banana bread in a soft, chewy, moist as can be banana chocolate chip cookie.",
                  img: IMG.kitchen3,
                },
                {
                  cat: "Cakes & Cupcakes",
                  title: "Apple Cider Donut Bundt Cake",
                  body: "Take all your favorite flavors of an apple cider donut and make them into an easy bundt cake.",
                  img: IMG.kitchen4,
                },
              ].map((item) => (
                <Link key={item.title} href="#" className="group flex flex-col sm:flex-row gap-4">
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm shadow sm:w-52">
                    <Image
                      src={item.img}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 208px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#e07a5f]">
                      {item.cat}
                    </p>
                    <p className="bakery-display mt-2 text-2xl font-medium text-neutral-900">
                      {item.title}
                    </p>
                    <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
                      {item.body}
                    </p>
                    <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-[#2d6a4f]">
                      View Recipe →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal grid */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="bakery-section-title text-center text-3xl text-neutral-900 sm:text-4xl">
              all the recipes you
              <br />
              need this season
            </h2>
            <div className="mt-10 text-center">
              <Link href="#" className={`inline-block text-sm font-bold uppercase ${coral} rounded-sm px-6 py-2.5`}>
                More Recipes
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { t: "Double Chocolate Chip Cookies", cat: "Cookies", img: IMG.seasonal1 },
                { t: "Perfect Cheesecake", cat: "Cheesecake", img: IMG.seasonal2 },
                { t: "Millionaire Toffee Chocolate Chunk Cookies", cat: "Cookies", img: IMG.seasonal3 },
                { t: "Quick and Easy Scotcheroos", cat: "Bars", img: IMG.seasonal4 },
                { t: "Healthy Banana Bread", cat: "Breakfast", img: IMG.seasonal5 },
                { t: "Peppermint Bark Brownies", cat: "Brownies", img: IMG.seasonal6 },
              ].map((item) => (
                <Link key={item.t} href="#" className="group block">
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-sm">
                    <Image
                      src={item.img}
                      alt=""
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 16vw"
                    />
                  </div>
                  <p className="text-[10px] font-semibold uppercase text-[#e07a5f]">
                    {item.cat}
                  </p>
                  <p className="bakery-display text-sm font-medium leading-snug text-neutral-900 line-clamp-2">
                    {item.t}
                  </p>
                </Link>
              ))}
            </div>
            <p className="mt-10 text-center">
              <Link
                href="#"
                className="text-sm font-bold uppercase tracking-wide text-[#2d6a4f] underline decoration-2 underline-offset-4"
              >
                View All Recipes
              </Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-[#2a2a2a] py-14 text-neutral-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="bakery-display text-xl text-white">
              {c.websiteName || "Broma Bakery"}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["More", "About", "Contact", "Shop", "Privacy"].map((x) => (
                <li key={x}>
                  <Link href="#" className="hover:text-white">
                    {x}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Recipes
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Breads",
                "Breakfast",
                "Desserts",
                "Drinks",
                "Savory",
              ].map((x) => (
                <li key={x}>
                  <Link href="#" className="hover:text-white">
                    {x}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Social
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Instagram",
                "Tiktok",
                "Youtube",
                "Pinterest",
                "Facebook",
              ].map((x) => (
                <li key={x}>
                  <Link href="#" className="hover:text-white">
                    {x}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Craving More?
            </p>
            <p className="mt-4 text-sm text-neutral-400">
              Demo layout only — swap copy and images when you go live.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-8 text-center text-xs text-neutral-500 sm:px-6 lg:px-8">
          Copyright © {new Date().getFullYear()}{" "}
          {c.websiteName || "Broma Bakery"}. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
