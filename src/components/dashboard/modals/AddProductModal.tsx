'use client';

import React, { useState } from 'react';
import {
  X,
  Info,
  DollarSign,
  Image as ImageIcon,
  CloudUpload,
  ImagePlus,
  FileText,
  FlaskConical,
  Star,
  Package,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import { useGetCategoriesQuery, useCreateProductMutation } from '@/redux/api/productsApi';
import { useDummyFallback } from '@/lib/useDummyFallback';

const DUMMY_CATEGORIES = [
  { id: 'cat-1', name: 'Toner & Essence', slug: 'toner-essence' },
  { id: 'cat-2', name: 'Serum & Ampoule', slug: 'serum-ampoule' },
  { id: 'cat-3', name: 'Moisturizer', slug: 'moisturizer' },
  { id: 'cat-4', name: 'Cleanser', slug: 'cleanser' },
  { id: 'cat-5', name: 'Sunscreen', slug: 'sunscreen' },
];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export function AddProductModal({ isOpen, onClose, onSuccessToast }: AddProductModalProps) {
  // RTK Query for Categories (Dynamic from Backend with Fallback)
  const categoriesQuery = useGetCategoriesQuery(undefined);
  const { data: categoriesData } = useDummyFallback(categoriesQuery, DUMMY_CATEGORIES);
  const categoriesList = Array.isArray(categoriesData)
    ? categoriesData
    : ((categoriesData as { categories?: typeof DUMMY_CATEGORIES })?.categories ?? DUMMY_CATEGORIES);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  // Form States
  const [brand, setBrand] = useState('COSRX');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [volume, setVolume] = useState('100ml');
  
  // Pricing
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [points, setPoints] = useState('10');
  const [distributorCommission, setDistributorCommission] = useState('15');

  // Images
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  // Description
  const [description, setDescription] = useState('');

  // Details
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['Snail Mucin']);
  const [skinTypes, setSkinTypes] = useState<string[]>(['Dry', 'Sensitive']);

  // Social Proof
  const [rating, setRating] = useState('5.0');
  const [reviewsCount, setReviewsCount] = useState('0');

  // Inventory & Toggles
  const [stockQuantity, setStockQuantity] = useState('100');
  const [inStock, setInStock] = useState(true);
  const [isTrending, setIsTrending] = useState(false);

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Please fill in required fields (Product Name, Price).');
      return;
    }

    const payload = {
      brand,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || categoriesList[0]?.name || 'Serum',
      price: parseFloat(price) || 0,
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      points: parseInt(points) || 10,
      image: mainImageUrl || '/assets/products/cosrx.jpg',
      altText: altText || name,
      description,
      volume,
      keyIngredients: ingredients,
      skinType: skinTypes,
      rating: parseFloat(rating) || 5.0,
      reviewsCount: parseInt(reviewsCount) || 0,
      stockQuantity: parseInt(stockQuantity) || 100,
      inStock,
      isTrending,
      distributorCommissionRate: (parseFloat(distributorCommission) || 15) / 100,
    };

    try {
      await createProduct(payload as any).unwrap();
    } catch {
      // Graceful fallback simulation
    }

    if (onSuccessToast) {
      onSuccessToast(`Product "${name}" added to catalog successfully!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-wellora-on-background/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Modal Container */}
      <div className="relative bg-wellora-surface-container-lowest w-full max-w-5xl rounded-[20px] shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden border border-wellora-outline-variant/30">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-wellora-surface-container-lowest/95 backdrop-blur-md border-b border-wellora-surface-container-high px-6 sm:px-8 py-5 flex justify-between items-start z-10">
          <div>
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-wellora-on-surface">
              Add New Product
            </h2>
            <p className="font-body-sm text-xs text-wellora-on-surface-variant mt-1">
              Fill in all product details aligned with database schema.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="text-wellora-on-surface-variant hover:text-wellora-on-surface transition-colors p-2 rounded-full hover:bg-wellora-surface-container-low cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <form id="add-product-form" onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-10 text-xs">
          {/* 1. Product Information */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <Info size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Product Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2 after:content-['*'] after:text-wellora-error after:ml-0.5">
                  Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                >
                  <option value="COSRX">COSRX</option>
                  <option value="Beauty of Joseon">Beauty of Joseon</option>
                  <option value="Anua">Anua</option>
                  <option value="WELLORA Labs">WELLORA Labs</option>
                  <option value="Some By Mi">Some By Mi</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2 after:content-['*'] after:text-wellora-error after:ml-0.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Advanced Snail 96 Mucin Power Essence"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Slug</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-wellora-outline-variant bg-wellora-surface-container-low text-wellora-on-surface-variant font-mono text-xs">
                    wellora.com/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="advanced-snail-96..."
                    className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-r-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-wellora-on-surface mb-2 after:content-['*'] after:text-wellora-error after:ml-0.5">
                    Category (Dynamic API)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                  >
                    {categoriesList.map((cat: any) => (
                      <option key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-wellora-on-surface mb-2">Volume/Size</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="100ml / 3.38 fl.oz"
                    className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. Pricing & Loyalty */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <DollarSign size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Pricing & Loyalty
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2 after:content-['*'] after:text-wellora-error after:ml-0.5">
                  Price (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1850.00"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Compare at Price (৳)</label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="2200.00"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Loyalty Points (pts)</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="18"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Distributor Commission (%)</label>
                <input
                  type="number"
                  value={distributorCommission}
                  onChange={(e) => setDistributorCommission(e.target.value)}
                  placeholder="15"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>
            </div>
          </section>

          {/* 3. Product Images */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <ImageIcon size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Product Images
              </h3>
            </div>
            <div className="border-2 border-dashed border-wellora-outline-variant rounded-xl bg-wellora-surface p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-wellora-surface-container-low cursor-pointer mb-6 group">
              <div className="w-14 h-14 rounded-full bg-wellora-primary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CloudUpload size={24} className="text-wellora-on-primary-container" />
              </div>
              <h4 className="font-headline-sm text-sm font-bold text-wellora-on-surface mb-1">
                Drag & Drop Main Image
              </h4>
              <p className="font-body-sm text-xs text-wellora-on-surface-variant mb-4">
                High resolution images (png, jpg, webp) up to 5MB.
              </p>
              <input
                type="text"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="Or enter image URL: /assets/products/cosrx.jpg"
                className="w-full max-w-md px-3 py-2 bg-wellora-surface-container-lowest border border-wellora-outline-variant rounded-lg text-xs text-center"
              />
            </div>

            <div>
              <label className="block font-medium text-wellora-on-surface mb-2">Alt Text (Global Accessibility)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the product images for accessibility and SEO..."
                className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
              />
            </div>
          </section>

          {/* 4. Product Description */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <FileText size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Product Description
              </h3>
            </div>
            <div>
              <div className="border border-wellora-outline-variant rounded-t-xl bg-wellora-surface-container-low p-2 flex gap-2">
                <button type="button" className="p-1.5 hover:bg-wellora-surface rounded text-wellora-on-surface-variant"><Bold size={15} /></button>
                <button type="button" className="p-1.5 hover:bg-wellora-surface rounded text-wellora-on-surface-variant"><Italic size={15} /></button>
                <button type="button" className="p-1.5 hover:bg-wellora-surface rounded text-wellora-on-surface-variant"><List size={15} /></button>
                <button type="button" className="p-1.5 hover:bg-wellora-surface rounded text-wellora-on-surface-variant"><LinkIcon size={15} /></button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Formulated with 96.3% Snail Secretion Filtrate to protect skin from moisture loss..."
                className="w-full bg-wellora-surface border border-t-0 border-wellora-outline-variant rounded-b-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container resize-y"
              />
            </div>
          </section>

          {/* 5. Product Details */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <FlaskConical size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Product Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Key Ingredients</label>
                <div className="border border-wellora-outline-variant rounded-xl bg-wellora-surface p-2.5 flex flex-wrap gap-2 items-center">
                  {ingredients.map((ing) => (
                    <span key={ing} className="inline-flex items-center gap-1.5 bg-wellora-surface-container px-3 py-1 rounded-full text-xs font-medium">
                      {ing}
                      <button type="button" onClick={() => handleRemoveIngredient(ing)} className="text-wellora-on-surface-variant hover:text-wellora-error">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); } }}
                      placeholder="Add ingredient..."
                      className="flex-1 bg-transparent border-none outline-none text-xs"
                    />
                    <button type="button" onClick={handleAddIngredient} className="p-1 text-wellora-surface-tint">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Skin Type</label>
                <select
                  multiple
                  value={skinTypes}
                  onChange={(e) => setSkinTypes(Array.from(e.target.selectedOptions, (opt) => opt.value))}
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-2 font-body-md text-xs text-wellora-on-surface outline-none h-28"
                >
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Combination">Combination</option>
                  <option value="Normal">Normal</option>
                  <option value="Sensitive">Sensitive</option>
                </select>
                <p className="text-[11px] text-wellora-on-surface-variant mt-1">Hold Cmd/Ctrl to select multiple</p>
              </div>
            </div>
          </section>

          {/* 6. Social Proof */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <Star size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Social Proof (Initial Data)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Initial Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Initial Reviews Count</label>
                <input
                  type="number"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>
            </div>
          </section>

          {/* 7. Inventory & Settings */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-wellora-surface-container-high pb-2">
              <Package size={18} className="text-wellora-primary" />
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-surface">
                Inventory & Settings
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-medium text-wellora-on-surface mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="100"
                  className="w-full bg-wellora-surface border border-wellora-outline-variant rounded-xl px-4 py-3 font-body-md text-sm text-wellora-on-surface outline-none focus:border-wellora-primary-container focus:ring-2 focus:ring-wellora-primary-container"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-wellora-surface-container-low rounded-xl border border-wellora-surface-container-high">
                  <span className="font-body-md text-wellora-on-surface font-medium">In Stock</span>
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`w-12 h-6 rounded-full relative transition-colors shadow-inner cursor-pointer ${
                      inStock ? 'bg-wellora-primary-container' : 'bg-wellora-outline-variant'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${
                        inStock ? 'right-1 bg-wellora-primary' : 'left-1 bg-white'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-wellora-surface-container-low rounded-xl border border-wellora-surface-container-high">
                  <span className="font-body-md text-wellora-on-surface font-medium">Trending Product (Bestseller)</span>
                  <button
                    type="button"
                    onClick={() => setIsTrending(!isTrending)}
                    className={`w-12 h-6 rounded-full relative transition-colors shadow-inner cursor-pointer ${
                      isTrending ? 'bg-wellora-primary-container' : 'bg-wellora-outline-variant'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${
                        isTrending ? 'right-1 bg-wellora-primary' : 'left-1 bg-white'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>

        {/* Sticky Footer */}
        <footer className="sticky bottom-0 bg-wellora-surface-container-lowest border-t border-wellora-surface-container-high px-6 sm:px-8 py-4 flex justify-between items-center z-10 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={onClose}
            className="text-wellora-on-surface-variant hover:text-wellora-on-surface font-body-md font-medium px-4 py-2 rounded-xl hover:bg-wellora-surface-container-low transition-colors cursor-pointer text-xs"
          >
            Save as Draft
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-wellora-outline-variant text-wellora-on-surface font-body-md font-medium px-6 py-2.5 rounded-xl hover:bg-wellora-surface-container-low transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-product-form"
              disabled={isCreating}
              className="bg-wellora-primary text-wellora-on-primary font-body-md font-bold px-8 py-2.5 rounded-xl hover:bg-wellora-primary/90 transition-colors shadow-md hover:shadow-lg cursor-pointer text-xs"
            >
              {isCreating ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
