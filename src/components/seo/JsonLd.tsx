import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateProductJsonLd(product: {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://wellora-sajghor.com/products/${product.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };
}

export function generateStoreJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'WELLORA সাজঘর',
    image: 'https://wellora-sajghor.com/favicon.png',
    '@id': 'https://wellora-sajghor.com',
    url: 'https://wellora-sajghor.com',
    telephone: '+880 1700-000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gulshan Avenue',
      addressLocality: 'Dhaka',
      postalCode: '1212',
      addressCountry: 'BD',
    },
    priceRange: '৳৳',
  };
}
