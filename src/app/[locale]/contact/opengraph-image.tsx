import { OG_CONTENT_TYPE, OG_SIZE, pageCard } from "@/redesign/og";

export const alt = "Kreatale: Let's talk.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return pageCard({ lines: ["Let's", "talk."], sticker: "Replies within a day", chars: ["phone", "dreamer"] });
}
