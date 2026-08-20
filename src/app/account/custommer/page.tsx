'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Heart,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

const customerSections = [
  { label: 'My Profile', icon: UserRound },
  { label: 'Orders', icon: Package },
  { label: 'Wishlist', icon: Heart },
  { label: 'Addresses', icon: MapPin },
  { label: 'Loyalty Points', icon: Sparkles },
];

const recentOrders = [
  { id: '#WL-8472', date: 'Oct 12, 2024', status: 'Processing', total: 8450 },
  { id: '#WL-8391', date: 'Sep 28, 2024', status: 'Delivered', total: 12200 },
  { id: '#WL-8105', date: 'Sep 05, 2024', status: 'Delivered', total: 4150 },
];

export default function CustomerDashboardPage() {
  const [activeSection, setActiveSection] = useState('My Profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(INITIAL_PRODUCTS.slice(0, 4).map((product) => product.id));

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <header className="sticky top-0 z-40 border-b border-wellora-outline-variant/30 bg-wellora-background/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center gap-8 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="font-headline-md font-bold tracking-tight hover:opacity-75">WELLORA</Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <Link href="/products" className="font-label-caps text-wellora-on-surface-variant transition-colors hover:text-wellora-surface-tint">SHOP</Link>
            <Link href="/products?category=Serum" className="font-label-caps text-wellora-on-surface-variant transition-colors hover:text-wellora-surface-tint">BEST SELLERS</Link>
            <Link href="/products?sort=new" className="font-label-caps text-wellora-on-surface-variant transition-colors hover:text-wellora-surface-tint">NEW ARRIVALS</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login" className="hidden font-label-caps text-wellora-on-background hover:text-wellora-surface-tint md:block">LOGIN</Link>
            <Link href="/account/custommer" aria-label="Customer account" className="rounded-full p-2 text-wellora-surface-tint hover:bg-wellora-surface-container"><UserRound size={20} /></Link>
            <Link href="/" aria-label="Shopping bag" className="rounded-full p-2 text-wellora-surface-tint hover:bg-wellora-surface-container"><Package size={20} /></Link>
            <button type="button" aria-label="Open navigation" className="rounded-full p-2 md:hidden" onClick={() => setMobileMenuOpen(true)}><Menu size={21} /></button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-wellora-outline-variant/30 bg-wellora-surface-container-lowest px-5 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-wellora-on-surface-variant">MENU</span>
              <button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <nav className="mt-4 flex flex-col gap-4 font-label-caps" aria-label="Mobile navigation">
              <Link href="/products">SHOP</Link>
              <Link href="/products?category=Serum">BEST SELLERS</Link>
              <Link href="/products?sort=new">NEW ARRIVALS</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-16">
        <aside className="lg:col-span-3">
          <div className="mb-6">
            <p className="font-label-caps text-wellora-surface-tint">WELLORA ACCOUNT</p>
            <h1 className="mt-3 font-headline-sm">My Account</h1>
            <p className="mt-1 text-sm leading-6 text-wellora-on-surface-variant">Manage your luxury skincare journey.</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Account sections">
            {customerSections.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveSection(label)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === label ? 'bg-wellora-surface-container-low text-wellora-surface-tint' : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container hover:text-wellora-on-background'}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </button>
            ))}
            <div className="hidden h-px bg-wellora-outline-variant/30 lg:block" />
            <button type="button" className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-wellora-on-surface-variant transition-colors hover:text-wellora-error"><LogOut size={18} strokeWidth={1.8} />Log out</button>
          </nav>
        </aside>

        <section className="flex flex-col gap-12 lg:col-span-9">
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

          <section aria-labelledby="orders-title">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 id="orders-title" className="font-headline-md">Recent Orders</h2>
              <button type="button" onClick={() => setActiveSection('Orders')} className="flex items-center gap-1 font-label-caps text-wellora-surface-tint hover:underline">VIEW ALL <ArrowRight size={15} /></button>
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

          <section aria-labelledby="favorites-title">
            <div className="mb-5 flex items-end justify-between gap-4"><h2 id="favorites-title" className="font-headline-md">Recent Favorites</h2><button type="button" onClick={() => setActiveSection('Wishlist')} className="font-label-caps text-wellora-surface-tint hover:underline">VIEW WISHLIST</button></div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {INITIAL_PRODUCTS.slice(0, 4).map((product) => <article key={product.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-wellora-surface-container-low"><img src={product.image} alt={product.altText} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><button type="button" aria-label={`${wishlist.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${wishlist.includes(product.id) ? 'from' : 'to'} wishlist`} onClick={() => toggleWishlist(product.id)} className="absolute right-3 top-3 rounded-full bg-wellora-surface-container-lowest p-2 text-wellora-surface-tint shadow-sm"><Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button></div>
                <h3 className="mt-3 text-sm leading-5 text-wellora-on-background">{product.name}</h3><p className="mt-1 text-sm font-medium">Tk {product.price.toLocaleString()}</p>
              </article>)}
            </div>
          </section>
        </section>
      </main>

      <DashboardFooter role="customer" />
    </div>
  );
}