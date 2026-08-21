import { notFound } from 'next/navigation';
import { normalizeDashboardRole } from '@/lib/dashboardAccess';
import { AdminGenericTabView, AdminTabSlug } from '@/components/dashboard/views/admin/AdminGenericTabView';
import { DistributorTabView, DistributorTabSlug } from '@/components/dashboard/views/distributor/DistributorTabView';
import { CustomerGenericTabView, CustomerTabSlug } from '@/components/dashboard/views/customer/CustomerGenericTabView';

interface DynamicRoleTabPageProps {
  params: Promise<{ role: string; tab: string }>;
}

const adminTabs: AdminTabSlug[] = [
  'orders',
  'product-catalog',
  'distributors',
  'marketing-kits',
  'settings',
];

const distributorTabs: DistributorTabSlug[] = [
  'create-order',
  'referral-links',
  'marketing-assets',
  'wallet',
  'sales-analytics',
  'team-overrides',
];

const customerTabs: CustomerTabSlug[] = [
  'orders',
  'wishlist',
  'addresses',
  'loyalty-points',
];

export default async function DynamicRoleTabPage({ params }: DynamicRoleTabPageProps) {
  const { role, tab } = await params;
  const normalizedRole = normalizeDashboardRole(role);

  if (normalizedRole === 'admin') {
    if (!adminTabs.includes(tab as AdminTabSlug)) {
      notFound();
    }
    return <AdminGenericTabView tab={tab as AdminTabSlug} />;
  }

  if (normalizedRole === 'distributor') {
    if (!distributorTabs.includes(tab as DistributorTabSlug)) {
      notFound();
    }
    return <DistributorTabView tab={tab as DistributorTabSlug} />;
  }

  if (normalizedRole === 'customer') {
    if (!customerTabs.includes(tab as CustomerTabSlug)) {
      notFound();
    }
    return <CustomerGenericTabView tab={tab as CustomerTabSlug} />;
  }

  notFound();
}
