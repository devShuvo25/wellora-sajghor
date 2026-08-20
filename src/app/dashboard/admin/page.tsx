'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  FileDown,
  LayoutDashboard,
  Menu,
  MoreVertical,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingCart },
  { label: 'Product Catalog', href: '/dashboard/admin/product-catalog', icon: Package },
  { label: 'Distributors', href: '/dashboard/admin/distributors', icon: Users },
  { label: 'Marketing Kits', href: '/dashboard/admin/marketing-kits', icon: Store },
];

const orders = [
  { id: '#ORD-9021', name: 'Sarah Jenkins', initials: 'SJ', date: 'Oct 24, 2024', amount: 12500, status: 'Processing', tone: 'gold' },
  { id: '#ORD-9020', name: 'Mohammed Rahman (Dist)', initials: 'MR', date: 'Oct 24, 2024', amount: 45000, status: 'Shipped', tone: 'neutral' },
  { id: '#ORD-9019', name: 'Aisha Ahmed', initials: 'AA', date: 'Oct 23, 2024', amount: 3200, status: 'Delivered', tone: 'green' },
  { id: '#ORD-9018', name: 'Farhan Kabir', initials: 'FK', date: 'Oct 23, 2024', amount: 8900, status: 'Action Needed', tone: 'red' },
];

const distributors = [
  { name: 'Kamrul Hasan', region: 'Dhaka Region', amount: 450000, initials: 'KH', rank: 1 },
  { name: 'Nusrat Jahan', region: 'Sylhet Region', amount: 380000, initials: 'NJ', rank: 2 },
  { name: 'Rahim Trading', region: 'Chattogram', amount: 290000, initials: 'R', rank: 3 },
];

const inventory = [
  { name: 'Pearl Radiance Serum', stock: 'Only 12 left', tone: 'red' },
  { name: 'Midnight Renewal Cream', stock: '34 units remaining', tone: 'neutral' },
];

