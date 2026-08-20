'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { ProductCategory } from '@/interface/universal';

const categories: ProductCategory[] = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'];
const skinTypes = ['Dry', 'Sensitive', 'Oily', 'Combination'];

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('featured');
  const [notice, setNotice] = useState('');

  const products = useMemo(() => {
    const filtered = INITIAL_PRODUCTS.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const skinMatch = selectedSkinTypes.length === 0 || selectedSkinTypes.some((skin) => product.skinType.some((type) => type.toLowerCase().includes(skin.toLowerCase())));
      return categoryMatch && skinMatch;
    });

    return [...filtered].sort((first, second) => {
      if (sort === 'price-low') return first.price - second.price;
      if (sort === 'price-high') return second.price - first.price;
      if (sort === 'newest') return Number(Boolean(second.isTrending)) - Number(Boolean(first.isTrending));
      return Number(Boolean(second.isTrending)) - Number(Boolean(first.isTrending));
    });
  }, [selectedCategories, selectedSkinTypes, sort]);

  const toggleFilter = <T extends string>(value: T, setter: Dispatch<SetStateAction<T[]>>) => {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <main className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col px-4 pb-16 pt-8 md:px-10">
        <div className="mb-8 flex items-center gap-2 text-sm text-[#4f4445]"><Link href="/" className="hover:text-[#72585a]">Home</Link><span className="material-symbols-outlined text-base">chevron_right</span><span className="text-[#72585a]">Shop All Skincare</span></div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64"><div className="rounded-xl bg-white p-6 shadow-[0_4px_24px_rgba(26,32,44,0.04)]"><div className="mb-6 flex items-center justify-between border-b border-[#d3c3c4]/30 pb-4"><h2 className="font-headline-sm text-xl">Filters</h2><button onClick={() => { setSelectedCategories([]); setSelectedSkinTypes([]); }} className="text-xs text-[#72585a] hover:underline">Clear</button></div><div className="mb-7"><h3 className="mb-4 font-label-caps text-xs uppercase tracking-widest text-[#4f4445]">Category</h3><div className="space-y-3">{categories.map((category) => <label key={category} className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleFilter(category, setSelectedCategories)} className="h-4 w-4 rounded border-[#817475] text-[#72585a] focus:ring-[#e8c5c8]" /><span className={selectedCategories.includes(category) ? 'font-semibold text-[#72585a]' : ''}>{category}</span></label>)}</div></div><div><h3 className="mb-4 font-label-caps text-xs uppercase tracking-widest text-[#4f4445]">Skin Type</h3><div className="space-y-3">{skinTypes.map((skin) => <label key={skin} className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={selectedSkinTypes.includes(skin)} onChange={() => toggleFilter(skin, setSelectedSkinTypes)} className="h-4 w-4 rounded border-[#817475] text-[#72585a] focus:ring-[#e8c5c8]" /><span className={selectedSkinTypes.includes(skin) ? 'font-semibold text-[#72585a]' : ''}>{skin}</span></label>)}</div></div></div></aside>

          <section className="flex min-w-0 flex-1 flex-col"><div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#d3c3c4]/20 pb-4 sm:flex-row sm:items-center"><div><h1 className="font-headline-md text-3xl font-bold md:text-5xl">Shop All Skincare</h1><p className="mt-2 text-sm text-[#4f4445]">Showing {products.length} of 145 products</p></div><label className="flex items-center gap-3 text-sm text-[#4f4445]">Sort By:<select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="rounded-md border-[#d3c3c4] bg-transparent py-2 pl-3 pr-8 text-sm focus:border-[#72585a] focus:ring-[#e8c5c8]"><option value="featured">Featured</option><option value="newest">Newest Arrivals</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></label></div>
            {products.length === 0 ? <div className="rounded-xl bg-white p-16 text-center"><span className="material-symbols-outlined mb-3 text-5xl text-[#d3c3c4]">search_off</span><h2 className="font-headline-sm text-xl">No products match these filters</h2><p className="mt-2 text-sm text-[#4f4445]">Clear a filter to see more of the WELLORA collection.</p></div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <article key={product.id} className="group flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,32,44,0.08)]"><Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-[#f3f4f5]"><img src={product.image} alt={product.altText} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />{product.isTrending && <span className="absolute left-4 top-4 rounded bg-[#fedadd]/90 px-2 py-1 font-label-caps text-[10px] font-semibold text-[#594043]">BESTSELLER</span>}<span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#191c1d] opacity-0 shadow-sm backdrop-blur-md transition-all group-hover:opacity-100"><span className="material-symbols-outlined">visibility</span></span></Link><div className="flex flex-1 flex-col p-5"><span className="mb-1 font-label-caps text-xs uppercase tracking-widest text-[#4f4445]">{product.brand}</span><Link href={`/products/${product.id}`} className="mb-2 line-clamp-2 font-body-md font-semibold hover:text-[#72585a]">{product.name}</Link><div className="mb-3 flex items-center gap-1 text-sm"><span className="material-symbols-outlined fill text-base text-[#f1ca50]" data-weight="fill">star</span>{product.rating}<span className="text-[#4f4445]">({product.reviewsCount})</span></div><div className="mt-auto flex items-center justify-between"><div><span className="block font-headline-sm">৳ {product.price.toLocaleString()}</span><span className="mt-0.5 block text-[11px] text-[#72585a]">Earn {product.points} pts</span></div><button onClick={() => { setNotice(`${product.name} added to your cart.`); }} className="h-10 rounded-md bg-[#191c1d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4f4445]">Add</button></div></div></article>)}</div>}
            <div className="mt-10 flex items-center justify-center gap-2"><button disabled className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d3c3c4] text-[#817475]"><span className="material-symbols-outlined">chevron_left</span></button><span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#72585a] text-sm font-semibold text-white">1</span><button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d3c3c4] text-sm hover:bg-[#edeeef]">2</button><button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d3c3c4] text-sm hover:bg-[#edeeef]">3</button><span className="px-2 text-[#4f4445]">...</span><button className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d3c3c4]"><span className="material-symbols-outlined">chevron_right</span></button></div>
          </section>
        </div>
      </main>
      {notice && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#191c1d] px-5 py-3 text-sm text-white shadow-xl" role="status">{notice}</div>}
    </div>
  );
}
