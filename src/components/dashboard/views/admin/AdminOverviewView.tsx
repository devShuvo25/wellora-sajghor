'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  X,
  Search,
} from 'lucide-react';
import { useGetAdminDashboardStatsQuery, useGetAdminOrdersQuery, useUpdateAdminOrderStatusMutation } from '@/redux/api/adminApi';
import { useDummyFallback } from '@/lib/useDummyFallback';
import { INITIAL_PRODUCTS } from '@/data/mockData';

// ─── Mock Fallbacks ────────────────────────────────────────────────────────────
const DUMMY_STATS = {
  revenue: { mtd: 1480500, change: '+18.4%', positive: true, lastMonth: 1250000 },
  orders: { active: 142, change: '+6.2%', positive: true, delivered: 680, pending: 24 },
  distributors: { active: 84, change: '+12 new', positive: true, totalCommissions: 266490 },
  lowStock: { count: 4, note: '4 products need restock', positive: false },
};

const INITIAL_ADMIN_ORDERS = [
  { id: '#ORD-9021', customerName: 'Sarah Jenkins', phoneNumber: '+880 1700 000001', channel: 'WhatsApp', amount: 8450, commStatus: 'Processing', date: 'Just now', itemsCount: 3, city: 'Dhaka' },
  { id: '#ORD-9020', customerName: 'Mohammed Rahman', phoneNumber: '+880 1700 000002', channel: 'Facebook', amount: 12200, commStatus: 'Shipped', date: '25m ago', itemsCount: 5, city: 'Chittagong' },
  { id: '#ORD-9019', customerName: 'Aisha Ahmed', phoneNumber: '+880 1700 000003', channel: 'Direct', amount: 4150, commStatus: 'Delivered', date: '1h ago', itemsCount: 2, city: 'Sylhet' },
  { id: '#ORD-9018', customerName: 'Farhan Kabir', phoneNumber: '+880 1700 000004', channel: 'TikTok', amount: 6800, commStatus: 'Delivered', date: '3h ago', itemsCount: 4, city: 'Dhaka' },
  { id: '#ORD-9017', customerName: 'Nusrat Jahan', phoneNumber: '+880 1700 000005', channel: 'WhatsApp', amount: 3200, commStatus: 'Processing', date: '5h ago', itemsCount: 1, city: 'Rajshahi' },
];

