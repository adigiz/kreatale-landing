import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: Gala Esports case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["Gala Esports", "case study"], sticker: "Website · Australia", chars: ["phone", "maker"] });
}
