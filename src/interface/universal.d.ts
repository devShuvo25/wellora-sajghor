export type ProductCategory = 'Cleanser' | 'Toner' | 'Serum' | 'Moisturizer' | 'Sunscreen';

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  price: number;
  points: number;
  image: string;
  altText: string;
  description: string;
  volume: string;
  keyIngredients: string[];
  skinType: string[];
  isTrending?: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  distributorCommissionRate: number; // e.g. 0.15 = 15%
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Paid' | 'Cancelled';
export type TrackingStatus = 'Processing' | 'In Transit' | 'Delivered' | 'Ready for Pickup';
export type OrderChannel = 'WhatsApp' | 'Facebook' | 'Messenger' | 'Direct Link' | 'Offline / Direct';

export interface DistributorOrder {
  id: string;
  date: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  channel: OrderChannel;
  amount: number;
  commission: number;
  commStatus: OrderStatus;
  trackingStatus: TrackingStatus;
  items?: { productId: string; name: string; quantity: number; price: number }[];
}

export interface DistributorProfile {
  name: string;
  tier: string;
  roleBadge: string;
  avatar: string;
  totalSales: number;
  availableBalance: number;
  pendingCommissions: number;
  conversionRate: number;
  referralCode: string;
  referralUrl: string;
}

export type AssetType = 'Images' | 'Videos';
export type AssetCategory = 'All' | 'Serum' | 'Cleanser' | 'Sunscreen' | 'Moisturizer';

export interface MarketingAsset {
  id: string;
  title: string;
  formatType: string;
  type: 'image' | 'video';
  category: ProductCategory;
  image: string;
  altText: string;
  isHighCtr?: boolean;
  caption: string;
  suggestedPrice: number;
  downloadUrl: string;
  aspectRatio?: string;
  duration?: string;
}

export interface CampaignKit {
  id: string;
  badge: string;
  title: string;
  image: string;
  altText: string;
  itemCount: number;
  fileSize: string;
  downloadFilename: string;
}

export type AppView = 
  | 'store' 
  | 'partner-dashboard' 
  | 'partner-create-order' 
  | 'partner-marketing-assets' 
  | 'partner-referral-links' 
  | 'partner-wallet' 
  | 'partner-sales-analytics' 
  | 'partner-team-overrides';
