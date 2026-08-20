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
    <div id="referral-links-view" className="flex-1 min-h-screen bg-wellora-background p-4 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded bg-wellora-surface-container-lowest text-wellora-on-background border border-wellora-outline-variant"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-wellora-on-background">
            Referral & Deep Link Generator
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-wellora-on-surface-variant mt-0.5">
            Create customized tracking links for specific skincare products, WhatsApp promotions, or TikTok bios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Link Customizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Storefront Link */}
          <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs">
            <h3 className="font-headline-sm text-base font-bold text-wellora-on-background mb-1">
              General Storefront Referral Link
            </h3>
            <p className="text-xs text-wellora-on-surface-variant mb-4">
              Directs traffic to the full catalog. Any item purchased within 30 days generates a commission.
            </p>

            <div className="flex items-center bg-wellora-background border border-wellora-outline-variant rounded-lg p-2.5">
              <span className="font-mono text-xs text-wellora-on-background flex-1 truncate mr-2">
                https://{generalLink}
              </span>
              <button
                onClick={() => copyToClipboard(generalLink, 'General store link')}
                className="px-4 py-1.5 bg-wellora-surface-tint text-wellora-on-primary rounded text-xs font-label-caps font-semibold hover:bg-wellora-on-primary-fixed-variant transition-colors cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Product Deep Link Builder */}
          <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs space-y-4">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-wellora-on-background">
                Product-Specific Deep Link
              </h3>
              <p className="text-xs text-wellora-on-surface-variant">
                Send customers directly to a single product with your commission cookie pre-set.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-label-caps text-[11px] text-wellora-on-surface-variant uppercase mb-1">
                  Choose Skincare Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg text-wellora-on-background"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-wellora-on-surface-variant uppercase mb-1">
                  Campaign Tag / Channel
                </label>
                <input
                  type="text"
                  value={campaignTag}
                  onChange={(e) => setCampaignTag(e.target.value)}
                  placeholder="e.g. tiktok_march"
                  className="w-full px-3 py-2 bg-wellora-background border border-wellora-outline-variant rounded-lg text-wellora-on-background"
                />
              </div>
            </div>

            {/* Generated Deep link display */}
            <div className="pt-2">
              <div className="flex items-center bg-wellora-background border border-wellora-outline-variant rounded-lg p-2.5">
                <span className="font-mono text-xs text-wellora-surface-tint font-semibold flex-1 truncate mr-2">
                  https://{deepProductLink}
                </span>
                <button
                  onClick={() => copyToClipboard(deepProductLink, `Deep link for ${selectedProduct.name}`)}
                  className="px-4 py-1.5 bg-wellora-surface-tint text-wellora-on-primary rounded text-xs font-label-caps font-semibold hover:bg-wellora-on-primary-fixed-variant transition-colors cursor-pointer"
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
          <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs text-center flex flex-col items-center">
            <h3 className="font-headline-sm text-base font-bold text-wellora-on-background mb-1">
              Your Partner QR Code
            </h3>
            <p className="text-xs text-wellora-on-surface-variant mb-4">
              Scan with phone camera to load your personal shop
            </p>

            {/* Stylized QR Code placeholder */}
            <div className="w-36 h-36 bg-wellora-background border-2 border-dashed border-wellora-surface-tint rounded-xl p-3 flex flex-col items-center justify-center relative shadow-xs">
              <span className="material-symbols-outlined text-6xl text-wellora-surface-tint">
                qr_code_2
              </span>
              <span className="text-[9px] font-mono text-wellora-on-surface-variant mt-1 font-bold">
                {distributor.referralCode}
              </span>
            </div>

            <button
              onClick={() => onToast('QR Code image downloaded (PNG)')}
              className="mt-4 px-4 py-2 border border-wellora-surface-tint text-wellora-surface-tint rounded-lg text-xs font-label-caps font-semibold hover:bg-wellora-primary-fixed/30 transition-colors"
            >
              Download Printable QR
            </button>
          </div>

          {/* Tier Structure */}
          <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs text-xs space-y-3">
            <h4 className="font-label-caps text-xs font-bold text-wellora-on-background uppercase">
              Commission Rates by Tier
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded bg-wellora-background">
                <span className="text-wellora-on-surface-variant">Silver Partner</span>
                <span className="font-semibold text-wellora-on-background">12%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-wellora-primary-fixed/40 border border-wellora-primary-fixed">
                <span className="font-bold text-wellora-on-primary-fixed-variant">Gold Partner (You)</span>
                <span className="font-bold text-wellora-surface-tint">16% - 18%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-wellora-background">
                <span className="text-wellora-on-surface-variant">Platinum VIP</span>
                <span className="font-semibold text-wellora-on-background">22% + 5% Override</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
