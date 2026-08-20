'use client';

import Link from 'next/link';

export function DashboardFooter({ role }: { role: 'admin' | 'partner' | 'customer' }) {
  const accountRoute = role === 'admin' ? '/dashboard/admin' : role === 'partner' ? '/account' : '/account/custommer';

  return (
    <footer className="border-t border-[#d3c3c4]/40 bg-[#e1e3e4] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 text-sm text-[#4f4445] md:flex-row md:items-center md:justify-between">
        <Link href={accountRoute} className="font-headline-sm text-[#72585a] hover:opacity-75">WELLORA</Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Dashboard footer navigation">
          <Link href="/">Storefront</Link>
          <Link href={accountRoute}>Account</Link>
          <Link href="/">Support</Link>
          <Link href="/">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
