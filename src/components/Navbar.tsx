import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ProductCategory } from '../types';
import { useAppSelector } from '@/redux/hooks';
import { resolveDashboardRoute } from '@/lib/dashboardAccess';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateToPartner: () => void;
  onSelectCategory: (category: ProductCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigateToPartner,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const accountRoute = resolveDashboardRoute(userRole);
  const isHomeActive = pathname === '/';
  const isShopActive = pathname.startsWith('/products');
  const isPartnerActive = pathname.startsWith('/account');
  return (
    <>
      {/* Announcement Bar */}
      <div id="announcement-bar" className="bg-wellora-surface-tint text-wellora-on-primary py-2 px-4 md:px-10 text-center font-label-caps text-xs tracking-wider flex items-center justify-center gap-2">
        <span>Free shipping on orders over ৳2000!</span>
        <span className="hidden sm:inline text-wellora-on-primary/70">|</span>
        <span className="hidden sm:inline text-wellora-on-primary/90">100% Authentic Korean & Global Skincare</span>
      </div>

      {/* TopNavBar */}
      <header className="bg-wellora-background/90 backdrop-blur-xl sticky top-0 z-40 border-b border-wellora-outline-variant/30 shadow-xs">
        <div className="flex justify-between items-center max-w-[1280px] mx-auto w-full h-20 px-4 md:px-10">
          
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                onSelectCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col text-left focus:outline-hidden group cursor-pointer"
            >
              <span className="font-headline-md text-2xl font-bold text-wellora-on-background tracking-tight group-hover:text-wellora-surface-tint transition-colors">
                WELLORA
              </span>
              <span className="font-label-caps text-[11px] text-wellora-surface-tint tracking-widest -mt-0.5 font-semibold">
                মানানসই পছন্দ
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                aria-current={isHomeActive ? 'page' : undefined}
                className={`font-label-caps text-xs pb-1 transition-colors cursor-pointer ${isHomeActive ? 'text-wellora-surface-tint font-bold border-b-2 border-wellora-surface-tint' : 'text-wellora-on-surface-variant font-medium hover:text-wellora-surface-tint'}`}
              >
                Home
              </Link>
              <Link
                id="nav-shop-btn"
                href="/products"
                aria-current={isShopActive ? 'page' : undefined}
                className={`font-label-caps text-xs pb-1 transition-colors cursor-pointer ${isShopActive ? 'text-wellora-surface-tint font-bold border-b-2 border-wellora-surface-tint' : 'text-wellora-on-surface-variant font-medium hover:text-wellora-surface-tint'}`}
              >
                Shop All
              </Link>
              <button 
                id="nav-brands-btn"
                onClick={() => onScrollToSection('categories-section')} 
                className="font-label-caps text-xs text-wellora-on-surface-variant font-medium hover:text-wellora-surface-tint transition-colors cursor-pointer"
              >
                Brands
              </button>
              <button 
                id="nav-bestsellers-btn"
                onClick={() => onScrollToSection('trending-section')} 
                className="font-label-caps text-xs text-wellora-on-surface-variant font-medium hover:text-wellora-surface-tint transition-colors cursor-pointer"
              >
                Best Sellers
              </button>
              <button 
                id="nav-newarrivals-btn"
                onClick={() => onScrollToSection('trending-section')} 
                className="font-label-caps text-xs text-wellora-on-surface-variant font-medium hover:text-wellora-surface-tint transition-colors cursor-pointer"
              >
                New Arrivals
              </button>
            </nav>
          </div>

          {/* Search, Currency & Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search (Desktop) */}
            <div className="hidden lg:flex relative items-center">
              <span className="material-symbols-outlined absolute left-3 text-wellora-on-surface-variant/60 text-lg pointer-events-none">
                search
              </span>
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skincare..."
                className="w-60 pl-9 pr-8 py-2 bg-wellora-surface-container-low border-b border-wellora-outline-variant focus:border-wellora-surface-tint focus:bg-wellora-surface-container-lowest focus:outline-hidden rounded-t-sm font-body-sm text-sm text-wellora-on-background placeholder-wellora-on-surface-variant/60 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-xs text-wellora-on-surface-variant hover:text-wellora-on-background p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Currency Badge */}
            <div className="hidden sm:flex font-label-caps text-xs text-wellora-on-background font-semibold tracking-wider bg-wellora-surface-container-low px-2.5 py-1 rounded">
              BDT ৳
            </div>

            {/* Partner Portal Switcher Button */}
            <button
              id="distributor-portal-entry-btn"
              onClick={() => router.push(accountRoute)}
              aria-current={isPartnerActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-caps text-[11px] font-semibold transition-all cursor-pointer shadow-2xs ${isPartnerActive ? 'bg-wellora-primary-container text-wellora-on-primary-fixed-variant border-b-2 border-wellora-surface-tint' : 'bg-wellora-primary-fixed/60 hover:bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant border border-wellora-outline-variant/50'}`}
              title="Open Distributor Portal"
            >
              <span className="material-symbols-outlined text-[16px] text-wellora-surface-tint">storefront</span>
              <span className="hidden sm:inline">Partner Portal</span>
            </button>

            {/* Account Icon / Trigger */}
            <button
              id="user-account-btn"
              onClick={() => router.push(accountRoute)}
              aria-label="Login & Partner Portal"
              className="text-wellora-surface-tint hover:text-wellora-on-primary-fixed-variant transition-colors flex items-center justify-center p-2 rounded-full hover:bg-wellora-surface-container-high cursor-pointer"
              title="Partner Account (Shuvo Mallik)"
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="text-wellora-surface-tint hover:text-wellora-on-primary-fixed-variant transition-colors flex items-center justify-center p-2 rounded-full hover:bg-wellora-surface-container-high relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-wellora-error text-wellora-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-wellora-surface-tint p-1.5 rounded"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-wellora-surface-container-lowest border-b border-wellora-outline-variant px-4 py-4 flex flex-col gap-3 shadow-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-wellora-on-surface-variant/60 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skincare..."
                className="w-full pl-9 pr-4 py-2 bg-wellora-surface-container-low border border-wellora-outline-variant rounded text-sm text-wellora-on-background"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-wellora-outline-variant/40 font-label-caps text-xs">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isHomeActive ? 'page' : undefined}
                className={`text-left py-1 ${isHomeActive ? 'font-bold text-wellora-surface-tint border-l-2 border-wellora-surface-tint pl-2' : 'text-wellora-on-surface-variant hover:text-wellora-surface-tint'}`}
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isShopActive ? 'page' : undefined}
                className={`text-left py-1 ${isShopActive ? 'font-bold text-wellora-surface-tint border-l-2 border-wellora-surface-tint pl-2' : 'text-wellora-on-surface-variant hover:text-wellora-surface-tint'}`}
              >
                Shop All Products
              </Link>
              <button 
                onClick={() => { onScrollToSection('categories-section'); setMobileMenuOpen(false); }}
                className="text-left py-1 text-wellora-on-surface-variant"
              >
                Categories & Brands
              </button>
              <button 
                onClick={() => { onNavigateToPartner(); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 bg-wellora-primary-container text-wellora-on-primary-container rounded font-semibold flex items-center justify-between"
              >
                <span>Distributor Portal (Gold Tier)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
