import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: Six things, done properly";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["Six things,", "done properly"], sticker: "What we do", chars: ["maker", "dreamer"] });
}
