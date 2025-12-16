// middleware.ts (App Router)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { withAuth } from "next-auth/middleware"; // if you use next-auth

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public access to the verify route
  if (pathname.startsWith("/doctor/pin/verify")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/dv")) {
    return NextResponse.next();
  }

  // …your existing auth logic here (e.g., withAuth) …
  return NextResponse.next();
}

// If you already have a config.matcher, keep it;
// no need to match the public path above since we early-return.
export const config = {
  matcher: [
    // typical examples:
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
  ],
};
