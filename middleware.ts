// export { default } from "next-auth/middleware";
// to secure admin page and all sub routes

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // if (req.nextUrl.pathname.startsWith("/api")) {
    //   return null;
    // }
    if (
      (req.nextUrl.pathname === "/admin" ||
        req.nextUrl.pathname === "/add/user") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    } else if (!req.nextauth.token) {
      return NextResponse.rewrite(new URL("/sign-in", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

// export default async function middleware(
//   req: NextRequest,
//   event: NextFetchEvent
// ) {
//   const token = await getToken({ req });
//   const isAuthenticated = !!token;

//   if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
//     return NextResponse.redirect(new URL("/", req.url));
//   } else if (
//     (req.nextUrl.pathname === "/admin" ||
//       req.nextUrl.pathname === "/add/user") &&
//     token?.role !== "admin"
//   ) {
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   const authMiddleware = withAuth({
//     pages: {
//       signIn: "/sign-in",
//     },
//   });

//   // @ts-expect-error
//   return await authMiddleware(req, event);
// }

export const config = {
  matcher: [
    "/admin",
    "/",
    "/members",
    "/news",
    "/messages",
    "/add/:path*",
    "/edit/:path*",
  ],
};
