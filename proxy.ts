import { NextRequest, NextResponse } from "next/server";
import { locales, type Locale } from "./i18n/config";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Read existing locale cookie or default to "en"
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const locale: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : "en";

  const response = NextResponse.next();
  
  // Set the cookie if not already set
  if (!cookieLocale) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};