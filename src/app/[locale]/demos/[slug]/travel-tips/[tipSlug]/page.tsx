import Link from "next/link";
import { notFound } from "next/navigation";
import TourDemoShell from "@/components/demo/tour/TourDemoShell";
import type { TourConfig } from "@/components/demo/tour/tour-config";
import { findTravelTipBySlug } from "@/components/demo/tour/tour-content-merge";
import { TOUR_DICTIONARY } from "@/components/demo/tour/translations";
import { tourDemoPaths } from "@/lib/tour-demo-paths";
import { getStaticDemoBySlug } from "@/lib/demos/static-demos";

export default async function TourTravelTipArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; tipSlug: string }>;
}) {
  const { locale, slug, tipSlug } = await params;
  const result = getStaticDemoBySlug(slug);

  if (!result || result.demoSite.templateId !== "tour") {
    notFound();
  }

  const config = result.demoSite.config as TourConfig;
  const tip = findTravelTipBySlug(config, tipSlug);

  if (!tip) {
    notFound();
  }

  const lang = config.language === "id" ? "id" : "en";
  const t = TOUR_DICTIONARY[lang];
  const paths = tourDemoPaths(locale, slug);
  const bodyText = tip.body?.trim() || tip.excerpt || "";
  const paragraphs = bodyText.split(/\n\n+/).filter(Boolean);
  const tipImage =
    "image" in tip &&
    typeof tip.image === "string" &&
    tip.image.trim().length > 0
      ? tip.image
      : undefined;

  return (
    <TourDemoShell config={config}>
      <main className="pt-20 lg:pt-24 pb-28 lg:pb-16 px-6 lg:px-10 max-w-3xl mx-auto">
        <Link
          href={paths.travelTips}
          className="text-xs font-bold uppercase tracking-widest text-tour-accent hover:opacity-80 inline-flex items-center gap-1 mb-10"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {t.nav.travelTips}
        </Link>

        <article>
          <p className="text-tour-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">
            {t.subpages.travelTipsPage.eyebrow}
          </p>
          <h1 className="font-tour-serif text-4xl md:text-5xl text-tour-navy-dark dark:text-white leading-tight mb-8">
            {tip.title}
          </h1>
          {tipImage ? (
            <div className="aspect-[16/9] rounded-sm overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tipImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
          <div className="prose prose-lg dark:prose-invert max-w-none font-light text-gray-700 dark:text-gray-300 space-y-6">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p className="leading-relaxed text-gray-500">{tip.excerpt}</p>
            )}
          </div>
        </article>
      </main>
    </TourDemoShell>
  );
}
