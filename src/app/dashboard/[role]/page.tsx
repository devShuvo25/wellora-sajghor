import { notFound } from 'next/navigation';
import { normalizeDashboardRole } from '@/lib/dashboardAccess';
import { AdminOverviewView } from '@/components/dashboard/views/admin';
import { DistributorOverviewView } from '@/components/dashboard/views/distributor';
import { CustomerProfileView } from '@/components/dashboard/views/customer';

interface DynamicRolePageProps {
  params: Promise<{ role: string }>;
}

export default async function DynamicRolePage({ params }: DynamicRolePageProps) {
  const { role } = await params;
  const normalized = normalizeDashboardRole(role);

  if (normalized === 'admin') {
    return <AdminOverviewView />;
  }

  if (normalized === 'distributor') {
    return <DistributorOverviewView />;
  }

  if (normalized === 'customer') {
    return <CustomerProfileView />;
  }

  notFound();
}