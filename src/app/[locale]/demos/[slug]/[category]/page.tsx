import { notFound } from "next/navigation";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";
import {
  getDestinationSlug,
  getPackageSlug,
  slugify,
} from "@/lib/demo-slug";
import { DemoCategoryList } from "@/components/demo/DemoCategoryList";
import { CarBrandBrowseView } from "@/components/demo/car/CarBrandBrowseView";
import type { CarConfig } from "@/components/demo/car/CarTemplate";
import { BeddingCollectionPlp } from "@/components/demo/bedding/BeddingCollectionPlp";
import { BeddingFontWrapper } from "@/components/demo/bedding/BeddingFontWrapper";
import type { BeddingConfig } from "@/components/demo/bedding/bedding-config";

/**
 * Category page: list of items for a category.
 * - Car: category = brand slug (e.g. ferrari) → list destinations (cars) in that brand
 * - Tour: category = city/destination slug (e.g. santorini) → list packages for that city
 * - Bedding: category = collection slug → list products (destinations) in that collection
 */
export default async function DemoCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; category: string }>;
}) {
  const { locale, slug, category: categorySlug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const config = demoSite.config as any;
  const packages = config.packages || [];
  const destinations = config.destinations || [];

  let filteredItems: Array<{
    title: string;
    slug?: string;
    image?: string;
    imageSecondary?: string;
    price?: string;
    location?: string;
    duration?: string;
    feature?: string;
    description?: string;
    badgeLabel?: string;
    swatches?: string[];
    showFromPrice?: boolean;
  }> = [];
  let categoryTitle = categorySlug;
  let carBrandHeroImage: string | undefined;
  let beddingCollectionPkg: { collectionIntro?: string } | undefined;

  if (demoSite.templateId === "car") {
    // Car: category = brand slug. List destinations (cars) that belong to this brand.
    const brandPkg = packages.find(
      (p: { slug?: string; title: string }) => getPackageSlug(p) === categorySlug
    );
    if (brandPkg) categoryTitle = brandPkg.title;
    carBrandHeroImage = brandPkg?.image;
    filteredItems = destinations
      .filter((d: { name: string; region?: string; brandSlug?: string }) => {
        if (d.brandSlug) return d.brandSlug === categorySlug;
        const nameSlug = slugify(d.name);
        return (
          nameSlug.includes(categorySlug) ||
          (d.region != null && slugify(d.region) === categorySlug)
        );
      })
      .map((d: { name: string; slug?: string; image?: string; price?: string; region?: string }) => ({
        title: d.name,
        slug: getDestinationSlug(d),
        image: d.image,
        price: d.price,
        location: d.region,
      }));
  } else if (demoSite.templateId === "tour") {
    // Tour: category = city/destination slug. Match data slug or derived slug from name.
    const dest = destinations.find((d: { name: string; slug?: string }) => {
      const fromData =
        d.slug != null && d.slug !== "" && d.slug === categorySlug;
      const derived = getDestinationSlug(d) === categorySlug;
      const legacyName = slugify(d.name) === categorySlug;
      return fromData || derived || legacyName;
    });
    if (dest) {
      categoryTitle = dest.name;
      filteredItems = packages.filter(
        (p: { location?: string }) =>
          p.location && (slugify(p.location) === categorySlug || p.location === dest.name)
      );
    }
  } else if (demoSite.templateId === "bedding") {
    const collectionPkg = packages.find(
      (p: { slug?: string; title: string }) => getPackageSlug(p) === categorySlug
    );
    if (collectionPkg) categoryTitle = collectionPkg.title;
    beddingCollectionPkg = collectionPkg;
    filteredItems = destinations
      .filter(
        (d: { brandSlug?: string }) =>
          d.brandSlug != null && d.brandSlug === categorySlug
      )
      .map(
        (d: {
          name: string;
          slug?: string;
          image?: string;
          price?: string;
          region?: string;
          badgeLabel?: string;
          swatches?: string[];
          gallery?: string[];
        }) => {
          const g = Array.isArray(d.gallery) ? d.gallery : [];
          const secondary = g.length > 1 && g[1] ? g[1] : undefined;
          const showFromPrice = !/(Hand Towel|Face Towel Pair)\s*$/i.test(d.name);
          return {
            title: d.name,
            slug: getDestinationSlug(d),
            image: d.image,
            imageSecondary: secondary,
            price: d.price,
            location: d.region,
            badgeLabel: d.badgeLabel,
            swatches: d.swatches,
            showFromPrice,
          };
        }
      );
  } else {
    notFound();
  }

  if (filteredItems.length === 0) {
    notFound();
  }

  if (demoSite.templateId === "car") {
    const carConfig: CarConfig = {
      ...config,
      slug,
    };
    return (
      <CarBrandBrowseView
        config={carConfig}
        brandTitle={categoryTitle}
        vehicles={filteredItems}
        heroImage={carBrandHeroImage ?? filteredItems[0]?.image}
      />
    );
  }

  if (demoSite.templateId === "bedding") {
    const beddingConfig = config as BeddingConfig;
    const plpProducts = filteredItems
      .filter((item) => item.slug != null && item.slug !== "")
      .map((item) => ({
        title: item.title,
        slug: item.slug as string,
        image: item.image,
        imageSecondary: item.imageSecondary,
        price: item.price,
        fabricLabel: item.location,
        badgeLabel: item.badgeLabel,
        swatches: item.swatches,
        showFromPrice: item.showFromPrice !== false,
      }));
    return (
      <BeddingFontWrapper>
        <BeddingCollectionPlp
          config={beddingConfig}
          locale={locale}
          demoSlug={slug}
          categorySlug={categorySlug}
          collectionTitle={categoryTitle}
          collectionIntro={beddingCollectionPkg?.collectionIntro}
          products={plpProducts}
        />
      </BeddingFontWrapper>
    );
  }

  return (
    <DemoCategoryList
      locale={locale}
      slug={slug}
      categoryTitle={categoryTitle}
      packages={filteredItems}
      primaryColor={config.primaryColor}
      currency={config.currency}
      templateId={demoSite.templateId as "car" | "tour" | "bedding"}
    />
  );
}
