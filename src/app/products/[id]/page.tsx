"use client";

import { use } from "react";
import Link from "next/link";
import { ProductDetails } from "@/components/ProductDetails";
import { useGetProductByIdQuery } from "@/redux/api/productsApi";
import { JsonLd, generateProductJsonLd } from "@/components/seo/JsonLd";
import { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);

  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const rawProduct = responseData?.data || responseData;

  const product: Product | null = rawProduct
    ? {
        ...rawProduct,
        id: rawProduct.id || rawProduct._id,
      }
    : null;
    console.log("product", product)

  if (isLoading || isFetching) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 py-16 md:px-10">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-48 rounded bg-wellora-outline-variant/20" />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="aspect-square w-full rounded-xl bg-wellora-outline-variant/20" />
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-wellora-outline-variant/20" />
              <div className="h-8 w-3/4 rounded bg-wellora-outline-variant/20" />
              <div className="h-6 w-32 rounded bg-wellora-outline-variant/20" />
              <div className="h-24 w-full rounded bg-wellora-outline-variant/20" />
              <div className="h-12 w-40 rounded bg-wellora-outline-variant/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ২. Client-Side এ notFound() না ডেকে Safe Fallback UI (লুপ বন্ধ করবে)
  if (isError || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1280px] flex-col items-center justify-center px-4 py-16 text-center">
        <span className="material-symbols-outlined mb-4 text-6xl text-wellora-outline-variant">
          inventory_2
        </span>
        <h1 className="font-headline-sm text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-sm text-wellora-on-surface-variant">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-md bg-wellora-on-background px-6 py-2.5 text-sm font-semibold text-wellora-on-primary transition-colors hover:bg-wellora-on-surface-variant"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

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