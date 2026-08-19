import React from 'react';
import { ProductCategory } from '../types';

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
        <h2 className="font-headline-md text-2xl md:text-3xl text-[#191c1d] text-center font-semibold">
          Shop by Category
        </h2>
        <p className="font-body-sm text-xs md:text-sm text-[#4f4445] mt-1 text-center">
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
                ? 'bg-[#72585a] text-white border-[#72585a] shadow-md scale-105'
                : 'bg-[#f3f4f5] text-[#4f4445] border-[#d3c3c4]/40 group-hover:bg-[#e8c5c8] group-hover:border-[#e8c5c8] group-hover:text-[#6b5053]'
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">
              grid_view
            </span>
          </div>
          <span
            className={`font-label-caps text-xs tracking-wider transition-colors ${
              selectedCategory === null
                ? 'text-[#72585a] font-bold'
                : 'text-[#191c1d] group-hover:text-[#72585a]'
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
                    ? 'bg-[#72585a] text-white border-[#72585a] shadow-md scale-105'
                    : 'bg-[#f3f4f5] text-[#4f4445] border-[#d3c3c4]/40 group-hover:bg-[#e8c5c8] group-hover:border-[#e8c5c8] group-hover:text-[#6b5053]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl">
                  {cat.icon}
                </span>
              </div>
              <span
                className={`font-label-caps text-xs tracking-wider transition-colors ${
                  isSelected
                    ? 'text-[#72585a] font-bold'
                    : 'text-[#191c1d] group-hover:text-[#72585a]'
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
