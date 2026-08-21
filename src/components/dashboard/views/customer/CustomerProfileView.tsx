'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Heart,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { useGetMeQuery } from '@/redux/api/authApi';
import { useGetMyOrdersQuery } from '@/redux/api/ordersApi';
import { useGetMyWishlistQuery, useRemoveFromWishlistMutation, useAddToWishlistMutation } from '@/redux/api/wishlistApi';
import { useGetMyLoyaltyPointsQuery, useRedeemPointsMutation } from '@/redux/api/loyaltyApi';
import { useDummyFallback } from '@/lib/useDummyFallback';
import { INITIAL_PRODUCTS } from '@/data/mockData';

// ─── Dummy fallbacks ─────────────────────────────────────────────────────────
const DUMMY_USER = { name: 'Sarah M.', email: 'sarah.m@gmail.com', role: 'customer', id: 'u1' };
const DUMMY_ORDERS = [
  { id: '#WL-8472', date: 'Oct 12, 2024', status: 'Processing', total: 8450 },
  { id: '#WL-8391', date: 'Sep 28, 2024', status: 'Delivered', total: 12200 },
  { id: '#WL-8105', date: 'Sep 05, 2024', status: 'Delivered', total: 4150 },
];
const DUMMY_WISHLIST = { items: INITIAL_PRODUCTS.slice(0, 4).map((p) => ({ productId: p.id, product: p })) };
const DUMMY_LOYALTY = { availablePoints: 450, tier: 'Gold', nextTierPoints: 600, equivalentDiscount: 225 };

