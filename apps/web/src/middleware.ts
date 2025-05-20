import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import createIntlMiddleware from "next-intl/middleware";

const publicPages = ["/", "/auth/login", "/auth/register"];

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  localePrefix: "as-needed",
  defaultLocale: "en",
});

export default async function middleware(req: NextRequest) {
  const session = await auth();

  // Get the pathname without the locale prefix
  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  // Check if the current page is a public page
  if (publicPages.includes(pathnameWithoutLocale)) {
    return intlMiddleware(req);
  }

  // For protected pages, check if the user is authenticated
  if (!session) {
    // If not authenticated, redirect to the sign-in page
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // If authenticated, run i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|manifest.json|fonts).*)",
  ],
};
