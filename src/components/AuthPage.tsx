'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type AuthMode = 'login' | 'register' | 'forgot' | 'change' | 'reset';

const copy: Record<AuthMode, { title: string; submit: string; description: string }> = {
  login: { title: 'Welcome back', submit: 'Sign in', description: 'Sign in to manage your Wellora account.' },
  register: { title: 'Create your account', submit: 'Create account', description: 'Join Wellora for authentic skincare and partner tools.' },
  forgot: { title: 'Forgot your password?', submit: 'Send reset link', description: 'Enter your email and we will send recovery instructions.' },
  change: { title: 'Change password', submit: 'Update password', description: 'Choose a new password for your account.' },
  reset: { title: 'Reset password', submit: 'Reset password', description: 'Set a new password to regain access.' },
};

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [message, setMessage] = useState('');
  const content = copy[mode];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('This demo form is ready to connect to your authentication API.');
  };

  return (
    <main className="min-h-screen bg-wellora-background px-4 py-16 text-wellora-on-background">
      <section className="mx-auto max-w-md rounded-2xl border border-wellora-outline-variant/50 bg-wellora-surface-container-lowest p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-wellora-surface-tint">Wellora</p>
        <h1 className="mt-3 text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-sm text-wellora-on-primary-fixed-variant">{content.description}</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {mode !== 'change' && <label className="block text-sm font-medium">Email<input required type="email" className="mt-1 w-full rounded-lg border border-wellora-outline-variant px-3 py-2" /></label>}
          {mode === 'register' && <label className="block text-sm font-medium">Name<input required className="mt-1 w-full rounded-lg border border-wellora-outline-variant px-3 py-2" /></label>}
          {mode !== 'forgot' && <label className="block text-sm font-medium">Password<input required minLength={6} type="password" className="mt-1 w-full rounded-lg border border-wellora-outline-variant px-3 py-2" /></label>}
          <button type="submit" className="w-full rounded-lg bg-wellora-surface-tint px-4 py-3 text-sm font-semibold text-wellora-on-primary">{content.submit}</button>
        </form>
        {message && <p className="mt-4 text-sm text-wellora-surface-tint">{message}</p>}
        <Link href="/" className="mt-6 block text-center text-sm text-wellora-surface-tint">Continue shopping</Link>
      </section>
    </main>
  );
}
