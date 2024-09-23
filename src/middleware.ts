import authConfig from "@/auth.config";

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
interface AppRouteHandlerFnContext {
  params?: Record<string, string | string[]>;
}
const i18nMiddleware = createMiddleware(routing);

export const middleware = (
  request: NextRequest,
  event: AppRouteHandlerFnContext,
): NextResponse => {
  return NextAuth(authConfig).auth(() => {
    return i18nMiddleware(request);
  })(request, event) as NextResponse;
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static).*)",
  ],
};
