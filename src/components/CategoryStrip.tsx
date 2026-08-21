'use client';

import React from 'react';
import { ProductCategory } from '@/types';

interface CategoryStripProps {
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
}

interface CategoryItem {
  id: ProductCategory;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'Cleanser', label: 'Cleanser', icon: 'water_drop' },
  { id: 'Toner', label: 'Toner', icon: 'waves' },
  { id: 'Serum', label: 'Serum', icon: 'science' },
  { id: 'Moisturizer', label: 'Moisturizer', icon: 'spa' },
  { id: 'Sunscreen', label: 'Sunscreen', icon: 'light_mode' },
];

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
      <div className="flex flex-col items-center mb-10">
        <h2 className="font-headline-md text-2xl md:text-3xl text-wellora-on-background text-center font-semibold">
          Shop by Category
        </h2>
        <p className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant mt-1 text-center">
          Explore dermatologically tested K-Beauty essentials formulated for all skin concerns
        </p>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 hide-scrollbar justify-start md:justify-center px-2">
        {/* All / Reset Option */}
        <button
          id="cat-btn-all"
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] group cursor-pointer focus:outline-hidden"
        >
          <div
            className={`w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-wellora-surface-tint text-wellora-on-primary border-wellora-surface-tint shadow-md scale-105'
                : 'bg-wellora-surface-container-low text-wellora-on-surface-variant border-wellora-outline-variant/40 group-hover:bg-wellora-primary-container group-hover:border-wellora-primary-container group-hover:text-wellora-on-primary-container'
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">
              grid_view
            </span>
          </div>
          <span
            className={`font-label-caps text-xs tracking-wider transition-colors ${
              selectedCategory === null
                ? 'text-wellora-surface-tint font-bold'
                : 'text-wellora-on-background group-hover:text-wellora-surface-tint'
            }`}
          >
            All Products
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id.toLowerCase()}`}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] group cursor-pointer focus:outline-hidden"
            >
              <div
                className={`w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSelected
                    ? 'bg-wellora-surface-tint text-wellora-on-primary border-wellora-surface-tint shadow-md scale-105'
                    : 'bg-wellora-surface-container-low text-wellora-on-surface-variant border-wellora-outline-variant/40 group-hover:bg-wellora-primary-container group-hover:border-wellora-primary-container group-hover:text-wellora-on-primary-container'
                }`}
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl">
                  {cat.icon}
                </span>
              </div>
              <span
                className={`font-label-caps text-xs tracking-wider transition-colors ${
                  isSelected
                    ? 'text-wellora-surface-tint font-bold'
                    : 'text-wellora-on-background group-hover:text-wellora-surface-tint'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
