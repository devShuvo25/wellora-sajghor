'use client';

import React, { useState } from 'react';
import { Product, DistributorOrder, DistributorProfile, OrderChannel, OrderStatus } from '@/types';

interface DistributorDashboardProps {
  distributor: DistributorProfile;
  orders: DistributorOrder[];
  products: Product[];
  onCreateOrder: (newOrder: Omit<DistributorOrder, 'id' | 'date'>) => void;
  onOpenWithdrawModal: () => void;
  onSelectOrderTracking: (order: DistributorOrder) => void;
  onToast: (msg: string) => void;
  onSwitchToStore: () => void;
  onOpenMobileMenu: () => void;
}

export const DistributorDashboard: React.FC<DistributorDashboardProps> = ({
  distributor,
  orders,
  products,
  onCreateOrder,
  onOpenWithdrawModal,
  onSelectOrderTracking,
  onToast,
  onSwitchToStore,
  onOpenMobileMenu,
}) => {
  // Order creation form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [source, setSource] = useState<OrderChannel>('WhatsApp');

  // Filter state for orders table
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const orderTotal = (selectedProduct?.price || 0) * quantity;
  const estimatedCommission = Math.round(orderTotal * (selectedProduct?.distributorCommissionRate || 0.16));

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${distributor.referralUrl}`);
    setCopiedLink(true);
    onToast('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('Please fill in all customer details.');
      return;
    }

    onCreateOrder({
      customerName,
      phoneNumber: phone,
      deliveryAddress: address,
      channel: source,
      amount: orderTotal,
      commission: estimatedCommission,
      commStatus: 'Pending',
      trackingStatus: 'Processing',
      items: [
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          quantity,
          price: selectedProduct.price,
        },
      ],
    });

    onToast(`Order created for ${customerName}! Commission of ৳${estimatedCommission} logged.`);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setQuantity(1);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.commStatus === statusFilter;
  });

  return (
    <div id="partner-dashboard-view" className="flex-1 min-h-screen bg-wellora-background p-4 sm:p-8 lg:p-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded bg-wellora-surface-container-lowest text-wellora-on-background border border-wellora-outline-variant"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-wellora-on-background">
                Welcome back, {distributor.name}
              </h2>
              <span className="bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant px-2 py-0.5 rounded text-xs font-semibold">
                Pro Partner
              </span>
            </div>
            <p className="font-body-sm text-xs text-wellora-on-surface-variant mt-0.5">
              Here is your social sales overview and commission status for today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToStore}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-wellora-surface-container-lowest border border-wellora-outline-variant rounded-lg text-xs font-semibold text-wellora-surface-tint hover:bg-wellora-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">store</span>
            <span>View Store</span>
          </button>

          <button
            onClick={() => onToast('You have 2 newly approved commissions waiting!')}
            className="relative p-2 rounded-full bg-wellora-surface-container-lowest border border-wellora-outline-variant/40 text-wellora-on-surface-variant hover:text-wellora-on-background hover:bg-wellora-surface-container-low cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-wellora-error"></span>
          </button>

          <button
            onClick={onOpenWithdrawModal}
            className="p-2 rounded-full bg-wellora-surface-container-lowest border border-wellora-outline-variant/40 text-wellora-on-surface-variant hover:text-wellora-on-background hover:bg-wellora-surface-container-low cursor-pointer"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat 1: Total Sales */}
        <div className="bg-wellora-surface-container-lowest p-5 rounded-xl border border-wellora-outline-variant/30 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-wellora-on-surface-variant font-semibold uppercase">
              Total Sales Volume
            </span>
            <span className="p-1.5 bg-wellora-secondary-container text-wellora-secondary rounded-md">
              <span className="material-symbols-outlined text-sm">trending_up</span>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-md text-2xl font-bold text-wellora-on-background">
              ৳{distributor.totalSales.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span>
              +14.2% from last month
            </p>
          </div>
        </div>

        {/* Stat 2: Available Balance */}
        <div className="bg-wellora-surface-container-lowest p-5 rounded-xl border border-wellora-outline-variant/30 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-wellora-on-surface-variant font-semibold uppercase">
              Available Balance
            </span>
            <span className="p-1.5 bg-wellora-primary-container text-wellora-on-primary-container rounded-md">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-md text-2xl font-bold text-wellora-surface-tint">
              ৳{distributor.availableBalance.toLocaleString()}
            </h3>
            <button
              onClick={onOpenWithdrawModal}
              className="text-[11px] text-wellora-surface-tint font-bold underline hover:text-wellora-on-primary-fixed-variant mt-1 block cursor-pointer"
            >
              Request Payout (bKash/Bank) &rarr;
            </button>
          </div>
        </div>

        {/* Stat 3: Pending Commissions */}
        <div className="bg-wellora-surface-container-lowest p-5 rounded-xl border border-wellora-outline-variant/30 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-wellora-on-surface-variant font-semibold uppercase">
              Pending Commissions
            </span>
            <span className="p-1.5 bg-wellora-tertiary-container/20 text-wellora-tertiary rounded-md">
              <span className="material-symbols-outlined text-sm">hourglass_top</span>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-md text-2xl font-bold text-wellora-tertiary">
              ৳{distributor.pendingCommissions.toLocaleString()}
            </h3>
            <p className="text-[11px] text-wellora-on-surface-variant mt-1">
              From 2 active transit orders
            </p>
          </div>
        </div>

        {/* Stat 4: Conversion Rate */}
        <div className="bg-wellora-surface-container-lowest p-5 rounded-xl border border-wellora-outline-variant/30 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-wellora-on-surface-variant font-semibold uppercase">
              Conversion Rate
            </span>
            <span className="p-1.5 bg-wellora-secondary-container text-wellora-secondary rounded-md">
              <span className="material-symbols-outlined text-sm">insights</span>
            </span>
          </div>
          <div className="mt-3">
            <h3 className="font-headline-md text-2xl font-bold text-wellora-on-background">
              {distributor.conversionRate}%
            </h3>
            <p className="text-[11px] text-wellora-on-surface-variant mt-1">
              Top 5% among Gold distributors
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Create Order (Left) + Quick Share (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left 2 Cols: Create Order Card */}
        <div className="lg:col-span-2 bg-wellora-surface-container-lowest rounded-xl p-6 border border-wellora-outline-variant/30 shadow-2xs">
          <div className="mb-5 pb-3 border-b border-wellora-outline-variant/20 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-wellora-on-background">
                Create Social / Offline Customer Order
              </h3>
              <p className="font-body-sm text-xs text-wellora-on-surface-variant">
                Directly log orders from WhatsApp chats, Facebook inquiries, or phone calls.
              </p>
            </div>
            <span className="material-symbols-outlined text-2xl text-wellora-surface-tint">
              point_of_sale
            </span>
          </div>

          <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                Delivery Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area, District (e.g. Dhanmondi 9/A, Dhaka)"
                className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.brand}] {p.name} - ৳{p.price} ({Math.round(p.distributorCommissionRate * 100)}% Comm)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-label-caps text-wellora-on-surface-variant uppercase mb-1">
                  Order Source Channel
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as OrderChannel)}
                  className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint focus:outline-hidden"
                >
                  <option value="WhatsApp">WhatsApp Chat</option>
                  <option value="Facebook">Facebook Post / Page</option>
                  <option value="Messenger">Messenger DM</option>
                  <option value="Direct Link">Direct Link / Referral</option>
                  <option value="Offline / Direct">Offline / In-Person</option>
                </select>
              </div>

              {/* Commission calculation preview */}
              <div className="p-3 bg-wellora-primary-fixed/30 border border-wellora-primary-fixed rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="text-wellora-on-surface-variant block">Estimated Commission:</span>
                  <span className="text-base font-bold text-wellora-surface-tint">
                    ৳ {estimatedCommission.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-wellora-on-surface-variant block">Order Amount:</span>
                  <span className="font-semibold text-wellora-on-background">
                    ৳ {orderTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-partner-order-btn"
                className="w-full sm:w-auto px-8 py-3 bg-wellora-surface-tint text-wellora-on-primary rounded-lg font-label-caps text-xs uppercase tracking-wider hover:bg-wellora-on-primary-fixed-variant transition-all shadow-xs cursor-pointer font-bold"
              >
                Submit Order to Logistics
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Quick Share Link Card */}
        <div className="bg-wellora-surface-container-lowest rounded-xl p-6 border border-wellora-outline-variant/30 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-wellora-secondary-container text-wellora-secondary flex items-center justify-center">
                <span className="material-symbols-outlined">link</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">
                  Personal Referral Link
                </h3>
                <span className="text-[11px] text-wellora-on-surface-variant">Permanent 15-20% payout</span>
              </div>
            </div>

            <p className="font-body-sm text-xs text-wellora-on-surface-variant leading-relaxed mb-4">
              Share your personal shop link across social media or in WhatsApp groups. Orders made through this link are automatically credited to your balance.
            </p>

            {/* Link Box */}
            <div className="bg-wellora-background border border-wellora-outline-variant rounded-lg p-2.5 flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-wellora-on-background truncate mr-2">
                {distributor.referralUrl}
              </span>
              <button
                id="copy-referral-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-1 bg-wellora-surface-tint text-wellora-on-primary rounded text-[11px] font-label-caps font-semibold hover:bg-wellora-on-primary-fixed-variant transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">
                  {copiedLink ? 'check' : 'content_copy'}
                </span>
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Share Icons */}
            <span className="block text-[11px] font-label-caps text-wellora-on-surface-variant uppercase mb-2">
              Share directly to:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=Check%20out%20authentic%20skincare%20on%20WELLORA%20https://${distributor.referralUrl}`, '_blank');
                }}
                className="py-2 px-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors"
              >
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onToast('Facebook share dialog opened!');
                }}
                className="py-2 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors"
              >
                <span>Facebook</span>
              </button>

              <button
                onClick={() => {
                  onToast('Messenger share link generated!');
                }}
                className="py-2 px-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-purple-100 transition-colors"
              >
                <span>Messenger</span>
              </button>
            </div>
          </div>

          {/* Partner Tier Progress */}
          <div className="mt-6 pt-4 border-t border-wellora-outline-variant/30 bg-wellora-background p-3 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-wellora-on-background">Platinum Tier Goal</span>
              <span className="text-wellora-surface-tint font-bold">75%</span>
            </div>
            <div className="w-full h-1.5 bg-wellora-outline-variant/40 rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-wellora-surface-tint w-[75%] rounded-full"></div>
            </div>
            <p className="text-[10px] text-wellora-on-surface-variant">
              Sell ৳11,500 more this month to unlock 22% super commissions!
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-wellora-surface-container-lowest rounded-xl border border-wellora-outline-variant/30 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-wellora-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-wellora-on-background">
              Recent Partner Orders
            </h3>
            <p className="font-body-sm text-xs text-wellora-on-surface-variant">
              Real-time synchronization with Dhaka warehouse dispatch
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 bg-wellora-background p-1 rounded-lg border border-wellora-outline-variant/40 self-start sm:self-auto text-xs">
            {(['All', 'Pending', 'Approved', 'Paid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                  statusFilter === st
                    ? 'bg-wellora-surface-tint text-wellora-on-primary shadow-2xs font-semibold'
                    : 'text-wellora-on-surface-variant hover:text-wellora-on-background'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-wellora-background border-b border-wellora-outline-variant/40 font-label-caps text-wellora-on-surface-variant uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Channel</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Comm. Status</th>
                <th className="py-3.5 px-6 text-right">Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wellora-outline-variant/20">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-wellora-background/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-wellora-surface-tint">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-wellora-on-surface-variant whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-wellora-on-background">{order.customerName}</div>
                    <div className="text-[11px] text-wellora-on-surface-variant">{order.phoneNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 bg-wellora-surface-container-low border border-wellora-outline-variant/40 rounded text-[11px] text-wellora-on-surface-variant">
                      {order.channel}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-wellora-on-background">৳{order.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">+৳{order.commission}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] font-bold ${
                        order.commStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.commStatus === 'Paid'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant'
                      }`}
                    >
                      {order.commStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelectOrderTracking(order)}
                      className="px-3 py-1 bg-wellora-surface-container-lowest border border-wellora-outline-variant hover:border-wellora-surface-tint hover:text-wellora-surface-tint rounded text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{order.trackingStatus}</span>
                      <span className="material-symbols-outlined text-xs">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
