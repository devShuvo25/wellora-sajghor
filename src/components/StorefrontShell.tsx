'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function StorefrontShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isProductRoute = pathname.startsWith('/products');
  const isDashboardRoute = pathname.startsWith('/account') || pathname.startsWith('/dashboard');

  if (!isProductRoute && !isDashboardRoute) return <>{children}</>;

  if (isDashboardRoute) {
    return (
      <>
        {children}
        <Footer onPartnerClick={() => router.push('/account')} />
      </>
    );
  }

  return (
    <>
      <Navbar
        cartCount={0}
        onOpenCart={() => router.push('/')}
        onNavigateToPartner={() => router.push('/account')}
        onSelectCategory={() => undefined}
        searchQuery=""
        onSearchChange={() => undefined}
        onScrollToSection={(sectionId) => {
          if (pathname === '/') document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
          else router.push(`/#${sectionId}`);
        }}
      />
      <div>{children}</div>
      <Footer onPartnerClick={() => router.push('/account')} />
    </>
  );
}
