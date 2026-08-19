import React from 'react';

interface DistributorBannerProps {
  onBecomeDistributor: () => void;
}

export const DistributorBanner: React.FC<DistributorBannerProps> = ({ onBecomeDistributor }) => {
  return (
    <section id="distributor-banner-section" className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-16">
      <div className="bg-[#2e3132] rounded-2xl overflow-hidden relative shadow-lg flex flex-col md:flex-row items-center p-8 md:p-16 gap-8 text-[#f0f1f2] border border-[#4f4445]/30">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#191c1d] via-[#2e3132] to-[#2e3132]/80 z-0"></div>
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-[#e8c5c8]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f1ca50]/20 border border-[#f1ca50]/30 text-[#f1ca50] rounded-full text-xs font-label-caps tracking-wider w-fit">
            <span className="material-symbols-outlined text-sm">stars</span>
            Partner Opportunity
          </div>

          <h2 className="font-headline-md text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Earn By Sharing What You Love
          </h2>

          <p className="font-body-lg text-sm md:text-base text-[#e1e3e4] leading-relaxed">
            Join the WELLORA Sales Partner Program. Share authentic beauty products and build your own business with our premium distribution network across Bangladesh.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="distributor-cta-btn"
              onClick={onBecomeDistributor}
              className="bg-[#e8c5c8] text-[#6b5053] px-7 py-3.5 rounded font-label-caps text-xs font-bold hover:bg-[#fedadd] transition-all uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              Become a Distributor
            </button>

            <span className="text-xs text-[#e1e3e4]/80 font-body-sm">
              • Up to 20% Instant Commission &bull; No inventory required
            </span>
          </div>
        </div>

        {/* Big Icon Graphic */}
        <div className="relative z-10 hidden md:flex flex-1 justify-end opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[160px] lg:text-[200px] text-[#fedadd]">
            groups
          </span>
        </div>
      </div>
    </section>
  );
};
