'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateOrderView } from '@/components/portal/CreateOrderView';
import { DistributorDashboard } from '@/components/portal/DistributorDashboard';
import { DistributorSidebar } from '@/components/portal/DistributorSidebar';
import { MarketingAssetLibrary } from '@/components/portal/MarketingAssetLibrary';
import { ReferralLinksView } from '@/components/portal/ReferralLinksView';
import { SalesAnalyticsView } from '@/components/portal/SalesAnalyticsView';
import { TeamOverridesView } from '@/components/portal/TeamOverridesView';
import { TrackingModal } from '@/components/portal/TrackingModal';
import { WalletModal } from '@/components/portal/WalletModal';
import {
  INITIAL_DISTRIBUTOR,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from '@/data/mockData';
import { AppView, DistributorOrder, DistributorProfile } from '@/interface/universal';
import type { PartnerTab } from '@/components/portal/partnerTabs';

const tabViews: Record<PartnerTab, AppView> = {
  dashboard: 'partner-dashboard',
  'create-order': 'partner-create-order',
  'referral-links': 'partner-referral-links',
  'marketing-assets': 'partner-marketing-assets',
  wallet: 'partner-wallet',
  'sales-analytics': 'partner-sales-analytics',
  'team-overrides': 'partner-team-overrides',
};

interface PartnerPortalPageProps {
  activeTab?: PartnerTab;
}

export function PartnerPortalPage({ activeTab = 'dashboard' }: PartnerPortalPageProps) {
  const router = useRouter();
  const [distributor, setDistributor] = useState<DistributorProfile>(INITIAL_DISTRIBUTOR);
  const [orders, setOrders] = useState<DistributorOrder[]>(INITIAL_ORDERS);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<DistributorOrder | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(activeTab === 'wallet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const navigateToTab = (view: AppView) => {
    const tab = Object.entries(tabViews).find(([, value]) => value === view)?.[0];
    if (tab) router.push(tab === 'dashboard' ? '/account' : `/account/${tab}`);
  };

  const handleCreateOrder = (newOrderData: Omit<DistributorOrder, 'id' | 'date'>) => {
    const newOrder: DistributorOrder = {
      ...newOrderData,
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    setDistributor((currentDistributor) => ({
      ...currentDistributor,
      totalSales: currentDistributor.totalSales + newOrder.amount,
      pendingCommissions: currentDistributor.pendingCommissions + newOrder.commission,
    }));
  };

  const handleWithdrawSuccess = (amount: number) => {
    setDistributor((currentDistributor) => ({
      ...currentDistributor,
      availableBalance: Math.max(0, currentDistributor.availableBalance - amount),
    }));
    showToast(`Withdrawal of ৳${amount.toLocaleString()} processed successfully.`);
  };

  return (
    <main className="min-h-screen bg-wellora-background">
      <DistributorSidebar
        currentView={tabViews[activeTab]}
        onNavigate={navigateToTab}
        distributor={distributor}
        onOpenWithdrawModal={() => setWalletModalOpen(true)}
        onSwitchToStore={() => router.push('/')}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col md:pl-72">
        {activeTab === 'dashboard' && (
          <DistributorDashboard
            distributor={distributor}
            orders={orders}
            products={INITIAL_PRODUCTS}
            onCreateOrder={handleCreateOrder}
            onOpenWithdrawModal={() => setWalletModalOpen(true)}
            onSelectOrderTracking={setTrackingOrder}
            onToast={showToast}
            onSwitchToStore={() => router.push('/')}
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          />
        )}
        {activeTab === 'create-order' && (
          <CreateOrderView products={INITIAL_PRODUCTS} onCreateOrder={handleCreateOrder} onToast={showToast} onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        )}
        {activeTab === 'referral-links' && (
          <ReferralLinksView distributor={distributor} products={INITIAL_PRODUCTS} onToast={showToast} onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        )}
        {activeTab === 'marketing-assets' && (
          <MarketingAssetLibrary onToast={showToast} onOpenMobileMenu={() => setMobileSidebarOpen(true)} referralCode={distributor.referralCode} />
        )}
        {activeTab === 'sales-analytics' && (
          <SalesAnalyticsView distributor={distributor} onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        )}
        {activeTab === 'team-overrides' && (
          <TeamOverridesView distributor={distributor} onOpenMobileMenu={() => setMobileSidebarOpen(true)} onToast={showToast} />
        )}
        {activeTab === 'wallet' && (
          <div className="min-h-screen bg-wellora-background p-4 sm:p-8 lg:p-10">
            <div className="rounded-xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
              <h2 className="text-xl font-bold text-wellora-on-background">Partner Wallet</h2>
              <p className="mt-1 text-sm text-wellora-on-surface-variant">Manage your available commissions and payout methods.</p>
              <button onClick={() => setWalletModalOpen(true)} className="mt-6 rounded-lg bg-wellora-surface-tint px-5 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant">
                Request payout
              </button>
            </div>
          </div>
        )}
      </div>
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => {
          setWalletModalOpen(false);
          if (activeTab === 'wallet') router.push('/account');
        }}
        distributor={distributor}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
      <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] rounded-lg bg-wellora-inverse-surface px-4 py-3 text-sm text-wellora-on-primary shadow-lg" role="status">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
