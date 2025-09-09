import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "id"],

  // Used when no locale matches
  defaultLocale: "en",

  // Always show locale prefix in URL
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - all root files inside /public (e.g. favicon.ico)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
