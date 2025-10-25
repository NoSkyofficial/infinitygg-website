import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isWhitelistRoute = request.nextUrl.pathname.startsWith("/whitelist");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // Allow auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Protect admin and whitelist routes
  if ((isAdminRoute || isWhitelistRoute) && !token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/whitelist/:path*"],
};
