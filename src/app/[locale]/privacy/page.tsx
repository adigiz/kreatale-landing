import RedesignPage from "@/redesign/RedesignPage";
import { legalPage, type LegalSection } from "@/redesign/pages";
import legal from "@/redesign/generated/legal";

type LegalDoc = { title: string; lastUpdated: string; sections: Record<string, LegalSection> };

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  return (
    <RedesignPage
      page={legalPage(legal, messages.privacy as LegalDoc)}
      locale={locale}
      id="privacy"
    />
  );
}
