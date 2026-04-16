import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

const LOCALES = ["en", "id"] as const;

export default async function middleware(request: NextRequest) {
  // Get pathname
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // Legacy /{locale}/demo/... → /{locale}/demos/... (permanent redirect)
  const legacyDemo = pathname.match(/^\/(en|id)\/demo\/(.+)$/);
  if (legacyDemo) {
    const url = request.nextUrl.clone();
    url.pathname = `/${legacyDemo[1]}/demos/${legacyDemo[2]}`;
    return NextResponse.redirect(url, 308);
  }

  // Rewrite demo URLs without locale: /dealer-mobil/... -> /en/demos/dealer-mobil/...
  // So shared links like https://kreatale.com/dealer-mobil/package/ferrari work
  const firstSegment = segments[0];
  if (
    firstSegment &&
    !LOCALES.includes(firstSegment as "en" | "id") &&
    firstSegment !== "admin" &&
    firstSegment !== "demo" &&
    firstSegment !== "demos" &&
    firstSegment !== "about" &&
    firstSegment !== "blog" &&
    firstSegment !== "projects" &&
    firstSegment !== "services" &&
    firstSegment !== "privacy" &&
    firstSegment !== "terms" &&
    firstSegment !== "preview"
  ) {
    const demoPath = `/en/demos/${segments.join("/")}`;
    const url = request.nextUrl.clone();
    url.pathname = demoPath;
    return NextResponse.rewrite(url);
  }

  // Auth Check: Redirect from login to dashboard if already logged in
  const normalizedPathname = pathname.replace(/\/$/, "");
  const isLoginPage = normalizedPathname.split('/').filter(Boolean).slice(-2).join('/') === "admin/login";
  
  if (isLoginPage) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token) {
      const locale = pathname.startsWith("/id") ? "id" : "en";
      const redirectUrl = new URL(`/${locale}/admin`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Call next-intl middleware for all other cases
  const response = intlMiddleware(request);
  
  // Add pathname to request headers so server components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  
  // If response is a redirect from intl, just return it
  if (response instanceof NextResponse && response.status >= 300 && response.status < 400) {
     return response;
  }

  // Otherwise return response with updated headers
  const finalResponse = response instanceof NextResponse ? response : NextResponse.next();
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all routes EXCEPT:
    // - /api/* (API routes)
    // - /_next/* (Next.js internals)
    // - /_vercel/* (Vercel internals)
    // - Files with extensions (.*\\..*)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
