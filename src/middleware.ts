import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/account'];

export function middleware(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!isProtectedRoute || request.cookies.has('token')) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/account/:path*'],
};