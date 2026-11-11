"use client";

import { SessionProvider } from "next-auth/react";
import SessionGuard from "./SessionGuard";

/**
 * Client-side providers for the admin panel.
 * Wraps children with NextAuth SessionProvider and SessionGuard
 * for automatic session monitoring.
 *
 * No background polling: with JWT sessions every session check re-issues the cookie with a
 * fresh expiry, so polling kept an open, unattended admin tab signed in forever. The session
 * is still checked on every page load and when the tab regains focus, which is real activity.
 */
export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
