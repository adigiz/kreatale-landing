import "server-only";

// Server-to-server client for Morpheus's private admin API (/v1/admin/*).
// MORPHEUS_API_URL is the core API base, MORPHEUS_ADMIN_TOKEN matches Morpheus's ADMIN_API_TOKEN.

export type MorpheusUser = {
  id: string;
  email: string;
  createdAt: string;
  blockedAt: string | null;
  blockedReason: string | null;
  lastActiveAt: string | null;
  uploads: number;
  projects: number;
  exports: number;
};

export type MorpheusProject = {
  id: string;
  name: string;
  status: string;
  platform: string | null;
  editor: string | null;
  createdAt: string;
  updatedAt: string;
  exports: number;
};

export type MorpheusJob = {
  id: string;
  projectId: string;
  type: string;
  status: string;
  error: string | null;
  createdAt: string;
};

export type MorpheusStats = {
  users: number;
  blocked: number;
  signups7d: number;
  signups30d: number;
  exports7d: number;
  uploads7d: number;
};

export class MorpheusError extends Error {
  constructor(
    message: string,
    public status = 0,
  ) {
    super(message);
  }
}

export function morpheusConfigured() {
  return Boolean(process.env.MORPHEUS_API_URL && process.env.MORPHEUS_ADMIN_TOKEN);
}

async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const base = process.env.MORPHEUS_API_URL?.replace(/\/+$/, "");
  const token = process.env.MORPHEUS_ADMIN_TOKEN;
  if (!base || !token) throw new MorpheusError("Morpheus isn't connected yet. Set MORPHEUS_API_URL and MORPHEUS_ADMIN_TOKEN.");

  let res: Response;
  try {
    res = await fetch(`${base}/v1/admin${path}`, {
      method: init.method ?? "GET",
      headers: {
        authorization: `Bearer ${token}`,
        ...(init.body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new MorpheusError("Couldn't reach Morpheus. Check that it's running and MORPHEUS_API_URL is right.");
  }

  if (res.status === 401) throw new MorpheusError("Morpheus rejected the admin key. Check MORPHEUS_ADMIN_TOKEN matches its ADMIN_API_TOKEN.", 401);
  if (res.status === 404 && path === "/stats") throw new MorpheusError("Morpheus's admin API is switched off. Set ADMIN_API_TOKEN on Morpheus.", 404);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new MorpheusError(data?.error ? `Morpheus: ${data.error}` : `Morpheus returned ${res.status}.`, res.status);
  }
  return (await res.json()) as T;
}

export type UserFilter = "all" | "active" | "blocked";

export function listMorpheusUsers(opts: { q?: string; status?: UserFilter; limit?: number; offset?: number } = {}) {
  const p = new URLSearchParams();
  if (opts.q) p.set("q", opts.q);
  p.set("status", opts.status ?? "all");
  p.set("limit", String(opts.limit ?? 50));
  p.set("offset", String(opts.offset ?? 0));
  return call<{ users: MorpheusUser[]; total: number }>(`/users?${p}`);
}

export function getMorpheusUser(id: string) {
  return call<{ user: MorpheusUser; projects: MorpheusProject[]; jobs: MorpheusJob[] }>(`/users/${encodeURIComponent(id)}`);
}

export function blockMorpheusUser(id: string, reason?: string) {
  return call<{ user: MorpheusUser; sessionsRevoked: number }>(`/users/${encodeURIComponent(id)}/block`, {
    method: "POST",
    body: reason ? { reason } : {},
  });
}

export function unblockMorpheusUser(id: string) {
  return call<{ user: MorpheusUser }>(`/users/${encodeURIComponent(id)}/unblock`, { method: "POST", body: {} });
}

export function signOutMorpheusUser(id: string) {
  return call<{ sessionsRevoked: number }>(`/users/${encodeURIComponent(id)}/signout`, { method: "POST", body: {} });
}

export function deleteMorpheusUser(id: string) {
  return call<{ ok: true }>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function morpheusStats() {
  return call<MorpheusStats>("/stats");
}
