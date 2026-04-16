import type { ReactNode } from "react";
import { DM_Sans, Lora } from "next/font/google";

const beddingDisplay = Lora({
  subsets: ["latin"],
  variable: "--font-bedding-display",
  display: "swap",
});

const beddingBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-bedding-body",
  display: "swap",
});

export function BeddingFontWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${beddingDisplay.variable} ${beddingBody.variable} ${className}`}>
      {children}
    </div>
  );
}
