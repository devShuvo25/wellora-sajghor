'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '../Hero';
import { TrustBadges } from '../TrustBadges';
import { CategoryStrip } from '../CategoryStrip';
import { ProductGrid } from '../ProductGrid';
import { DistributorBanner } from '../DistributorBanner';
import { Product, ProductCategory } from '@/types/universal';

interface LandingPageProps {
  products: Product[];
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onScrollToSection: (sectionId: string) => void;
  isAuthenticated: boolean;
}

export function LandingPage({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onScrollToSection,
  isAuthenticated,
}: LandingPageProps) {
  const router = useRouter();

  return (
    <main className="flex-1">
      <Hero
        onExploreClick={() => onScrollToSection('trending-section')}
        onDistributorClick={() =>
          router.push(isAuthenticated ? '/dashboard/distributor' : '/login?next=/dashboard/distributor')
        }
      />

      <TrustBadges />

      <CategoryStrip
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onAddToCart={onAddToCart}
        onQuickView={(product) => router.push(`/products/${product.id}`)}
        onClearFilters={() => {
          onSelectCategory(null);
          onSearchChange('');
        }}
      />

      <DistributorBanner
        onBecomeDistributor={() =>
          router.push(isAuthenticated ? '/dashboard/distributor' : '/login?next=/dashboard/distributor')
        }
      />
    </main>
  );
}

export default LandingPage;
