export type PartnerTab =
  | 'dashboard'
  | 'create-order'
  | 'referral-links'
  | 'marketing-assets'
  | 'wallet'
  | 'sales-analytics'
  | 'team-overrides';

const partnerTabs = new Set<PartnerTab>([
  'dashboard',
  'create-order',
  'referral-links',
  'marketing-assets',
  'wallet',
  'sales-analytics',
  'team-overrides',
]);

export function isPartnerTab(value: string): value is PartnerTab {
  return partnerTabs.has(value as PartnerTab);
}