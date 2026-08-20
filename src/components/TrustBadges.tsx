import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section id="trust-badges-section" className="bg-wellora-surface-container-lowest py-12 border-y border-wellora-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Badge 1 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-wellora-secondary-container flex items-center justify-center text-wellora-on-secondary-container group-hover:bg-wellora-surface-tint group-hover:text-wellora-on-primary transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <span className="font-label-caps text-xs text-wellora-on-background font-bold tracking-wider">
            100% Authentic
          </span>
          <span className="font-body-sm text-xs text-wellora-on-surface-variant">
            Global Brands
          </span>
        </div>

        {/* Badge 2 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-wellora-secondary-container flex items-center justify-center text-wellora-on-secondary-container group-hover:bg-wellora-surface-tint group-hover:text-wellora-on-primary transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <span className="font-label-caps text-xs text-wellora-on-background font-bold tracking-wider">
            Cash on Delivery
          </span>
          <span className="font-body-sm text-xs text-wellora-on-surface-variant">
            Available Nationwide
          </span>
        </div>

        {/* Badge 3 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-wellora-secondary-container flex items-center justify-center text-wellora-on-secondary-container group-hover:bg-wellora-surface-tint group-hover:text-wellora-on-primary transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <span className="font-label-caps text-xs text-wellora-on-background font-bold tracking-wider">
            Loyalty Points
          </span>
          <span className="font-body-sm text-xs text-wellora-on-surface-variant">
            Earn on Every Purchase
          </span>
        </div>

        {/* Badge 4 */}
        <div className="flex flex-col items-center text-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-wellora-secondary-container flex items-center justify-center text-wellora-on-secondary-container group-hover:bg-wellora-surface-tint group-hover:text-wellora-on-primary transition-colors duration-300 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <span className="font-label-caps text-xs text-wellora-on-background font-bold tracking-wider">
            Express Shipping
          </span>
          <span className="font-body-sm text-xs text-wellora-on-surface-variant">
            Fast Delivery
          </span>
        </div>

      </div>
    </section>
  );
};
