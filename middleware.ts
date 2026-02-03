import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // Call next-intl middleware
  const response = intlMiddleware(request);
  
  // Get pathname (after locale processing)
  const pathname = request.nextUrl.pathname;
  const locale = pathname.startsWith("/id") ? "id" : "en";
  
  // Auth Check: Redirect from login to dashboard if already logged in
  const isLoginPage = pathname.endsWith("/admin/login");
  const token = request.cookies.get("next-auth.session-token") || 
                request.cookies.get("__Secure-next-auth.session-token");

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }
  
  // Add pathname to request headers so server components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  
  // If response is a redirect from intl, just return it
  if (response instanceof NextResponse && response.status >= 300 && response.status < 400) {
     return response;
  }

  // Otherwise return response with updated headers
  const finalResponse = response instanceof NextResponse ? response : NextResponse.next();
  // Headers are only easily set on NextResponse.next({ request: { headers } }) 
  // or by modifying the response headers. For server components to see them, 
  // we must return the result of NextResponse.next
  
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
