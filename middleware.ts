import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const locales = ["en", "fr"];
const defaultLocale = "fr";

function getLocale(request: NextRequest) {
  // Simple locale detection
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage && acceptLanguage.toLowerCase().startsWith("en")) {
    return "en";
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if it's an internal next.js path or public file or api
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon" ||
    pathname === "/apple-icon"
  ) {
    return;
  }

  // Handle Admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return;
    }
    const token = request.cookies.get("auth_token");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return;
  }

  // Check if the pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|.*\\..*).*)",
  ],
};
