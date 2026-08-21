'use client';

import React, { useState } from 'react';
import { DistributorProfile } from '@/types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  distributor: DistributorProfile;
  onWithdrawSuccess: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  distributor,
  onWithdrawSuccess,
}) => {
  const [amount, setAmount] = useState('5000');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [accountNumber, setAccountNumber] = useState('01712-449821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = Number(amount);
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }
    if (withdrawAmt > distributor.availableBalance) {
      alert(`Withdrawal amount cannot exceed available balance of ৳${distributor.availableBalance.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onWithdrawSuccess(withdrawAmt);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div
      id="wallet-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-wellora-on-background/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        id="wallet-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-wellora-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-wellora-outline-variant/40"
      >
        <div className="flex justify-between items-center pb-4 border-b border-wellora-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-wellora-surface-tint">account_balance_wallet</span>
            <h3 className="font-headline-sm text-lg font-bold text-wellora-on-background">Withdraw Funds</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-wellora-surface-container-low text-wellora-on-background hover:bg-wellora-surface-container-high flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-wellora-on-background">
              Payout Request Submitted!
            </h4>
            <p className="text-xs text-wellora-on-surface-variant">
              ৳{Number(amount).toLocaleString()} will be transferred to your {method} account within 2-4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4 pt-4 text-xs">
            {/* Balance Overview */}
            <div className="p-3.5 bg-wellora-background rounded-xl border border-wellora-outline-variant/30 flex justify-between items-center">
              <div>
                <span className="text-wellora-on-surface-variant block">Available for Payout:</span>
                <span className="text-xl font-bold text-wellora-surface-tint">
                  ৳ {distributor.availableBalance.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] font-label-caps bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Instant Ready
              </span>
            </div>

            {/* Amount */}
            <div>
              <label className="block font-label-caps text-[11px] text-wellora-on-surface-variant uppercase mb-1">
                Withdrawal Amount (BDT ৳) *
              </label>
              <input
                type="number"
                required
                min="500"
                max={distributor.availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-sm font-bold text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint"
              />
              <div className="flex gap-2 mt-1.5">
                {[1000, 3000, 5000, distributor.availableBalance].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="px-2 py-0.5 bg-wellora-surface-container-low hover:bg-wellora-surface-container-high rounded text-[11px] text-wellora-on-surface-variant font-mono"
                  >
                    ৳{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="block font-label-caps text-[11px] text-wellora-on-surface-variant uppercase mb-1">
                Select Payout Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bKash', 'Nagad', 'Bank'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-2 border rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                      method === m
                        ? 'border-wellora-surface-tint bg-wellora-primary-fixed/40 text-wellora-on-primary-fixed-variant'
                        : 'border-wellora-outline-variant text-wellora-on-surface-variant'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Account number */}
            <div>
              <label className="block font-label-caps text-[11px] text-wellora-on-surface-variant uppercase mb-1">
                {method === 'Bank' ? 'Bank Account / Routing No.' : `${method} Personal / Agent Mobile No.`} *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={method === 'Bank' ? 'BRAC Bank - 1501204859001' : '01XXXXXXXXX'}
                className="w-full px-3.5 py-2.5 bg-wellora-background border border-wellora-outline-variant rounded-lg text-xs text-wellora-on-background focus:bg-wellora-surface-container-lowest focus:border-wellora-surface-tint"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || distributor.availableBalance <= 0}
                className="w-full py-3 bg-wellora-surface-tint text-wellora-on-primary rounded-lg font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-wellora-on-primary-fixed-variant transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Processing Request...' : `Confirm Payout (৳ ${Number(amount || 0).toLocaleString()})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
