export type DashboardRole = 'admin' | 'distributor' | 'partner' | 'customer';

export const dashboardRoutes: Record<DashboardRole, string> = {
  admin: '/dashboard/admin',
  distributor: '/dashboard/distributor',
  partner: '/dashboard/distributor',
  customer: '/dashboard/customer',
};

export function normalizeDashboardRole(role?: string | null): DashboardRole {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'admin' || normalizedRole === 'administrator') {
    return 'admin';
  }

  if (normalizedRole === 'partner' || normalizedRole === 'distributor') {
    return 'distributor';
  }

  return 'customer';
}

export function resolveDashboardRoute(role?: string | null): string {
  return dashboardRoutes[normalizeDashboardRole(role)];
}