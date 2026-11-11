import RedesignPage from "@/redesign/RedesignPage";
import { metadataFor } from "@/redesign/metadata";
import contact from "@/redesign/generated/contact";

export const generateMetadata = metadataFor("contact");

// the prototype ships hCaptcha's public test key; the live form uses the site's own
const TEST_SITEKEY = "10000000-ffff-ffff-ffff-000000000001";
const page = {
  ...contact,
  html: contact.html.replace(TEST_SITEKEY, process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || TEST_SITEKEY),
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <RedesignPage page={page} locale={locale} id="contact" />;
}
