import { DM_Sans, Fraunces } from "next/font/google";
import type { BakeryConfig } from "./bakery-config";
import "./bakery-demo.css";
import { BakeryDemoView } from "./BakeryDemoView";

const bakeryDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-bakery-display",
  display: "swap",
});

const bakeryBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-bakery-body",
  display: "swap",
});

export default function BakeryTemplate({
  config,
}: {
  config?: BakeryConfig;
}) {
  return (
    <div
      className={`bakery-demo-root min-h-screen overflow-x-hidden antialiased ${bakeryDisplay.variable} ${bakeryBody.variable}`}
    >
      <BakeryDemoView config={config} />
    </div>
  );
}
