import { notFound } from "next/navigation";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
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

  // Fetch the demo site config
  const result = await getDemoSiteBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const config = demoSite.config as any;
  const packages = config.packages || [];

  // Find the specific package
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
      language: config.language,
    };

    return <CarDetailPage config={carConfig} />;
  }

  // Otherwise render tour package detail page using TourDetailTemplate
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
