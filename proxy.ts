import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page without authentication
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect other admin routes
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("auth_token");

    if (!authToken) {
      // Redirect to login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
