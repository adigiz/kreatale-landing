import { getSession } from "@/lib/cms/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, ExternalLink } from "lucide-react";
import { getAllDemoSites } from "@/lib/cms/queries/demo-sites";
import { Button } from "@/components/ui/button";
import DeleteDemoSiteButton from "./DeleteDemoSiteButton";
import {
  hasPermission,
  PERMISSIONS,
  type UserRole,
} from "@/lib/cms/permissions";

export default async function DemosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = session.user.role as UserRole;
  const demoSites = await getAllDemoSites();

  // Check permissions
  const canCreate = hasPermission(role, PERMISSIONS.DEMO_SITES_CREATE);
  const canUpdate = hasPermission(role, PERMISSIONS.DEMO_SITES_UPDATE);
  const canDelete = hasPermission(role, PERMISSIONS.DEMO_SITES_DELETE);
  const isAdmin = role === "super_admin" || role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Demo Sites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your dynamic landing pages
          </p>
        </div>
        {canCreate && (
          <Button asChild>
            <Link href={`/${locale}/admin/demos/new`}>
              <Plus className="size-4 mr-2" />
              New Demo Site
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Website Name
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Slug
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Template
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Language
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Author
                </th>
                <th className="h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground">
                  Created
                </th>
                <th className="h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {demoSites.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No demo sites found. Create one to get started.
                  </td>
                </tr>
              ) : (
                demoSites.map(({ demoSite: site, author }) => {
                  const isOwner = site.authorId === session.user.id;
                  const showUpdate = canUpdate && (isAdmin || isOwner);
                  const showDelete = canDelete && (isAdmin || isOwner);

                  return (
                    <tr
                      key={site.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <span className="text-sm font-medium text-foreground">
                          {(site.config as any)?.websiteName || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        {site.isPublished ? (
                          <Link
                            href={`/${locale}/demo/${site.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {site.slug}
                            <ExternalLink className="size-3" />
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-foreground">
                            {site.slug}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium uppercase">
                          {site.templateId}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium uppercase">
                          {(site.config as any)?.language || "en"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            site.isPublished
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
                          }`}
                        >
                          {site.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {author?.name || author?.email || "-"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {showUpdate && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/${locale}/admin/demos/${site.id}`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                          )}
                          {showDelete && <DeleteDemoSiteButton id={site.id} />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
