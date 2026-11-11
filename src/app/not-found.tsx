import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import RedesignPage from "@/redesign/RedesignPage";
import notFoundPage from "@/redesign/generated/404";

/**
 * The 404 for URLs outside a locale (e.g. /something). Same page as the localized 404.
 * It's a server component on purpose: Next loads this file with every page, so it must stay light.
 */
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Page not found | Kreatale",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${geistMono.variable}`}>
        <RedesignPage page={notFoundPage} locale="en" id="not-found-root" />
      </body>
    </html>
  );
}
