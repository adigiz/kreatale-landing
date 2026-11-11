import type { Metadata } from "next";
import RedesignPage from "@/redesign/RedesignPage";
import notFoundPage from "@/redesign/generated/404";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  // not-found pages get no params, so links point at the English site
  return <RedesignPage page={notFoundPage} locale="en" id="not-found" />;
}
