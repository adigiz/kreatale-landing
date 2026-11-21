"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Counts the view once per tab and refreshes while the audit is still running. */
export default function ReportClient({ token, pending }: { token: string; pending: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (pending) return;
    const key = `kt_audit_seen_${token}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode: count anyway */
    }
    fetch("/api/audit/view", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }), keepalive: true }).catch(() => {});
  }, [token, pending]);
  useEffect(() => {
    if (!pending) return;
    const t = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(t);
  }, [pending, router]);
  return null;
}
