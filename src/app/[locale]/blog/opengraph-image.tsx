import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return locale === "id"
    ? pageCard({ lines: ["Catatan dari", "studio"], sticker: "Ditulis oleh pembuatnya", chars: ["dreamer", "maker"] })
    : pageCard({ lines: ["Notes from", "the studio"], sticker: "Written by the makers", chars: ["dreamer", "maker"] });
}
