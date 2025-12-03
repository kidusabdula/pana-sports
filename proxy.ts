// proxy.ts
// This is unconventional - Next.js expects 'middleware.ts' or 'middleware.js'
// But here's how you would structure it if you want proxy.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, api routes, and auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/unauthorized")
  ) {
    return NextResponse.next();
  }

  // Create Supabase client and verify user authentication
  const supabase = await createClient();

  // Use getUser() instead of getSession() for better security
  // getUser() authenticates with the Supabase Auth server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Protect CMS routes - require admin role
  if (pathname.startsWith("/cms")) {
    if (error || !user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (user.user_metadata?.role !== "admin") {
      // Redirect to unauthorized page if not admin
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Export as middleware for Next.js to recognize
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - images, fonts, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
