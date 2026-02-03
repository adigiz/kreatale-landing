import { Suspense } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/cms/auth/config";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side session check
  const session = await getSession();

  if (session) {
    redirect(`/${locale}/admin`);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex justify-center">
              <Image
                src="/kreatale-logo-primary.svg"
                alt="Kreatale"
                width={40}
                height={40}
                className="shrink-0"
              />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Admin Login
              </h2>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
