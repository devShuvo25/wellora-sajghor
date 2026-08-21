import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/ProductDetails';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { JsonLd, generateProductJsonLd } from '@/components/seo/JsonLd';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((item) => item.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | ${product.brand}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - ৳${product.price.toLocaleString()}`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.image,
          alt: product.altText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((item) => item.id === id);

  if (!product) notFound();

  const productJsonLd = generateProductJsonLd({
    id: product.id,
    name: product.name,
    brand: product.brand,
    description: product.description,
    image: product.image,
    price: product.price,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    inStock: product.inStock,
  });

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductDetails product={product} />
    </>
  );
}