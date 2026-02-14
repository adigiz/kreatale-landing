import TourTemplate, {
  type TourConfig,
} from "@/components/demo/tour/TourTemplate";
import { CarTemplate, type CarConfig } from "@/components/demo/car/CarTemplate";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import { notFound } from "next/navigation";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const result = await getDemoSiteBySlug(slug);

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
      ...(demoSite.config as any),
      slug,
    } as unknown as CarConfig;
    return <CarTemplate config={carConfig} />;
  }

  return <div>Template not found</div>;
}
