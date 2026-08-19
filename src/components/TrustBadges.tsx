import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section id="trust-badges-section" className="bg-white py-12 border-y border-[#d3c3c4]/30">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Badge 1 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-[#dde2f3] flex items-center justify-center text-[#5e6473] group-hover:bg-[#72585a] group-hover:text-white transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <span className="font-label-caps text-xs text-[#191c1d] font-bold tracking-wider">
            100% Authentic
          </span>
          <span className="font-body-sm text-xs text-[#4f4445]">
            Global Brands
          </span>
        </div>

        {/* Badge 2 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-[#dde2f3] flex items-center justify-center text-[#5e6473] group-hover:bg-[#72585a] group-hover:text-white transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <span className="font-label-caps text-xs text-[#191c1d] font-bold tracking-wider">
            Cash on Delivery
          </span>
          <span className="font-body-sm text-xs text-[#4f4445]">
            Available Nationwide
          </span>
        </div>

        {/* Badge 3 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-[#dde2f3] flex items-center justify-center text-[#5e6473] group-hover:bg-[#72585a] group-hover:text-white transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <span className="font-label-caps text-xs text-[#191c1d] font-bold tracking-wider">
            Loyalty Points
          </span>
          <span className="font-body-sm text-xs text-[#4f4445]">
            Earn on Every Purchase
          </span>
        </div>

        {/* Badge 4 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-[#dde2f3] flex items-center justify-center text-[#5e6473] group-hover:bg-[#72585a] group-hover:text-white transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <span className="font-label-caps text-xs text-[#191c1d] font-bold tracking-wider">
            Express Shipping
          </span>
          <span className="font-body-sm text-xs text-[#4f4445]">
            Fast Delivery
          </span>
        </div>

      </div>
    </section>
  );
};
