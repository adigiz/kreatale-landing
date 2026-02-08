"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/**
 * Client component that monitors the session for errors
 * (e.g., user deleted, token expired) and auto-signs out.
 */
export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    const error = (session?.user as { error?: string } | undefined)?.error;

    if (error === "UserNotFound") {
      // User was deleted from the DB -- force sign out
      signOut({ callbackUrl: "/en/admin/login", redirect: true });
    }
  }, [session]);

  return <>{children}</>;
}
