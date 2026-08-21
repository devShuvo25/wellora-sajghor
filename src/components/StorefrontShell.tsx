'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function StorefrontShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isProductRoute = pathname.startsWith('/products');
  const isDashboardRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/account');
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-otp') ||
    pathname.startsWith('/change-password');

  // If on Dashboard or Auth routes, render children without storefront wrappers
  if (isDashboardRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // If on standalone product pages
  if (isProductRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar
          cartCount={0}
          onOpenCart={() => router.push('/')}
          onNavigateToPartner={() => router.push('/dashboard/distributor')}
          onSelectCategory={() => undefined}
          searchQuery=""
          onSearchChange={() => undefined}
          onScrollToSection={(sectionId) => {
            if (pathname === '/') document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            else router.push(`/#${sectionId}`);
          }}
        />
        <main className="flex-1">{children}</main>
        <Footer onPartnerClick={() => router.push('/dashboard/distributor')} />
      </div>
    );
  }

  return <>{children}</>;
}
