export const siteConfig = {
  name: 'WELLORA সাজঘর',
  shortName: 'WELLORA',
  tagline: 'মানানসই পছন্দ | Skincare & Beauty Products',
  description:
    'WELLORA সাজঘর — আপনার ত্বকের জন্য ১০০% খাঁটি কোরিয়ান ও গ্লোবাল স্কিনকেয়ার এবং বিউটি প্রোডাক্টের নির্ভরযোগ্য অনলাইন গন্তব্য।',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wellora-sajghor.com',
  ogImage: '/assets/og-image.jpg',
  links: {
    facebook: 'https://facebook.com/wellora.bd',
    instagram: 'https://instagram.com/wellora.bd',
    whatsapp: 'https://wa.me/8801700000000',
  },
  contact: {
    email: 'support@wellora.com.bd',
    phone: '+880 1700-000000',
    address: 'Gulshan Avenue, Dhaka, Bangladesh',
  },
  keywords: [
    'WELLORA',
    'WELLORA সাজঘর',
    'Korean skincare Bangladesh',
    'Authentic skincare Dhaka',
    'COSRX Bangladesh',
    'Beauty of Joseon Bangladesh',
    'Anua Bangladesh',
    'Beauty products BD',
    'Skincare online shop Bangladesh',
  ],
  currencies: {
    code: 'BDT',
    symbol: '৳',
  },
} as const;

export type SiteConfig = typeof siteConfig;
