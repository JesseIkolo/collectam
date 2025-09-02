import { NextResponse, NextRequest } from "next/server";

function getRoleBasedDashboard(userRole: string): string {
  switch (userRole) {
    case "admin":
      return "/dashboard/admin";
    case "org_admin":
      return "/dashboard/org-admin";
    case "collector":
      return "/dashboard/collector";
    case "user":
      return "/dashboard/user";
    default:
      return "/dashboard";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/auth/v2/login", "/auth/v1/register", "/auth/v2/register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const token =
    request.cookies.get("accessToken")?.value ?? request.headers.get("authorization")?.replace("Bearer ", "");

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth/v2/login", request.url));
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/v2/login", request.url));
  }

  if (token && isPublicRoute) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const dashboardUrl = getRoleBasedDashboard(payload.role);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    } catch {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
