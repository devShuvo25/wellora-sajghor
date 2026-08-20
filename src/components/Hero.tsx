import React from 'react';
import { ArrowRight, BadgeCheck, Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onDistributorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDistributorClick }) => {
  return (
    <section id="hero-section" className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start min-h-[560px]">
      {/* Left Text */}
      <div className="flex flex-col gap-6 z-10 lg:pr-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fedadd]/70 border border-[#e8c5c8] text-[#594043] rounded-full text-xs font-label-caps tracking-wider w-fit">
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
          Direct Import from Seoul & Tokyo
        </div>

        <h1 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl font-bold text-[#191c1d] leading-tight tracking-tight">
          Elevate Your <br />
          <span className="text-[#72585a]">Skincare Routine</span>
        </h1>

        <p className="font-body-lg text-[#4f4445] text-base md:text-lg max-w-md leading-relaxed">
          Discover 100% authentic global beauty brands curated for you. Precision formulation meets luxury aesthetic in our exclusive collection.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            id="hero-explore-catalog-btn"
            onClick={onExploreClick}
            className="bg-[#72585a] text-white px-8 py-4 rounded font-label-caps text-xs tracking-widest uppercase hover:bg-[#594043] transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95"
          >
            Explore Catalog
          </button>

          <button
            id="hero-join-distributor-btn"
            onClick={onDistributorClick}
            className="border border-[#72585a] text-[#72585a] px-6 py-4 rounded font-label-caps text-xs tracking-widest uppercase hover:bg-[#fedadd]/30 transition-all cursor-pointer"
          >
            Partner Program
          </button>
        </div>

        {/* Quick highlight stat */}
        <div className="flex items-center gap-6 pt-4 text-xs font-body-sm text-[#4f4445] border-t border-[#d3c3c4]/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#735c00] text-base">verified</span>
            <span>QR Verified Batches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#735c00] text-base">local_shipping</span>
            <span>24h Dhaka Dispatch</span>
          </div>
        </div>
      </div>

      {/* Right Grid (From Mockup) */}
      <div className="grid h-[340px] min-h-0 grid-cols-2 gap-4 self-start lg:h-[440px] relative">
        {/* Left tall card */}
        <div className="min-h-0 rounded-xl overflow-hidden shadow-xs border border-[#d3c3c4]/20 relative h-full bg-[#f3f4f5] group">
          <img
            id="hero-img-bottles"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            alt="High-end skincare bottles arranged on white marble slab"
            src="/wellora-hero-banner.jfif"
          />
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded text-[11px] font-label-caps text-[#191c1d] shadow-xs">
            Curated Formulations
          </div>
        </div>

        {/* Right column: 2 rows */}
        <div className="grid min-h-0 grid-rows-2 gap-4 h-full">
          {/* Top texture image */}
          <div className="min-h-0 rounded-xl overflow-hidden shadow-xs border border-[#d3c3c4]/20 relative h-full bg-[#f3f4f5] group">
            <img
              id="hero-img-texture"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              alt="Rich creamy skincare moisturizer scooped on transparent glass spatula"
              src="/bannerImage2.jfif"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-label-caps text-[#191c1d]">
              Tactile Luxury
            </div>
          </div>

          {/* Bottom rose badge card */}
          <div className="min-h-0 rounded-xl overflow-hidden shadow-xs relative bg-[#e8c5c8] flex items-center justify-center p-6 text-center border border-[#fedadd]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-3xl text-[#6b5053] fill" data-weight="fill">
                  verified
                </span>
              </div>
              <p className="font-body-md text-sm md:text-base text-[#6b5053] font-semibold">
                100% Authentic Korean Brands
              </p>
              <span className="font-label-caps text-[10px] text-[#6b5053]/80 uppercase tracking-wider">
                Official Distribution Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
