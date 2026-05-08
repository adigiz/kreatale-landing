"use client";

import { cn } from "@/lib/utils";
import { MAXIMA_NAV_LOGO_HTML } from "./maxima-nav-logo-html";

/** Production SVG wordmark + symbol (static HTML, clip paths namespaced). */
export function MaximaNavLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn("maxima-nav-logo block shrink-0 [&_svg]:block", className)}
      // eslint-disable-next-line react/no-danger -- trusted static markup from bundled constant
      dangerouslySetInnerHTML={{ __html: MAXIMA_NAV_LOGO_HTML }}
    />
  );
}
