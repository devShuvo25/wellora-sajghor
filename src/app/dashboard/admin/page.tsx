'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AdminOverviewView } from '@/components/dashboard/views/admin';

export default function AdminPage() {
  return (
    <DashboardLayout role="admin">
      <AdminOverviewView />
    </DashboardLayout>
  );
}
