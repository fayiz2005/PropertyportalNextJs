import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/auth/dashboard", "/auth/settings"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );


  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userRole = token.role;

    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};
