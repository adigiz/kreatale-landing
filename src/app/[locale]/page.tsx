import RedesignPage from "@/redesign/RedesignPage";
import { metadataFor } from "@/redesign/metadata";
import home from "@/redesign/generated/index";

export const generateMetadata = metadataFor("home");

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RedesignPage page={home} locale={locale} id="home" />;
}
