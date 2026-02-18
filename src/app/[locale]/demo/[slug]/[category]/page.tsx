import { notFound } from "next/navigation";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import { getDestinationSlug, getPackageSlug, slugify } from "@/lib/demo-slug";
import { DemoCategoryList } from "@/components/demo/DemoCategoryList";

/**
 * Category page: list of items for a category.
 * - Car: category = brand slug (e.g. ferrari) → list destinations (cars) in that brand
 * - Tour: category = city/destination slug (e.g. santorini) → list packages for that city
 */
export default async function DemoCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; category: string }>;
}) {
  const { locale, slug, category: categorySlug } = await params;
  const result = await getDemoSiteBySlug(slug);

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
    price?: string;
    location?: string;
    duration?: string;
    feature?: string;
    description?: string;
  }> = [];
  let categoryTitle = categorySlug;

  if (demoSite.templateId === "car") {
    // Car: category = brand slug. List destinations (cars) that belong to this brand.
    const brandPkg = packages.find(
      (p: { slug?: string; title: string }) => getPackageSlug(p) === categorySlug
    );
    if (brandPkg) categoryTitle = brandPkg.title;
    filteredItems = destinations
      .filter(
        (d: { name: string; region?: string }) =>
          slugify(d.name).includes(categorySlug) ||
          (d.region && slugify(d.region) === categorySlug)
      )
      .map((d: { name: string; slug?: string; image?: string; price?: string; region?: string }) => ({
        title: d.name,
        slug: getDestinationSlug(d),
        image: d.image,
        price: d.price,
        location: d.region,
      }));
  } else if (demoSite.templateId === "tour") {
    // Tour: category = city/destination slug. Find destination, then packages for that city.
    const dest = destinations.find(
      (d: { name: string }) => slugify(d.name) === categorySlug
    );
    if (dest) {
      categoryTitle = dest.name;
      filteredItems = packages.filter(
        (p: { location?: string }) =>
          p.location && (slugify(p.location) === categorySlug || p.location === dest.name)
      );
    }
  } else {
    notFound();
  }

  if (filteredItems.length === 0) {
    notFound();
  }

  return (
    <DemoCategoryList
      locale={locale}
      slug={slug}
      categoryTitle={categoryTitle}
      packages={filteredItems}
      primaryColor={config.primaryColor}
      currency={config.currency}
      templateId={demoSite.templateId as "car" | "tour"}
    />
  );
}
