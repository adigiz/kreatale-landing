import { notFound } from "next/navigation";
import { TourPackagesBrowse } from "@/components/demo/tour/tour-browse-ui";
import TourDemoShell from "@/components/demo/tour/TourDemoShell";
import {
  TourSubpageClosing,
  TourSubpageExploreMore,
  TourSubpageHero,
  TourSubpageTrustStrip,
} from "@/components/demo/tour/tour-subpage-layout";
import type { TourConfig } from "@/components/demo/tour/tour-config";
import { TourCtaSection } from "@/components/demo/tour/tour-sections";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";

export default async function TourPackagesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result || result.demoSite.templateId !== "tour") {
    notFound();
  }

  const config = result.demoSite.config as TourConfig;

  return (
    <TourDemoShell config={config}>
      <main className="pb-28 lg:pb-10">
        <TourSubpageHero
          page="packages"
          config={config}
          locale={locale}
          slug={slug}
        />
        <TourPackagesBrowse config={config} locale={locale} slug={slug} />
        <TourSubpageTrustStrip config={config} />
        <TourSubpageExploreMore
          current="packages"
          config={config}
          locale={locale}
          slug={slug}
        />
        <TourSubpageClosing config={config} locale={locale} slug={slug} />
        <TourCtaSection config={config} />
      </main>
    </TourDemoShell>
  );
}
