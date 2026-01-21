// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/services",
    "/events",
    "/membership",
    "/gallery",
    "/contact-us",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password"
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    "/learning-hub",
    "/profile",
    "/settings"
  ];

  // Admin routes
  const adminRoutes = [
    "/admin"
  ];

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))
  ) {
    return NextResponse.next();
  }

  // Check if current path requires authentication
  const requiresAuth = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  const requiresAdmin = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect to login if no token and trying to access protected route
  if ((requiresAuth || requiresAdmin) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user has token and is trying to access auth pages, redirect to learning hub
  if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/learning-hub", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image directories)
     * - assets/ (asset directories)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|assets/|logo.svg|login-bg.jpg).*)",
  ],
};