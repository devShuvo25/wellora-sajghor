'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { DashboardRole, resolveDashboardRoute } from '@/lib/dashboardAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: DashboardRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const activeToken = token || Cookies.get('token');

    // 1. Unauthenticated check
    if (!activeToken) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Role authorization check (if specified)
    if (allowedRoles && allowedRoles.length > 0 && user?.role) {
      const userRole = user.role.toLowerCase() as DashboardRole;
      const isAllowed = allowedRoles.includes(userRole);

      if (!isAllowed) {
        // Redirect unauthorized user to their proper dashboard role route
        const fallbackRoute = resolveDashboardRoute(userRole);
        router.push(fallbackRoute);
        return;
      }
    }

    setIsAuthorized(true);
    setChecking(false);
  }, [token, user, allowedRoles, pathname, router]);

  if (checking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-wellora-background flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-wellora-surface-tint" />
          <p className="text-xs font-semibold text-wellora-on-surface-variant tracking-wide">
            Verifying secure session & access permissions…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
