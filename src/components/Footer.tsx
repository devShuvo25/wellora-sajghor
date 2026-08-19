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
    <footer id="main-footer" className="bg-[#e1e3e4] w-full py-16 px-4 md:px-10 border-t border-[#d3c3c4] mt-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-headline-sm text-2xl text-[#72585a] font-bold tracking-tight">
                WELLORA
              </span>
              <span className="font-label-caps text-[10px] text-[#72585a] tracking-widest -mt-0.5">
                মানানসই পছন্দ &bull; সাজঘর
              </span>
            </div>

            <p className="font-body-sm text-xs md:text-sm text-[#4f4445] max-w-xs leading-relaxed">
              Your trusted source for 100% authentic global beauty and Korean skincare in Bangladesh.
            </p>

            <div className="flex gap-4 mt-1">
              <button
                aria-label="Website"
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#4f4445] hover:text-[#72585a] hover:bg-white transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </button>
              <button
                aria-label="Email support"
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#4f4445] hover:text-[#72585a] hover:bg-white transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
              </button>
              <button
                onClick={onPartnerClick}
                aria-label="Partner Portal"
                className="px-2.5 h-8 rounded-full bg-[#fedadd] text-[#594043] font-label-caps text-[10px] flex items-center gap-1 font-semibold hover:bg-[#e8c5c8] transition-colors cursor-pointer"
                title="Distributor Login"
              >
                <span className="material-symbols-outlined text-xs">storefront</span>
                <span>Partner Hub</span>
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-[#191c1d] tracking-wider uppercase mb-1">
              Company
            </h4>
            <a href="#hero-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              About Us
            </a>
            <a href="#main-footer" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Contact Us (Dhaka Hub)
            </a>
            <button 
              onClick={onPartnerClick}
              className="text-left font-body-sm text-xs md:text-sm text-[#72585a] font-medium hover:underline transition-colors"
            >
              Distributor Program
            </button>
            <a href="#trending-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Authenticity Guarantee
            </a>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-[#191c1d] tracking-wider uppercase mb-1">
              Customer Care
            </h4>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Privacy Policy
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Terms of Service
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Shipping & Cash on Delivery
            </a>
            <a href="#trust-badges-section" className="font-body-sm text-xs md:text-sm text-[#4f4445] hover:text-[#72585a] transition-colors">
              Refund & Return Policy
            </a>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-xs font-bold text-[#191c1d] tracking-wider uppercase mb-1">
              Newsletter
            </h4>
            <p className="font-body-sm text-xs text-[#4f4445]">
              Subscribe for exclusive K-beauty product drops, distributor perks, and flash sales.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#dde2f3] text-[#5e6473] rounded text-xs font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#2e3132]">check_circle</span>
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
                  className="bg-[#f3f4f5] border border-[#d3c3c4] rounded-l px-3 py-2 font-body-sm text-xs focus:outline-hidden focus:border-[#72585a] focus:bg-white w-full text-[#191c1d]"
                />
                <button
                  type="submit"
                  className="bg-[#72585a] text-white px-4 py-2 rounded-r font-label-caps text-xs hover:bg-[#594043] transition-colors uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#d3c3c4]/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body-sm text-[#4f4445]">
          <p className="text-center md:text-left">
            &copy; 2024 WELLORA সাজঘর. All Rights Reserved. &bull; Trade License: TRAD-123456 &bull; Certified Korean Cosmetics Importer
          </p>

          <div className="flex gap-4 items-center">
            <span className="px-2 py-0.5 bg-white rounded font-label-caps text-[10px] font-bold text-[#ba1a1a] border border-[#d3c3c4]/40">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-white rounded font-label-caps text-[10px] font-bold text-[#735c00] border border-[#d3c3c4]/40">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-white rounded font-label-caps text-[10px] font-bold text-[#585e6c] border border-[#d3c3c4]/40">
              Visa
            </span>
            <span className="px-2 py-0.5 bg-white rounded font-label-caps text-[10px] font-bold text-[#191c1d] border border-[#d3c3c4]/40">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
