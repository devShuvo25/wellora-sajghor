import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | WELLORA সাজঘর',
  description: 'Enterprise management and customer portal for WELLORA সাজঘর.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-wellora-background">{children}</div>;
}