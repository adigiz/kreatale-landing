import RedesignPage from "@/redesign/RedesignPage";
import { metadataFor } from "@/redesign/metadata";
import work from "@/redesign/generated/work";

export const generateMetadata = metadataFor("work");

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <RedesignPage page={work} locale={locale} id="work" />;
}
