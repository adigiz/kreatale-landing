import RedesignPage from "@/redesign/RedesignPage";
import faq from "@/redesign/generated/faq";

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

// FAQ rich results, built from the questions on the page so the two never drift apart
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [...faq.html.matchAll(/<details data-faq="1"><summary>([\s\S]*?)<span[\s\S]*?<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(
    ([, q, a]) => ({
      "@type": "Question",
      name: decode(q),
      acceptedAnswer: { "@type": "Answer", text: decode(a) },
    }),
  ),
};

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <RedesignPage page={faq} locale={locale} id="faq" />
    </>
  );
}
