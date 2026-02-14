import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import DemoSiteForm from "../DemoSiteForm";
import ActionButtons from "../ActionButtons";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewDemoSitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/demos`}>
            <ArrowLeft className="size-4" />
            Back to Demos
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Create New Demo Site
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure a new dynamic landing page
          </p>
        </div>
        <ActionButtons demoId="new" />
      </div>
      <DemoSiteForm />
    </div>
  );
}
