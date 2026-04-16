import { notFound, redirect } from "next/navigation";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";
import { getDestinationSlug, getPackageSlug } from "@/lib/demo-slug";
import {
  CarDetailPage,
  type CarDetailConfig,
} from "@/components/demo/car/CarDetailPage";
import { BeddingFontWrapper } from "@/components/demo/bedding/BeddingFontWrapper";
import type { BeddingConfig } from "@/components/demo/bedding/bedding-config";
import {
  BeddingProductDetail,
  type BeddingProductLine,
} from "@/components/demo/bedding/BeddingProductDetail";

function beddingProductLine(collectionSlug: string | undefined): BeddingProductLine {
  switch (collectionSlug) {
    case "bath-towels":
      return "towel";
    case "loungewear":
      return "loungewear";
    case "throws":
      return "throw";
    default:
      return "bedding";
  }
}
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

  const result = getStaticDemoBySlug(slug);

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

  // Car template: only bookable vehicles use this route; brand slugs show the marque browse page.
  if (demoSite.templateId === "car") {
    if (dest) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const d = dest as any;
      const defaultFeatures = [
        "Premium audio & connectivity",
        "Navigation & parking aids",
        "Detailed handover & condition report",
        "Fuel policy explained at pickup",
      ];
      const defaultInclusions = [
        "Insurance packages available at checkout",
        "24/7 roadside assistance",
        "Concierge delivery & collection in Greater Los Angeles",
        "200 miles included per rental day",
      ];
      const gallery =
        Array.isArray(d.gallery) && d.gallery.length > 0
          ? (d.gallery as string[])
          : d.image
            ? [d.image as string]
            : [];

      const brandSlug = d.brandSlug as string | undefined;
      const brandPkg =
        brandSlug != null && brandSlug !== ""
          ? packages.find(
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              (p: any) => getPackageSlug(p) === brandSlug,
            )
          : undefined;
      const brandTitle = brandPkg?.title as string | undefined;
      const brandPath =
        brandSlug != null &&
        brandSlug !== "" &&
        brandTitle != null &&
        brandTitle !== ""
          ? `/${locale}/demos/${slug}/${brandSlug}`
          : undefined;

      const carConfig: CarDetailConfig = {
        name: d.name || "Luxury Vehicle",
        category: d.region || "Premium",
        description: d.description || "",
        price: d.price || "1,000",
        currency: config.currency || "$",
        heroImage: d.image,
        specs: d.specs,
        features: (d.features as string[] | undefined) ?? defaultFeatures,
        inclusions: (d.inclusions as string[] | undefined) ?? defaultInclusions,
        gallery,
        logo: config.logo,
        primaryColor: config.primaryColor,
        websiteName: config.websiteName,
        language: config.language,
        demoBasePath: `/${locale}/demos/${slug}`,
        breadcrumbBrand:
          brandPath != null && brandTitle != null
            ? { title: brandTitle, path: brandPath }
            : undefined,
      };
      return <CarDetailPage config={carConfig} />;
    }

    if (pkg) {
      redirect(`/${locale}/demos/${slug}/${getPackageSlug(pkg)}`);
    }

    notFound();
  }

  if (demoSite.templateId === "bedding") {
    if (!dest) notFound();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const d = dest as any;
    const brandSlug = d.brandSlug as string | undefined;
    const brandPkg = packages.find(
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (p: any) => getPackageSlug(p) === brandSlug
    );
    const hero = typeof d.image === "string" && d.image ? d.image : "";
    const gallery =
      Array.isArray(d.gallery) && d.gallery.length > 0
        ? (d.gallery as string[])
        : hero
          ? [hero]
          : [];
    const productSlug =
      typeof d.slug === "string" && d.slug !== ""
        ? d.slug
        : getDestinationSlug(d);
    const line = beddingProductLine(brandSlug);
    const showFromPrice =
      line === "towel" || /bundle/i.test(String(d.name ?? ""));
    return (
      <BeddingFontWrapper>
        <BeddingProductDetail
          config={{
            locale,
            demoSlug: slug,
            websiteName: config.websiteName || "SOJAO",
            primaryColor: config.primaryColor || "#29378c",
            currency: config.currency || "S$",
            chromeConfig: config as BeddingConfig,
            productLine: line,
            showFromPrice,
            product: {
              name: (d.name as string) || "Product",
              slug: productSlug,
              description: (d.description as string) || "",
              price: (d.price as string) || "0",
              image: hero,
              fabricLabel: d.region as string | undefined,
              gallery,
              swatches: d.swatches as string[] | undefined,
            },
            collectionTitle: brandPkg?.title as string | undefined,
            collectionSlug: brandSlug,
          }}
        />
      </BeddingFontWrapper>
    );
  }

  if (demoSite.templateId !== "tour") {
    notFound();
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
    primaryColor: config.primaryColor || "#2747A0",
    accentColor: config.accentColor,
    accentHoverColor: config.accentHoverColor,
    logo: config.logo,
    backUrl: `/${locale}/demos/${slug}`,
  };

  return <TourDetailTemplate config={tourDetailConfig} />;
}
