import { notFound } from 'next/navigation';
import { PartnerPortalPage } from '@/components/portal/PartnerPortalPage';
import { isPartnerTab } from '@/components/portal/partnerTabs';
import type { PartnerTab } from '@/components/portal/partnerTabs';

interface PartnerTabPageProps {
  params: Promise<{ tab: string }>;
}

export default async function PartnerTabPage({ params }: PartnerTabPageProps) {
  const { tab } = await params;

  if (!isPartnerTab(tab) || tab === 'dashboard') {
    notFound();
  }

  return <PartnerPortalPage activeTab={tab as PartnerTab} />;
}