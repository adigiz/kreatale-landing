import { metadataFor } from "@/redesign/metadata";

export const generateMetadata = metadataFor("blog");

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
