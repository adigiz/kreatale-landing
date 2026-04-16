import { notFound } from "next/navigation";
import { CarFleetCollectionView } from "@/components/demo/car/CarFleetCollectionView";
import type { CarConfig } from "@/components/demo/car/CarTemplate";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";

export default async function CarFleetCollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result || result.demoSite.templateId !== "car") {
    notFound();
  }

  const config = {
    ...(result.demoSite.config as unknown as CarConfig),
    slug,
  };

  return <CarFleetCollectionView config={config} />;
}
