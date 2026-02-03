import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  // Get pathname
  const pathname = request.nextUrl.pathname;
  
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
