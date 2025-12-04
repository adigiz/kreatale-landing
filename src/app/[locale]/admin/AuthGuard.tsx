"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  authenticatedContent: ReactNode;
}

export default function AuthGuard({
  children,
  authenticatedContent,
}: AuthGuardProps) {
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname?.includes("/admin/login");

  // If on login page, render children without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, render authenticated content
  return <>{authenticatedContent}</>;
}
