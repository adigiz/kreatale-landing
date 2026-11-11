import { metadataFor } from "@/redesign/metadata";

export const generateMetadata = metadataFor("services");

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
