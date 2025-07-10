import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Apply secure headers
  res.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self';");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=()");

  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/api/auth")) {
    return res;
  }


  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: authOptions.secret });
    const role = token?.role?.toLowerCase();

    if (!role || !["admin", "superadmin"].includes(role)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",      // protect frontend admin pages
    "/((?!_next/static|_next/image|favicon.ico).*)", // apply headers everywhere else
  ],
};
