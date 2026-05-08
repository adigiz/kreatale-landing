"use client";

import type { MaximaConfig } from "./maxima-config";
import MaximaHero from "./MaximaHero";
import MaximaNav from "./MaximaNav";
import MaximaProgramPin from "./MaximaProgramPin";
import MaximaSections from "./MaximaSections";

export default function MaximaDemoShell({ config }: { config?: MaximaConfig }) {
  void config;
  return (
    <div id="top" className="relative min-h-screen">
      <MaximaNav />
      <main className="overflow-x-clip">
        <MaximaHero />
        <MaximaProgramPin />
        <MaximaSections />
      </main>
    </div>
  );
}
