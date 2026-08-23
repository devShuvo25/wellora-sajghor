"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ProductCategory, Product } from "@/types";
import { useGetProductsQuery } from "@/redux/api/productsApi";

const categories = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
];
const skinTypes = ["Dry", "Sensitive", "Oily", "Combination"];

type SortOption = "featured" | "newest" | "price-low" | "price-high";

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");

  const { data: rawProducts, isLoading } = useGetProductsQuery({
    category: selectedCategories.join(","),
    skinType: selectedSkinTypes.join(","),
    searchTerm: searchTerm,
    sortBy: sort,
  });

  const products: Product[] = rawProducts?.data || [];

  const toggleFilter = <T extends string>(
    value: T,
    setter: Dispatch<SetStateAction<T[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <main className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col px-4 pb-16 pt-8 md:px-10">
        <div className="mb-8 flex items-center gap-2 text-sm text-wellora-on-surface-variant">
          <Link href="/" className="hover:text-wellora-surface-tint">
            Home
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <span className="text-wellora-surface-tint">Shop All Skincare</span>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-xl bg-wellora-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(26,32,44,0.04)]">
              {/* Search Box */}
              <div className="mb-6">
                <h3 className="mb-2 font-label-caps text-xs uppercase tracking-widest text-wellora-on-surface-variant">
                  Search
                </h3>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-md border border-wellora-outline-variant bg-transparent py-2 pl-3 pr-8 text-sm focus:border-wellora-surface-tint focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 text-xs text-wellora-on-surface-variant hover:text-wellora-surface-tint"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between border-b border-wellora-outline-variant/30 pb-4">
                <h2 className="font-headline-sm text-xl">Filters</h2>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSkinTypes([]);
                    setSearchTerm("");
                  }}
                  className="text-xs text-wellora-surface-tint hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="mb-7">
                <h3 className="mb-4 font-label-caps text-xs uppercase tracking-widest text-wellora-on-surface-variant">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category as any)}
                        onChange={() =>
                          toggleFilter(category, setSelectedCategories as any)
                        }
                        className="h-4 w-4 rounded border-wellora-outline text-wellora-surface-tint focus:ring-wellora-primary-container"
                      />
                      <span
                        className={
                          selectedCategories.includes(category as any)
                            ? "font-semibold text-wellora-surface-tint"
                            : ""
                        }
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-label-caps text-xs uppercase tracking-widest text-wellora-on-surface-variant">
                  Skin Type
                </h3>
                <div className="space-y-3">
                  {skinTypes.map((skin) => (
                    <label
                      key={skin}
                      className="flex cursor-pointer items-center gap-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkinTypes.includes(skin)}
                        onChange={() =>
                          toggleFilter(skin, setSelectedSkinTypes)
                        }
                        className="h-4 w-4 rounded border-wellora-outline text-wellora-surface-tint focus:ring-wellora-primary-container"
                      />
                      <span
                        className={
                          selectedSkinTypes.includes(skin)
                            ? "font-semibold text-wellora-surface-tint"
                            : ""
                        }
                      >
                        {skin}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-wellora-outline-variant/20 pb-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="font-headline-md text-3xl font-bold md:text-5xl">
                  Shop All Skincare
                </h1>
                <p className="mt-2 text-sm text-wellora-on-surface-variant">
                  {isLoading
                    ? "Searching..."
                    : `Showing ${products.length} products`}
                </p>
              </div>
              <label className="flex items-center gap-3 text-sm text-wellora-on-surface-variant">
                Sort By:
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortOption)
                  }
                  className="rounded-md border-wellora-outline-variant bg-transparent py-2 pl-3 pr-8 text-sm focus:border-wellora-surface-tint focus:ring-wellora-primary-container"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </label>
            </div>

            {/* Skeleton Loading Fallback */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col animate-pulse overflow-hidden rounded-xl bg-wellora-surface-container-lowest"
                  >
                    <div className="aspect-square bg-wellora-outline-variant/20" />
                    <div className="flex flex-1 flex-col p-5 space-y-3">
                      <div className="h-3 w-1/3 rounded bg-wellora-outline-variant/20" />
                      <div className="h-4 w-3/4 rounded bg-wellora-outline-variant/20" />
                      <div className="h-3 w-1/2 rounded bg-wellora-outline-variant/20" />
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="space-y-1 w-1/2">
                          <div className="h-5 w-20 rounded bg-wellora-outline-variant/20" />
                          <div className="h-3 w-14 rounded bg-wellora-outline-variant/20" />
                        </div>
                        <div className="h-10 w-16 rounded-md bg-wellora-outline-variant/20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl bg-wellora-surface-container-lowest p-16 text-center">
                <span className="material-symbols-outlined mb-3 text-5xl text-wellora-outline-variant">
                  search_off
                </span>
                <h2 className="font-headline-sm text-xl">
                  No products match these filters
                </h2>
                <p className="mt-2 text-sm text-wellora-on-surface-variant">
                  Clear a filter to see more of the WELLORA collection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl bg-wellora-surface-container-lowest transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,32,44,0.08)]"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="relative aspect-square overflow-hidden bg-wellora-surface-container-low"
                    >
                      <img
                        src={product.image}
                        alt={product.altText || product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {product.isTrending && (
                        <span className="absolute left-4 top-4 rounded bg-wellora-primary-fixed/90 px-2 py-1 font-label-caps text-[10px] font-semibold text-wellora-on-primary-fixed-variant">
                          BESTSELLER
                        </span>
                      )}
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-wellora-surface-container-lowest/80 text-wellora-on-background opacity-0 shadow-sm backdrop-blur-md transition-all group-hover:opacity-100">
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="mb-1 font-label-caps text-xs uppercase tracking-widest text-wellora-on-surface-variant">
                        {product.brand}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="mb-2 line-clamp-2 font-body-md font-semibold hover:text-wellora-surface-tint"
                      >
                        {product.name}
                      </Link>
                      <div className="mb-3 flex items-center gap-1 text-sm">
                        <span
                          className="material-symbols-outlined fill text-base text-wellora-tertiary-container"
                          data-weight="fill"
                        >
                          star
                        </span>
                        {product.rating}
                        <span className="text-wellora-on-surface-variant">
                          ({product.reviewsCount})
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="block font-headline-sm">
                            ৳ {product.price.toLocaleString()}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-wellora-surface-tint">
                            Earn {product.points} pts
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setNotice(`${product.name} added to your cart.`);
                          }}
                          className="h-10 rounded-md bg-wellora-on-background px-4 text-sm font-semibold text-wellora-on-primary transition-colors hover:bg-wellora-on-surface-variant"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled
                className="flex h-10 w-10 items-center justify-center rounded-md border border-wellora-outline-variant text-wellora-outline"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-wellora-surface-tint text-sm font-semibold text-wellora-on-primary">
                1
              </span>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-wellora-outline-variant text-sm hover:bg-wellora-surface-container">
                2
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-wellora-outline-variant text-sm hover:bg-wellora-surface-container">
                3
              </button>
              <span className="px-2 text-wellora-on-surface-variant">...</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-wellora-outline-variant">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>
      {notice && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-wellora-on-background px-5 py-3 text-sm text-wellora-on-primary shadow-xl"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}