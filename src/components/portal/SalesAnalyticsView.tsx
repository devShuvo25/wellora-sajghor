'use client';

import React from 'react';
import { DistributorProfile } from '@/types';

interface SalesAnalyticsViewProps {
  distributor: DistributorProfile;
  onOpenMobileMenu: () => void;
}

export const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({
  distributor,
  onOpenMobileMenu,
}) => {
  const channelData = [
    { channel: 'WhatsApp Social Selling', revenue: 21800, share: '45%', orders: 12, color: 'bg-emerald-500' },
    { channel: 'Facebook / Messenger DMs', revenue: 14500, share: '30%', orders: 8, color: 'bg-blue-500' },
    { channel: 'Direct Referral Link (Instagram/TikTok)', revenue: 8200, share: '17%', orders: 5, color: 'bg-purple-500' },
    { channel: 'Offline / Direct In-Person', revenue: 4000, share: '8%', orders: 3, color: 'bg-amber-500' },
  ];

  const topProducts = [
    { name: 'COSRX Snail 96 Mucin Power Essence', units: 14, earned: 4662 },
    { name: 'Beauty of Joseon Relief Sun Rice+Probiotics', units: 11, earned: 2392 },
    { name: 'WELLORA Luminous C Radiance Elixir', units: 9, earned: 2250 },
    { name: 'Anua Heartleaf 77% Soothing Toner', units: 6, earned: 2016 },
  ];

  return (
    <div id="sales-analytics-view" className="flex-1 min-h-screen bg-wellora-background p-4 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded bg-wellora-surface-container-lowest text-wellora-on-background border border-wellora-outline-variant"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-wellora-on-background">
            Sales & Channel Analytics ({distributor?.name || 'Partner'})
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-wellora-on-surface-variant mt-0.5">
            Detailed performance tracking across social channels and best-converting skincare formulations ({distributor?.tier || 'Pro Partner'}).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Channel Revenue Breakdown */}
        <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs">
          <h3 className="font-headline-sm text-base font-bold text-wellora-on-background mb-1">
            Revenue by Social Channel
          </h3>
          <p className="text-xs text-wellora-on-surface-variant mb-6">
            Where your customers are placing their skincare orders
          </p>

          <div className="space-y-4 text-xs">
            {channelData.map((ch) => (
              <div key={ch.channel} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-wellora-on-background">{ch.channel}</span>
                  <span className="font-bold text-wellora-surface-tint">
                    ৳{ch.revenue.toLocaleString()} ({ch.share})
                  </span>
                </div>
                <div className="w-full h-2 bg-wellora-surface-container-low rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ch.color} rounded-full`}
                    style={{ width: ch.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Skincare */}
        <div className="bg-wellora-surface-container-lowest p-6 rounded-xl border border-wellora-outline-variant/30 shadow-2xs">
          <h3 className="font-headline-sm text-base font-bold text-wellora-on-background mb-1">
            Top Earning Skincare Items
          </h3>
          <p className="text-xs text-wellora-on-surface-variant mb-6">
            Products generating the highest total commission for you
          </p>

          <div className="divide-y divide-wellora-outline-variant/20 text-xs">
            {topProducts.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-wellora-surface-container-low text-wellora-surface-tint font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-wellora-on-background">{p.name}</h4>
                    <span className="text-[11px] text-wellora-on-surface-variant">{p.units} units sold</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">+৳{p.earned.toLocaleString()}</span>
                  <span className="text-[10px] text-wellora-on-surface-variant">earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
