import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { getMorpheusUser, MorpheusError } from "@/lib/morpheus";
import { ago } from "../../pipeline/ui";
import { UserActions } from "../UserActions";

export const dynamic = "force-dynamic";

const fullDate = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
const JOB_TONE: Record<string, string> = {
  done: "text-emerald-700",
  succeeded: "text-emerald-700",
  failed: "text-red-700",
  error: "text-red-700",
};

export default async function MorpheusUserPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  const role = session.user.role as string;
  if (!(await sessionHasPermission(role, "morpheus:read"))) redirect(`/${locale}/admin`);
  const canManage = await sessionHasPermission(role, "morpheus:manage");
  const base = `/${locale}/admin/morpheus`;

  let data;
  try {
    data = await getMorpheusUser(decodeURIComponent(id));
  } catch (e) {
    if (e instanceof MorpheusError && e.status === 404) notFound();
    return (
      <div className="space-y-4">
        <BackLink href={base} />
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          {e instanceof MorpheusError ? e.message : "Couldn't load this account."}
        </div>
      </div>
    );
  }

  const { user: u, projects, jobs } = data;
  const projectName = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <BackLink href={base} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold">{u.email}</h1>
            {u.blockedAt ? (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">Blocked</span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Active</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed up {fullDate(u.createdAt)}
            {u.lastActiveAt ? ` · last active ${ago(u.lastActiveAt)} ago` : ""}
          </p>
          {u.blockedAt && (
            <p className="mt-2 text-sm text-red-700">
              Blocked {fullDate(u.blockedAt)}
              {u.blockedReason ? `: ${u.blockedReason}` : ""}
            </p>
          )}
        </div>
        {canManage && <UserActions id={u.id} email={u.email} blocked={Boolean(u.blockedAt)} locale={locale} />}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Uploads" value={u.uploads} />
        <Stat label="Projects" value={u.projects} />
        <Stat label="Exports" value={u.exports} />
      </div>

      <section className="rounded-2xl border bg-card">
        <h2 className="border-b px-4 py-3 text-base font-bold">Projects</h2>
        {projects.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No projects.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="label-mono px-4 py-2.5 font-normal text-muted-foreground">Name</th>
                  <th className="label-mono px-4 py-2.5 font-normal text-muted-foreground">Status</th>
                  <th className="label-mono px-4 py-2.5 font-normal text-muted-foreground">Destination</th>
                  <th className="label-mono px-4 py-2.5 text-right font-normal text-muted-foreground">Exports</th>
                  <th className="label-mono px-4 py-2.5 font-normal text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2.5 font-medium">{p.name}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{p.status}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{[p.platform, p.editor].filter(Boolean).join(" + ") || "Not picked"}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{p.exports}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{ago(p.updatedAt)} ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-card">
        <h2 className="border-b px-4 py-3 text-base font-bold">Recent jobs</h2>
        {jobs.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No jobs yet.</p>
        ) : (
          <ul className="divide-y text-sm">
            {jobs.map((j) => (
              <li key={j.id} className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="w-28 shrink-0 capitalize">{j.type.replace(/[_-]/g, " ")}</span>
                <span className={`w-24 shrink-0 capitalize ${JOB_TONE[j.status] ?? "text-muted-foreground"}`}>{j.status}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {projectName.get(j.projectId) ?? "Deleted project"}
                  {j.error ? ` · ${j.error.split("\n")[0]}` : ""}
                </span>
                <span className="shrink-0 text-muted-foreground">{ago(j.createdAt)} ago</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" /> All Morpheus accounts
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="label-mono text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
