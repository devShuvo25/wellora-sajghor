import React, { useState } from 'react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOrderAsDistributor: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOrderAsDistributor,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div
      id="quick-view-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#191c1d]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="quick-view-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#d3c3c4]/40 relative my-8"
      >
        {/* Close button */}
        <button
          id="close-quick-view-btn"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e7e8e9] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="bg-[#f8f9fa] p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#d3c3c4]/30">
            <img
              src={product.image}
              alt={product.altText}
              className="max-h-80 w-auto object-contain mix-blend-multiply drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label-caps text-[#735c00] flex items-center gap-1 shadow-2xs">
              <span className="material-symbols-outlined text-sm fill" data-weight="fill">verified</span>
              <span>100% Genuine Imported</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="font-label-caps text-xs text-[#72585a] font-bold uppercase tracking-widest">
                  {product.brand}
                </span>
                <h3 className="font-headline-sm text-xl md:text-2xl font-bold text-[#191c1d] mt-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-[#191c1d]">
                    ৳ {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#4f4445] bg-[#f3f4f5] px-2 py-0.5 rounded">
                    {product.volume}
                  </span>
                  <div className="flex items-center gap-1 text-[#735c00] text-xs font-label-caps">
                    <span className="material-symbols-outlined text-sm fill" data-weight="fill">stars</span>
                    <span>+{product.points} Loyalty Pts</span>
                  </div>
                </div>
              </div>

              <p className="font-body-sm text-xs text-[#4f4445] leading-relaxed">
                {product.description}
              </p>

              {/* Key Ingredients */}
              <div>
                <span className="block font-label-caps text-[11px] uppercase tracking-wider text-[#191c1d] font-semibold mb-1.5">
                  Key Ingredients
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.keyIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#dde2f3] text-[#5e6473] rounded text-[11px] font-body-sm"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skin type compatibility */}
              <div>
                <span className="block font-label-caps text-[11px] uppercase tracking-wider text-[#191c1d] font-semibold mb-1.5">
                  Best For
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.skinType.map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#f3f4f5] text-[#4f4445] border border-[#d3c3c4]/40 rounded text-[11px]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#d3c3c4]/30 mt-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#d3c3c4] rounded-lg overflow-hidden bg-[#f8f9fa]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-[#4f4445] hover:bg-[#e7e8e9] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-body-sm text-sm font-semibold text-[#191c1d]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-[#4f4445] hover:bg-[#e7e8e9] transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 bg-[#72585a] text-white py-2.5 px-4 rounded-lg font-label-caps text-xs uppercase tracking-wider hover:bg-[#594043] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">shopping_bag</span>
                  <span>Add to Cart (৳ {(product.price * quantity).toLocaleString()})</span>
                </button>
              </div>

              {/* Distributor Shortcut */}
              <button
                id="modal-create-distributor-order-btn"
                onClick={() => {
                  onOrderAsDistributor(product);
                  onClose();
                }}
                className="w-full py-2 bg-[#fedadd]/60 hover:bg-[#fedadd] text-[#594043] border border-[#e8c5c8] rounded-lg font-label-caps text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#72585a]">point_of_sale</span>
                <span>Create Partner Customer Order (Earn ৳ {Math.round(product.price * product.distributorCommissionRate * quantity)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
