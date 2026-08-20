import React, { useState } from 'react';
import { MarketingAsset, CampaignKit, AssetCategory, AssetType } from '../../types';
import { CAMPAIGN_KITS, MARKETING_ASSETS } from '../../data/mockData';

interface MarketingAssetLibraryProps {
  onToast: (msg: string) => void;
  onOpenMobileMenu: () => void;
  referralCode: string;
}

export const MarketingAssetLibrary: React.FC<MarketingAssetLibraryProps> = ({
  onToast,
  onOpenMobileMenu,
  referralCode,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory>('All');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'All'>('All');
  const [downloadingKitId, setDownloadingKitId] = useState<string | null>(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  const filteredAssets = MARKETING_ASSETS.filter((asset) => {
    const matchesCat = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesType =
      typeFilter === 'All' ||
      (typeFilter === 'Images' && asset.type === 'image') ||
      (typeFilter === 'Videos' && asset.type === 'video');
    return matchesCat && matchesType;
  });

  const handleDownloadKit = (kit: CampaignKit) => {
    setDownloadingKitId(kit.id);
    setTimeout(() => {
      setDownloadingKitId(null);
      onToast(`Downloaded ${kit.downloadFilename} (${kit.fileSize})`);
    }, 1200);
  };

  const handleCopyCaption = (asset: MarketingAsset) => {
    const textToCopy = `${asset.caption}\n\n👉 Order directly with 10% discount: wellora.com/d/${referralCode.toLowerCase()}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedCaptionId(asset.id);
    onToast(`Caption for ${asset.title} copied with your referral link!`);
    setTimeout(() => setCopiedCaptionId(null), 3000);
  };

  const handleDownloadAsset = (asset: MarketingAsset) => {
    onToast(`Downloading high-resolution ${asset.formatType} for ${asset.title}...`);
  };

  return (
    <div id="marketing-assets-view" className="flex-1 min-h-screen bg-wellora-background p-4 sm:p-8 lg:p-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded bg-wellora-surface-container-lowest text-wellora-on-background border border-wellora-outline-variant"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-wellora-on-background">
              Marketing Asset Library
            </h2>
            <p className="font-body-sm text-xs sm:text-sm text-wellora-on-surface-variant mt-1 max-w-2xl">
              Access high-quality promotional materials to elevate your campaigns. Filter by asset type, category, or campaign to find pre-approved creative content.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-wellora-secondary-container text-wellora-secondary rounded-full font-label-caps text-xs font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">cloud_download</span>
            <span>All Rights Cleared</span>
          </span>
        </div>
      </div>

      {/* Featured Section: New Campaign Kits */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-sm text-lg font-bold text-wellora-on-background flex items-center gap-2">
            <span>New Campaign Kits</span>
            <span className="text-xs font-normal text-wellora-on-surface-variant">(Complete social media packages)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGN_KITS.map((kit) => (
            <div
              key={kit.id}
              className="bg-wellora-surface-container-lowest rounded-2xl overflow-hidden border border-wellora-outline-variant/30 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden bg-wellora-surface-container-low">
                <img
                  src={kit.image}
                  alt={kit.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-wellora-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label-caps font-semibold text-wellora-surface-tint shadow-xs">
                  {kit.badge}
                </div>
              </div>

              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-headline-sm text-lg font-bold text-wellora-on-background">
                    {kit.title}
                  </h4>
                  <p className="font-body-sm text-xs text-wellora-on-surface-variant mt-0.5">
                    Includes {kit.itemCount} assets (Feed posts, Reels, Bengali captions, and price cards)
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadKit(kit)}
                  disabled={downloadingKitId === kit.id}
                  className="px-5 py-2.5 bg-wellora-surface-tint text-wellora-on-primary rounded-lg font-label-caps text-xs font-semibold tracking-wider uppercase hover:bg-wellora-on-primary-fixed-variant transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-sm">
                    {downloadingKitId === kit.id ? 'hourglass_bottom' : 'download'}
                  </span>
                  <span>{downloadingKitId === kit.id ? 'Preparing...' : `Download Kit (${kit.fileSize})`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Content Grid */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-wellora-outline-variant/30 pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'Serum', 'Cleanser', 'Sunscreen', 'Moisturizer'] as AssetCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-wellora-surface-tint text-wellora-on-primary shadow-2xs font-semibold'
                  : 'bg-wellora-surface-container-lowest text-wellora-on-surface-variant border border-wellora-outline-variant/40 hover:bg-wellora-surface-container-low'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 bg-wellora-surface-container-low p-1 rounded-lg border border-wellora-outline-variant/40 self-start text-xs">
          {(['All', 'Images', 'Videos'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-wellora-surface-tint text-wellora-on-primary shadow-2xs font-semibold'
                  : 'text-wellora-on-surface-variant hover:text-wellora-on-background'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-wellora-surface-container-lowest rounded-xl border border-wellora-outline-variant/30 shadow-2xs overflow-hidden flex flex-col justify-between group"
          >
            {/* Visual Container */}
            <div className="relative aspect-4/3 bg-wellora-background overflow-hidden">
              <img
                src={asset.image}
                alt={asset.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Video Play Overlay if type is video */}
              {asset.type === 'video' && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-wellora-surface-container-lowest/90 text-wellora-surface-tint flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl fill" data-weight="fill">play_arrow</span>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {asset.isHighCtr && (
                  <span className="bg-wellora-error text-wellora-on-primary text-[10px] font-label-caps px-2 py-0.5 rounded-full font-bold shadow-xs">
                    HIGH CTR 🔥
                  </span>
                )}
                <span className="bg-wellora-surface-container-lowest/90 text-wellora-on-background text-[10px] font-label-caps px-2 py-0.5 rounded-full font-semibold shadow-xs">
                  {asset.aspectRatio || '1:1'}
                </span>
              </div>

              {/* Quick download button */}
              <button
                onClick={() => handleDownloadAsset(asset)}
                title="Download High-Res Asset"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-wellora-surface-container-lowest/90 text-wellora-on-background hover:bg-wellora-surface-tint hover:text-wellora-on-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
              </button>
            </div>

            {/* Content & Caption */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-label-caps text-wellora-surface-tint uppercase font-bold">
                      {asset.category} &bull; {asset.formatType}
                    </span>
                    <h4 className="font-headline-sm text-base font-bold text-wellora-on-background mt-0.5">
                      {asset.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-wellora-on-surface-variant block">Suggested Price</span>
                    <span className="font-bold text-xs text-wellora-on-background">৳{asset.suggestedPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Pre-written Copy Text */}
                <div className="mt-3 p-3 bg-wellora-background rounded-lg border border-wellora-outline-variant/30 text-xs relative group/copy">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-label-caps text-wellora-on-surface-variant uppercase">
                    <span>Proven Caption Copy</span>
                    <span className="text-wellora-tertiary font-semibold">+Link Auto-Appended</span>
                  </div>
                  <p className="text-wellora-on-background line-clamp-3 font-body-sm text-[11px] leading-relaxed">
                    {asset.caption}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-wellora-outline-variant/20">
                <button
                  onClick={() => handleCopyCaption(asset)}
                  className={`py-2 px-3 rounded-lg text-xs font-label-caps font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    copiedCaptionId === asset.id
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-wellora-primary-fixed/60 hover:bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedCaptionId === asset.id ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedCaptionId === asset.id ? 'Copied!' : 'Copy Caption'}</span>
                </button>

                <button
                  onClick={() => handleDownloadAsset(asset)}
                  className="py-2 px-3 bg-wellora-surface-tint text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant rounded-lg text-xs font-label-caps font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Save HD</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
