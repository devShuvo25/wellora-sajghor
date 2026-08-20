export type DashboardRole = 'admin' | 'partner' | 'customer';

export const dashboardRoutes: Record<DashboardRole, string> = {
  admin: '/dashboard/admin',
  partner: '/account',
  customer: '/account/custommer',
};

export function normalizeDashboardRole(role?: string | null): DashboardRole {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'admin' || normalizedRole === 'administrator') {
    return 'admin';
  }

  if (normalizedRole === 'partner' || normalizedRole === 'distributor') {
    return 'partner';
  }

  return 'customer';
}

export function resolveDashboardRoute(role?: string | null): string {
  return dashboardRoutes[normalizeDashboardRole(role)];
}