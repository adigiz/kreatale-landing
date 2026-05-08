"use client";

import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MAXIMA_HERO_LOTTIE_LAYERS } from "./maxima-hero-lottie-layers";
import { MAXIMA_PROGRAM_SLIDES } from "./maxima-data";

function MaximaHeroLottieLayer({
  path,
  className,
  playing,
}: {
  path: string;
  className: string;
  playing: boolean;
}) {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(path)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!data) return null;

  return (
    <div className={cn(className, "pointer-events-none select-none")}>
      <Lottie animationData={data} loop autoplay={playing} className="h-auto w-full" />
    </div>
  );
}

/**
 * Hero art: local WebP illu pair (correct colour per program) + Lottie JSON / positions
 * extracted from maximatherapy.com (`scripts/download-maxima-hero-assets.py`).
 *
 * Note: their SSR `<svg class="w-full h-auto" width="2979">` is the same shell on every
 * program URL today; full program-specific vector art hydrates from their JS bundle.
 */
export default function MaximaHeroSlideArt({
  slug,
  playing,
  priority,
}: {
  slug: string;
  playing: boolean;
  priority?: boolean;
}) {
  const slide = MAXIMA_PROGRAM_SLIDES.find((s) => s.slug === slug);
  const layers = MAXIMA_HERO_LOTTIE_LAYERS[slug] ?? [];

  if (!slide) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={slide.heroIlluBg}
        alt=""
        fill
        priority={priority}
        quality={92}
        className="pointer-events-none select-none object-cover object-bottom"
        sizes="(max-width: 1023px) 150vw, 120vw"
      />
      <Image
        src={slide.heroIlluFg}
        alt=""
        fill
        priority={priority}
        quality={92}
        className="pointer-events-none select-none object-cover object-bottom"
        sizes="(max-width: 1023px) 150vw, 120vw"
      />
      {layers.map((layer) => (
        <MaximaHeroLottieLayer key={layer.path} path={layer.path} className={layer.className} playing={playing} />
      ))}
    </div>
  );
}
