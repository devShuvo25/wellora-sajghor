import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = ['/dashboard', '/account'];
const authOnlyRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthOnlyRoute = authOnlyRoutes.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated user trying to access a protected route -> Redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access login/register -> Redirect to /dashboard
  if (isAuthOnlyRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ],
};