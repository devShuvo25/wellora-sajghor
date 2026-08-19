import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccessToast: (message: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccessToast,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [city, setCity] = useState<'dhaka' | 'outside'>('dhaka');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : city === 'dhaka' ? 80 : 130;
  const total = subtotal + shippingFee;
  const totalPoints = cartItems.reduce((acc, item) => acc + item.product.points * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('Please fill out customer details.');
      return;
    }

    setCheckoutStep('success');
    onOrderSuccessToast(`Order #${Math.floor(1000 + Math.random() * 9000)} placed successfully!`);
    setTimeout(() => {
      onClearCart();
      setCheckoutStep('cart');
      onClose();
    }, 3000);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#191c1d]/60 backdrop-blur-xs flex justify-end transition-opacity duration-300"
    >
      <div
        id="cart-drawer-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInRight"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#d3c3c4]/30 flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#72585a]">shopping_bag</span>
            <h3 className="font-headline-sm text-lg font-bold text-[#191c1d]">
              {checkoutStep === 'cart'
                ? `Your Cart (${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`
                : checkoutStep === 'checkout'
                ? 'Delivery & Payment'
                : 'Order Confirmed!'}
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => {
              setCheckoutStep('cart');
              onClose();
            }}
            className="p-1 rounded-full text-[#4f4445] hover:bg-[#e7e8e9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {checkoutStep === 'cart' && subtotal > 0 && (
          <div className="bg-[#fedadd]/30 px-5 py-3 border-b border-[#fedadd] text-xs">
            <div className="flex justify-between items-center mb-1.5 font-medium text-[#594043]">
              {isFreeShipping ? (
                <span className="flex items-center gap-1 text-[#735c00] font-semibold">
                  <span className="material-symbols-outlined text-sm fill" data-weight="fill">verified</span>
                  You unlocked Free Express Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#ba1a1a]">৳ {remainingForFreeShipping.toLocaleString()}</strong> more for FREE Shipping!
                </span>
              )}
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#e8c5c8]/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#72585a] rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-[#d3c3c4] mb-3">
                    shopping_bag
                  </span>
                  <p className="font-headline-sm text-base font-semibold text-[#191c1d]">
                    Your bag is empty
                  </p>
                  <p className="font-body-sm text-xs text-[#4f4445] mt-1 max-w-xs mx-auto">
                    Explore 100% authentic Korean and global skincare essentials to add to your routine.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-[#72585a] text-white rounded font-label-caps text-xs tracking-wider uppercase hover:bg-[#594043] transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-3 pb-4 border-b border-[#d3c3c4]/20 items-center"
                    >
                      <div className="w-16 h-16 rounded-lg bg-[#f8f9fa] border border-[#d3c3c4]/30 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={product.image}
                          alt={product.altText}
                          className="w-full h-full object-contain mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-label-caps text-[#72585a] uppercase font-semibold">
                          {product.brand}
                        </span>
                        <h4 className="font-body-sm text-xs text-[#191c1d] font-medium truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs font-bold text-[#191c1d]">
                            ৳ {(product.price * quantity).toLocaleString()}
                          </span>

                          {/* Quantity control */}
                          <div className="flex items-center border border-[#d3c3c4] rounded bg-[#f8f9fa] text-xs">
                            <button
                              onClick={() => onUpdateQuantity(product.id, -1)}
                              className="px-2 py-0.5 text-[#4f4445] hover:bg-[#e7e8e9]"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 font-semibold text-[#191c1d]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, 1)}
                              className="px-2 py-0.5 text-[#4f4445] hover:bg-[#e7e8e9]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[#4f4445] hover:text-[#ba1a1a] p-1 transition-colors"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4 text-xs">
              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#d3c3c4] rounded text-xs text-[#191c1d] focus:bg-white focus:border-[#72585a]"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#d3c3c4] rounded text-xs text-[#191c1d] focus:bg-white focus:border-[#72585a]"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Delivery Region
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCity('dhaka')}
                    className={`py-2 px-3 border rounded text-xs text-center transition-all ${
                      city === 'dhaka'
                        ? 'border-[#72585a] bg-[#fedadd]/40 text-[#594043] font-semibold'
                        : 'border-[#d3c3c4] text-[#4f4445]'
                    }`}
                  >
                    Inside Dhaka (৳80)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCity('outside')}
                    className={`py-2 px-3 border rounded text-xs text-center transition-all ${
                      city === 'outside'
                        ? 'border-[#72585a] bg-[#fedadd]/40 text-[#594043] font-semibold'
                        : 'border-[#d3c3c4] text-[#4f4445]'
                    }`}
                  >
                    Outside Dhaka (৳130)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Full Street Address & Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, Thana / District"
                  className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#d3c3c4] rounded text-xs text-[#191c1d] focus:bg-white focus:border-[#72585a]"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 bg-[#f8f9fa] border border-[#d3c3c4]/50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#72585a] focus:ring-[#72585a]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-[#191c1d]">Cash on Delivery (COD)</span>
                      <p className="text-[10px] text-[#4f4445]">Pay in cash when your parcel arrives</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-[#f8f9fa] border border-[#d3c3c4]/50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-[#72585a] focus:ring-[#72585a]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-[#ba1a1a]">bKash Direct</span>
                      <p className="text-[10px] text-[#4f4445]">Merchant Account: 01700-WELLORA</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="text-center py-12 space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-[#e8c5c8] rounded-full flex items-center justify-center mx-auto text-[#72585a]">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h4 className="font-headline-sm text-lg font-bold text-[#191c1d]">
                Order Successfully Received!
              </h4>
              <p className="font-body-sm text-xs text-[#4f4445] max-w-xs mx-auto">
                Thank you, <strong>{customerName}</strong>. Our Dhaka logistics team is preparing your package. A tracking SMS has been sent to {phone}.
              </p>
              <div className="p-3 bg-[#f8f9fa] border border-[#d3c3c4]/40 rounded text-xs text-[#191c1d] max-w-xs mx-auto text-left">
                <div className="flex justify-between py-1">
                  <span className="text-[#4f4445]">Total Amount:</span>
                  <span className="font-bold">৳ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#4f4445]">Points Credited:</span>
                  <span className="text-[#735c00] font-semibold">+{totalPoints} pts</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && checkoutStep !== 'success' && (
          <div className="p-5 border-t border-[#d3c3c4]/30 bg-[#f8f9fa] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#4f4445]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#191c1d]">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4f4445]">
                <span>Delivery:</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-[#735c00] font-semibold">FREE (Over ৳2000)</span>
                  ) : (
                    `৳ ${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#191c1d] pt-2 border-t border-[#d3c3c4]/30">
                <span>Total Amount:</span>
                <span className="text-base text-[#72585a]">৳ {total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#735c00]">
                <span>Loyalty Points to Earn:</span>
                <span className="font-bold">+{totalPoints} pts</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                id="proceed-checkout-btn"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-[#72585a] text-white py-3 rounded-lg font-label-caps text-xs uppercase tracking-wider hover:bg-[#594043] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-2.5 border border-[#d3c3c4] text-[#4f4445] rounded-lg text-xs font-semibold hover:bg-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  className="flex-1 bg-[#72585a] text-white py-2.5 rounded-lg font-label-caps text-xs uppercase tracking-wider hover:bg-[#594043] transition-all shadow-sm cursor-pointer font-bold"
                >
                  Confirm & Place Order (৳ {total.toLocaleString()})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
