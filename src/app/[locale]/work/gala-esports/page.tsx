import RedesignPage from "@/redesign/RedesignPage";
import { metadataFor } from "@/redesign/metadata";
import gala from "@/redesign/generated/case-gala-esports";

export const generateMetadata = metadataFor("gala");

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <RedesignPage page={gala} locale={locale} id="gala-esports" />;
}
