"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const defaultCallback = `/${locale}/admin`;
  const rawCallback = searchParams.get("callbackUrl");
  // Prevent open redirect: allow only relative paths (e.g. /en/admin or /en/admin/posts)
  const callbackUrl =
    typeof rawCallback === "string" &&
    rawCallback.startsWith("/") &&
    !rawCallback.startsWith("//") &&
    !rawCallback.includes("\\") // browsers read "/\evil.com" as "//evil.com"
      ? rawCallback
      : defaultCallback;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error.startsWith("Too many attempts")
            ? result.error
            : "Invalid email or password",
        );
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Link href={`/${locale}`} aria-label="Kreatale home">
        <Image src="/kreatale-logo-primary.svg" alt="Kreatale" width={56} height={56} className="shrink-0" />
      </Link>
      <h1 className="text-center text-[clamp(56px,11vw,120px)] font-extrabold uppercase leading-[0.86] tracking-[-0.055em] text-primary">
        Back
        <br />
        to work.
      </h1>
      <div className="shadow-brand max-w-md w-full space-y-6 rounded-[26px] border bg-card p-7">
        <div className="space-y-1">
          <p className="label-mono text-muted-foreground">Kreatale admin</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Sign in</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold leading-none"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-12 w-full rounded-xl border px-4 text-base transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-bold leading-none"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-12 w-full rounded-xl border px-4 text-base transition-colors"
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
      <Link href={`/${locale}`} className="text-sm font-semibold text-foreground hover:text-primary">
        ← Back to website
      </Link>
    </div>
  );
}
