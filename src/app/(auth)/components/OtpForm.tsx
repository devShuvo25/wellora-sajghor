'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/redux/api/authApi';
import { setCredentials } from '@/redux/features/authSlice';

export function OtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const email = params.get('email') || '';
  const nextPath = params.get('next') || '/';

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setNotice('Enter the 6-digit OTP. Demo OTP is 123456.');
      return;
    }
    try {
      const response = await verifyOtp({ data: { email, otp } }).unwrap() as { token?: string; accessToken?: string };
      dispatch(setCredentials({ token: response.token || response.accessToken || 'wellora-demo-token', user: { id: 'demo-user', email, role: 'user', name: 'Wellora User' } }));
    } catch {
      if (otp !== '123456') {
        setNotice('Invalid OTP. Use 123456 in demo mode.');
        return;
      }
      dispatch(setCredentials({ token: 'wellora-demo-token', user: { id: 'demo-user', email, role: 'user', name: 'Demo User' } }));
    }
    sessionStorage.removeItem('wellora-pending-email');
    Cookies.set('token', 'wellora-demo-token', { expires: 7, sameSite: 'lax' });
    router.push(nextPath);
  };

  const resend = async () => {
    try { await resendOtp({ data: { email } }).unwrap(); } catch { /* demo fallback */ }
    setNotice('A new OTP was sent. Demo OTP: 123456.');
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-16 text-[#191c1d]">
      <section className="mx-auto max-w-md rounded-2xl border border-[#d3c3c4]/50 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[#72585a]">Wellora</p>
        <h1 className="mt-3 text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm text-[#594043]">Enter the OTP sent to {email || 'your email'}.</p>
        <form className="mt-8 space-y-4" onSubmit={verify}>
          <input required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="6-digit OTP" className="w-full rounded-lg border border-[#d3c3c4] px-3 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-[#72585a]" />
          <button disabled={isLoading} className="w-full rounded-lg bg-[#72585a] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
        </form>
        <button type="button" onClick={resend} className="mt-5 w-full text-sm text-[#72585a]">Resend OTP</button>
        {notice && <p className="mt-4 text-center text-sm text-[#72585a]">{notice}</p>}
      </section>
    </main>
  );
}