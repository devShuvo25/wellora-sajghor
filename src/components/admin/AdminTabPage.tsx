'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  X,
} from 'lucide-react';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

export type AdminTab = 'orders' | 'product-catalog' | 'distributors' | 'marketing-kits' | 'settings';

const navigation = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingCart },
  { label: 'Product Catalog', href: '/dashboard/admin/product-catalog', icon: Package },
  { label: 'Distributors', href: '/dashboard/admin/distributors', icon: Users },
  { label: 'Marketing Kits', href: '/dashboard/admin/marketing-kits', icon: Store },
];

const tabContent: Record<AdminTab, { eyebrow: string; title: string; description: string; action: string }> = {
  orders: { eyebrow: 'ORDERS', title: 'Order management', description: 'Review customer and distributor orders, update statuses, and resolve exceptions.', action: 'Export orders' },
  'product-catalog': { eyebrow: 'PRODUCT CATALOG', title: 'Product catalog', description: 'Keep pricing, stock levels, and product visibility current across the storefront.', action: 'Add product' },
  distributors: { eyebrow: 'DISTRIBUTORS', title: 'Distributor network', description: 'Monitor partner performance, payouts, and regional sales activity.', action: 'Invite distributor' },
  'marketing-kits': { eyebrow: 'MARKETING KITS', title: 'Marketing asset library', description: 'Organize campaign-ready content and make the latest brand assets available to partners.', action: 'Upload asset' },
  settings: { eyebrow: 'SETTINGS', title: 'Portal settings', description: 'Manage notifications, roles, payout preferences, and operational defaults.', action: 'Save changes' },
};

const rows: Record<AdminTab, Array<[string, string, string]>> = {
  orders: [['#ORD-9021', 'Sarah Jenkins', 'Processing'], ['#ORD-9020', 'Mohammed Rahman', 'Shipped'], ['#ORD-9019', 'Aisha Ahmed', 'Delivered'], ['#ORD-9018', 'Farhan Kabir', 'Action Needed']],
  'product-catalog': [['COSRX', 'Snail Mucin Essence', 'In stock'], ['Beauty of Joseon', 'Relief Sun SPF50+', 'In stock'], ['Anua', 'Heartleaf Toner', 'Low stock'], ['WELLORA Labs', 'Luminous C Elixir', 'In stock']],
  distributors: [['Kamrul Hasan', 'Dhaka Region', 'Tk 450k'], ['Nusrat Jahan', 'Sylhet Region', 'Tk 380k'], ['Rahim Trading', 'Chattogram', 'Tk 290k'], ['Maya Beauty Hub', 'Rajshahi', 'Tk 212k']],
  'marketing-kits': [['Holiday Glow Campaign', 'Images · 12 assets', 'Published'], ['Skin Barrier Basics', 'Video · 6 assets', 'Published'], ['Summer SPF Guide', 'Images · 8 assets', 'Draft'], ['Wellora Starter Pack', 'Mixed · 18 assets', 'Published']],
  settings: [['Order notifications', 'Email and dashboard alerts', 'Enabled'], ['Distributor approvals', 'Manual review required', 'Enabled'], ['Low-stock threshold', 'Notify below 20 units', '20 units'], ['Default currency', 'Store and partner portal', 'BDT']],
};

