'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/redux/api/authApi';

function OtpFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const email = params.get('email') || '';
  const nextPath = params.get('next') || '/dashboard/customer';

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice('');
    setErrorMessage('');

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    try {
      await verifyOtp({ data: { email, otp } }).unwrap();
      
      sessionStorage.removeItem('wellora-pending-email');
      setNotice('Email verified successfully! Redirecting to login page...');

      setTimeout(() => {
        router.push(
          `/login?registered=true&email=${encodeURIComponent(email)}&next=${encodeURIComponent(
            nextPath
          )}`
        );
      }, 1200);
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string }; message?: string };
      setErrorMessage(
        errorData?.data?.message || errorData?.message || 'Verification failed. Please check the OTP code and try again.'
      );
    }
  };

  const resend = async () => {
    setNotice('');
    setErrorMessage('');
    
    try {
      await resendOtp({ data: { email } }).unwrap();
      setNotice('A new OTP code has been sent to your email address.');
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string }; message?: string };
      setErrorMessage(
        errorData?.data?.message || errorData?.message || 'Failed to resend OTP. Please try again.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-wellora-background px-4 py-16 text-wellora-on-background flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-wellora-outline-variant/50 bg-wellora-surface-container-lowest p-8 shadow-sm">
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-wellora-surface-tint">Wellora</p>
        <h1 className="mt-3 text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm text-wellora-on-primary-fixed-variant">
          Enter the 6-digit verification OTP sent to <span className="font-semibold text-wellora-on-background">{email || 'your email'}</span>.
        </p>

        {notice && (
          <div role="status" className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
            {notice}
          </div>
        )}

        {errorMessage && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 animate-fadeIn">
            {errorMessage}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={verify}>
          <input
            required
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full rounded-xl border border-wellora-outline-variant px-3 py-3 text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-wellora-surface-tint bg-wellora-surface-container-lowest"
          />
          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-wellora-surface-tint px-4 py-3 text-xs font-bold text-wellora-on-primary disabled:opacity-60 cursor-pointer shadow-2xs transition-colors hover:bg-wellora-on-primary-fixed-variant"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP & Continue'}
          </button>
        </form>

        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="mt-6 w-full text-xs font-semibold text-wellora-surface-tint hover:underline cursor-pointer"
        >
          {isResending ? 'Sending...' : 'Didn\'t receive code? Resend OTP'}
        </button>
      </section>
    </main>
  );
}

export function OtpForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-wellora-background flex items-center justify-center">
          <p className="text-xs text-wellora-on-surface-variant">Loading OTP verification...</p>
        </div>
      }
    >
      <OtpFormInner />
    </Suspense>
  );
}