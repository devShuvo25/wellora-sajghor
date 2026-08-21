'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, Store, Shield } from 'lucide-react';
import { UserProfile } from '@/types/navigation';

interface DashboardHeaderProps {
  portalTitle: string;
  roleBadge: string;
  user: UserProfile;
  onOpenMobileMenu: () => void;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  portalTitle,
  roleBadge,
  user,
  onOpenMobileMenu,
  actions,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wellora-outline-variant/30 bg-wellora-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar menu"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-wellora-on-surface-variant hover:bg-wellora-surface-container md:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <Link href="/" className="font-headline-sm font-bold tracking-tight text-wellora-on-background hover:text-wellora-surface-tint md:hidden">
            {portalTitle}
          </Link>
          <span className="hidden rounded-full bg-wellora-primary-fixed/80 px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-wellora-on-primary-fixed-variant md:inline-flex items-center gap-1">
            <Shield size={12} />
            {roleBadge}
          </span>
        </div>
      </div>

      {/* Desktop Header Actions */}
      <div className="flex items-center gap-3">
        {actions}

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-wellora-outline-variant/50 bg-wellora-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-wellora-surface-tint hover:bg-wellora-surface-container-low transition-colors"
        >
          <Store size={15} />
          <span>Customer Store</span>
        </Link>

        {/* Live sync badge */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync Active</span>
        </div>

        {/* Notification Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full border border-wellora-outline-variant/40 bg-wellora-surface-container-lowest p-2 text-wellora-on-surface-variant hover:bg-wellora-surface-container hover:text-wellora-on-background transition-colors"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-wellora-error"></span>
        </button>

        {/* User initials bubble on mobile */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wellora-primary-container font-bold text-xs text-wellora-on-primary-container md:hidden">
          {user.initials || 'WL'}
        </div>
      </div>
    </header>
  );
}
