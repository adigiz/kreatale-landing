import TourDetailTemplate from "@/components/demo/tour/TourDetailTemplate";
import { getDemoSiteBySlug } from "@/lib/cms/queries/demo-sites";
import { notFound } from "next/navigation";

export default async function DemoDetailPage({
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
    // Config can be passed if detail page needs dynamic data later
    // For now TourDetailTemplate handles its own static content
    return <TourDetailTemplate />;
  }

  return <div>Template detail not found</div>;
}
