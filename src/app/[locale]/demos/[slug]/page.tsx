import TourTemplate from "@/components/demo/tour/TourTemplate";
import type { TourConfig } from "@/components/demo/tour/tour-config";
import { CarTemplate, type CarConfig } from "@/components/demo/car/CarTemplate";
import ZodiacTemplate from "@/components/demo/zodiac/ZodiacTemplate";
import type { ZodiacConfig } from "@/components/demo/zodiac/zodiac-config";
import BakeryTemplate from "@/components/demo/bakery/BakeryTemplate";
import type { BakeryConfig } from "@/components/demo/bakery/bakery-config";
import BeddingTemplate from "@/components/demo/bedding/BeddingTemplate";
import type { BeddingConfig } from "@/components/demo/bedding/bedding-config";
import FortesTemplate from "@/components/demo/fortes/FortesTemplate";
import type { FortesConfig } from "@/components/demo/fortes/fortes-config";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";
import { notFound } from "next/navigation";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;

  // Check template type and render appropriate component
  if (demoSite.templateId === "tour") {
    return <TourTemplate config={demoSite.config as unknown as TourConfig} />;
  }

  if (demoSite.templateId === "car") {
    const carConfig = {
      ...(demoSite.config as unknown as Record<string, unknown>),
      slug,
    } as unknown as CarConfig;
    return <CarTemplate config={carConfig} />;
  }

  if (demoSite.templateId === "zodiac") {
    return (
      <ZodiacTemplate config={demoSite.config as unknown as ZodiacConfig} />
    );
  }

  if (demoSite.templateId === "bakery") {
    return (
      <BakeryTemplate config={demoSite.config as unknown as BakeryConfig} />
    );
  }

  if (demoSite.templateId === "bedding") {
    return (
      <BeddingTemplate config={demoSite.config as unknown as BeddingConfig} />
    );
  }

  if (demoSite.templateId === "fortes") {
    return (
      <FortesTemplate config={demoSite.config as unknown as FortesConfig} />
    );
  }

  return <div>Template not found</div>;
}
