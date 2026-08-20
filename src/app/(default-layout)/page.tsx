
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Product,
  CartItem,
  DistributorOrder,
  DistributorProfile,
  ProductCategory,
  AppView,
} from '../../interface/universal';
import {
  INITIAL_PRODUCTS,
  INITIAL_DISTRIBUTOR,
  INITIAL_ORDERS,
} from '../../data/mockData';

// Storefront components
import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { TrustBadges } from '../../components/TrustBadges';
import { CategoryStrip } from '../../components/CategoryStrip';
import { ProductGrid } from '../../components/ProductGrid';
import { DistributorBanner } from '../../components/DistributorBanner';
import { Footer } from '../../components/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { NotificationToast } from '../../components/NotificationToast';

// Partner Portal components
import { DistributorSidebar } from '../../components/portal/DistributorSidebar';
import { DistributorDashboard } from '../../components/portal/DistributorDashboard';
import { MarketingAssetLibrary } from '../../components/portal/MarketingAssetLibrary';
import { CreateOrderView } from '../../components/portal/CreateOrderView';
import { ReferralLinksView } from '../../components/portal/ReferralLinksView';
import { SalesAnalyticsView } from '../../components/portal/SalesAnalyticsView';
import { TeamOverridesView } from '../../components/portal/TeamOverridesView';
import { WalletModal } from '../../components/portal/WalletModal';
import { TrackingModal } from '../../components/portal/TrackingModal';
import { RootState } from '../../redux/store';

export function App() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => Boolean(state.auth.token));
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('store');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Storefront Filter States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Catalog State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);

  // Partner State
  const [distributor, setDistributor] = useState<DistributorProfile>(INITIAL_DISTRIBUTOR);
  const [orders, setOrders] = useState<DistributorOrder[]>(INITIAL_ORDERS);
  const [trackingOrder, setTrackingOrder] = useState<DistributorOrder | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Partner Order Creation
  const handleCreatePartnerOrder = (newOrderData: Omit<DistributorOrder, 'id' | 'date'>) => {
    const newId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: DistributorOrder = {
      id: newId,
      date: today,
      ...newOrderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setDistributor((prev) => ({
      ...prev,
      totalSales: prev.totalSales + newOrder.amount,
      pendingCommissions: prev.pendingCommissions + newOrder.commission,
    }));
  };

  // Partner Payout
  const handleWithdrawSuccess = (amount: number) => {
    setDistributor((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));
    showToast(`Withdrawal of ৳${amount.toLocaleString()} processed successfully.`);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isPartnerPortal = currentView.startsWith('partner-');

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background flex flex-col selection:bg-wellora-primary-fixed selection:text-wellora-on-primary-fixed-variant">
      
      {/* Toast Notification */}
      <NotificationToast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccessToast={showToast}
        isAuthenticated={isAuthenticated}
        onAuthenticationRequired={() => router.push('/login?next=/')}
      />

      {/* Wallet Payout Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        distributor={distributor}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Order Tracking Modal */}
      <TrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      {/* RENDER VIEW: STOREFRONT OR PARTNER PORTAL */}
      {!isPartnerPortal ? (
        // ------------------ STOREFRONT (Screen 1) ------------------
        <div className="flex flex-col min-h-screen">
          <Navbar
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            onOpenCart={() => setCartOpen(true)}
            onNavigateToPartner={() => router.push('/account')}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onScrollToSection={handleScrollToSection}
          />

          <main className="flex-1">
            <Hero
              onExploreClick={() => handleScrollToSection('trending-section')}
              onDistributorClick={() => router.push(isAuthenticated ? '/account' : '/login?next=/account')}
            />

            <TrustBadges />

            <CategoryStrip
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onQuickView={(product) => router.push(`/products/${product.id}`)}
              onClearFilters={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
            />

            <DistributorBanner
              onBecomeDistributor={() => router.push(isAuthenticated ? '/account' : '/login?next=/account')}
            />
          </main>

          <Footer onPartnerClick={() => router.push(isAuthenticated ? '/account' : '/login?next=/account')} />
        </div>
      ) : (
        // ------------------ PARTNER PORTAL (Screen 2 & 3) ------------------
        <div className="flex min-h-screen bg-wellora-background">
          {/* Sidebar */}
          <DistributorSidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            distributor={distributor}
            onOpenWithdrawModal={() => setWalletModalOpen(true)}
            onSwitchToStore={() => setCurrentView('store')}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area (offset by 288px / 72 on desktop) */}
          <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
            {currentView === 'partner-dashboard' && (
              <DistributorDashboard
                distributor={distributor}
                orders={orders}
                products={products}
                onCreateOrder={handleCreatePartnerOrder}
                onOpenWithdrawModal={() => setWalletModalOpen(true)}
                onSelectOrderTracking={(order) => setTrackingOrder(order)}
                onToast={showToast}
                onSwitchToStore={() => setCurrentView('store')}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              />
            )}

            {currentView === 'partner-marketing-assets' && (
              <MarketingAssetLibrary
                onToast={showToast}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
                referralCode={distributor.referralCode}
              />
            )}

            {currentView === 'partner-create-order' && (
              <CreateOrderView
                products={products}
                onCreateOrder={handleCreatePartnerOrder}
                onToast={showToast}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              />
            )}

            {currentView === 'partner-referral-links' && (
              <ReferralLinksView
                distributor={distributor}
                products={products}
                onToast={showToast}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              />
            )}

            {currentView === 'partner-wallet' && (
              <div className="p-6 md:p-10">
                <button
                  onClick={() => setWalletModalOpen(true)}
                  className="px-6 py-3 bg-wellora-surface-tint text-wellora-on-primary rounded-lg text-xs font-label-caps"
                >
                  Open Wallet Payout Modal
                </button>
              </div>
            )}

            {currentView === 'partner-sales-analytics' && (
              <SalesAnalyticsView
                distributor={distributor}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              />
            )}

            {currentView === 'partner-team-overrides' && (
              <TeamOverridesView
                distributor={distributor}
                onOpenMobileMenu={() => setMobileSidebarOpen(true)}
                onToast={showToast}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

