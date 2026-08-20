'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/mockData';

const customerSections = [
  { label: 'My Profile', slug: 'profile', icon: UserRound },
  { label: 'Orders', slug: 'orders', icon: Package },
  { label: 'Wishlist', slug: 'wishlist', icon: Heart },
  { label: 'Addresses', slug: 'addresses', icon: MapPin },
  { label: 'Loyalty Points', slug: 'loyalty-points', icon: Sparkles },
];

const recentOrders = [
  { id: '#WL-8472', date: 'Oct 12, 2024', status: 'Processing', total: 8450 },
  { id: '#WL-8391', date: 'Sep 28, 2024', status: 'Delivered', total: 12200 },
  { id: '#WL-8105', date: 'Sep 05, 2024', status: 'Delivered', total: 4150 },
];

const addresses = [
  { label: 'Home', recipient: 'Sarah M.', address: 'House 24, Road 8, Dhanmondi, Dhaka', phone: '+880 1700 000000', preferred: true },
  { label: 'Office', recipient: 'Sarah M.', address: 'Level 5, Gulshan Avenue, Dhaka', phone: '+880 1700 000000', preferred: false },
];

export default function CustomerDashboardPage({ activeSection = 'My Profile' }: { activeSection?: string }) {
  const [redeemed, setRedeemed] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(INITIAL_PRODUCTS.slice(0, 4).map((product) => product.id));

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  const isOverview = activeSection === 'My Profile';

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-12">
        <aside className="dashboard-sidebar lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-dvh lg:w-72 lg:flex-col lg:border-r lg:border-wellora-outline-variant/20 lg:bg-wellora-surface-container-low lg:p-6 lg:pt-10 lg:shadow-sm lg:col-span-3">
          <div className="mb-6">
            <p className="font-label-caps text-wellora-surface-tint">WELLORA ACCOUNT</p>
            <h1 className="mt-3 font-headline-sm">My Account</h1>
            <p className="mt-1 text-sm leading-6 text-wellora-on-surface-variant">Manage your luxury skincare journey.</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Account sections">
            {customerSections.map(({ label, slug, icon: Icon }) => (
              <Link
                key={label}
                href={slug === 'profile' ? '/account/custommer' : `/account/custommer/${slug}`}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === label ? 'bg-wellora-surface-container-low text-wellora-surface-tint' : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container hover:text-wellora-on-background'}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </Link>
            ))}
            <div className="hidden h-px bg-wellora-outline-variant/30 lg:block" />
            <button type="button" className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-wellora-on-surface-variant transition-colors hover:text-wellora-error"><LogOut size={18} strokeWidth={1.8} />Log out</button>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-col gap-12 lg:col-span-9 lg:col-start-4 lg:pl-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="font-label-caps text-wellora-surface-tint">{activeSection.toUpperCase()}</p>
              <h2 className="mt-3 font-display-lg-mobile md:font-display-lg">Hello, Sarah M.</h2>
              <p className="mt-2 text-lg leading-7 text-wellora-on-surface-variant">Welcome back to your curated beauty space.</p>
            </div>
            <div className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-xl bg-wellora-primary-container p-7 shadow-[0_8px_30px_rgb(26,32,44,0.04)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-wellora-primary-fixed opacity-60 blur-2xl" />
              <div className="relative">
                <p className="font-label-caps text-wellora-on-primary-container">WELLORA REWARDS</p>
                <h3 className="mt-2 font-headline-md text-wellora-on-primary-container">Current points: 450</h3>
              </div>
              <button type="button" onClick={() => setRedeemed(true)} className="relative w-fit rounded-lg bg-wellora-on-background px-5 py-3 font-label-caps text-wellora-on-primary transition-colors hover:bg-wellora-on-surface-variant">
                {redeemed ? 'REDEMPTION REQUESTED' : 'REDEEM POINTS'}
              </button>
            </div>
          </div>

          <section className={isOverview ? '' : 'hidden'} aria-labelledby="orders-title">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 id="orders-title" className="font-headline-md">Recent Orders</h2>
              <Link href="/account/custommer/orders" className="flex items-center gap-1 font-label-caps text-wellora-surface-tint hover:underline">VIEW ALL <ArrowRight size={15} /></Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-wellora-outline-variant/20 bg-wellora-surface-container-lowest shadow-[0_4px_20px_rgb(26,32,44,0.03)]">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead className="bg-wellora-surface-container-low text-xs uppercase tracking-[0.1em] text-wellora-on-surface-variant"><tr><th className="px-5 py-4 font-semibold">Order ID</th><th className="px-5 py-4 font-semibold">Date</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 text-right font-semibold">Total</th></tr></thead>
                <tbody className="text-sm">
                  {recentOrders.map((order) => <tr key={order.id} className="border-t border-wellora-outline-variant/20"><td className="px-5 py-4 font-medium">{order.id}</td><td className="px-5 py-4 text-wellora-on-surface-variant">{order.date}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === 'Processing' ? 'bg-wellora-surface-container-highest' : 'bg-wellora-primary-fixed text-wellora-on-primary-container'}`}>{order.status}</span></td><td className="px-5 py-4 text-right font-medium">Tk {order.total.toLocaleString()}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>

          <section className={isOverview ? '' : 'hidden'} aria-labelledby="favorites-title">
            <div className="mb-5 flex items-end justify-between gap-4"><h2 id="favorites-title" className="font-headline-md">Recent Favorites</h2><Link href="/account/custommer/wishlist" className="font-label-caps text-wellora-surface-tint hover:underline">VIEW WISHLIST</Link></div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {INITIAL_PRODUCTS.slice(0, 4).map((product) => <article key={product.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-wellora-surface-container-low"><img src={product.image} alt={product.altText} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><button type="button" aria-label={`${wishlist.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${wishlist.includes(product.id) ? 'from' : 'to'} wishlist`} onClick={() => toggleWishlist(product.id)} className="absolute right-3 top-3 rounded-full bg-wellora-surface-container-lowest p-2 text-wellora-surface-tint shadow-sm"><Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button></div>
                <h3 className="mt-3 text-sm leading-5 text-wellora-on-background">{product.name}</h3><p className="mt-1 text-sm font-medium">Tk {product.price.toLocaleString()}</p>
              </article>)}
            </div>
          </section>

          {!isOverview && <CustomerTabContent activeSection={activeSection} wishlist={wishlist} onToggleWishlist={toggleWishlist} />}
        </section>
      </main>

    </div>
  );
}

function CustomerTabContent({ activeSection, wishlist, onToggleWishlist }: { activeSection: string; wishlist: string[]; onToggleWishlist: (productId: string) => void }) {
  if (activeSection === 'Orders') {
    return <section aria-labelledby="all-orders-title" className="rounded-xl border border-wellora-outline-variant/20 bg-wellora-surface-container-lowest p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><div><p className="font-label-caps text-wellora-surface-tint">ORDER HISTORY</p><h2 id="all-orders-title" className="mt-2 font-headline-md">All Orders</h2></div><Link href="/products" className="font-label-caps text-wellora-surface-tint hover:underline">CONTINUE SHOPPING</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[600px] border-collapse text-left"><thead className="border-b border-wellora-outline-variant/30 text-xs uppercase tracking-wider text-wellora-on-surface-variant"><tr><th className="pb-3">Order ID</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3 text-right">Total</th></tr></thead><tbody className="text-sm">{recentOrders.map((order) => <tr key={order.id} className="border-b border-wellora-outline-variant/20 last:border-0"><td className="py-4 font-medium">{order.id}</td><td className="py-4 text-wellora-on-surface-variant">{order.date}</td><td className="py-4"><span className="rounded-full bg-wellora-primary-fixed px-3 py-1 text-xs text-wellora-on-primary-container">{order.status}</span></td><td className="py-4 text-right font-medium">Tk {order.total.toLocaleString()}</td></tr>)}</tbody></table></div></section>;
  }

  if (activeSection === 'Wishlist') {
    return <section aria-labelledby="wishlist-title"><div className="mb-5"><p className="font-label-caps text-wellora-surface-tint">SAVED PRODUCTS</p><h2 id="wishlist-title" className="mt-2 font-headline-md">My Wishlist</h2></div><div className="grid grid-cols-2 gap-5 md:grid-cols-4">{INITIAL_PRODUCTS.slice(0, 6).map((product) => <article key={product.id} className="group"><div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-wellora-surface-container-low"><img src={product.image} alt={product.altText} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><button type="button" aria-label={`Toggle ${product.name} wishlist`} onClick={() => onToggleWishlist(product.id)} className="absolute right-3 top-3 rounded-full bg-wellora-surface-container-lowest p-2 text-wellora-surface-tint shadow-sm"><Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button></div><h3 className="mt-3 text-sm leading-5">{product.name}</h3><p className="mt-1 text-sm font-medium">Tk {product.price.toLocaleString()}</p></article>)}</div></section>;
  }

  if (activeSection === 'Addresses') {
    return <section aria-labelledby="addresses-title"><div className="mb-5 flex items-end justify-between"><div><p className="font-label-caps text-wellora-surface-tint">DELIVERY DETAILS</p><h2 id="addresses-title" className="mt-2 font-headline-md">Saved Addresses</h2></div><button type="button" className="rounded-lg bg-wellora-primary px-4 py-2.5 font-label-caps text-wellora-on-primary">ADD ADDRESS</button></div><div className="grid gap-5 md:grid-cols-2">{addresses.map((address) => <article key={address.label} className="rounded-xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-5 shadow-sm"><div className="flex items-start justify-between"><h3 className="font-headline-sm">{address.label}</h3>{address.preferred && <span className="rounded-full bg-wellora-primary-fixed px-3 py-1 text-xs text-wellora-on-primary-container">Preferred</span>}</div><p className="mt-5 text-sm font-semibold">{address.recipient}</p><p className="mt-1 text-sm leading-6 text-wellora-on-surface-variant">{address.address}</p><p className="mt-2 text-sm text-wellora-on-surface-variant">{address.phone}</p><button type="button" className="mt-5 font-label-caps text-wellora-surface-tint hover:underline">EDIT ADDRESS</button></article>)}</div></section>;
  }

  return <section aria-labelledby="loyalty-title" className="space-y-6"><div className="rounded-xl bg-wellora-primary-container p-7"><p className="font-label-caps text-wellora-on-primary-container">WELLORA REWARDS</p><h2 id="loyalty-title" className="mt-2 font-headline-md text-wellora-on-primary-container">450 points available</h2><div className="mt-5 h-2 overflow-hidden rounded-full bg-wellora-primary-fixed"><div className="h-full w-3/5 rounded-full bg-wellora-surface-tint" /></div><p className="mt-3 text-sm text-wellora-on-primary-container">150 more points until your next reward.</p></div><div className="grid gap-5 md:grid-cols-3">{[['+120', 'Order #WL-8472', 'Oct 12, 2024'], ['+80', 'Order #WL-8391', 'Sep 28, 2024'], ['-250', 'Redeemed reward', 'Sep 10, 2024']].map(([points, label, date]) => <article key={label} className="rounded-xl border border-wellora-outline-variant/30 bg-wellora-surface-container-lowest p-5"><p className={`font-headline-md ${points.startsWith('-') ? 'text-wellora-error' : 'text-wellora-tertiary'}`}>{points}</p><p className="mt-2 text-sm font-medium">{label}</p><p className="mt-1 text-xs text-wellora-on-surface-variant">{date}</p></article>)}</div></section>;
}