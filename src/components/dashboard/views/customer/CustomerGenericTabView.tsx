'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useGetMyOrdersQuery } from '@/redux/api/ordersApi';
import { useGetMyWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/api/wishlistApi';
import { useGetMyLoyaltyPointsQuery, useGetLoyaltyHistoryQuery, useRedeemPointsMutation } from '@/redux/api/loyaltyApi';
import { useDummyFallback } from '@/lib/useDummyFallback';
import { INITIAL_PRODUCTS } from '@/data/mockData';

export type CustomerTabSlug = 'orders' | 'wishlist' | 'addresses' | 'loyalty-points';

// ─── Dummy data ───────────────────────────────────────────────────────────────
const DUMMY_ORDERS = [
  { id: '#WL-8472', date: 'Oct 12, 2024', status: 'Processing', total: 8450, items: 'COSRX Snail Mucin, Anua Toner' },
  { id: '#WL-8391', date: 'Sep 28, 2024', status: 'Delivered', total: 12200, items: 'Beauty of Joseon Sunscreen x2' },
  { id: '#WL-8105', date: 'Sep 05, 2024', status: 'Delivered', total: 4150, items: 'Low pH Cleanser' },
];
const DUMMY_WISHLIST = { items: INITIAL_PRODUCTS.slice(0, 6).map((p) => ({ productId: p.id, product: p })) };
const DUMMY_LOYALTY = { availablePoints: 450, nextTierPoints: 600, equivalentDiscount: 225 };
const DUMMY_LOYALTY_HISTORY = {
  history: [
    { points: '+120', label: 'Order #WL-8472 Delivered', date: 'Oct 12, 2024' },
    { points: '+80', label: 'Order #WL-8391 Delivered', date: 'Sep 28, 2024' },
    { points: '-250', label: 'Discount Voucher Redeemed', date: 'Sep 10, 2024' },
  ],
};
const DUMMY_ADDRESSES = [
  { id: 'addr-1', label: 'Home (Default)', recipient: 'Sarah M.', address: 'House 24, Road 8, Dhanmondi, Dhaka', phone: '+880 1700 000000', preferred: true },
  { id: 'addr-2', label: 'Office', recipient: 'Sarah M.', address: 'Level 5, Gulshan Avenue, Dhaka', phone: '+880 1700 000000', preferred: false },
];

// ─────────────────────────────────────────────────────────────────────────────

export function CustomerGenericTabView({ tab }: { tab: CustomerTabSlug }) {
  // Only call relevant queries per active tab
  const ordersQ = useGetMyOrdersQuery(undefined, { skip: tab !== 'orders' });
  const wishlistQ = useGetMyWishlistQuery(undefined, { skip: tab !== 'wishlist' });
  const loyaltyQ = useGetMyLoyaltyPointsQuery(undefined, { skip: tab !== 'loyalty-points' });
  const loyaltyHistoryQ = useGetLoyaltyHistoryQuery(undefined, { skip: tab !== 'loyalty-points' });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [redeemPoints] = useRedeemPointsMutation();

  const { data: ordersData, isLoading: ordersLoading } = useDummyFallback(ordersQ, { orders: DUMMY_ORDERS });
  const { data: wishlistData, isLoading: wishlistLoading } = useDummyFallback(wishlistQ, DUMMY_WISHLIST);
  const { data: loyaltyData } = useDummyFallback(loyaltyQ, DUMMY_LOYALTY);
  const { data: loyaltyHistoryData } = useDummyFallback(loyaltyHistoryQ, DUMMY_LOYALTY_HISTORY);

  const [localWishlistIds, setLocalWishlistIds] = useState<string[]>(
    INITIAL_PRODUCTS.slice(0, 6).map((p) => p.id)
  );
  const [redeemed, setRedeemed] = useState(false);

  const orders = ((ordersData as { orders?: typeof DUMMY_ORDERS })?.orders) ?? DUMMY_ORDERS;
  const wishlistItems = ((wishlistData as typeof DUMMY_WISHLIST)?.items) ?? [];
  const wishlistProductIds = wishlistItems.length > 0 ? wishlistItems.map((i) => i.productId) : localWishlistIds;
  const wishlistProducts = INITIAL_PRODUCTS.filter((p) => wishlistProductIds.includes(p.id));
  const loyalty = (loyaltyData as typeof DUMMY_LOYALTY) ?? DUMMY_LOYALTY;
  const loyaltyHistory = ((loyaltyHistoryData as typeof DUMMY_LOYALTY_HISTORY)?.history) ?? DUMMY_LOYALTY_HISTORY.history;

  const handleRemoveWishlist = async (productId: string) => {
    setLocalWishlistIds((prev) => prev.filter((id) => id !== productId));
    try { await removeFromWishlist(productId); } catch { /* graceful */ }
  };

  const handleRedeem = async () => {
    setRedeemed(true);
    try { await redeemPoints({ points: loyalty.availablePoints }); } catch { /* graceful */ }
  };

  // ── ORDERS TAB ──────────────────────────────────────────────────────────────
  if (tab === 'orders') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">ORDER HISTORY</p>
            <h1 className="mt-1 font-headline-md text-2xl font-bold text-wellora-on-background">All Orders</h1>
          </div>
          <Link href="/products" className="rounded-lg bg-wellora-surface-tint px-4 py-2 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors">
            Shop More
          </Link>
        </div>
        <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
          {ordersLoading ? (
            <div className="flex items-center gap-2 py-8 justify-center text-wellora-on-surface-variant text-sm">
              <Loader2 size={16} className="animate-spin" /><span>Loading orders…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-wellora-outline-variant/30 font-label-caps text-wellora-on-surface-variant uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Products</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wellora-outline-variant/20">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-wellora-background/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-wellora-surface-tint">{order.id}</td>
                      <td className="py-4 px-4 text-wellora-on-surface-variant">{order.date}</td>
                      <td className="py-4 px-4 text-wellora-on-background font-medium">{(order as typeof DUMMY_ORDERS[0]).items || '—'}</td>
                      <td className="py-4 px-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-wellora-on-background">৳ {order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── WISHLIST TAB ────────────────────────────────────────────────────────────
  if (tab === 'wishlist') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">SAVED PRODUCTS</p>
            <h1 className="mt-1 font-headline-md text-2xl font-bold text-wellora-on-background">
              My Wishlist ({wishlistProducts.length})
            </h1>
          </div>
        </div>
        {wishlistLoading ? (
          <div className="flex items-center gap-2 py-8 justify-center text-wellora-on-surface-variant text-sm">
            <Loader2 size={16} className="animate-spin" /><span>Loading wishlist…</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="group rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-wellora-surface-container-low">
                    <img src={product.image} alt={product.altText} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button
                      type="button"
                      onClick={() => handleRemoveWishlist(product.id)}
                      className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-2 text-wellora-error shadow-xs backdrop-blur-xs cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="font-label-caps text-[10px] text-wellora-on-surface-variant uppercase mt-3">{product.brand}</p>
                  <h3 className="text-xs font-semibold text-wellora-on-background line-clamp-2 mt-0.5">{product.name}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-wellora-outline-variant/20 flex items-center justify-between">
                  <span className="font-bold text-xs text-wellora-surface-tint">৳ {product.price.toLocaleString()}</span>
                  <Link href={`/products/${product.id}`} className="rounded-lg bg-wellora-on-background px-3 py-1.5 text-[11px] font-bold text-wellora-on-primary hover:bg-wellora-on-surface-variant transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── ADDRESSES TAB ───────────────────────────────────────────────────────────
  if (tab === 'addresses') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4">
          <div>
            <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">DELIVERY DETAILS</p>
            <h1 className="mt-1 font-headline-md text-2xl font-bold text-wellora-on-background">Saved Addresses</h1>
          </div>
          <button type="button" className="rounded-lg bg-wellora-surface-tint px-4 py-2 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-1.5 cursor-pointer">
            <Plus size={15} /><span>Add Address</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DUMMY_ADDRESSES.map((address) => (
            <div key={address.id} className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">{address.label}</h3>
                  {address.preferred && (
                    <span className="rounded-full bg-wellora-primary-fixed px-2.5 py-0.5 text-[10px] font-bold text-wellora-on-primary-fixed-variant">Preferred</span>
                  )}
                </div>
                <p className="mt-4 text-xs font-semibold text-wellora-on-background">{address.recipient}</p>
                <p className="text-xs text-wellora-on-surface-variant mt-1 leading-relaxed">{address.address}</p>
                <p className="text-xs text-wellora-on-surface-variant mt-1 font-mono">{address.phone}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-wellora-outline-variant/20">
                <button type="button" className="text-xs font-bold text-wellora-surface-tint hover:underline cursor-pointer">Edit Address</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LOYALTY POINTS TAB ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-wellora-outline-variant/30 pb-4">
        <p className="font-label-caps text-xs font-bold text-wellora-surface-tint uppercase">WELLORA REWARDS</p>
        <h1 className="mt-1 font-headline-md text-2xl font-bold text-wellora-on-background">Loyalty Points & Tiers</h1>
      </div>

      <div className="rounded-2xl bg-wellora-primary-container p-8 shadow-sm">
        <p className="font-label-caps text-xs font-bold text-wellora-on-primary-container">AVAILABLE BALANCE</p>
        <h2 className="mt-2 font-headline-md text-4xl font-bold text-wellora-on-primary-container">
          {loyalty.availablePoints} Points
        </h2>
        <div className="mt-5 h-2.5 w-full rounded-full bg-wellora-primary-fixed overflow-hidden">
          <div
            className="h-full rounded-full bg-wellora-surface-tint transition-all duration-700"
            style={{ width: `${Math.min((loyalty.availablePoints / (loyalty.nextTierPoints || 600)) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-wellora-on-primary-container font-medium">
          {Math.max(0, (loyalty.nextTierPoints || 600) - loyalty.availablePoints)} more points until next VIP perk tier!
        </p>
        <button
          type="button"
          onClick={handleRedeem}
          className="mt-5 rounded-xl bg-wellora-on-background px-6 py-2.5 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-surface-variant transition-colors cursor-pointer"
        >
          {redeemed ? '✓ REDEMPTION APPLIED' : 'REDEEM AT CHECKOUT'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loyaltyHistory.map((item, index) => (
          <div key={index} className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-5 shadow-2xs">
            <p className={`font-headline-md text-xl font-bold ${item.points.startsWith('-') ? 'text-wellora-error' : 'text-emerald-700'}`}>
              {item.points} pts
            </p>
            <p className="text-xs font-semibold text-wellora-on-background mt-2">{item.label}</p>
            <p className="text-[11px] text-wellora-on-surface-variant mt-1">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
