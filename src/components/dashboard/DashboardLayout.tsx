'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { getRoleDashboardConfig } from '@/config/dashboard.config';
import { DashboardRole, DashboardTabConfig } from '@/types/dashboard';
import { NavItem, UserProfile } from '@/types/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: DashboardRole | string;
  portalTitle?: string;
  portalSubtitle?: string;
  roleBadge?: string;
  navigationItems?: (NavItem | DashboardTabConfig)[];
  settingsHref?: string;
  user?: UserProfile;
  activeTab?: string;
  headerActions?: React.ReactNode;
  showFooter?: boolean;
  onOpenWithdrawModal?: () => void;
}

export function DashboardLayout({
  children,
  role = 'admin',
  portalTitle: propTitle,
  portalSubtitle: propSubtitle,
  roleBadge: propBadge,
  navigationItems: propItems,
  user: propUser,
  headerActions,
  showFooter = true,
  onOpenWithdrawModal,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const authUser = useAppSelector((state) => state.auth.user);
  const activeConfig = getRoleDashboardConfig(role);

  const portalTitle = propTitle || activeConfig.portalTitle;
  const portalSubtitle = propSubtitle || activeConfig.portalSubtitle;
  const roleBadge = propBadge || activeConfig.roleBadge;
  const navigationItems = (propItems || activeConfig.items) as DashboardTabConfig[];

  const user: UserProfile = propUser || {
    name: authUser?.name || activeConfig.defaultUser.name,
    roleTitle: activeConfig.defaultUser.roleTitle,
    initials:
      authUser?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || activeConfig.defaultUser.initials,
    avatar: activeConfig.defaultUser.avatar,
    tier: activeConfig.defaultUser.tier,
    email: authUser?.email || activeConfig.defaultUser.email,
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <ProtectedRoute allowedRoles={[activeConfig.role]}>
      <div className="min-h-screen bg-wellora-background text-wellora-on-background flex flex-col selection:bg-wellora-primary-fixed selection:text-wellora-on-primary-fixed-variant">
        {/* Dynamic Unified Sidebar */}
        <DashboardSidebar
          portalTitle={portalTitle}
          portalSubtitle={portalSubtitle}
          roleBadge={roleBadge}
          items={navigationItems}
          user={user}
          isOpenMobile={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={handleLogout}
          onOpenWithdrawModal={onOpenWithdrawModal}
        />

        {/* Main Viewport */}
        <div className="flex flex-1 flex-col min-h-screen md:pl-72 transition-all duration-300">
          {/* Dynamic Top Header */}
          <DashboardHeader
            portalTitle={portalTitle}
            roleBadge={roleBadge}
            user={user}
            onOpenMobileMenu={() => setMobileOpen(true)}
            actions={headerActions}
          />

          {/* Dynamic Page Content Viewport */}
          <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-10 animate-fadeIn">
            {children}
          </main>

          {/* Dashboard Footer */}
          {showFooter && <DashboardFooter role={activeConfig.role} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
