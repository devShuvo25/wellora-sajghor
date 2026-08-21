'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardRole } from '@/types/dashboard';
import { resolveDashboardRoute } from '@/lib/dashboardAccess';

export function DashboardFooter({ role = 'admin' }: { role?: DashboardRole | string }) {
  const accountRoute = resolveDashboardRoute(role);

  return (
    <footer className="border-t border-wellora-outline-variant/30 bg-wellora-surface-container-low px-4 py-8 sm:px-6 lg:px-10 mt-auto">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 text-xs text-wellora-on-surface-variant md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href={accountRoute} className="font-headline-sm text-sm font-bold text-wellora-surface-tint hover:opacity-80">
            WELLORA সাজঘর
          </Link>
          <span className="text-wellora-on-surface-variant/60">| Enterprise Portal</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-medium" aria-label="Dashboard footer navigation">
          <Link href="/" className="hover:text-wellora-surface-tint transition-colors">
            Storefront
          </Link>
          <Link href={accountRoute} className="hover:text-wellora-surface-tint transition-colors">
            Portal Home
          </Link>
          <Link href="/products" className="hover:text-wellora-surface-tint transition-colors">
            Catalog
          </Link>
          <a href="mailto:support@wellora.com.bd" className="hover:text-wellora-surface-tint transition-colors">
            Support Desk
          </a>
        </nav>
      </div>
    </footer>
  );
}
