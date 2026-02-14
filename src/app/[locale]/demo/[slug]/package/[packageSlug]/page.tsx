import { notFound } from "next/navigation";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type TourConfig } from "@/components/demo/tour/TourTemplate";
import {
  CarDetailPage,
  type CarDetailConfig,
} from "@/components/demo/car/CarDetailPage";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
    packageSlug: string;
  }>;
}

export default async function PackageDetailPage(props: PageProps) {
  const params = await props.params;
  const { locale, slug, packageSlug } = params;

  // Fetch the demo site config
  const result = await getDemoSiteBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;

  const config = demoSite.config as any;
  const packages = config.packages || [];

  // Find the specific package
  const pkg = packages.find((p: any) => {
    const pSlug =
      p.slug ||
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    return pSlug === packageSlug;
  });

  if (!pkg) {
    notFound();
  }

  // If car template, render CarDetailPage
  if (demoSite.templateId === "car") {
    const carConfig: CarDetailConfig = {
      name: pkg.title || "Luxury Vehicle",
      category: pkg.feature || "Premium",
      description: pkg.itinerary?.[0]?.description || "",
      price: pkg.price || "1,000",
      currency: config.currency || "$",
      heroImage: pkg.image,
      specs: {
        acceleration: "3.2s",
        topSpeed: pkg.duration || "Auto",
        power: "502 HP",
        transmission: pkg.duration || "Auto",
      },
      features: [
        "Premium Sound System",
        "Navigation System",
        "Advanced Safety Features",
        "Luxury Interior Package",
        "Performance Brakes",
      ],
      inclusions: [
        "Comprehensive Insurance Coverage",
        "24/7 Roadside Assistance",
        "Concierge Delivery & Collection",
        "200km Daily Allowance",
      ],
      gallery: pkg.image ? [pkg.image, pkg.image, pkg.image] : [],
      logo: config.logo,
      primaryColor: config.primaryColor,
      websiteName: config.websiteName,
    };

    return <CarDetailPage config={carConfig} />;
  }

  // Otherwise render tour package detail page
  const primaryColor = config.primaryColor || "#1173d4";
  const style = {
    "--tour-primary": primaryColor,
    "--tour-primary-hover": primaryColor,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className="font-sans text-slate-900 bg-white min-h-screen selection:bg-[var(--color-tour-primary)]/20"
    >
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 h-20 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-8 h-full flex items-center justify-between">
          <Link
            href={`/${locale}/demo/${slug}`}
            className="flex items-center gap-2 text-slate-900 hover:text-[var(--color-tour-primary)] transition-colors group"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            {config.logo ? (
              <img
                src={config.logo}
                alt="Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-tour-primary)] text-3xl">
                  travel_explore
                </span>
                <span className="text-xl font-serif font-bold tracking-tight text-slate-900">
                  Voyage
                  <span className="text-[var(--color-tour-primary)]">.</span>
                </span>
              </div>
            )}
          </div>
          <button className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-[var(--color-tour-primary)] hover:text-[var(--color-tour-primary)] transition-all rounded-sm hidden sm:block">
            Inquire Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[60vh] lg:h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={
              pkg.image ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=3242&auto=format&fit=crop"
            }
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-8 w-full pb-16 lg:pb-24">
          <div className="max-w-4xl">
            {pkg.location && (
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                {pkg.location}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium tracking-wide">
              {pkg.duration && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-tour-primary)]">
                    calendar_month
                  </span>
                  {pkg.duration}
                </div>
              )}
              {pkg.feature && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-tour-primary)]">
                    star
                  </span>
                  {pkg.feature}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-3xl font-serif text-slate-900 mb-8">
                About this Journey
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-light mb-12">
                Experience the ultimate in luxury travel with this curated
                package to {pkg.location || "a breathtaking destination"}.
                Designed for the discerning traveler, this itinerary blends
                cultural immersion, exclusive access, and unparalleled comfort.
              </p>

              {/* Highlights */}
              <div className="mb-16">
                <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b border-gray-200 pb-4">
                  Trip Highlights
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Private Chauffeur Service",
                    "Luxury Accommodations",
                    "Exclusive Guided Tours",
                    "Authentic Culinary Experiences",
                    "24/7 Concierge Support",
                    "VIP Airport Fast Track",
                  ].map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="material-symbols-outlined text-[var(--color-tour-primary)] text-sm">
                        check_circle
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b border-gray-200 pb-4">
                    The Journey
                  </h3>
                  <div className="space-y-8 border-l border-gray-200 ml-3 pl-8 relative">
                    {pkg.itinerary.map((day: any, idx: number) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[var(--color-tour-primary)] border-4 border-white shadow-sm"></span>
                        <h4 className="text-lg font-serif font-bold text-slate-900 mb-2">
                          Day {day.day || idx + 1}: {day.title}
                        </h4>
                        <p className="text-slate-600 font-light leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm sticky top-24">
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    Starting From
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-serif text-[var(--color-tour-primary)]">
                      {config.currency || "Rp"}
                      {config.currency && config.currency.length > 1 ? " " : ""}
                      {pkg.price || "0"}
                    </span>
                    <span className="text-gray-500 font-light">
                      / per person
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold text-slate-900">
                      {pkg.duration || "Flexible"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-slate-600">Group Size</span>
                    <span className="font-semibold text-slate-900">
                      Private / Small Group
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-slate-600">Travel Style</span>
                    <span className="font-semibold text-slate-900">Luxury</span>
                  </div>
                </div>

                <button className="w-full bg-[var(--color-tour-primary)] hover:bg-slate-900 text-white py-4 rounded-sm font-bold uppercase tracking-widest transition-colors mb-4 shadow-lg shadow-[var(--color-tour-primary)]/20">
                  Request a Quote
                </button>
                <button className="w-full border border-slate-200 hover:border-slate-900 text-slate-900 py-4 rounded-sm font-bold uppercase tracking-widest transition-all bg-white">
                  Download Brochure
                </button>

                <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                  *Prices are subject to availability and seasonality. Contact
                  our consultants for a personalized proposal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
