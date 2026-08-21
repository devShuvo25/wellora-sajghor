'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut, ArrowLeftRight } from 'lucide-react';
import { DashboardTabConfig } from '@/types/dashboard';
import { UserProfile } from '@/types/navigation';

interface DashboardSidebarProps {
  portalTitle: string;
  portalSubtitle: string;
  roleBadge: string;
  items: DashboardTabConfig[];
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  onOpenWithdrawModal?: () => void;
}

function renderSidebarIcon(icon: unknown, isActive: boolean) {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <span className="material-symbols-outlined text-lg">{icon}</span>;
  }
  if (React.isValidElement(icon)) {
    return icon;
  }
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    const IconComponent = icon as React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    return <IconComponent size={18} strokeWidth={1.8} className={isActive ? 'text-white' : 'text-wellora-surface-tint'} />;
  }
  return null;
}

export function DashboardSidebar({
  portalTitle,
  portalSubtitle,
  roleBadge,
  items,
  user,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onOpenWithdrawModal,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between p-6">
      {/* Brand & Portal Header */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <Link
              href="/"
              className="font-headline-md text-xl font-bold tracking-tight text-wellora-on-background hover:text-wellora-surface-tint transition-colors"
            >
              {portalTitle}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-label-caps text-[10px] tracking-widest text-wellora-on-surface-variant uppercase font-semibold">
                {portalSubtitle}
              </span>
              <span className="rounded-full bg-wellora-primary-fixed/80 px-2 py-0.5 font-label-caps text-[9px] font-bold text-wellora-on-primary-fixed-variant">
                {roleBadge}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="md:hidden rounded-lg p-1.5 text-wellora-on-surface-variant hover:bg-wellora-surface-container-high transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1" aria-label="Sidebar navigation">
          {items.map((item) => {
            const Icon = item.icon;
            const isRootPath = item.href.split('/').length === 3;
            const isActive = isRootPath
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-wellora-surface-tint text-wellora-on-primary shadow-sm translate-x-1'
                    : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container-high hover:text-wellora-on-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  {renderSidebarIcon(Icon, isActive)}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Quick Actions Footer */}
      <div className="flex flex-col gap-3 border-t border-wellora-outline-variant/30 pt-4">
        {onOpenWithdrawModal && (
          <button
            type="button"
            onClick={onOpenWithdrawModal}
            className="w-full py-2.5 bg-wellora-primary-container text-wellora-on-primary-container font-label-caps text-xs font-bold rounded-lg hover:bg-wellora-primary-fixed transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Request Payout</span>
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-wellora-surface-tint hover:bg-wellora-surface-container-high transition-colors"
        >
          <ArrowLeftRight size={16} />
          <span>Switch to Storefront</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border border-wellora-outline-variant/40 shrink-0"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wellora-primary-container font-bold text-xs text-wellora-on-primary-container">
                {user.initials || 'WL'}
              </div>
            )}
            <div className="truncate">
              <p className="truncate text-xs font-bold text-wellora-on-background">{user.name}</p>
              <p className="font-label-caps text-[10px] text-wellora-on-surface-variant truncate">
                {user.tier || user.roleTitle}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              className="rounded-lg p-2 text-wellora-on-surface-variant hover:bg-wellora-surface-container hover:text-wellora-error transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden h-dvh w-72 flex-col border-r border-wellora-outline-variant/20 bg-wellora-surface-container-low md:flex">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-wellora-on-background/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative z-50 h-full w-72 bg-wellora-surface-container-low shadow-2xl animate-slideIn">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
