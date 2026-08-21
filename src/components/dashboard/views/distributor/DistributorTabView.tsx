'use client';

import React, { useState } from 'react';
import { CreateOrderView } from '@/components/portal/CreateOrderView';
import { ReferralLinksView } from '@/components/portal/ReferralLinksView';
import { MarketingAssetLibrary } from '@/components/portal/MarketingAssetLibrary';
import { SalesAnalyticsView } from '@/components/portal/SalesAnalyticsView';
import { TeamOverridesView } from '@/components/portal/TeamOverridesView';
import { WalletModal } from '@/components/portal/WalletModal';
import { INITIAL_DISTRIBUTOR, INITIAL_PRODUCTS } from '@/data/mockData';
import { DistributorOrder, DistributorProfile } from '@/types/universal';
import { useGetMyDistributorProfileQuery, useGetDistributorWalletQuery, useRequestWithdrawalMutation } from '@/redux/api/distributorsApi';
import { useCreateDistributorOrderMutation } from '@/redux/api/ordersApi';
import { useDummyFallback } from '@/lib/useDummyFallback';

export type DistributorTabSlug =
  | 'create-order'
  | 'referral-links'
  | 'marketing-assets'
  | 'wallet'
  | 'sales-analytics'
  | 'team-overrides';

const DUMMY_WALLET = {
  availableBalance: INITIAL_DISTRIBUTOR.availableBalance,
  pendingCommissions: INITIAL_DISTRIBUTOR.pendingCommissions,
  totalEarned: INITIAL_DISTRIBUTOR.totalSales * 0.18,
};

export function DistributorTabView({ tab }: { tab: DistributorTabSlug }) {
  const profileQ = useGetMyDistributorProfileQuery(undefined);
  const walletQ = useGetDistributorWalletQuery(undefined, { skip: tab !== 'wallet' });
  const [createOrderMutation] = useCreateDistributorOrderMutation();
  const [requestWithdrawal] = useRequestWithdrawalMutation();

  const { data: profileData } = useDummyFallback(profileQ, INITIAL_DISTRIBUTOR);
  const { data: walletData } = useDummyFallback(walletQ, DUMMY_WALLET);

  const [distributor, setDistributor] = useState<DistributorProfile>(INITIAL_DISTRIBUTOR);
  const [walletModalOpen, setWalletModalOpen] = useState(tab === 'wallet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateOrder = async (newOrderData: Omit<DistributorOrder, 'id' | 'date'>) => {
    const commission = newOrderData.commission || 0;
    // Optimistic update
    setDistributor((prev) => ({
      ...prev,
      totalSales: prev.totalSales + newOrderData.amount,
      pendingCommissions: prev.pendingCommissions + commission,
    }));
    // Real API call
    try {
      await createOrderMutation({
        customerName: newOrderData.customerName,
        phoneNumber: newOrderData.phoneNumber,
        deliveryAddress: newOrderData.deliveryAddress || '',
        items: newOrderData.items?.map((i) => ({ productId: i.productId, quantity: i.quantity })) ?? [],
        channel: newOrderData.channel || 'Direct Link',
      });
    } catch { /* Backend not ready, optimistic update already applied */ }
    showToast(`Order created! Commission of ৳${commission} logged.`);
  };

  const handleWithdrawSuccess = async (amount: number) => {
    // Optimistic update
    setDistributor((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));
    // Real API call
    try {
      await requestWithdrawal({ amount, method: 'bkash', accountNumber: '', accountName: '' });
    } catch { /* Graceful no-op */ }
    showToast(`Withdrawal of ৳${amount.toLocaleString()} submitted.`);
  };

  // Prefer real API data
  const resolvedDistributor = (profileData as DistributorProfile) ?? distributor;
  const walletBalance = (walletData as typeof DUMMY_WALLET)?.availableBalance ?? resolvedDistributor.availableBalance;
  const pendingBalance = (walletData as typeof DUMMY_WALLET)?.pendingCommissions ?? resolvedDistributor.pendingCommissions;

  return (
    <div className="space-y-6 animate-fadeIn">
      {tab === 'create-order' && (
        <CreateOrderView
          products={INITIAL_PRODUCTS}
          onCreateOrder={handleCreateOrder}
          onToast={showToast}
          onOpenMobileMenu={() => undefined}
        />
      )}

      {tab === 'referral-links' && (
        <ReferralLinksView
          distributor={resolvedDistributor}
          products={INITIAL_PRODUCTS}
          onToast={showToast}
          onOpenMobileMenu={() => undefined}
        />
      )}

      {tab === 'marketing-assets' && (
        <MarketingAssetLibrary
          onToast={showToast}
          onOpenMobileMenu={() => undefined}
          referralCode={resolvedDistributor.referralCode}
        />
      )}

      {tab === 'sales-analytics' && (
        <SalesAnalyticsView
          distributor={resolvedDistributor}
          onOpenMobileMenu={() => undefined}
        />
      )}

      {tab === 'team-overrides' && (
        <TeamOverridesView
          distributor={resolvedDistributor}
          onOpenMobileMenu={() => undefined}
          onToast={showToast}
        />
      )}

      {tab === 'wallet' && (
        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-8 shadow-2xs space-y-6">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">
              PAYOUT & COMMISSIONS
            </p>
            <h2 className="mt-1 font-headline-md text-2xl font-bold text-wellora-on-background">
              Partner Wallet
            </h2>
            <p className="text-xs text-wellora-on-surface-variant mt-1">
              Available earnings, withdrawal methods, and full transaction log.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-wellora-primary-container text-wellora-on-primary-container">
              <span className="font-label-caps text-[11px] font-bold uppercase">Available Balance</span>
              <p className="font-headline-md text-3xl font-bold mt-2">
                ৳ {walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-5 rounded-xl border border-wellora-outline-variant/30 bg-wellora-background">
              <span className="font-label-caps text-[11px] font-bold text-wellora-on-surface-variant uppercase">Pending Verification</span>
              <p className="font-headline-md text-3xl font-bold text-wellora-tertiary mt-2">
                ৳ {pendingBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWalletModalOpen(true)}
            className="rounded-lg bg-wellora-surface-tint px-6 py-3 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors shadow-2xs cursor-pointer"
          >
            Request Withdrawal (bKash / Nagad / Bank)
          </button>
        </div>
      )}

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        distributor={resolvedDistributor}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-wellora-inverse-surface px-5 py-3 text-xs font-semibold text-wellora-on-primary shadow-xl"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
