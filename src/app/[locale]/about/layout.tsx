import { metadataFor } from "@/redesign/metadata";

export const generateMetadata = metadataFor("about");

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
