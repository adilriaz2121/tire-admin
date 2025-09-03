import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./auth";

export default async function middleware(req: NextRequest) {
  const session = await getServerSession();
  const isAuthenticated = !!session;

  const url = req.nextUrl.clone();

  // Redirect authenticated users from /login to /dashboard
  if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Handle access to /dashboard and other pages
  if (req.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect root to dashboard if authenticated, otherwise to login
  if (req.nextUrl.pathname === "/") {
    url.pathname = isAuthenticated ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/", "/login"],
};
