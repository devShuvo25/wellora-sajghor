'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Product, CartItem, ProductCategory } from '@/types/universal';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { NotificationToast } from '@/components/NotificationToast';
import { LandingPage } from '@/components/Home/LandingPage';
import { RootState } from '@/redux/store';

export function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => Boolean(state.auth.token));

  // Storefront Filter States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);

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

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onNavigateToPartner={() =>
          router.push(isAuthenticated ? '/dashboard/distributor' : '/login?next=/dashboard/distributor')
        }
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScrollToSection={handleScrollToSection}
      />

      {/* Storefront Main Content */}
      <LandingPage
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddToCart={(product) => handleAddToCart(product, 1)}
        onScrollToSection={handleScrollToSection}
        isAuthenticated={isAuthenticated}
      />

      {/* Footer */}
      <Footer
        onPartnerClick={() =>
          router.push(isAuthenticated ? '/dashboard/distributor' : '/login?next=/dashboard/distributor')
        }
      />
    </div>
  );
}

export default HomePage;