export function AdminTabPage({ tab }: { tab: AdminTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const content = tabContent[tab];
  const tableHeaders = tab === 'orders' ? ['Order', 'Customer / Distributor', 'Status'] : tab === 'settings' ? ['Setting', 'Description', 'Value'] : ['Name', 'Details', tab === 'distributors' ? 'Sales' : 'Status'];

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-72 flex-col border-r border-wellora-outline-variant/20 bg-wellora-surface-container-low p-6 md:flex">
        <div className="mb-8"><Link href="/" className="font-headline-md font-bold tracking-tight hover:opacity-75">WELLORA Admin</Link><p className="mt-1 font-label-caps text-wellora-on-surface-variant">MANAGEMENT PORTAL</p></div>
        <AdminNavigation tab={tab} />
        <div className="mt-auto border-t border-wellora-outline-variant/20 pt-6"><Link href="/dashboard/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-wellora-on-surface-variant hover:bg-wellora-surface-container-high"><Settings size={19} />Settings</Link><div className="mt-4 flex items-center gap-3 rounded-lg border border-wellora-outline-variant/30 bg-wellora-background px-3 py-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-wellora-primary-container font-semibold text-wellora-on-primary-container">AU</div><div><p className="text-sm font-semibold">Admin User</p><p className="font-label-caps text-wellora-on-surface-variant">SYSTEM MANAGER</p></div></div></div>
      </aside>

      <main className="min-h-screen min-w-0 md:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-wellora-outline-variant/30 bg-wellora-background/90 px-4 py-4 backdrop-blur-xl md:hidden"><Link href="/" className="font-headline-sm font-bold tracking-tight">WELLORA</Link><button type="button" aria-label="Open admin navigation" onClick={() => setMobileOpen(true)} className="rounded-full p-2"><Menu size={24} /></button></header>
        {mobileOpen && <div className="fixed inset-0 z-50 bg-wellora-on-background/20 md:hidden"><div className="h-full w-72 bg-wellora-surface-container-low p-6"><div className="flex items-center justify-between"><span className="font-headline-sm font-bold">WELLORA Admin</span><button type="button" aria-label="Close admin navigation" onClick={() => setMobileOpen(false)}><X size={21} /></button></div><div className="mt-8"><AdminNavigation tab={tab} onNavigate={() => setMobileOpen(false)} /></div></div></div>}
        <div className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="font-label-caps text-wellora-surface-tint">{content.eyebrow}</p><h1 className="mt-2 font-display-lg-mobile md:font-display-lg">{content.title}</h1><p className="mt-2 max-w-2xl text-lg leading-7 text-wellora-on-surface-variant">{content.description}</p></div><button type="button" onClick={() => setNotice(`${content.action} is ready.`)} className="w-fit rounded-lg bg-wellora-on-background px-5 py-3 text-sm font-semibold text-wellora-on-primary hover:bg-wellora-inverse-surface">{content.action}</button></header>
          {notice && <div role="status" className="flex items-center justify-between rounded-lg border border-wellora-primary-container bg-wellora-primary-fixed/50 px-4 py-3 text-sm text-wellora-on-primary-container"><span>{notice}</span><button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={17} /></button></div>}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><SummaryCard label="Active records" value={tab === 'orders' ? '850' : tab === 'distributors' ? '124' : '48'} icon={BarChart3} /><SummaryCard label="This month" value={tab === 'orders' ? 'Tk 1.2M' : tab === 'distributors' ? 'Tk 1.3M' : '92%'} icon={ShoppingCart} /><SummaryCard label="Needs attention" value={tab === 'orders' ? '12' : '4'} icon={tab === 'product-catalog' ? Package : Users} /></div>
          <section className="overflow-hidden rounded-xl border border-wellora-surface-container-lowest/70 bg-wellora-surface-container-lowest/70 p-6 shadow-[0_4px_20px_rgb(26,32,44,0.04)] backdrop-blur-xl"><div className="mb-6 flex items-center justify-between"><h2 className="font-headline-sm">{content.title}</h2><button type="button" className="flex items-center gap-1 text-sm text-wellora-surface-tint hover:underline">View details <ChevronRight size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left"><thead className="border-b border-wellora-outline-variant/30 text-wellora-on-surface-variant"><tr>{tableHeaders.map((header) => <th key={header} className="pb-3 pr-4 font-label-caps font-normal">{header}</th>)}<th className="pb-3 text-right font-label-caps font-normal">Action</th></tr></thead><tbody className="text-sm">{rows[tab].map((row) => <tr key={row[0]} className="border-b border-wellora-outline-variant/20 last:border-0 hover:bg-wellora-surface-container-lowest/50">{row.map((cell) => <td key={cell} className="py-4 pr-4">{cell}</td>)}<td className="py-4 text-right"><button type="button" onClick={() => setNotice(`${row[0]} opened for review.`)} className="rounded border border-wellora-outline-variant px-3 py-1.5 text-xs hover:bg-wellora-surface-container-high">Manage</button></td></tr>)}</tbody></table></div></section>
        </div>
        <DashboardFooter role="admin" />
      </main>
    </div>
  );
}

function AdminNavigation({ tab, onNavigate }: { tab: AdminTab; onNavigate?: () => void }) {
  return <nav className="flex flex-col gap-2" aria-label="Admin navigation">{navigation.map(({ label, href, icon: Icon }) => { const active = (tab === 'orders' && label === 'Orders') || (tab === 'product-catalog' && label === 'Product Catalog') || (tab === 'distributors' && label === 'Distributors') || (tab === 'marketing-kits' && label === 'Marketing Kits'); return <Link key={label} href={href} onClick={onNavigate} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${active ? 'translate-x-1 bg-wellora-surface-tint text-wellora-on-primary shadow-sm' : 'text-wellora-on-surface-variant hover:bg-wellora-surface-container-high hover:text-wellora-on-background'}`}><Icon size={19} strokeWidth={1.8} />{label}</Link>; })}</nav>;
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BarChart3 }) {
  return <article className="flex h-32 flex-col justify-between rounded-xl border border-wellora-surface-container-lowest/70 bg-wellora-surface-container-lowest/70 p-5 shadow-[0_4px_20px_rgb(26,32,44,0.04)] backdrop-blur-xl"><div className="flex items-start justify-between"><p className="font-label-caps text-wellora-on-surface-variant">{label}</p><span className="rounded-full bg-wellora-primary-container p-2 text-wellora-surface-tint"><Icon size={18} /></span></div><p className="font-headline-md">{value}</p></article>;
}