'use client';

import { useParams, notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { getRoleDashboardConfig } from '@/config/dashboard.config';
import { normalizeDashboardRole } from '@/lib/dashboardAccess';

interface RoleLayoutProps {
  children: ReactNode;
}

export default function DynamicRoleLayout({ children }: RoleLayoutProps) {
  const params = useParams();
  const role = typeof params.role === 'string' ? params.role : '';

  const validRoles = ['admin', 'distributor', 'partner', 'customer'];
  if (!validRoles.includes(role.toLowerCase())) {
    notFound();
  }

  const normalizedRole = normalizeDashboardRole(role);
  const config = getRoleDashboardConfig(normalizedRole);

  return (
    <DashboardLayout
      role={normalizedRole}
      portalTitle={config.portalTitle}
      portalSubtitle={config.portalSubtitle}
      roleBadge={config.roleBadge}
    >
      {children}
    </DashboardLayout>
  );
}