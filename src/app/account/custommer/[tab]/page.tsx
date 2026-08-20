import { notFound } from 'next/navigation';
import CustomerDashboardPage from '@/app/account/custommer/page';

const customerTabs: Record<string, string> = {
  orders: 'Orders',
  wishlist: 'Wishlist',
  addresses: 'Addresses',
  'loyalty-points': 'Loyalty Points',
};

export default async function CustomerTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const activeSection = customerTabs[tab];

  if (!activeSection) {
    notFound();
  }

  return <CustomerDashboardPage activeSection={activeSection} />;
}