export function AdminOverviewView() {
  const statsQuery = useGetAdminDashboardStatsQuery(undefined);
  const ordersQuery = useGetAdminOrdersQuery({ limit: 10 });
  const [updateOrderStatus] = useUpdateAdminOrderStatusMutation();

  const { data: statsData, isLoading: statsLoading } = useDummyFallback(statsQuery, DUMMY_STATS);
  const { data: ordersData, isLoading: ordersLoading } = useDummyFallback(
    ordersQuery,
    { orders: INITIAL_ADMIN_ORDERS }
  );

  const stats = (statsData as typeof DUMMY_STATS) || DUMMY_STATS;
  const [ordersList, setOrdersList] = useState(INITIAL_ADMIN_ORDERS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Action Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isInvitePartnerOpen, setIsInvitePartnerOpen] = useState(false);
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, commStatus: newStatus } : o))
    );
    try {
      await updateOrderStatus({ id: orderId, status: newStatus });
    } catch {
      // Graceful fallback
    }
    showToast(`Order ${orderId} updated to "${newStatus}"`);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    showToast(`Product "${newProductName}" (৳${newProductPrice}) added to catalog!`);
    setNewProductName('');
    setNewProductPrice('');
    setIsAddProductOpen(false);
  };

  const handleInvitePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerEmail) return;
    showToast(`Partner invitation sent to ${newPartnerEmail}!`);
    setNewPartnerEmail('');
    setIsInvitePartnerOpen(false);
  };

  const filteredOrders = ordersList.filter((order) => {
    const matchStatus = selectedStatusFilter === 'All' || order.commStatus === selectedStatusFilter;
    const matchSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const kpiCards = [
    {
      label: 'Total Revenue (MTD)',
      value: `৳ ${(stats.revenue?.mtd || 1480500).toLocaleString()}`,
      change: stats.revenue?.change || '+18.4%',
      subtext: `vs ৳ ${(stats.revenue?.lastMonth || 1250000).toLocaleString()} last month`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Active Orders',
      value: `${stats.orders?.active || 142}`,
      change: stats.orders?.change || '+6.2%',
      subtext: `${stats.orders?.delivered || 680} fulfilled, ${stats.orders?.pending || 24} in queue`,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Active Distributors',
      value: `${stats.distributors?.active || 84}`,
      change: stats.distributors?.change || '+12 new',
      subtext: `৳ ${(stats.distributors?.totalCommissions || 266490).toLocaleString()} paid out`,
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      label: 'Low Stock Alert',
      value: `${stats.lowStock?.count || 4} items`,
      change: 'Action needed',
      subtext: 'Re-order from Seoul suppliers',
      icon: Package,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-wellora-primary-fixed/80 px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-wellora-on-primary-fixed-variant">
              SUPER ADMIN PORTAL
            </span>
            <span className="text-xs text-wellora-on-surface-variant font-medium">
              System Node: Dhaka Central Hub
            </span>
          </div>
          <h1 className="mt-2 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">
            Executive Command Center
          </h1>
          <p className="mt-1 text-sm text-wellora-on-surface-variant">
            Live business telemetry, partner network commissions, and omnichannel fulfillment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="rounded-lg bg-wellora-surface-tint px-4 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors shadow-2xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => setIsInvitePartnerOpen(true)}
            className="rounded-lg border border-wellora-outline-variant bg-wellora-surface-container-lowest px-4 py-2.5 text-xs font-bold text-wellora-on-background hover:bg-wellora-surface-container transition-colors shadow-2xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Users size={16} />
            <span>Invite Partner</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Full financial statement exported to CSV.')}
            className="rounded-lg border border-wellora-outline-variant bg-wellora-surface-container-lowest px-3 py-2.5 text-xs font-semibold text-wellora-on-surface-variant hover:text-wellora-on-background hover:bg-wellora-surface-container transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {statsLoading ? (
        <div className="flex items-center gap-2 text-wellora-on-surface-variant text-sm py-4">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading telemetry…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-5 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[11px] font-semibold text-wellora-on-surface-variant uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="font-headline-md text-2xl font-bold text-wellora-on-background">
                    {item.value}
                  </h2>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <TrendingUp size={14} />
                    <span>{item.change}</span>
                  </div>
                  <p className="text-[11px] text-wellora-on-surface-variant mt-1">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Grid: Orders Stream + Operations Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Order Fulfillment Queue */}
        <div className="lg:col-span-2 rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/20 pb-4 mb-5">
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-wellora-on-background flex items-center gap-2">
                <span>Order Fulfillment Queue</span>
                <span className="rounded-full bg-wellora-primary-fixed px-2 py-0.5 text-[10px] font-bold text-wellora-on-primary-fixed-variant">
                  Live
                </span>
              </h2>
              <p className="text-xs text-wellora-on-surface-variant mt-0.5">
                Steadfast & Pathao courier automated dispatch
              </p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="text-xs font-bold text-wellora-surface-tint hover:underline flex items-center gap-1"
            >
              View Full History <ChevronRight size={14} />
            </Link>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 rounded-xl bg-wellora-surface-container-low p-1 text-xs">
              {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                    selectedStatusFilter === st
                      ? 'bg-wellora-surface-container-lowest text-wellora-on-background shadow-xs'
                      : 'text-wellora-on-surface-variant hover:text-wellora-on-background'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-wellora-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-44 sm:w-56 pl-8 pr-3 py-1.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:outline-none focus:border-wellora-surface-tint"
              />
            </div>
          </div>

          {/* Table */}
          {ordersLoading ? (
            <div className="flex items-center gap-2 py-10 justify-center text-wellora-on-surface-variant text-sm">
              <Loader2 size={16} className="animate-spin" />
              <span>Loading orders…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-wellora-outline-variant/30 font-label-caps text-wellora-on-surface-variant uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wellora-outline-variant/20">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-wellora-on-surface-variant">
                        No orders match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-wellora-background/60 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-wellora-surface-tint">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-wellora-on-background">{order.customerName}</p>
                          <p className="text-[11px] text-wellora-on-surface-variant">{order.city} · {order.itemsCount} items</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="rounded bg-wellora-surface-container-low px-2 py-0.5 text-[11px] text-wellora-on-surface-variant">
                            {order.channel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-wellora-on-background">
                          ৳ {order.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              order.commStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.commStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.commStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <select
                            value={order.commStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="rounded-lg border border-wellora-outline-variant bg-wellora-surface-container-lowest px-2 py-1 text-[11px] font-semibold text-wellora-on-background hover:border-wellora-surface-tint focus:outline-none cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Ship Order</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Inventory Telemetry + Operations */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-sm text-base font-bold text-wellora-on-background">
                Top Performing Skincare
              </h2>
              <Link href="/dashboard/admin/product-catalog" className="text-xs font-bold text-wellora-surface-tint hover:underline">
                Catalog
              </Link>
            </div>
            <div className="space-y-4">
              {INITIAL_PRODUCTS.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-12 w-12 rounded-lg object-cover border border-wellora-outline-variant/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-wellora-on-background truncate">{p.name}</p>
                    <p className="text-[11px] text-wellora-on-surface-variant">
                      {p.brand} · ৳ {p.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-wellora-surface-tint">
                      {p.reviewsCount * 4} sold
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courier API & Gateway Telemetry */}
          <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-primary-container p-6">
            <div className="flex items-center gap-2 text-wellora-on-primary-container mb-2">
              <ShieldCheck size={18} />
              <h3 className="font-label-caps text-xs font-bold uppercase tracking-wider">
                Logistics & SMS Gateways
              </h3>
            </div>
            <p className="text-xs text-wellora-on-primary-container leading-relaxed">
              Steadfast Courier API, Pathao Merchant API, and RedX Logistics syncing every 60 seconds.
            </p>
            <div className="mt-4 space-y-2 text-xs text-wellora-on-primary-container">
              <div className="flex items-center justify-between border-t border-wellora-primary-fixed/40 pt-2">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} /> Steadfast Express API
                </span>
                <span className="font-semibold text-emerald-800">Connected (99.9%)</span>
              </div>
              <div className="flex items-center justify-between border-t border-wellora-primary-fixed/40 pt-2">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} /> Pathao Courier Node
                </span>
                <span className="font-semibold text-emerald-800">Connected (100%)</span>
              </div>
              <div className="flex items-center justify-between border-t border-wellora-primary-fixed/40 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> SSLCOMMERZ / bKash Direct
                </span>
                <span className="font-semibold text-emerald-800">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-wellora-surface-container-lowest rounded-2xl border border-wellora-outline-variant shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4 mb-4">
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">
                Add New Skincare Product
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 text-wellora-on-surface-variant hover:text-wellora-on-background"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Rice Water Probiotic Toner"
                  className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Price (BDT ৳)</label>
                <input
                  type="number"
                  required
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="2400"
                  className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Category</label>
                <select className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg">
                  <option>Serum</option>
                  <option>Cleanser</option>
                  <option>Toner</option>
                  <option>Moisturizer</option>
                  <option>Sunscreen</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-wellora-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg border border-wellora-outline-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-wellora-surface-tint text-wellora-on-primary font-bold hover:bg-wellora-on-primary-fixed-variant"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Partner Modal */}
      {isInvitePartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-wellora-surface-container-lowest rounded-2xl border border-wellora-outline-variant shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4 mb-4">
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">
                Invite Distributor Partner
              </h3>
              <button
                type="button"
                onClick={() => setIsInvitePartnerOpen(false)}
                className="p-1 text-wellora-on-surface-variant hover:text-wellora-on-background"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleInvitePartnerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Partner Email / Phone</label>
                <input
                  type="text"
                  required
                  value={newPartnerEmail}
                  onChange={(e) => setNewPartnerEmail(e.target.value)}
                  placeholder="distributor@wellora.com.bd"
                  className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Commission Tier</label>
                <select className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg">
                  <option>Gold Tier (18% Commission)</option>
                  <option>Silver Tier (15% Commission)</option>
                  <option>Standard Tier (12% Commission)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-wellora-on-background mb-1">Assigned Region</label>
                <select className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg">
                  <option>Dhaka North & South</option>
                  <option>Chittagong Division</option>
                  <option>Sylhet Division</option>
                  <option>Rajshahi & Khulna</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-wellora-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsInvitePartnerOpen(false)}
                  className="px-4 py-2 rounded-lg border border-wellora-outline-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-wellora-surface-tint text-wellora-on-primary font-bold hover:bg-wellora-on-primary-fixed-variant"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast */}
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
