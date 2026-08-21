import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id?: string;
  label: string;
  href: string;
  icon: LucideIcon | string;
  badge?: string | number;
  description?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  roleTitle: string;
  initials: string;
  avatar?: string;
  tier?: string;
}
