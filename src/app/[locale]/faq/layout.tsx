import { metadataFor } from "@/redesign/metadata";

export const generateMetadata = metadataFor("faq");

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
