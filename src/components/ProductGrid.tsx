import React from 'react';
import { Product, ProductCategory } from '../types';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | null;
  searchQuery: string;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onClearFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onAddToCart,
  onQuickView,
  onClearFilters,
}) => {
  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="trending-section" className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8 border-b border-wellora-outline-variant/20 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-md text-2xl md:text-3xl text-wellora-on-background font-semibold">
              {selectedCategory ? `${selectedCategory} Collection` : 'Trending Now'}
            </h2>
            {selectedCategory && (
              <span className="px-2.5 py-0.5 bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant rounded-full text-xs font-label-caps">
                {filteredProducts.length} items
              </span>
            )}
          </div>
          {searchQuery && (
            <p className="font-body-sm text-xs text-wellora-on-surface-variant mt-1">
              Showing results matching &ldquo;<span className="font-semibold text-wellora-on-background">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {(selectedCategory || searchQuery) && (
            <button
              id="clear-filters-btn"
              onClick={onClearFilters}
              className="text-xs text-wellora-surface-tint hover:underline font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
          <button
            id="view-all-products-btn"
            onClick={onClearFilters}
            className="font-label-caps text-xs text-wellora-surface-tint hover:underline underline-offset-4 font-semibold tracking-wider uppercase cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-wellora-surface-container-lowest rounded-xl border border-wellora-outline-variant/30 p-8 my-6">
          <span className="material-symbols-outlined text-5xl text-wellora-outline-variant mb-3">
            search_off
          </span>
          <h3 className="font-headline-sm text-lg font-semibold text-wellora-on-background mb-1">
            No skincare products found
          </h3>
          <p className="font-body-sm text-sm text-wellora-on-surface-variant max-w-sm mx-auto mb-5">
            We couldn&apos;t find any items matching your current filters. Try searching for COSRX, Toner, or clear your filters.
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-2.5 bg-wellora-surface-tint text-wellora-on-primary rounded font-label-caps text-xs tracking-wider uppercase hover:bg-wellora-on-primary-fixed-variant transition-colors cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Grid: 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            id={`product-card-${product.id}`}
            className="group flex flex-col bg-wellora-surface-container-lowest rounded-xl p-3 sm:p-4 border border-transparent hover:border-wellora-outline-variant/40 hover:shadow-lg transition-all duration-300 relative"
          >
            {/* Image Box */}
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-wellora-background border border-wellora-outline-variant/20">
              <img
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                alt={product.altText}
                src={product.image}
                referrerPolicy="no-referrer"
              />

              {/* Tag / Badge if Trending */}
              {product.isTrending && (
                <div className="absolute top-2 left-2 bg-wellora-primary-fixed/90 backdrop-blur-xs text-wellora-on-primary-fixed-variant font-label-caps text-[9px] px-2 py-0.5 rounded font-semibold">
                  BESTSELLER
                </div>
              )}

              {/* Quick Actions overlay on hover */}
              <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 px-2">
                <button
                  id={`btn-add-cart-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  aria-label="Add to Cart"
                  title="Add to Cart"
                  className="bg-wellora-surface-tint text-wellora-on-primary p-2.5 rounded-full shadow-md hover:bg-wellora-on-primary-fixed-variant hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    shopping_bag
                  </span>
                </button>

                <button
                  id={`btn-product-details-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  aria-label="Quick View"
                  title="View Product Details"
                  className="bg-wellora-surface-container-lowest text-wellora-on-background p-2.5 rounded-full shadow-md hover:text-wellora-surface-tint hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    open_in_new
                  </span>
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="flex flex-col gap-1 flex-1 justify-between">
              <div>
                <span className="font-label-caps text-wellora-on-surface-variant/80 tracking-widest text-[10px] uppercase font-semibold">
                  {product.brand}
                </span>

                <h3
                  onClick={() => onQuickView(product)}
                  className="font-body-sm text-xs sm:text-sm text-wellora-on-background font-medium line-clamp-2 hover:text-wellora-surface-tint transition-colors cursor-pointer mt-0.5"
                  title={`View details for ${product.name}`}
                >
                  {product.name}
                </h3>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-body-md text-sm sm:text-base font-bold text-wellora-on-background">
                    ৳ {product.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-wellora-on-surface-variant/70">
                    {product.volume}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-1.5 text-wellora-tertiary">
                  <span className="material-symbols-outlined text-[13px] fill" data-weight="fill">
                    stars
                  </span>
                  <span className="font-label-caps text-[10px] lowercase tracking-wide font-medium">
                    earn {product.points} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
