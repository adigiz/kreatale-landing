import { Manrope, Noto_Serif } from "next/font/google";
import type { ZodiacConfig } from "./zodiac-config";
import { ZodiacDemoView } from "./ZodiacDemoView";

const zodiacSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-zodiac-serif",
  display: "swap",
});

const zodiacSans = Manrope({
  subsets: ["latin"],
  variable: "--font-zodiac-sans",
  display: "swap",
});

export default function ZodiacTemplate({ config }: { config?: ZodiacConfig }) {
  return (
    <div
      className={`zodiac-demo-root dark min-h-screen overflow-x-hidden bg-[#131313] ${zodiacSerif.variable} ${zodiacSans.variable}`}
    >
      <ZodiacDemoView config={config} />
    </div>
  );
}
