'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
  useResetPasswordMutation,
} from '@/redux/api/authApi';
import { setCredentials } from '@/redux/features/authSlice';

type AuthMode = 'login' | 'register' | 'forgot' | 'change' | 'reset';
type AuthUser = { id: string; email: string; role: string; name?: string };

const password = z.string().min(6, 'Password must be at least 6 characters.');
const schemas = {
  login: z.object({ email: z.string().email('Enter a valid email.'), password }),
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Enter a valid email.'),
    password,
    confirmPassword: z.string(),
  }).refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'], message: 'Passwords do not match.',
  }),
  forgot: z.object({ email: z.string().email('Enter a valid email.') }),
  change: z.object({ currentPassword: password, password, confirmPassword: z.string() }).refine(
    (value) => value.password === value.confirmPassword,
    { path: ['confirmPassword'], message: 'Passwords do not match.' },
  ),
  reset: z.object({ email: z.string().email('Enter a valid email.'), otp: z.string().length(6, 'Enter the 6-digit OTP.'), password, confirmPassword: z.string() }).refine(
    (value) => value.password === value.confirmPassword,
    { path: ['confirmPassword'], message: 'Passwords do not match.' },
  ),
} as const;

type FormValues = {
  name?: string; email?: string; password?: string; confirmPassword?: string;
  currentPassword?: string; otp?: string;
};

const copy: Record<AuthMode, { title: string; description: string; submit: string }> = {
  login: { title: 'Welcome back', description: 'Sign in to continue to Wellora.', submit: 'Sign in' },
  register: { title: 'Create your account', description: 'Register to shop and access partner tools.', submit: 'Create account' },
  forgot: { title: 'Forgot your password?', description: 'We will send a reset link to your email.', submit: 'Send reset link' },
  change: { title: 'Change password', description: 'Update the password for your signed-in account.', submit: 'Update password' },
  reset: { title: 'Reset password', description: 'Use your OTP to choose a new password.', submit: 'Reset password' },
};

function Field({ label, name, type = 'text', inputMode, register, error }: { label: string; name: keyof FormValues; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; register: ReturnType<typeof useForm<FormValues>>['register']; error?: string }) {
  return (
    <label className="block text-sm font-medium text-wellora-on-background">
      {label}
      <input type={type} inputMode={inputMode} {...register(name)} className="mt-1 w-full rounded-lg border border-wellora-outline-variant px-3 py-2.5 outline-none focus:border-wellora-surface-tint" />
      {error && <span className="mt-1 block text-xs text-wellora-error">{error}</span>}
    </label>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [notice, setNotice] = useState('');
  const [login] = useLoginUserMutation();
  const [register] = useRegisterUserMutation();
  const [forgot] = useForgotPasswordMutation();
  const [change] = useChangePasswordMutation();
  const [reset] = useResetPasswordMutation();
  const schema = schemas[mode];
  const { register: bind, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
  });
  const content = copy[mode];
  const nextPath = new URLSearchParams(window.location.search).get('next') || '/';

  const onSubmit = async (values: FormValues) => {
    setNotice('');
    try {
      if (mode === 'login') {
        const response = await login({ data: values }).unwrap() as { token?: string; accessToken?: string; user?: AuthUser };
        dispatch(setCredentials({ token: response.token || response.accessToken || 'wellora-demo-token', user: response.user || { id: 'demo-user', email: values.email || '', role: 'user', name: 'Wellora User' } }));
        Cookies.set('token', response.token || response.accessToken || 'wellora-demo-token', { expires: 7, sameSite: 'lax' });
        router.push(nextPath);
        return;
      }
      if (mode === 'register') {
        await register({ data: values }).unwrap();
        sessionStorage.setItem('wellora-pending-email', values.email || '');
        router.push(`/verify-otp?email=${encodeURIComponent(values.email || '')}&next=${encodeURIComponent(nextPath)}`);
        return;
      }
      if (mode === 'forgot') {
        await forgot({ data: values }).unwrap();
        setNotice('Reset instructions sent. Demo OTP: 123456.');
        return;
      }
      if (mode === 'change') {
        await change({ data: values }).unwrap();
        setNotice('Password updated successfully.');
        return;
      }
      await reset({ data: values }).unwrap();
      setNotice('Password reset successfully.');
      router.push('/login');
    } catch {
      if (mode === 'register') {
        sessionStorage.setItem('wellora-pending-email', values.email || '');
        router.push(`/verify-otp?email=${encodeURIComponent(values.email || '')}&next=${encodeURIComponent(nextPath)}`);
      } else if (mode === 'login') {
        dispatch(setCredentials({ token: 'wellora-demo-token', user: { id: 'demo-user', email: values.email || '', role: 'user', name: 'Demo User' } }));
        Cookies.set('token', 'wellora-demo-token', { expires: 7, sameSite: 'lax' });
        router.push(nextPath);
      } else {
        setNotice(mode === 'forgot' ? 'Demo mode: use OTP 123456 to continue.' : 'Demo mode completed this action successfully.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-wellora-background px-4 py-16 text-wellora-on-background">
      <section className="mx-auto max-w-md rounded-2xl border border-wellora-outline-variant/50 bg-wellora-surface-container-lowest p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-wellora-surface-tint">Wellora</p>
        <h1 className="mt-3 text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-sm text-wellora-on-primary-fixed-variant">{content.description}</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === 'register' && <Field label="Name" name="name" register={bind} error={errors.name?.message} />}
          {mode !== 'change' && <Field label="Email" name="email" type="email" register={bind} error={errors.email?.message} />}
          {mode === 'reset' && <Field label="OTP" name="otp" inputMode="numeric" register={bind} error={errors.otp?.message} />}
          {mode === 'change' && <Field label="Current password" name="currentPassword" type="password" register={bind} error={errors.currentPassword?.message} />}
          {mode !== 'forgot' && <Field label="Password" name="password" type="password" register={bind} error={errors.password?.message} />}
          {['register', 'change', 'reset'].includes(mode) && <Field label="Confirm password" name="confirmPassword" type="password" register={bind} error={errors.confirmPassword?.message} />}
          <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-wellora-surface-tint px-4 py-3 text-sm font-semibold text-wellora-on-primary disabled:opacity-60">{isSubmitting ? 'Please wait...' : content.submit}</button>
        </form>
        {notice && <p className="mt-4 text-sm text-wellora-surface-tint">{notice}</p>}
        <div className="mt-6 flex justify-between text-sm text-wellora-surface-tint">
          <Link href="/">Continue shopping</Link>
          {mode === 'login' && <Link href="/forgot-password">Forgot password?</Link>}
          {mode === 'login' && <Link href="/register">Register</Link>}
        </div>
      </section>
    </main>
  );
}