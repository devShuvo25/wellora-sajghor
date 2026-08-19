import React, { useState } from 'react';
import { DistributorProfile, Product } from '../../types';

interface ReferralLinksViewProps {
  distributor: DistributorProfile;
  products: Product[];
  onToast: (msg: string) => void;
  onOpenMobileMenu: () => void;
}

export const ReferralLinksView: React.FC<ReferralLinksViewProps> = ({
  distributor,
  products,
  onToast,
  onOpenMobileMenu,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [campaignTag, setCampaignTag] = useState('spring_glow');
  const [discountPercent, setDiscountPercent] = useState('10');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const deepProductLink = `wellora.com/p/${selectedProduct.id}?ref=${distributor.referralCode.toLowerCase()}&camp=${campaignTag}`;
  const generalLink = `wellora.com/d/${distributor.referralCode.toLowerCase()}?utm_camp=${campaignTag}&disc=${discountPercent}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(`https://${text}`);
    onToast(`${label} copied to clipboard!`);
  };

  return (
    <div id="referral-links-view" className="flex-1 min-h-screen bg-[#f8f9fa] p-4 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded bg-white text-[#191c1d] border border-[#d3c3c4]"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#191c1d]">
            Referral & Deep Link Generator
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-[#4f4445] mt-0.5">
            Create customized tracking links for specific skincare products, WhatsApp promotions, or TikTok bios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Link Customizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Storefront Link */}
          <div className="bg-white p-6 rounded-xl border border-[#d3c3c4]/30 shadow-2xs">
            <h3 className="font-headline-sm text-base font-bold text-[#191c1d] mb-1">
              General Storefront Referral Link
            </h3>
            <p className="text-xs text-[#4f4445] mb-4">
              Directs traffic to the full catalog. Any item purchased within 30 days generates a commission.
            </p>

            <div className="flex items-center bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg p-2.5">
              <span className="font-mono text-xs text-[#191c1d] flex-1 truncate mr-2">
                https://{generalLink}
              </span>
              <button
                onClick={() => copyToClipboard(generalLink, 'General store link')}
                className="px-4 py-1.5 bg-[#72585a] text-white rounded text-xs font-label-caps font-semibold hover:bg-[#594043] transition-colors cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Product Deep Link Builder */}
          <div className="bg-white p-6 rounded-xl border border-[#d3c3c4]/30 shadow-2xs space-y-4">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#191c1d]">
                Product-Specific Deep Link
              </h3>
              <p className="text-xs text-[#4f4445]">
                Send customers directly to a single product with your commission cookie pre-set.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Choose Skincare Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-[#4f4445] uppercase mb-1">
                  Campaign Tag / Channel
                </label>
                <input
                  type="text"
                  value={campaignTag}
                  onChange={(e) => setCampaignTag(e.target.value)}
                  placeholder="e.g. tiktok_march"
                  className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg text-[#191c1d]"
                />
              </div>
            </div>

            {/* Generated Deep link display */}
            <div className="pt-2">
              <div className="flex items-center bg-[#f8f9fa] border border-[#d3c3c4] rounded-lg p-2.5">
                <span className="font-mono text-xs text-[#72585a] font-semibold flex-1 truncate mr-2">
                  https://{deepProductLink}
                </span>
                <button
                  onClick={() => copyToClipboard(deepProductLink, `Deep link for ${selectedProduct.name}`)}
                  className="px-4 py-1.5 bg-[#72585a] text-white rounded text-xs font-label-caps font-semibold hover:bg-[#594043] transition-colors cursor-pointer"
                >
                  Copy Deep Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: QR Code & Commission Tiers */}
        <div className="space-y-6">
          {/* Quick QR Card */}
          <div className="bg-white p-6 rounded-xl border border-[#d3c3c4]/30 shadow-2xs text-center flex flex-col items-center">
            <h3 className="font-headline-sm text-base font-bold text-[#191c1d] mb-1">
              Your Partner QR Code
            </h3>
            <p className="text-xs text-[#4f4445] mb-4">
              Scan with phone camera to load your personal shop
            </p>

            {/* Stylized QR Code placeholder */}
            <div className="w-36 h-36 bg-[#f8f9fa] border-2 border-dashed border-[#72585a] rounded-xl p-3 flex flex-col items-center justify-center relative shadow-xs">
              <span className="material-symbols-outlined text-6xl text-[#72585a]">
                qr_code_2
              </span>
              <span className="text-[9px] font-mono text-[#4f4445] mt-1 font-bold">
                {distributor.referralCode}
              </span>
            </div>

            <button
              onClick={() => onToast('QR Code image downloaded (PNG)')}
              className="mt-4 px-4 py-2 border border-[#72585a] text-[#72585a] rounded-lg text-xs font-label-caps font-semibold hover:bg-[#fedadd]/30 transition-colors"
            >
              Download Printable QR
            </button>
          </div>

          {/* Tier Structure */}
          <div className="bg-white p-6 rounded-xl border border-[#d3c3c4]/30 shadow-2xs text-xs space-y-3">
            <h4 className="font-label-caps text-xs font-bold text-[#191c1d] uppercase">
              Commission Rates by Tier
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded bg-[#f8f9fa]">
                <span className="text-[#4f4445]">Silver Partner</span>
                <span className="font-semibold text-[#191c1d]">12%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#fedadd]/40 border border-[#fedadd]">
                <span className="font-bold text-[#594043]">Gold Partner (You)</span>
                <span className="font-bold text-[#72585a]">16% - 18%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#f8f9fa]">
                <span className="text-[#4f4445]">Platinum VIP</span>
                <span className="font-semibold text-[#191c1d]">22% + 5% Override</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
