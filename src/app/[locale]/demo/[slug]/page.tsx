import TourTemplate, {
  type TourConfig,
} from "@/components/demo/tour/TourTemplate";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import { notFound } from "next/navigation";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const demoSite = await getDemoSiteBySlug(slug);

  if (!demoSite) {
    notFound();
  }

  // Check template type and render appropriate component
  if (demoSite.templateId === "tour") {
    // Cast config to appropriate type or pass as any if loose
    return <TourTemplate config={demoSite.config as unknown as TourConfig} />;
  }

  return <div>Template not found</div>;
}
