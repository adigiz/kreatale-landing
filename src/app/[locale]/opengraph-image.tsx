import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: Websites & apps for big ideas.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["Websites & apps", "for big ideas."], sticker: "Web & app studio · Jakarta", chars: ["maker", "shopper"] });
}
