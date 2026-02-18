import Link from "next/link";
import { getPackageSlug } from "@/lib/demo-slug";

export interface PackageItem {
  title: string;
  slug?: string;
  image?: string;
  price?: string;
  location?: string;
  duration?: string;
  feature?: string;
  description?: string;
}

interface DemoCategoryListProps {
  locale: string;
  slug: string;
  categoryTitle: string;
  packages: PackageItem[];
  primaryColor?: string;
  currency?: string;
  templateId: "car" | "tour";
}

export function DemoCategoryList({
  locale,
  slug,
  categoryTitle,
  packages,
  primaryColor = "#256af4",
  currency = "$",
  templateId,
}: DemoCategoryListProps) {
  const demoBase = `/${locale}/demo/${slug}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={demoBase}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:opacity-80 mb-8"
          style={{ color: primaryColor }}
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to {templateId === "car" ? "Fleet" : "Destinations"}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-2">
          {categoryTitle}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-12">
          {packages.length} {templateId === "car" ? "vehicle" : "package"}
          {packages.length !== 1 ? "s" : ""} available
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const pkgSlug = getPackageSlug(pkg);
            return (
              <Link
                key={idx}
                href={`${demoBase}/package/${pkgSlug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={
                      pkg.image ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400"
                    }
                  />
                  {pkg.location && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded">
                        {pkg.location}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:opacity-90">
                    {pkg.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {pkg.duration && (
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-base">schedule</span>
                        {pkg.duration}
                      </span>
                    )}
                    {pkg.feature && (
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-base">star</span>
                        {pkg.feature}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span
                      className="font-bold text-lg"
                      style={{ color: primaryColor }}
                    >
                      {currency}
                      {pkg.price || "—"}
                    </span>
                    <span
                      className="text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                      style={{ color: primaryColor }}
                    >
                      View details
                      <span className="material-icons text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
