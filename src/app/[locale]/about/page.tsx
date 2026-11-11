import RedesignPage from "@/redesign/RedesignPage";
import about from "@/redesign/generated/about";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RedesignPage page={about} locale={locale} id="about" />;
}
