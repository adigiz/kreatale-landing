import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";
import { getSession } from "@/lib/cms/auth/config";
import { sessionHasPermission } from "@/lib/cms/permissions.server";
import { listMorpheusUsers, morpheusStats, MorpheusError, type MorpheusStats, type MorpheusUser, type UserFilter } from "@/lib/morpheus";
import { ago } from "../pipeline/ui";

export const dynamic = "force-dynamic";

const PAGE = 50;
const MORPHEUS_SITE = "https://morpheus.kreatale.com";

export default async function MorpheusUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/admin/login`);
  if (!(await sessionHasPermission(session.user.role as string, "morpheus:read"))) redirect(`/${locale}/admin`);

  const q = (sp.q ?? "").trim().slice(0, 200);
  const status: UserFilter = sp.status === "active" || sp.status === "blocked" ? sp.status : "all";
  const page = Math.max(1, Number(sp.page) || 1);
  const base = `/${locale}/admin/morpheus`;

  let stats: MorpheusStats | null = null;
  let list: { users: MorpheusUser[]; total: number } | null = null;
  let error: string | null = null;
  try {
    [stats, list] = await Promise.all([morpheusStats(), listMorpheusUsers({ q, status, limit: PAGE, offset: (page - 1) * PAGE })]);
  } catch (e) {
    error = e instanceof MorpheusError ? e.message : "Couldn't load Morpheus accounts.";
  }

  const href = (o: { status?: UserFilter; page?: number }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const s = o.status ?? status;
    if (s !== "all") p.set("status", s);
    if (o.page && o.page > 1) p.set("page", String(o.page));
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };
  const tab = (key: UserFilter, label: string) => (
    <Link
      key={key}
      href={href({ status: key })}
      className={`rounded-full border px-3 py-1 text-sm ${status === key ? "border-foreground bg-foreground text-background" : "hover:bg-muted"}`}
    >
      {label}
    </Link>
  );
  const pages = list ? Math.max(1, Math.ceil(list.total / PAGE)) : 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Morpheus accounts</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Everyone who signed up to Morpheus. Open an account to see its projects, or to block or delete it.</p>
        </div>
        <a href={MORPHEUS_SITE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Open Morpheus <ExternalLink className="size-3.5" />
        </a>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Morpheus isn&apos;t connected</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Tile label="Accounts" value={stats.users} sub={stats.blocked ? `${stats.blocked} blocked` : "None blocked"} />
              <Tile label="Sign-ups, 7 days" value={stats.signups7d} sub={`${stats.signups30d} in 30 days`} />
              <Tile label="Uploads, 7 days" value={stats.uploads7d} />
              <Tile label="Exports, 7 days" value={stats.exports7d} />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {tab("all", "All")}
              {tab("active", "Active")}
              {tab("blocked", "Blocked")}
            </div>
            <form action={base} className="relative w-full sm:w-72">
              {status !== "all" && <input type="hidden" name="status" value={status} />}
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input name="q" defaultValue={q} placeholder="Search by email" className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm" />
            </form>
          </div>

          {list && list.users.length === 0 ? (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              {q ? `No accounts match “${q}”.` : status === "blocked" ? "No blocked accounts." : "No accounts yet."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="label-mono px-4 py-3 font-normal text-muted-foreground">Email</th>
                    <th className="label-mono px-4 py-3 font-normal text-muted-foreground">Signed up</th>
                    <th className="label-mono px-4 py-3 font-normal text-muted-foreground">Last active</th>
                    <th className="label-mono px-4 py-3 text-right font-normal text-muted-foreground">Uploads</th>
                    <th className="label-mono px-4 py-3 text-right font-normal text-muted-foreground">Projects</th>
                    <th className="label-mono px-4 py-3 text-right font-normal text-muted-foreground">Exports</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {list?.users.map((u) => (
                    <tr key={u.id} className="hover:bg-background">
                      <td className="px-4 py-3">
                        <Link href={`${base}/${encodeURIComponent(u.id)}`} className="font-medium hover:underline">
                          {u.email}
                        </Link>
                        {u.blockedAt && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Blocked</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" title={new Date(u.createdAt).toLocaleString()}>
                        {ago(u.createdAt)} ago
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.lastActiveAt ? `${ago(u.lastActiveAt)} ago` : "–"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{u.uploads}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{u.projects}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{u.exports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {list && pages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {page} of {pages} · {list.total} accounts
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={href({ page: page - 1 })} className="rounded-full border px-3 py-1 hover:bg-muted">
                    ← Newer
                  </Link>
                )}
                {page < pages && (
                  <Link href={href({ page: page + 1 })} className="rounded-full border px-3 py-1 hover:bg-muted">
                    Older →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="label-mono text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
