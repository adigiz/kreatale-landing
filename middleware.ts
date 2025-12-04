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
  
  // Add pathname to request headers so server components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  
  // If response is a redirect, clone it and add the header
  if (response instanceof NextResponse) {
    // Clone the response to modify headers
    const newResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Copy status and headers from intl middleware response
    if (response.status >= 300 && response.status < 400) {
      // It's a redirect - return the redirect but with modified request headers
      return response;
    }
    
    return newResponse;
  }
  
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