const formatAmount = (amount: number) => `Tk ${(amount / 1000).toLocaleString()}k`;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const selectNav = (label: string) => {
    setActiveNav(label);
    setMobileNavOpen(false);
    const routeByLabel: Record<string, string> = {
      Orders: '/dashboard/admin/orders',
      Distributors: '/dashboard/admin/distributors',
    };
    const route = routeByLabel[label];
    if (route) router.push(route);
  };

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <aside className="dashboard-sidebar fixed inset-x-0 top-0 z-40 hidden h-dvh w-72 flex-col border-r border-wellora-outline-variant/20 bg-wellora-surface-container-low p-6 md:inset-x-auto md:flex">
        <div className="mb-8">
          <Link href="/" className="font-headline-md font-bold tracking-tight hover:opacity-75">WELLORA Admin</Link>
          <p className="mt-1 font-label-caps text-wellora-on-surface-variant">MANAGEMENT PORTAL</p>
        </div>
        <nav className="flex flex-1 flex-col gap-2" aria-label="Admin navigation">
          {navigation.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${activeNav === label ? 'translate-x-1 bg-wellora-surface-tint text-wellora-on-primary shadow-sm' : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container-high hover:text-wellora-on-background'}`}><Icon size={19} strokeWidth={1.8} />{label}</Link>)}
        </nav>
        <div className="flex flex-col gap-2 border-t border-wellora-outline-variant/20 pt-6">
          <Link href="/dashboard/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-wellora-on-surface-variant hover:bg-wellora-surface-container-high"><Settings size={19} strokeWidth={1.8} />Settings</Link>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-wellora-outline-variant/30 bg-wellora-background px-3 py-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-wellora-primary-container font-semibold text-wellora-on-primary-container">AU</div><div><p className="text-sm font-semibold">Admin User</p><p className="font-label-caps text-wellora-on-surface-variant">SYSTEM MANAGER</p></div></div>
        </div>
      </aside>

      <main className="min-h-screen min-w-0 md:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-wellora-outline-variant/30 bg-wellora-background/90 px-4 py-4 backdrop-blur-xl md:hidden"><Link href="/" className="font-headline-sm font-bold tracking-tight">WELLORA</Link><button type="button" aria-label="Open admin navigation" onClick={() => setMobileNavOpen(true)} className="rounded-full p-2"><Menu size={24} /></button></header>
        {mobileNavOpen && <div className="fixed inset-0 z-50 bg-wellora-on-background/20 md:hidden"><div className="h-full w-72 bg-wellora-surface-container-low p-6 shadow-xl"><div className="flex items-center justify-between"><span className="font-headline-sm font-bold">WELLORA Admin</span><button type="button" aria-label="Close admin navigation" onClick={() => setMobileNavOpen(false)}><X size={21} /></button></div><nav className="mt-8 flex flex-col gap-2" aria-label="Mobile admin navigation">{navigation.map(({ label, href, icon: Icon }) => <Link key={label} href={href} onClick={() => setMobileNavOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ${activeNav === label ? 'bg-wellora-surface-tint text-wellora-on-primary' : 'text-wellora-on-surface-variant'}`}><Icon size={19} />{label}</Link>)}</nav></div></div>}

        <div className="mx-auto w-full max-w-[1280px] space-y-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="font-label-caps text-wellora-surface-tint">{activeNav.toUpperCase()}</p><h1 className="mt-2 font-display-lg-mobile md:font-display-lg">Dashboard Overview</h1><p className="mt-2 text-lg leading-7 text-wellora-on-surface-variant">Welcome back. Here&apos;s what&apos;s happening today.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => setNotice('Report prepared for download.')} className="flex items-center gap-2 rounded-lg bg-wellora-secondary-container px-5 py-3 text-sm font-semibold text-wellora-on-secondary-container hover:bg-wellora-secondary-fixed-dim"><FileDown size={17} />Download report</button><button type="button" onClick={() => setNotice('Campaign workspace opened.')} className="rounded-lg bg-wellora-on-background px-5 py-3 text-sm font-semibold text-wellora-on-primary hover:bg-wellora-inverse-surface">New campaign</button></div></header>
          {notice && <div role="status" className="flex items-center justify-between rounded-lg border border-wellora-primary-container bg-wellora-primary-fixed/50 px-4 py-3 text-sm text-wellora-on-primary-container"><span>{notice}</span><button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={17} /></button></div>}

          <section aria-label="Key performance metrics" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[{ label: 'Total Revenue', value: 'Tk 1.2M', detail: '+8.4% from last month', icon: CircleDollarSign, positive: true }, { label: 'Total Orders', value: '850', detail: '+12% this week', icon: ShoppingCart, positive: true }, { label: 'Active Distributors', value: '124', detail: 'Steady growth', icon: Users, positive: false }, { label: 'Customer Growth', value: '+15%', detail: 'Accelerated acquisition', icon: BarChart3, positive: true }].map(({ label, value, detail, icon: Icon, positive }) => <article key={label} className="group flex h-40 flex-col justify-between rounded-xl border border-wellora-surface-container-lowest/70 bg-wellora-surface-container-lowest/70 p-6 shadow-[0_4px_20px_rgb(26,32,44,0.04)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"><div className="flex items-start justify-between"><p className="font-label-caps text-wellora-on-surface-variant">{label}</p><span className="rounded-full bg-wellora-primary-container p-2 text-wellora-surface-tint"><Icon size={19} /></span></div><div><h2 className="font-headline-md">{value}</h2><p className={`mt-1 flex items-center gap-1 text-sm ${positive ? 'text-wellora-tertiary' : 'text-wellora-on-surface-variant'}`}>{positive && <ArrowUpRight size={15} />}{detail}</p></div></article>)}
          </section>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <section className="overflow-hidden rounded-xl border border-wellora-surface-container-lowest/70 bg-wellora-surface-container-lowest/70 p-6 shadow-[0_4px_20px_rgb(26,32,44,0.04)] backdrop-blur-xl lg:col-span-2" aria-labelledby="recent-orders-title"><div className="mb-6 flex items-center justify-between"><h2 id="recent-orders-title" className="font-headline-sm">Recent Orders</h2><button type="button" onClick={() => selectNav('Orders')} className="flex items-center gap-1 text-sm text-wellora-surface-tint hover:underline">View all <ChevronRight size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left"><thead className="border-b border-wellora-outline-variant/30 text-wellora-on-surface-variant"><tr>{['Order ID', 'Customer / Distributor', 'Date', 'Amount', 'Status', 'Action'].map((heading) => <th key={heading} className="pb-3 pr-4 font-label-caps font-normal">{heading}</th>)}</tr></thead><tbody className="text-sm">{orders.map((order) => <tr key={order.id} className="border-b border-wellora-outline-variant/20 last:border-0 hover:bg-wellora-surface-container-lowest/50"><td className="py-4 pr-4 font-semibold">{order.id}</td><td className="py-4 pr-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-wellora-primary-container text-xs font-bold text-wellora-on-primary-container">{order.initials}</span>{order.name}</div></td><td className="py-4 pr-4 text-wellora-on-surface-variant">{order.date}</td><td className="py-4 pr-4">Tk {order.amount.toLocaleString()}</td><td className="py-4 pr-4"><span className={`rounded-md px-2 py-1 text-xs font-medium ${order.tone === 'red' ? 'bg-wellora-error-container text-wellora-on-error-container' : order.tone === 'gold' ? 'bg-wellora-tertiary-container text-wellora-on-tertiary-container' : order.tone === 'green' ? 'bg-wellora-tertiary-fixed text-wellora-on-tertiary-fixed-variant' : 'bg-wellora-surface-container-highest text-wellora-on-surface-variant'}`}>{order.status}</span></td><td className="py-4 text-right"><button type="button" onClick={() => setNotice(`${order.id} opened for management.`)} className="rounded border border-wellora-outline-variant px-3 py-1.5 text-xs hover:bg-wellora-surface-container-high">Manage</button></td></tr>)}</tbody></table></div></section>

            <div className="space-y-5"><section className="rounded-xl border border-wellora-surface-container-lowest/70 bg-wellora-surface-container-lowest/70 p-6 shadow-[0_4px_20px_rgb(26,32,44,0.04)] backdrop-blur-xl" aria-labelledby="distributors-title"><div className="mb-6 flex items-center justify-between"><h2 id="distributors-title" className="font-headline-sm">Top Distributors</h2><button type="button" aria-label="More distributor options" className="text-wellora-on-surface-variant hover:text-wellora-surface-tint"><MoreVertical size={20} /></button></div><ul className="space-y-4">{distributors.map((distributor) => <li key={distributor.name} className="flex items-center justify-between border-b border-wellora-outline-variant/20 pb-3 last:border-0 last:pb-0"><div className="flex items-center gap-3"><div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-wellora-secondary-container text-sm font-bold text-wellora-on-secondary-container">{distributor.initials}<span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-wellora-surface-container-lowest bg-wellora-tertiary text-[9px] font-bold text-wellora-on-primary">{distributor.rank}</span></div><div><p className="text-sm font-medium leading-tight">{distributor.name}</p><p className="text-xs text-wellora-on-surface-variant">{distributor.region}</p></div></div><p className="text-sm font-bold">{formatAmount(distributor.amount)}</p></li>)}</ul><button type="button" onClick={() => selectNav('Distributors')} className="mt-6 w-full rounded-lg border border-wellora-outline-variant py-2 text-sm font-medium hover:bg-wellora-surface-container-high">View full leaderboard</button></section>
              <section className="rounded-xl border-l-4 border-l-wellora-error bg-wellora-surface-container-lowest/70 p-6 shadow-[0_4px_20px_rgb(26,32,44,0.04)]" aria-labelledby="inventory-title"><div className="mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-wellora-error" /><h2 id="inventory-title" className="font-headline-sm">Inventory Alerts</h2></div><div className="space-y-3">{inventory.map((item) => <div key={item.name} className={`flex items-center justify-between gap-3 rounded-lg p-3 ${item.tone === 'red' ? 'bg-wellora-error-container/40' : 'bg-wellora-surface-container-low'}`}><div className="flex items-center gap-3"><div className="h-10 w-10 rounded bg-wellora-primary-container" /><div><p className="text-sm font-semibold">{item.name}</p><p className={`font-label-caps ${item.tone === 'red' ? 'text-wellora-error' : 'text-wellora-on-surface-variant'}`}>{item.stock}</p></div></div><button type="button" onClick={() => setNotice(`Restock request created for ${item.name}.`)} className="text-sm text-wellora-surface-tint hover:underline">Restock</button></div>)}</div></section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}