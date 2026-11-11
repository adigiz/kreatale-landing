import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: A small studio in Jakarta.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["A small studio", "in Jakarta."], sticker: "Since 2024", chars: ["dreamer", "shopper"] });
}
