import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isDemo = req.cookies.get("demo-mode")?.value === "true";
  const { pathname } = req.nextUrl;

  // Allow next-auth endpoint, login page, static files, or active session / demo session
  if (
    token ||
    isDemo ||
    pathname.includes("/api/auth") ||
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/mock-audio") ||
    pathname === "/favicon.ico" ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated or in demo mode
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Intercept all routes except asset files
    "/((?!_next/static|_next/image|favicon.ico|images|sw.js).*)",
  ],
};
