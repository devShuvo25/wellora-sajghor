import React, { useState } from 'react';
import { Product } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateToPartner: () => void;
  onSelectCategory: (category: string | null) => void;
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

  return (
    <>
      {/* Announcement Bar */}
      <div id="announcement-bar" className="bg-[#72585a] text-white py-2 px-4 md:px-10 text-center font-label-caps text-xs tracking-wider flex items-center justify-center gap-2">
        <span>Free shipping on orders over ৳2000!</span>
        <span className="hidden sm:inline text-white/70">|</span>
        <span className="hidden sm:inline text-white/90">100% Authentic Korean & Global Skincare</span>
      </div>

      {/* TopNavBar */}
      <header className="bg-[#f8f9fa]/90 backdrop-blur-xl sticky top-0 z-40 border-b border-[#d3c3c4]/30 shadow-xs">
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
              <span className="font-headline-md text-2xl font-bold text-[#191c1d] tracking-tight group-hover:text-[#72585a] transition-colors">
                WELLORA
              </span>
              <span className="font-label-caps text-[11px] text-[#72585a] tracking-widest -mt-0.5 font-semibold">
                মানানসই পছন্দ
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                id="nav-shop-btn"
                onClick={() => onScrollToSection('trending-section')} 
                className="font-label-caps text-xs text-[#72585a] font-bold border-b-2 border-[#72585a] pb-1 hover:text-[#72585a] transition-colors cursor-pointer"
              >
                Shop
              </button>
              <button 
                id="nav-brands-btn"
                onClick={() => onScrollToSection('categories-section')} 
                className="font-label-caps text-xs text-[#4f4445] font-medium hover:text-[#72585a] transition-colors cursor-pointer"
              >
                Brands
              </button>
              <button 
                id="nav-bestsellers-btn"
                onClick={() => onScrollToSection('trending-section')} 
                className="font-label-caps text-xs text-[#4f4445] font-medium hover:text-[#72585a] transition-colors cursor-pointer"
              >
                Best Sellers
              </button>
              <button 
                id="nav-newarrivals-btn"
                onClick={() => onScrollToSection('trending-section')} 
                className="font-label-caps text-xs text-[#4f4445] font-medium hover:text-[#72585a] transition-colors cursor-pointer"
              >
                New Arrivals
              </button>
            </nav>
          </div>

          {/* Search, Currency & Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search (Desktop) */}
            <div className="hidden lg:flex relative items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#4f4445]/60 text-lg pointer-events-none">
                search
              </span>
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skincare..."
                className="w-60 pl-9 pr-8 py-2 bg-[#f3f4f5] border-b border-[#d3c3c4] focus:border-[#72585a] focus:bg-white focus:outline-hidden rounded-t-sm font-body-sm text-sm text-[#191c1d] placeholder-[#4f4445]/60 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-xs text-[#4f4445] hover:text-[#191c1d] p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Currency Badge */}
            <div className="hidden sm:flex font-label-caps text-xs text-[#191c1d] font-semibold tracking-wider bg-[#f3f4f5] px-2.5 py-1 rounded">
              BDT ৳
            </div>

            {/* Partner Portal Switcher Button */}
            <button
              id="distributor-portal-entry-btn"
              onClick={onNavigateToPartner}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fedadd]/60 hover:bg-[#fedadd] text-[#594043] border border-[#d3c3c4]/50 rounded-full font-label-caps text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              title="Open Distributor Portal"
            >
              <span className="material-symbols-outlined text-[16px] text-[#72585a]">storefront</span>
              <span className="hidden sm:inline">Partner Portal</span>
            </button>

            {/* Account Icon / Trigger */}
            <button
              id="user-account-btn"
              onClick={onNavigateToPartner}
              aria-label="Login & Partner Portal"
              className="text-[#72585a] hover:text-[#594043] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#e7e8e9] cursor-pointer"
              title="Partner Account (Shuvo Mallik)"
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="text-[#72585a] hover:text-[#594043] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#e7e8e9] relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#ba1a1a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#72585a] p-1.5 rounded"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#d3c3c4] px-4 py-4 flex flex-col gap-3 shadow-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#4f4445]/60 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skincare..."
                className="w-full pl-9 pr-4 py-2 bg-[#f3f4f5] border border-[#d3c3c4] rounded text-sm text-[#191c1d]"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-[#d3c3c4]/40 font-label-caps text-xs">
              <button 
                onClick={() => { onScrollToSection('trending-section'); setMobileMenuOpen(false); }}
                className="text-left py-1 text-[#72585a] font-bold"
              >
                Shop All Products
              </button>
              <button 
                onClick={() => { onScrollToSection('categories-section'); setMobileMenuOpen(false); }}
                className="text-left py-1 text-[#4f4445]"
              >
                Categories & Brands
              </button>
              <button 
                onClick={() => { onNavigateToPartner(); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 bg-[#e8c5c8] text-[#6b5053] rounded font-semibold flex items-center justify-between"
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
