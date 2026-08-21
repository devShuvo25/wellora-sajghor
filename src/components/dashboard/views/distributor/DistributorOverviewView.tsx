'use client';

import React, { useState } from 'react';
import { DistributorDashboard } from '@/components/portal/DistributorDashboard';
import { WalletModal } from '@/components/portal/WalletModal';
import { TrackingModal } from '@/components/portal/TrackingModal';
import { INITIAL_DISTRIBUTOR, INITIAL_PRODUCTS } from '@/data/mockData';
import { DistributorOrder, DistributorProfile } from '@/types/universal';
import { useGetMyDistributorProfileQuery, useGetDistributorWalletQuery } from '@/redux/api/distributorsApi';
import { useGetDistributorOrdersQuery, useCreateDistributorOrderMutation } from '@/redux/api/ordersApi';
import { useDummyFallback, createDummyMutationHandler } from '@/lib/useDummyFallback';

// ─── Dummy data fallbacks ─────────────────────────────────────────────────────
const DUMMY_ORDERS: DistributorOrder[] = [
  { id: '#ORD-9021', customerName: 'Sarah Jenkins', phoneNumber: '+880 1700 000001', deliveryAddress: 'Dhanmondi, Dhaka', items: [], channel: 'WhatsApp', amount: 8450, commission: 1521, commStatus: 'Paid', trackingStatus: 'Processing', date: 'Oct 12, 2024' },
  { id: '#ORD-9020', customerName: 'Mohammed Rahman', phoneNumber: '+880 1700 000002', deliveryAddress: 'Gulshan, Dhaka', items: [], channel: 'Facebook', amount: 12200, commission: 2196, commStatus: 'Pending', trackingStatus: 'In Transit', date: 'Sep 28, 2024' },
  { id: '#ORD-9019', customerName: 'Aisha Ahmed', phoneNumber: '+880 1700 000003', deliveryAddress: 'Mirpur, Dhaka', items: [], channel: 'Direct Link', amount: 4150, commission: 747, commStatus: 'Paid', trackingStatus: 'Delivered', date: 'Sep 05, 2024' },
];

// ─────────────────────────────────────────────────────────────────────────────

export function DistributorOverviewView() {
  const profileQ = useGetMyDistributorProfileQuery(undefined);
  const ordersQ = useGetDistributorOrdersQuery({ limit: 20 });
  const [createOrderMutation] = useCreateDistributorOrderMutation();

  const { data: profileData } = useDummyFallback(profileQ, INITIAL_DISTRIBUTOR);
  const { data: ordersData } = useDummyFallback(ordersQ, { orders: DUMMY_ORDERS });

  // Merge API data with local optimistic state
  const [localDistributor, setLocalDistributor] = useState<DistributorProfile>(INITIAL_DISTRIBUTOR);
  const [localOrders, setLocalOrders] = useState<DistributorOrder[]>(DUMMY_ORDERS);
  const [trackingOrder, setTrackingOrder] = useState<DistributorOrder | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePartnerOrder = async (newOrderData: Omit<DistributorOrder, 'id' | 'date'>) => {
    // Optimistic local update
    const newId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newOrder: DistributorOrder = { id: newId, date: today, ...newOrderData };
    setLocalOrders((prev) => [newOrder, ...prev]);
    setLocalDistributor((prev) => ({
      ...prev,
      totalSales: prev.totalSales + newOrderData.amount,
      pendingCommissions: prev.pendingCommissions + newOrderData.commission,
    }));

    // Real API call (gracefully fails if backend not ready)
    try {
      await createOrderMutation({
        customerName: newOrderData.customerName,
        phoneNumber: newOrderData.phoneNumber,
        deliveryAddress: newOrderData.deliveryAddress || '',
        items: newOrderData.items?.map((i) => ({ productId: i.productId, quantity: i.quantity })) ?? [],
        channel: newOrderData.channel || 'Direct Link',
      });
    } catch {
      // No-op: local state already updated
    }

    showToast(`Order ${newId} created successfully!`);
  };

  const handleWithdrawSuccess = (amount: number) => {
    setLocalDistributor((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));
    showToast(`Withdrawal of ৳${amount.toLocaleString()} submitted.`);
  };

  // Prefer API data when available
  const distributor = (profileData as DistributorProfile) ?? localDistributor;
  const orders = ((ordersData as { orders?: DistributorOrder[] })?.orders) ?? localOrders;

  return (
    <div className="space-y-6">
      <DistributorDashboard
        distributor={distributor}
        orders={orders}
        products={INITIAL_PRODUCTS}
        onCreateOrder={handleCreatePartnerOrder}
        onOpenWithdrawModal={() => setWalletModalOpen(true)}
        onSelectOrderTracking={(order) => setTrackingOrder(order)}
        onToast={showToast}
        onSwitchToStore={() => { window.location.href = '/'; }}
        onOpenMobileMenu={() => undefined}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        distributor={distributor}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      <TrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-wellora-inverse-surface px-5 py-3 text-xs font-semibold text-wellora-on-primary shadow-xl animate-fadeIn"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
