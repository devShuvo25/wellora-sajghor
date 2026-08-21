'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingCart,
  X,
  Plus,
  Download,
  Search,
  Filter,
  Users,
  Store,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Edit,
  Save,
  Check,
  Ban,
  UploadCloud,
} from 'lucide-react';
import {
  useGetAdminOrdersQuery,
  useGetAdminProductsQuery,
  useGetAllDistributorsQuery,
  useGetMarketingKitsQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminOrderStatusMutation,
  useUpdateDistributorStatusMutation,
  useUpdateProductStockMutation,
} from '@/redux/api/adminApi';
import { useDummyFallback } from '@/lib/useDummyFallback';
import { INITIAL_PRODUCTS } from '@/data/mockData';

export type AdminTabSlug = 'orders' | 'product-catalog' | 'distributors' | 'marketing-kits' | 'settings';

export function AdminGenericTabView({ tab }: { tab: AdminTabSlug }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Action States
  const [activeModal, setActiveModal] = useState<'create' | 'detail' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ORDERS TAB
  // ─────────────────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([
    { id: '#ORD-9021', customerName: 'Sarah Jenkins', phone: '+880 1700 000001', address: 'Dhanmondi, Dhaka', channel: 'WhatsApp', amount: 8450, commStatus: 'Processing', date: 'Oct 12, 2024', items: 'COSRX Snail Mucin x2, Anua Toner x1' },
    { id: '#ORD-9020', customerName: 'Mohammed Rahman', phone: '+880 1700 000002', address: 'Gulshan, Dhaka', channel: 'Facebook', amount: 12200, commStatus: 'Shipped', date: 'Oct 11, 2024', items: 'Beauty of Joseon Sunscreen x4' },
    { id: '#ORD-9019', customerName: 'Aisha Ahmed', phone: '+880 1700 000003', address: 'Mirpur, Dhaka', channel: 'Direct Link', amount: 4150, commStatus: 'Delivered', date: 'Oct 10, 2024', items: 'Low pH Cleanser x2' },
    { id: '#ORD-9018', customerName: 'Farhan Kabir', phone: '+880 1700 000004', address: 'Agrabad, Chittagong', channel: 'TikTok', amount: 6800, commStatus: 'Delivered', date: 'Oct 09, 2024', items: 'Luminous C Glow Elixir x1' },
    { id: '#ORD-9017', customerName: 'Nusrat Jahan', phone: '+880 1700 000005', address: 'Zindabazar, Sylhet', channel: 'WhatsApp', amount: 3200, commStatus: 'Processing', date: 'Oct 08, 2024', items: 'Heartleaf Soothing Toner x2' },
  ]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, commStatus: newStatus } : o)));
    showToast(`Order ${orderId} marked as "${newStatus}"`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PRODUCT CATALOG TAB
  // ─────────────────────────────────────────────────────────────────────────────
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  const handleSaveStock = (productId: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: tempStockValue > 0 } : p))
    );
    setEditingStockId(null);
    showToast(`Stock updated for product.`);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. DISTRIBUTORS TAB
  // ─────────────────────────────────────────────────────────────────────────────
  const [distributorsList, setDistributorsList] = useState([
    { id: 'd1', name: 'Kamrul Hasan', email: 'partner.kamrul@wellora.com.bd', phone: '+880 1711 000001', region: 'Dhaka Division', tier: 'Gold Tier (18%)', totalSales: 450000, pendingPayout: 18500, status: 'Active' },
    { id: 'd2', name: 'Nusrat Jahan', email: 'nusrat.beauty@gmail.com', phone: '+880 1711 000002', region: 'Sylhet Region', tier: 'Gold Tier (18%)', totalSales: 380000, pendingPayout: 12400, status: 'Active' },
    { id: 'd3', name: 'Rahim Trading', email: 'rahim.ctg@gmail.com', phone: '+880 1711 000003', region: 'Chattogram Metro', tier: 'Silver Tier (15%)', totalSales: 290000, pendingPayout: 9800, status: 'Active' },
    { id: 'd4', name: 'Maya Beauty Hub', email: 'maya.rajshahi@gmail.com', phone: '+880 1711 000004', region: 'Rajshahi Division', tier: 'Silver Tier (15%)', totalSales: 212000, pendingPayout: 6200, status: 'Pending Review' },
    { id: 'd5', name: 'Tanvir Ahmed', email: 'tanvir.khulna@gmail.com', phone: '+880 1711 000005', region: 'Khulna Region', tier: 'Bronze Tier (12%)', totalSales: 145000, pendingPayout: 3100, status: 'Suspended' },
  ]);

  const toggleDistributorStatus = (id: string) => {
    setDistributorsList((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = d.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Distributor "${d.name}" status changed to ${next}.`);
          return { ...d, status: next };
        }
        return d;
      })
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. MARKETING KITS TAB
  // ─────────────────────────────────────────────────────────────────────────────
  const [kits, setKits] = useState([
    { id: 'k1', title: 'Holiday Glow Campaign', category: 'Serum & Toners', assetCount: 12, size: '48.5 MB', downloads: 142, status: 'Published' },
    { id: 'k2', title: 'Skin Barrier Essentials', category: 'Moisturizers', assetCount: 6, size: '24.1 MB', downloads: 98, status: 'Published' },
    { id: 'k3', title: 'Summer SPF Reel Packs', category: 'Sunscreen', assetCount: 8, size: '62.0 MB', downloads: 215, status: 'Published' },
    { id: 'k4', title: 'Wellora Brand Story Kit', category: 'Brand Assets', assetCount: 18, size: '110 MB', downloads: 340, status: 'Published' },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SETTINGS TAB
  // ─────────────────────────────────────────────────────────────────────────────
  const [settingsForm, setSettingsForm] = useState({
    storeName: 'WELLORA সাজঘর',
    supportEmail: 'support@wellora.com.bd',
    supportPhone: '+880 1700 000000',
    currency: 'BDT (৳)',
    goldTierRate: 18,
    silverTierRate: 15,
    bronzeTierRate: 12,
    freeShippingThreshold: 2000,
    bkashMerchant: '01700000000',
    nagadMerchant: '01800000000',
    courierAutoDispatch: true,
    smsNotifications: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Portal configuration saved successfully!');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB 1: ORDERS VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (tab === 'orders') {
    const filteredOrders = orders.filter((o) => {
      const matchStatus = statusFilter === 'All' || o.commStatus === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-6">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">MANAGEMENT</p>
            <h1 className="mt-1 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">Order Fulfillment</h1>
            <p className="text-xs text-wellora-on-surface-variant mt-1">Review, dispatch, and track all customer and distributor orders.</p>
          </div>
          <button
            type="button"
            onClick={() => showToast('Order history exported to CSV.')}
            className="rounded-lg bg-wellora-surface-tint px-4 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download size={15} />
            <span>Export Orders CSV</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-wellora-surface-container-lowest p-4 rounded-2xl border border-wellora-outline-variant/30">
          <div className="flex items-center gap-1 rounded-xl bg-wellora-surface-container-low p-1 text-xs">
            {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-wellora-surface-container-lowest text-wellora-on-background shadow-xs' : 'text-wellora-on-surface-variant'
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
              placeholder="Search by Order ID or Name..."
              className="w-64 pl-8 pr-3 py-1.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-wellora-outline-variant/30 font-label-caps text-wellora-on-surface-variant uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & Address</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wellora-outline-variant/20">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-wellora-background/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-wellora-surface-tint">{o.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-wellora-on-background">{o.customerName}</p>
                      <p className="text-[11px] text-wellora-on-surface-variant">{o.phone} · {o.address}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded bg-wellora-surface-container-low px-2 py-0.5 text-[11px] text-wellora-on-surface-variant">{o.channel}</span>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate text-wellora-on-surface-variant">{o.items}</td>
                    <td className="py-4 px-4 font-bold text-wellora-on-background">৳ {o.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <select
                        value={o.commStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="rounded-lg border border-wellora-outline-variant bg-wellora-surface-container-lowest px-2 py-1 text-[11px] font-semibold text-wellora-on-background hover:border-wellora-surface-tint focus:outline-none cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(o);
                          setActiveModal('detail');
                        }}
                        className="p-1.5 text-wellora-surface-tint hover:bg-wellora-surface-container rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {activeModal === 'detail' && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-lg bg-wellora-surface-container-lowest rounded-2xl border border-wellora-outline-variant shadow-2xl p-6">
              <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4 mb-4">
                <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">
                  Order Details {selectedItem.id}
                </h3>
                <button type="button" onClick={() => setActiveModal(null)} className="p-1 text-wellora-on-surface-variant hover:text-wellora-on-background">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-wellora-background rounded-xl">
                  <div>
                    <span className="text-wellora-on-surface-variant block">Customer</span>
                    <span className="font-bold text-wellora-on-background">{selectedItem.customerName}</span>
                  </div>
                  <div>
                    <span className="text-wellora-on-surface-variant block">Phone</span>
                    <span className="font-bold text-wellora-on-background">{selectedItem.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-wellora-on-surface-variant block">Delivery Address</span>
                    <span className="font-medium text-wellora-on-background">{selectedItem.address}</span>
                  </div>
                </div>

                <div className="p-3 border border-wellora-outline-variant/30 rounded-xl">
                  <span className="font-label-caps font-bold text-wellora-on-surface-variant uppercase block mb-1">Products Ordered</span>
                  <p className="text-wellora-on-background font-medium leading-relaxed">{selectedItem.items}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-wellora-on-surface-variant">Order Total</span>
                  <span className="font-headline-md text-lg font-bold text-wellora-surface-tint">৳ {selectedItem.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-wellora-surface-tint text-wellora-on-primary font-bold rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB 2: PRODUCT CATALOG VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (tab === 'product-catalog') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-6">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">INVENTORY</p>
            <h1 className="mt-1 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">Product Catalog</h1>
            <p className="text-xs text-wellora-on-surface-variant mt-1">Manage pricing, variants, stock quantities, and distributor commission tiers.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('create')}
            className="rounded-lg bg-wellora-surface-tint px-4 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productsList.map((p) => (
            <div key={p.id} className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-4 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <img src={p.image} alt={p.name} className="h-16 w-16 rounded-xl object-cover border border-wellora-outline-variant/30 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-label-caps text-[10px] text-wellora-on-surface-variant uppercase">{p.brand} · {p.category}</span>
                  <h3 className="font-semibold text-xs text-wellora-on-background line-clamp-1 mt-0.5">{p.name}</h3>
                  <p className="text-xs font-bold text-wellora-surface-tint mt-1">৳ {p.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-wellora-outline-variant/20 flex items-center justify-between text-xs">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-[11px] text-wellora-on-surface-variant font-medium">
                  Earn {p.points} pts · {Math.round(p.distributorCommissionRate * 100)}% Comm
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        {activeModal === 'create' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-wellora-surface-container-lowest rounded-2xl border border-wellora-outline-variant shadow-2xl p-6">
              <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4 mb-4">
                <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">Add New Skincare Product</h3>
                <button type="button" onClick={() => setActiveModal(null)} className="p-1 text-wellora-on-surface-variant hover:text-wellora-on-background">
                  <X size={18} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('New product added successfully!');
                  setActiveModal(null);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold mb-1">Product Title</label>
                  <input required placeholder="e.g. Centella Calming Serum" className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Price (৳)</label>
                    <input required type="number" placeholder="2200" className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg">
                      <option>Serum</option>
                      <option>Cleanser</option>
                      <option>Toner</option>
                      <option>Moisturizer</option>
                      <option>Sunscreen</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-wellora-outline-variant/30">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border rounded-lg font-semibold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-wellora-surface-tint text-wellora-on-primary font-bold rounded-lg">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB 3: DISTRIBUTORS TAB
  // ─────────────────────────────────────────────────────────────────────────────
  if (tab === 'distributors') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-6">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">AFFILIATE NETWORK</p>
            <h1 className="mt-1 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">Distributor Network</h1>
            <p className="text-xs text-wellora-on-surface-variant mt-1">Monitor partner sales volume, commission payouts, and active regional licenses.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('create')}
            className="rounded-lg bg-wellora-surface-tint px-4 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Users size={15} />
            <span>Invite Partner</span>
          </button>
        </div>

        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-wellora-outline-variant/30 font-label-caps text-wellora-on-surface-variant uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Partner Name</th>
                  <th className="py-3 px-4">Region & Tier</th>
                  <th className="py-3 px-4">Total Sales</th>
                  <th className="py-3 px-4">Pending Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wellora-outline-variant/20">
                {distributorsList.map((d) => (
                  <tr key={d.id} className="hover:bg-wellora-background/60 transition-colors">
                    <td className="py-4 px-4 font-semibold text-wellora-on-background">
                      <p>{d.name}</p>
                      <p className="text-[11px] text-wellora-on-surface-variant font-normal">{d.email}</p>
                    </td>
                    <td className="py-4 px-4 text-wellora-on-surface-variant">{d.region} · {d.tier}</td>
                    <td className="py-4 px-4 font-bold text-wellora-on-background">৳ {d.totalSales.toLocaleString()}</td>
                    <td className="py-4 px-4 font-semibold text-wellora-tertiary">৳ {d.pendingPayout.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        d.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : d.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleDistributorStatus(d.id)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          d.status === 'Active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {d.status === 'Active' ? 'Suspend' : 'Activate'}
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
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB 4: MARKETING KITS VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (tab === 'marketing-kits') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-6">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">ASSET HUB</p>
            <h1 className="mt-1 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">Marketing Kit Library</h1>
            <p className="text-xs text-wellora-on-surface-variant mt-1">Deploy campaign creatives, reel templates, and high-converting copy packs to distributors.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('create')}
            className="rounded-lg bg-wellora-surface-tint px-4 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <UploadCloud size={16} />
            <span>Upload New Kit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {kits.map((kit) => (
            <div key={kit.id} className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-5 shadow-2xs flex justify-between items-start">
              <div>
                <span className="font-label-caps text-[10px] font-bold text-wellora-surface-tint uppercase">{kit.category}</span>
                <h3 className="font-headline-sm text-base font-bold text-wellora-on-background mt-1">{kit.title}</h3>
                <p className="text-xs text-wellora-on-surface-variant mt-1">{kit.assetCount} assets · {kit.size}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 size={13} />
                  <span>{kit.downloads} partner downloads</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast(`Downloading "${kit.title}" zip archive...`)}
                className="p-2 text-wellora-on-surface-variant hover:text-wellora-surface-tint hover:bg-wellora-surface-container rounded-lg"
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB 5: SETTINGS VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-wellora-outline-variant/30 pb-6">
        <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">CONFIGURATION</p>
        <h1 className="mt-1 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">Portal Settings</h1>
        <p className="text-xs text-wellora-on-surface-variant mt-1">Configure global store preferences, commission tiers, payment gateways, and automated alerts.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-wellora-on-background">Store Profile & Branding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={settingsForm.supportEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs space-y-4">
          <h2 className="font-headline-sm text-base font-bold text-wellora-on-background">Distributor Commission Rates</h2>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Gold Tier (%)</label>
              <input
                type="number"
                value={settingsForm.goldTierRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, goldTierRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Silver Tier (%)</label>
              <input
                type="number"
                value={settingsForm.silverTierRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, silverTierRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Bronze Tier (%)</label>
              <input
                type="number"
                value={settingsForm.bronzeTierRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, bronzeTierRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-wellora-surface-tint px-6 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </form>

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
