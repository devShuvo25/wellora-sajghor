'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense, useEffect } from 'react';
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
import { resolveDashboardRoute } from '@/lib/dashboardAccess';

type AuthMode = 'login' | 'register' | 'forgot' | 'change' | 'reset';
type AuthUser = { id: string; email: string; role: string; name?: string };

const password = z.string().min(6, 'Password must be at least 6 characters.');
const schemas = {
  login: z.object({ email: z.string().email('Enter a valid email.'), password }),
  register: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters.'),
      email: z.string().email('Enter a valid email.'),
      password,
      confirmPassword: z.string(),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    }),
  forgot: z.object({ email: z.string().email('Enter a valid email.') }),
  change: z
    .object({ currentPassword: password, password, confirmPassword: z.string() })
    .refine((value) => value.password === value.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    }),
  reset: z
    .object({
      email: z.string().email('Enter a valid email.'),
      otp: z.string().length(6, 'Enter the 6-digit OTP.'),
      password,
      confirmPassword: z.string(),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    }),
} as const;

type FormValues = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  otp?: string;
};

const copy: Record<AuthMode, { title: string; description: string; submit: string }> = {
  login: {
    title: 'Welcome back',
    description: 'Sign in to continue to Wellora.',
    submit: 'Sign in',
  },
  register: {
    title: 'Create your account',
    description: 'Register to shop and access partner tools.',
    submit: 'Create account',
  },
  forgot: {
    title: 'Forgot your password?',
    description: 'We will send a reset link to your email.',
    submit: 'Send reset link',
  },
  change: {
    title: 'Change password',
    description: 'Update the password for your signed-in account.',
    submit: 'Update password',
  },
  reset: {
    title: 'Reset password',
    description: 'Use your OTP to choose a new password.',
    submit: 'Reset password',
  },
};

function Field({
  label,
  name,
  type = 'text',
  inputMode,
  register,
  error,
}: {
  label: string;
  name: keyof FormValues;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  register: ReturnType<typeof useForm<FormValues>>['register'];
  error?: string;
}) {
  return (
    <label className="block text-sm font-medium text-wellora-on-background">
      {label}
      <input
        type={type}
        inputMode={inputMode}
        {...register(name)}
        className="mt-1 w-full rounded-lg border border-wellora-outline-variant px-3 py-2.5 outline-none focus:border-wellora-surface-tint text-sm bg-wellora-surface-container-lowest"
      />
      {error && <span className="mt-1 block text-xs text-wellora-error">{error}</span>}
    </label>
  );
}

function AuthFormInner({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [login] = useLoginUserMutation();
  const [register] = useRegisterUserMutation();
  const [forgot] = useForgotPasswordMutation();
  const [change] = useChangePasswordMutation();
  const [reset] = useResetPasswordMutation();
  
  const schema = schemas[mode];
  const {
    register: bind,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
  });
  const content = copy[mode];
  
  const nextParam = searchParams?.get('next');
  const registered = searchParams?.get('registered') === 'true';
  const queryEmail = searchParams?.get('email');

  useEffect(() => {
    if (registered) {
      setNotice('Email verified successfully! Please sign in with your backend credentials.');
    }
    if (queryEmail) {
      setValue('email', queryEmail);
    }
  }, [registered, queryEmail, setValue]);

  const onSubmit = async (values: FormValues) => {
    setNotice('');
    setErrorMessage('');
    try {
      if (mode === 'login') {
        const response = (await login({ data: values }).unwrap()) as {
          token?: string;
          accessToken?: string;
          data?: { token?: string; accessToken?: string; user?: AuthUser };
          user?: AuthUser;
        };

        const authToken = response.token || response.accessToken || response.data?.token || response.data?.accessToken;
        const authUserData = response.user || response.data?.user;

        if (!authToken) {
          throw new Error('Authentication succeeded but no token was returned from server.');
        }

        dispatch(setCredentials({ token: authToken, user: authUserData }));
        Cookies.set('token', authToken, { expires: 7, sameSite: 'lax' });

        const targetRoute =
          nextParam && nextParam !== '/'
            ? decodeURIComponent(nextParam)
            : resolveDashboardRoute(authUserData?.role);

        router.push(targetRoute);
        return;
      }

      if (mode === 'register') {
        await register({ data: values }).unwrap();
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('wellora-pending-email', values.email || '');
        }
        const targetNext = nextParam || '/dashboard/customer';
        router.push(
          `/verify-otp?email=${encodeURIComponent(values.email || '')}&next=${encodeURIComponent(
            targetNext
          )}`
        );
        return;
      }

      if (mode === 'forgot') {
        await forgot({ data: values }).unwrap();
        setNotice('Reset instructions sent. Please check your email.');
        return;
      }

      if (mode === 'change') {
        await change({ data: values }).unwrap();
        setNotice('Password updated successfully.');
        return;
      }

      if (mode === 'reset') {
        await reset({ data: values }).unwrap();
        setNotice('Password reset successfully.');
        router.push('/login');
        return;
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string }; message?: string };
      setErrorMessage(
        errorData?.data?.message || errorData?.message || 'Authentication failed. Please verify your credentials and backend server.'
      );
    }
  };

  return (
    <main className="min-h-screen bg-wellora-background px-4 py-16 text-wellora-on-background flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-wellora-outline-variant/50 bg-wellora-surface-container-lowest p-8 shadow-sm">
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-wellora-surface-tint">Wellora</p>
        <h1 className="mt-3 text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-sm text-wellora-on-primary-fixed-variant">
          {content.description}
        </p>

        {notice && (
          <div role="status" className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
            {notice}
          </div>
        )}

        {errorMessage && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
            {errorMessage}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === 'register' && (
            <Field label="Name" name="name" register={bind} error={errors.name?.message} />
          )}
          {mode !== 'change' && (
            <Field
              label="Email"
              name="email"
              type="email"
              register={bind}
              error={errors.email?.message}
            />
          )}
          {mode === 'change' && (
            <Field
              label="Current Password"
              name="currentPassword"
              type="password"
              register={bind}
              error={errors.currentPassword?.message}
            />
          )}
          {mode === 'reset' && (
            <Field
              label="OTP Code"
              name="otp"
              inputMode="numeric"
              register={bind}
              error={errors.otp?.message}
            />
          )}
          {mode !== 'forgot' && (
            <Field
              label={mode === 'change' ? 'New Password' : 'Password'}
              name="password"
              type="password"
              register={bind}
              error={errors.password?.message}
            />
          )}
          {(mode === 'register' || mode === 'change' || mode === 'reset') && (
            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              register={bind}
              error={errors.confirmPassword?.message}
            />
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-wellora-surface-tint px-4 py-3 text-xs font-bold text-wellora-on-primary hover:bg-wellora-on-primary-fixed-variant transition-colors disabled:opacity-60 cursor-pointer shadow-2xs"
          >
            {isSubmitting ? 'Processing...' : content.submit}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-xs text-wellora-on-surface-variant">
          {mode === 'login' && (
            <>
              <Link href="/forgot-password" className="hover:text-wellora-surface-tint hover:underline">
                Forgot password?
              </Link>
              <p>
                Don't have an account?{' '}
                <Link href={`/register${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ''}`} className="font-bold text-wellora-surface-tint hover:underline">
                  Sign up
                </Link>
              </p>
            </>
          )}
          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <Link href={`/login${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ''}`} className="font-bold text-wellora-surface-tint hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-wellora-background flex items-center justify-center">
          <p className="text-xs text-wellora-on-surface-variant">Loading page...</p>
        </div>
      }
    >
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}