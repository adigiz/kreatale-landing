import type { Metadata } from "next";
import { notFound } from "next/navigation";

// unknown URLs land here first, so this is the title the 404 page shows
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function CatchAllPage() {
  notFound();
}
