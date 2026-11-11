import RedesignPage from "@/redesign/RedesignPage";
import { legalPage, type LegalSection } from "@/redesign/pages";
import legal from "@/redesign/generated/legal";
import text from "@/redesign/legal.json";

type LegalDoc = { title: string; lastUpdated: string; sections: Record<string, LegalSection> };

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RedesignPage
      page={legalPage(legal, text.terms as LegalDoc)}
      locale={locale}
      id="terms"
    />
  );
}
