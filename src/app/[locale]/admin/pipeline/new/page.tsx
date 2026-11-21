import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { ownerOptions } from "@/lib/cms/queries/deals";
import DealForm from "../DealForm";

export default async function NewDealPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ website?: string; source?: string; company?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  if (!(await sessionHasPermission(role, "deals:update"))) redirect(`/${locale}/admin/pipeline`);
  const [owners, canValue] = await Promise.all([ownerOptions(), sessionHasPermission(role, "deals:value")]);

  return (
    <div className="max-w-2xl space-y-5">
      <Link href={`/${locale}/admin/pipeline`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Pipeline
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">Add a deal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          For a referral, someone you met, or a business you want to reach out to.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <DealForm
          mode="create"
          locale={locale}
          owners={owners}
          canValue={canValue}
          initial={{
            name: "",
            email: "",
            company: sp.company ?? "",
            phone: "",
            website: sp.website ?? "",
            service: "websites",
            ownerId: session.user.id,
            valueAmount: "",
            currency: "USD",
            source: sp.source === "outreach" ? "outreach" : "manual",
            note: "",
          }}
        />
      </div>
    </div>
  );
}
