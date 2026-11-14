import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { db, contacts, leads, posts } from "@/lib/cms/db";
import { count, desc, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Inbox, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// The pipeline stages a lead moves through, in order.
const STAGES = [
  "new",
  "contacted",
  "replied",
  "qualified",
  "converted",
] as const;

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }
  const role = session.user.role as string;
  const [canContacts, canLeads] = await Promise.all([
    sessionHasPermission(role, "contacts:read"),
    sessionHasPermission(role, "leads:read"),
  ]);

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [[unread], [last30], recent, leadRows, [drafts]] = await Promise.all([
    canContacts
      ? db
          .select({ n: count() })
          .from(contacts)
          .where(eq(contacts.read, "false"))
      : [{ n: 0 }],
    canContacts
      ? db
          .select({ n: count() })
          .from(contacts)
          .where(gte(contacts.createdAt, since30))
      : [{ n: 0 }],
    canContacts
      ? db
          .select({
            id: contacts.id,
            name: contacts.name,
            company: contacts.company,
            inquiry: contacts.inquiry,
            read: contacts.read,
            createdAt: contacts.createdAt,
          })
          .from(contacts)
          .orderBy(desc(contacts.createdAt))
          .limit(5)
      : [],
    canLeads
      ? db
          .select({ status: leads.status, n: count() })
          .from(leads)
          .groupBy(leads.status)
      : [],
    db.select({ n: count() }).from(posts).where(eq(posts.status, "draft")),
  ]);

  const byStage = Object.fromEntries(
    leadRows.map((r) => [r.status, Number(r.n)]),
  );

  const stats = [
    canContacts && {
      name: "Unread enquiries",
      value: unread.n,
      icon: Inbox,
      href: `/${locale}/admin/contacts?read=false`,
      highlight: Number(unread.n) > 0,
    },
    canContacts && {
      name: "Enquiries, last 30 days",
      value: last30.n,
      icon: Mail,
      href: `/${locale}/admin/contacts`,
    },
    canLeads && {
      name: "Leads in progress",
      value:
        (byStage.contacted ?? 0) +
        (byStage.replied ?? 0) +
        (byStage.qualified ?? 0),
      icon: Target,
      href: `/${locale}/admin/leads`,
    },
    {
      name: "Draft posts",
      value: drafts.n,
      icon: FileText,
      href: `/${locale}/admin/posts?status=draft`,
    },
  ].filter(Boolean) as {
    name: string;
    value: number;
    icon: typeof Mail;
    href: string;
    highlight?: boolean;
  }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          New enquiries and where your leads stand
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className={`rounded-lg border bg-card p-4 hover:bg-accent transition-colors ${
                stat.highlight ? "border-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p
                    className={`text-2xl font-semibold mt-1 ${
                      stat.highlight ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-md border bg-muted p-2">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {canContacts && (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Latest enquiries
              </h2>
              <Link
                href={`/${locale}/admin/contacts`}
                className="text-sm text-primary hover:underline"
              >
                See all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              <ul className="divide-y">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/${locale}/admin/contacts/${c.id}`}
                      className="flex items-center justify-between gap-4 py-3 hover:bg-accent -mx-2 px-2 rounded-md"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {c.read === "false" && (
                            <span
                              aria-label="Unread"
                              className="inline-block size-2 rounded-full bg-primary mr-2 align-middle"
                            />
                          )}
                          {c.name}
                          {c.company ? ` · ${c.company}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.inquiry}
                        </p>
                      </div>
                      <time
                        dateTime={c.createdAt.toISOString()}
                        className="text-xs text-muted-foreground shrink-0"
                      >
                        {c.createdAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {canLeads && (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Leads by stage
              </h2>
              <Link
                href={`/${locale}/admin/leads`}
                className="text-sm text-primary hover:underline"
              >
                Open leads
              </Link>
            </div>
            <ul className="space-y-2">
              {STAGES.map((stage) => (
                <li
                  key={stage}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize text-muted-foreground">
                    {stage}
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {byStage[stage] ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`}>New post</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${locale}/admin/media`}>Upload media</Link>
        </Button>
      </div>
    </div>
  );
}
