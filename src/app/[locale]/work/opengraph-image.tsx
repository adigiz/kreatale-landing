import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: Work we're proud of";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["Work we're", "proud of"], sticker: "Websites, shops & apps", chars: ["maker", "shopper"] });
}
