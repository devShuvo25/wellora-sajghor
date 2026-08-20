import { notFound } from 'next/navigation';
import { AdminTabPage, type AdminTab } from '@/components/admin/AdminTabPage';

const adminTabs: AdminTab[] = ['orders', 'product-catalog', 'distributors', 'marketing-kits', 'settings'];

export default async function AdminTabRoute({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;

  if (!adminTabs.includes(tab as AdminTab)) {
    notFound();
  }

  return <AdminTabPage tab={tab as AdminTab} />;
}