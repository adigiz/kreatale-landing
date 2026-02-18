import { notFound } from "next/navigation";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import { getDestinationSlug, getPackageSlug } from "@/lib/demo-slug";
import {
  CarDetailPage,
  type CarDetailConfig,
} from "@/components/demo/car/CarDetailPage";
import TourDetailTemplate, {
  type TourDetailConfig,
} from "@/components/demo/tour/TourDetailTemplate";

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

  const result = await getDemoSiteBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const config = demoSite.config as any;
  const packages = config.packages || [];
  const destinations = config.destinations || [];

  // Car: item with price is a destination (car). Resolve from destinations first, then packages.
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const destByDataSlug = destinations.find((d: any) => d.slug != null && d.slug !== "" && d.slug === packageSlug);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const destByDerivedSlug = destinations.find((d: any) => getDestinationSlug(d) === packageSlug);
  const dest = destByDataSlug ?? destByDerivedSlug;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const pkgByDataSlug = packages.find((p: any) => p.slug != null && p.slug !== "" && p.slug === packageSlug);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const pkgByDerivedSlug = packages.find((p: any) => getPackageSlug(p) === packageSlug);
  const pkg = pkgByDataSlug ?? pkgByDerivedSlug;

  // Car template: prefer destination (the bookable car with price), fallback to package (brand-level)
  if (demoSite.templateId === "car") {
    const item = dest ?? pkg;
    if (!item) notFound();

    if (dest) {
      const carConfig: CarDetailConfig = {
        name: dest.name || "Luxury Vehicle",
        category: dest.region || "Premium",
        description: dest.description || "",
        price: dest.price || "1,000",
        currency: config.currency || "$",
        heroImage: dest.image,
        specs: {
          acceleration: "3.2s",
          topSpeed: "Auto",
          power: "502 HP",
          transmission: "Auto",
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
        gallery: dest.image ? [dest.image, dest.image, dest.image] : [],
        logo: config.logo,
        primaryColor: config.primaryColor,
        websiteName: config.websiteName,
        language: config.language,
      };
      return <CarDetailPage config={carConfig} />;
    }

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
      language: config.language,
    };
    return <CarDetailPage config={carConfig} />;
  }

  if (!pkg) notFound();

  // Tour: render tour package detail page using TourDetailTemplate
  const language = (config.language as "en" | "id") || "en";
  const currency = language === "id" ? "Rp" : "$";

  // Prepare images array
  const images = pkg.image
    ? [pkg.image, pkg.image, pkg.image] // Use same image for gallery, or could use pkg.gallery if available
    : [];

  // Prepare itinerary with tags
  const itineraryData =
    pkg.itinerary?.map((day: { day?: number; title: string; description?: string }) => ({
      day: day.day,
      title: day.title,
      description: day.description,
      tags: [], // Could extract tags from description or add tags field to package
    })) || [];

  // Prepare features from package or use defaults
  const features = pkg.features || [
    "High-Speed Wi-Fi",
    "Private Pool",
    "Fine Dining",
    "Transfers",
  ];

  const tourDetailConfig: TourDetailConfig = {
    title: pkg.title,
    subtitle: pkg.duration || "7 Days of Luxury",
    location: pkg.location,
    price: pkg.price,
    currency: config.currency || currency,
    image: pkg.image,
    images: images,
    description: pkg.description || pkg.itinerary?.[0]?.description,
    itinerary: itineraryData,
    features: features,
    language: language,
    primaryColor: config.primaryColor || "#1173d4",
    logo: config.logo,
    backUrl: `/${locale}/demo/${slug}`,
  };

  return <TourDetailTemplate config={tourDetailConfig} />;
}
