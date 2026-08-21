import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { NavItem, UserProfile } from './navigation';

export type DashboardRole = 'admin' | 'distributor' | 'partner' | 'customer';

export interface DashboardTabConfig {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon | string;
  badge?: string | number;
  description?: string;
  eyebrow?: string;
  actionLabel?: string;
}

export interface RoleDashboardConfig {
  role: DashboardRole;
  portalTitle: string;
  portalSubtitle: string;
  roleBadge: string;
  defaultTab: string;
  basePath: string;
  items: DashboardTabConfig[];
  defaultUser: UserProfile;
}

export interface DashboardLayoutProps {
  children: ReactNode;
  role?: DashboardRole;
  portalTitle?: string;
  portalSubtitle?: string;
  navigationItems?: (NavItem | DashboardTabConfig)[];
  settingsHref?: string;
  user?: UserProfile;
  activeTab?: string;
  headerActions?: ReactNode;
}
