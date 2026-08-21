'use client';

import React from 'react';
import { AppView, DistributorProfile } from '@/types';

interface DistributorSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  distributor: DistributorProfile;
  onOpenWithdrawModal: () => void;
  onSwitchToStore: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const DistributorSidebar: React.FC<DistributorSidebarProps> = ({
  currentView,
  onNavigate,
  distributor,
  onOpenWithdrawModal,
  onSwitchToStore,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'partner-dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'partner-create-order', label: 'Create Order', icon: 'add_shopping_cart' },
    { id: 'partner-referral-links', label: 'Referral Links', icon: 'share' },
    { id: 'partner-marketing-assets', label: 'Marketing Assets', icon: 'perm_media' },
    { id: 'partner-wallet', label: 'Wallet', icon: 'account_balance_wallet' },
    { id: 'partner-sales-analytics', label: 'Sales Analytics', icon: 'analytics' },
    { id: 'partner-team-overrides', label: 'Team Overrides', icon: 'groups' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        id="distributor-portal-sidebar"
        className={`dashboard-sidebar fixed left-0 top-0 h-screen w-72 bg-wellora-surface-container-low border-r border-wellora-outline-variant/30 z-50 flex flex-col p-6 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Profile Header */}
        <div className="mb-6 flex flex-col items-center text-center relative">
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden absolute top-0 right-0 p-1 text-wellora-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}

          <h1 className="font-headline-sm text-lg font-bold text-wellora-on-primary-fixed mb-0.5">
            WELLORA Partner
          </h1>
          <p className="font-body-sm text-xs text-wellora-on-surface-variant mb-3 font-medium">
            {distributor.tier}
          </p>

          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-wellora-outline-variant/40 bg-wellora-surface-container-lowest shadow-xs">
            <img
              src={distributor.avatar}
              alt="Distributor Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="mt-2 text-xs font-semibold text-wellora-on-background">
            {distributor.name}
          </span>
          <span className="text-[10px] bg-wellora-tertiary-container/30 text-wellora-on-tertiary-container px-2 py-0.5 rounded-full font-label-caps mt-0.5 font-bold">
            {distributor.roleBadge}
          </span>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-wellora-surface-tint text-wellora-on-primary shadow-xs translate-x-1'
                    : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container-high hover:text-wellora-on-background'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-4 border-t border-wellora-outline-variant/30 flex flex-col gap-1.5">
          <button
            id="sidebar-withdraw-btn"
            onClick={onOpenWithdrawModal}
            className="w-full py-2.5 mb-1 bg-wellora-primary-container text-wellora-on-primary-container font-label-caps text-xs font-bold rounded-lg hover:bg-wellora-primary-fixed transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">payments</span>
            <span>Withdraw Funds</span>
          </button>

          <button
            id="sidebar-switch-store-btn"
            onClick={onSwitchToStore}
            className="flex items-center gap-2.5 px-3 py-2 text-wellora-surface-tint hover:bg-wellora-primary-container/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">store</span>
            <span>Customer Storefront</span>
          </button>

          <div className="flex items-center justify-between pt-1 text-[11px] text-wellora-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Sync Active
            </span>
            <span className="font-mono font-semibold text-wellora-on-background">BDT ৳</span>
          </div>
        </div>
      </aside>
    </>
  );
};
