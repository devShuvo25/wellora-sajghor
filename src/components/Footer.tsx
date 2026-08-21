'use client';

import React, { useState } from 'react';

interface FooterProps {
  onPartnerClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPartnerClick }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer id="main-footer" className="bg-wellora-surface-container-highest w-full py-16 px-4 md:px-10 border-t border-wellora-outline-variant mt-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-headline-sm text-2xl text-wellora-surface-tint font-bold tracking-tight">
                WELLORA
              </span>
              <span className="font-label-caps text-[10px] text-wellora-surface-tint tracking-widest -mt-0.5">
                মানানসই পছন্দ &bull; সাজঘর
              </span>
            </div>

            <p className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant max-w-xs leading-relaxed">
              Your trusted source for 100% authentic global beauty and Korean skincare in Bangladesh.
            </p>

            <div className="flex gap-4 mt-1">
              <button
                aria-label="Website"
                className="w-8 h-8 rounded-full bg-wellora-surface-container-lowest/80 flex items-center justify-center text-wellora-on-surface-variant hover:text-wellora-surface-tint hover:bg-wellora-surface-container-lowest transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </button>
              <button
                aria-label="Email support"
                className="w-8 h-8 rounded-full bg-wellora-surface-container-lowest/80 flex items-center justify-center text-wellora-on-surface-variant hover:text-wellora-surface-tint hover:bg-wellora-surface-container-lowest transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
              </button>
              <button
                onClick={onPartnerClick}
                aria-label="Partner Portal"
                className="px-2.5 h-8 rounded-full bg-wellora-primary-fixed text-wellora-on-primary-fixed-variant font-label-caps text-[10px] flex items-center gap-1 font-semibold hover:bg-wellora-primary-container transition-colors cursor-pointer"
                title="Distributor Login"
              >
                <span className="material-symbols-outlined text-xs">storefront</span>
                <span>Partner Hub</span>
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-wellora-on-background tracking-wider uppercase mb-1">
              Company
            </h4>
            <a href="#hero-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              About Us
            </a>
            <a href="#main-footer" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Contact Us (Dhaka Hub)
            </a>
            <button 
              onClick={onPartnerClick}
              className="text-left font-body-sm text-xs md:text-sm text-wellora-surface-tint font-medium hover:underline transition-colors"
            >
              Distributor Program
            </button>
            <a href="#trending-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Authenticity Guarantee
            </a>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-wellora-on-background tracking-wider uppercase mb-1">
              Customer Care
            </h4>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Privacy Policy
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Terms of Service
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Shipping & Cash on Delivery
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-wellora-on-surface-variant hover:text-wellora-surface-tint transition-colors">
              Refund & Return Policy
            </a>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-wellora-on-background tracking-wider uppercase mb-1">
              Newsletter
            </h4>
            <p className="font-body-sm text-xs text-wellora-on-surface-variant">
              Subscribe for exclusive K-beauty product drops, distributor perks, and flash sales.
            </p>

            {subscribed ? (
              <div className="p-3 bg-wellora-secondary-container text-wellora-on-secondary-container rounded text-xs font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-wellora-inverse-surface">check_circle</span>
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-wellora-surface-container-low border border-wellora-outline-variant rounded-l px-3 py-2 font-body-sm text-xs focus:outline-hidden focus:border-wellora-surface-tint focus:bg-wellora-surface-container-lowest w-full text-wellora-on-background"
                />
                <button
                  type="submit"
                  className="bg-wellora-surface-tint text-wellora-on-primary px-4 py-2 rounded-r font-label-caps text-xs hover:bg-wellora-on-primary-fixed-variant transition-colors uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-wellora-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body-sm text-wellora-on-surface-variant">
          <p className="text-center md:text-left">
            &copy; 2024 WELLORA সাজঘর. All Rights Reserved. &bull; Trade License: TRAD-123456 &bull; Certified Korean Cosmetics Importer
          </p>

          <div className="flex gap-4 items-center">
            <span className="px-2 py-0.5 bg-wellora-surface-container-lowest rounded font-label-caps text-[10px] font-bold text-wellora-error border border-wellora-outline-variant/40">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-wellora-surface-container-lowest rounded font-label-caps text-[10px] font-bold text-wellora-tertiary border border-wellora-outline-variant/40">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-wellora-surface-container-lowest rounded font-label-caps text-[10px] font-bold text-wellora-secondary border border-wellora-outline-variant/40">
              Visa
            </span>
            <span className="px-2 py-0.5 bg-wellora-surface-container-lowest rounded font-label-caps text-[10px] font-bold text-wellora-on-background border border-wellora-outline-variant/40">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
