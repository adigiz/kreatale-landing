import RedesignPage from "@/redesign/RedesignPage";
import services from "@/redesign/generated/services";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RedesignPage page={services} locale={locale} id="services" />;
}
