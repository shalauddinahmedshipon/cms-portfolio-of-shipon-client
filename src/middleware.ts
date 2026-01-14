import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const PROTECTED_ROUTES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("access_token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 🔒 Not logged in → trying to access protected route
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Logged in → trying to access login page
  if (isPublicRoute && accessToken) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
