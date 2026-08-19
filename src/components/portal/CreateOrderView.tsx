import React, { useState } from 'react';
import { Product, DistributorOrder, OrderChannel } from '../../types';

interface CreateOrderViewProps {
  products: Product[];
  onCreateOrder: (newOrder: Omit<DistributorOrder, 'id' | 'date'>) => void;
  onToast: (msg: string) => void;
  onOpenMobileMenu: () => void;
}

export const CreateOrderView: React.FC<CreateOrderViewProps> = ({
  products,
  onCreateOrder,
  onToast,
  onOpenMobileMenu,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [channel, setChannel] = useState<OrderChannel>('WhatsApp');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const orderTotal = (selectedProduct?.price || 0) * quantity;
  const commission = Math.round(orderTotal * (selectedProduct?.distributorCommissionRate || 0.16));

  const handleGenerateWhatsAppReceipt = () => {
    const text = `🌸 *WELLORA Luxury Skincare Order Confirmation*\n` +
      `--------------------------------\n` +
      `Dear ${customerName || 'Customer'},\n` +
      `Thank you for ordering with WELLORA! Your order for *${selectedProduct.name}* (Qty: ${quantity}) has been confirmed.\n\n` +
      `📦 *Total Amount:* ৳${orderTotal.toLocaleString()} (Cash on Delivery)\n` +
      `📍 *Delivery Address:* ${deliveryAddress || 'Address on file'}\n` +
      `🚚 *Courier:* Dhaka Express / Pathao Logistics (24-48 hrs)\n` +
      `✨ 100% Genuine Korean Batch with QR Authenticity Guarantee.\n\n` +
      `For any questions, reach out to your partner advisor anytime!`;
    
    setGeneratedMessage(text);
    navigator.clipboard?.writeText(text);
    onToast('WhatsApp order confirmation message copied!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !deliveryAddress) {
      alert('Please fill out all mandatory customer details');
      return;
    }

    onCreateOrder({
      customerName,
      phoneNumber,
      deliveryAddress,
      channel,
      amount: orderTotal,
      commission,
      commStatus: 'Pending',
      trackingStatus: 'Processing',
      items: [
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          quantity,
          price: selectedProduct.price,
        },
      ],
    });

    handleGenerateWhatsAppReceipt();
    onToast(`Order created for ${customerName}! Commission of ৳${commission} logged.`);

    setCustomerName('');
    setPhoneNumber('');
    setDeliveryAddress('');
    setQuantity(1);
    setSpecialInstructions('');
  };

  return (
    <div id="partner-create-order-view" className="flex-1 min-h-screen bg-[#f8f9fa] p-4 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded bg-white text-[#191c1d] border border-[#d3c3c4]"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#191c1d]">
            Direct Customer Order Dispatch
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-[#4f4445] mt-0.5">
            Log manual orders from personal chats. Our warehouse fulfills and ships directly to your client.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 sm:p-8 border border-[#d3c3c4]/30 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="font-headline-sm text-base font-bold text-[#191c1d] pb-2 border-b border-[#d3c3c4]/30">
              Customer & Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Samira Rahman"
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d] focus:bg-white focus:border-[#72585a]"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d] focus:bg-white focus:border-[#72585a]"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                Full Delivery Street Address *
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House, Road, Block/Sector, Area (e.g. House 14, Road 5, Banani, Dhaka)"
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d] focus:bg-white focus:border-[#72585a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Product Item
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.brand}] {p.name} - ৳{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Sales Origin Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as OrderChannel)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                >
                  <option value="WhatsApp">WhatsApp Inquiries</option>
                  <option value="Facebook">Facebook Page / Group</option>
                  <option value="Messenger">Messenger Direct Chat</option>
                  <option value="Direct Link">Online Referral</option>
                  <option value="Offline / Direct">In-Person Client</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Courier Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Call before delivery, ring bell 3A"
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#72585a] text-white rounded-lg font-label-caps text-xs font-bold uppercase tracking-wider hover:bg-[#594043] transition-all shadow-xs cursor-pointer"
              >
                Log & Dispatch Order (৳{orderTotal.toLocaleString()})
              </button>

              <button
                type="button"
                onClick={handleGenerateWhatsAppReceipt}
                className="px-4 py-3 bg-[#dde2f3] text-[#585e6c] rounded-lg font-label-caps text-xs font-semibold hover:bg-[#c1c6d7] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Copy WhatsApp Confirmation</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Invoice Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-[#d3c3c4]/30 shadow-2xs text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d3c3c4]/30">
              <span className="font-headline-sm text-sm font-bold text-[#191c1d]">
                Live Invoice Calculation
              </span>
              <span className="bg-[#e8c5c8] text-[#6b5053] px-2 py-0.5 rounded text-[10px] font-bold">
                Auto Calculated
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#4f4445]">Product Item:</span>
                <span className="font-medium text-[#191c1d] max-w-[150px] truncate text-right">
                  {selectedProduct.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4f4445]">Unit Price:</span>
                <span className="font-mono">৳{selectedProduct.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4f4445]">Quantity:</span>
                <span className="font-mono">{quantity}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#d3c3c4]/20 font-bold">
                <span>Customer Payable:</span>
                <span className="text-[#191c1d] text-sm">৳{orderTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#fedadd]/40 rounded-lg text-[#594043]">
                <span className="font-semibold">Your Commission (16%):</span>
                <span className="font-bold text-sm text-[#72585a]">+৳{commission.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {generatedMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs animate-fadeIn">
              <span className="font-label-caps text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                Generated Message (Copied)
              </span>
              <pre className="font-sans text-[11px] text-emerald-900 whitespace-pre-wrap leading-relaxed">
                {generatedMessage}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
