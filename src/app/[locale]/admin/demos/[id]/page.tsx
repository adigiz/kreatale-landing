import { getSession } from "@/lib/cms/auth/config";
import { redirect, notFound } from "next/navigation";
import DemoSiteForm from "../DemoSiteForm";
import { getDemoSiteById } from "@/lib/cms/queries/demo-sites";
import ActionButtons from "../ActionButtons";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DemoSite } from "../types";

export default async function EditDemoSitePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const demoSite = (await getDemoSiteById(id)) as DemoSite | null;
  if (!demoSite) {
    notFound();
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
            Edit Demo Site
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update configuration for {demoSite.slug}
          </p>
        </div>
        <ActionButtons demoId={id} />
      </div>
      <DemoSiteForm initialData={demoSite} isEditing />
    </div>
  );
}
