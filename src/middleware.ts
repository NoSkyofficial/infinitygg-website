import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isWhitelistRoute = request.nextUrl.pathname.startsWith("/whitelist");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // Allow auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // For protected routes, check session
  if (isAdminRoute || isWhitelistRoute) {
    const session = await auth();
    
    if (!session?.user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/whitelist/:path*"],
};
