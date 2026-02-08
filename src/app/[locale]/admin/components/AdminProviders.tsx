"use client";

import { SessionProvider } from "next-auth/react";
import SessionGuard from "./SessionGuard";

/**
 * Client-side providers for the admin panel.
 * Wraps children with NextAuth SessionProvider and SessionGuard
 * for automatic session monitoring and token rotation handling.
 */
export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      // Re-fetch session every 5 minutes to pick up rotated tokens
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
