'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { resolveDashboardRoute } from '@/lib/dashboardAccess';

export default function DashboardEntryPage() {
  const router = useRouter();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  useEffect(() => {
    const destination = resolveDashboardRoute(userRole);
    router.replace(destination);
  }, [userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wellora-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wellora-surface-tint border-t-transparent"></div>
        <p className="font-label-caps text-xs text-wellora-on-surface-variant">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