export function CustomerProfileView() {
  const meQ = useGetMeQuery(undefined);
  const ordersQ = useGetMyOrdersQuery({ limit: 3 });
  const wishlistQ = useGetMyWishlistQuery(undefined);
  const loyaltyQ = useGetMyLoyaltyPointsQuery(undefined);
  const [redeemPoints] = useRedeemPointsMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const { data: meData } = useDummyFallback(meQ, DUMMY_USER);
  const { data: ordersData, isLoading: ordersLoading } = useDummyFallback(ordersQ, { orders: DUMMY_ORDERS });
  const { data: wishlistData } = useDummyFallback(wishlistQ, DUMMY_WISHLIST);
  const { data: loyaltyData } = useDummyFallback(loyaltyQ, DUMMY_LOYALTY);

  const [redeemedLocal, setRedeemedLocal] = useState(false);
  const [localWishlist, setLocalWishlist] = useState<string[]>(
    INITIAL_PRODUCTS.slice(0, 4).map((p) => p.id)
  );

  // Resolve
  const user = (meData as typeof DUMMY_USER) ?? DUMMY_USER;
  const recentOrders = ((ordersData as { orders?: typeof DUMMY_ORDERS })?.orders) ?? DUMMY_ORDERS;
  const loyalty = (loyaltyData as typeof DUMMY_LOYALTY) ?? DUMMY_LOYALTY;
  const wishlistProductIds: string[] =
    ((wishlistData as typeof DUMMY_WISHLIST)?.items?.map((i) => i.productId)) ?? localWishlist;
  const wishlistProducts = INITIAL_PRODUCTS.filter((p) => wishlistProductIds.slice(0, 4).includes(p.id));

  const handleRedeem = async () => {
    setRedeemedLocal(true);
    try { await redeemPoints({ points: loyalty.availablePoints }); } catch { /* fallback */ }
  };

  const toggleWishlist = async (productId: string) => {
    const isInList = localWishlist.includes(productId);
    setLocalWishlist((prev) =>
      isInList ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    try {
      if (isInList) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch { /* graceful no-op */ }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile + Loyalty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-wellora-primary-fixed/80 px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-wellora-on-primary-fixed-variant">
                VIP MEMBER
              </span>
              <span className="text-xs text-wellora-on-surface-variant font-medium">
                Member since Oct 2024
              </span>
            </div>
            <h1 className="mt-3 font-headline-md text-2xl sm:text-3xl font-bold text-wellora-on-background">
              Welcome back, {user?.name || 'Member'}
            </h1>
            <p className="mt-1 text-sm text-wellora-on-surface-variant leading-relaxed">
              Your personalized skincare hub — track orders, rewards, and saved favorites.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-wellora-outline-variant/20 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-wellora-surface-tint px-4 py-2 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors inline-flex items-center gap-1.5"
            >
              <ShoppingBag size={15} />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/dashboard/customer/orders"
              className="rounded-lg border border-wellora-outline-variant px-4 py-2 text-xs font-semibold text-wellora-on-background hover:bg-wellora-surface-container-high transition-colors"
            >
              Track Deliveries
            </Link>
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="relative overflow-hidden rounded-2xl bg-wellora-primary-container p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-wellora-primary-fixed opacity-70 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 font-label-caps text-xs font-bold text-wellora-on-primary-container uppercase">
              <Sparkles size={16} />
              <span>WELLORA REWARDS</span>
            </div>
            <h2 className="mt-2 font-headline-md text-3xl font-bold text-wellora-on-primary-container">
              {loyalty.availablePoints} Points
            </h2>
            <p className="text-xs text-wellora-on-primary-container/80 mt-1">
              ৳ {loyalty.equivalentDiscount} equivalent discount
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-wellora-primary-fixed overflow-hidden">
              <div
                className="h-full rounded-full bg-wellora-surface-tint transition-all duration-700"
                style={{ width: `${Math.min((loyalty.availablePoints / (loyalty.nextTierPoints || 600)) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-wellora-on-primary-container/70">
              {Math.max(0, (loyalty.nextTierPoints || 600) - loyalty.availablePoints)} more points to next tier
            </p>
          </div>
          <button
            type="button"
            onClick={handleRedeem}
            className="relative mt-5 w-full rounded-xl bg-wellora-on-background py-3 font-label-caps text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-surface-variant transition-colors cursor-pointer"
          >
            {redeemedLocal ? '✓ REDEMPTION APPLIED' : 'REDEEM AT CHECKOUT'}
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-wellora-outline-variant/20 pb-4 mb-4">
          <div>
            <h2 className="font-headline-sm text-lg font-bold text-wellora-on-background">Recent Orders</h2>
            <p className="text-xs text-wellora-on-surface-variant">Track and manage your deliveries</p>
          </div>
          <Link href="/dashboard/customer/orders" className="text-xs font-bold text-wellora-surface-tint hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        {ordersLoading ? (
          <div className="flex items-center gap-2 py-6 justify-center text-wellora-on-surface-variant text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>Loading orders…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-wellora-outline-variant/30 font-label-caps text-wellora-on-surface-variant uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wellora-outline-variant/20">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-wellora-background/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-wellora-surface-tint">{order.id}</td>
                    <td className="py-4 px-4 text-wellora-on-surface-variant">{order.date}</td>
                    <td className="py-4 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-wellora-on-background">
                      ৳ {order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wishlist Preview */}
      <div className="rounded-2xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-wellora-outline-variant/20 pb-4 mb-6">
          <div>
            <h2 className="font-headline-sm text-lg font-bold text-wellora-on-background">Saved Favorites</h2>
            <p className="text-xs text-wellora-on-surface-variant">Your curated skincare wishlist</p>
          </div>
          <Link href="/dashboard/customer/wishlist" className="text-xs font-bold text-wellora-surface-tint hover:underline">
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group relative rounded-xl border border-wellora-outline-variant/30 bg-wellora-background p-3 hover:shadow-md transition-all">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-wellora-surface-container-low">
                <img
                  src={product.image}
                  alt={product.altText}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  aria-label="Toggle wishlist"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-wellora-surface-tint shadow-xs backdrop-blur-xs cursor-pointer"
                >
                  <Heart size={15} fill={localWishlist.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="mt-2 text-xs font-semibold text-wellora-on-background line-clamp-1">{product.name}</h3>
              <p className="text-xs font-bold text-wellora-surface-tint mt-0.5">৳ {product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
