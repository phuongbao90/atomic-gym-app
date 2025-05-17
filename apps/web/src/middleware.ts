import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "./auth";
import pages from "next/dist/build/templates/pages";
export { auth } from "./auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const locales = ["en", "es"];
const protectedPages = ["/dashboard/*"];
const authPages = ["/auth/signin", "/auth/signup"];

const testPagesRegex = (pages: string[], pathname: string) => {
  const regex = `^(/(${locales.join("|")}))?(${pages
    .map((p) => p.replace("/*", ".*"))
    .join("|")})/?$`;
  return new RegExp(regex, "i").test(pathname);
};

// const handleAuth = async (
//   req: NextRequest,
//   isAuthPage: boolean,
//   isProtectedPage: boolean
// ) => {
//   const session = await auth();
//   const isAuth = !!session?.user;

//   if (!isAuth && isProtectedPage) {
//     let from = req.nextUrl.pathname;
//     if (req.nextUrl.search) {
//       from += req.nextUrl.search;
//     }

//     return NextResponse.redirect(
//       new URL(
//         `${pages.auth.signin()}?from=${encodeURIComponent(from)}`,
//         req.url
//       )
//     );
//   }

//   if (isAuth && isAuthPage) {
//     return NextResponse.redirect(new URL(pages.dashboard.root, req.nextUrl));
//   }

//   return intlMiddleware(req);
// };

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
