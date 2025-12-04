import { redirect } from "next/navigation";
import { getSession } from "@/lib/cms/auth/config";
import { canAccessAdmin } from "@/lib/cms/permissions";
import AuthGuard from "./AuthGuard";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";

// Force dynamic rendering for admin routes (they require authentication)
export const dynamic = "force-dynamic";

// Prevent search engines from indexing admin pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

async function AuthenticatedLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  // Check authentication
  let session;
  try {
    session = await getSession();
  } catch {
    redirect(`/${locale}/admin/login`);
  }

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  const role = session.user.role as string;
  if (
    !canAccessAdmin(
      role as "super_admin" | "admin" | "editor" | "author" | "viewer"
    )
  ) {
    redirect(`/${locale}`);
  }

  // Render authenticated layout with sidebar - NO HEADER/FOOTER
  // Note: This layout is nested under [locale]/layout.tsx, so we don't include html/body tags
  const userName = (session.user as { name?: string | null }).name || null;
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        locale={locale}
        userEmail={session.user.email}
        userName={userName}
        role={role}
      >
        {children}
      </Sidebar>
    </div>
  );
}

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Use AuthGuard client component to check pathname and conditionally render
  return (
    <AuthGuard
      authenticatedContent={
        <AuthenticatedLayout locale={locale}>{children}</AuthenticatedLayout>
      }
    >
      {children}
    </AuthGuard>
  );
}
