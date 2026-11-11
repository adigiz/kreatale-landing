import type { Metadata } from "next";
import { headers } from "next/headers";
import RedesignPage from "@/redesign/RedesignPage";
import notFoundPage from "@/redesign/generated/404";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  // not-found pages get no params; the middleware passes the path along
  const path = (await headers()).get("x-pathname") || "";
  const locale = path.split("/")[1] === "id" ? "id" : "en";
  return (
<RedesignPage page={notFoundPage} locale={locale} id="not-found" />
  );
}
