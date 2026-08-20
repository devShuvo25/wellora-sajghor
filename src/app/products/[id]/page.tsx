import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/ProductDetails';
import { INITIAL_PRODUCTS } from '@/data/mockData';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((item) => item.id === id);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}