import { notFound, redirect } from "next/navigation";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";

/** Legacy journal/detail URL for tour demos → travel tips listing. */
export default async function DemoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result) {
    notFound();
  }

  const { demoSite } = result;

  if (demoSite.templateId === "tour") {
    redirect(`/${locale}/demos/${slug}/travel-tips`);
  }

  if (demoSite.templateId === "zodiac") {
    redirect(`/${locale}/demos/${slug}`);
  }

  if (demoSite.templateId === "bakery") {
    redirect(`/${locale}/demos/${slug}`);
  }

  return <div>Template detail not found</div>;
}
