"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { INITIAL_PRODUCTS } from "@/data/mockData";
import { RootState } from "@/redux/store";
import { Product } from "@/types";

const detailTabs = [
  "Description",
  "Key Ingredients",
  "How to Use",
  "Suitable For",
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-wellora-tertiary"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className="material-symbols-outlined fill text-[18px]"
          data-weight="fill"
        >
          star
        </span>
      ))}
    </span>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  console.log("Productdetails : ", product);
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) =>
    Boolean(state.auth.token),
  );
  const [quantity, setQuantity] = useState(1);
  const galleryImages = product.galleryImages?.length
    ? product.galleryImages
    : [product.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] =
    useState<(typeof detailTabs)[number]>("Description");
  const [notice, setNotice] = useState("");
  const relatedProducts = INITIAL_PRODUCTS.filter(
    (item) => item.id !== product.id,
  ).slice(0, 4);

  const addToCart = () =>
    setNotice(`${quantity} x ${product.name} added to your cart.`);
  const openPartnerOrder = () =>
    router.push(
      isAuthenticated
        ? "/dashboard/distributor"
        : "/login?next=/dashboard/distributor",
    );
  const tabContent = {
    Description: product.description,
    "Key Ingredients": `${product.name} features ${product.keyIngredients.join(", ")} for a balanced skincare routine.`,
    "How to Use":
      "Apply an appropriate amount after cleansing. Gently pat into the skin until fully absorbed, then continue with serum and moisturizer.",
    "Suitable For": `Designed for ${product.skinType.join(", ")}. Patch test before use if your skin is especially sensitive.`,
  };

  return (
    <div className="min-h-screen bg-wellora-background text-wellora-on-background">
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-10 md:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-wellora-on-surface-variant"
        >
          <Link href="/" className="hover:text-wellora-surface-tint">
            Home
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <Link
            href="/#trending-section"
            className="hover:text-wellora-surface-tint"
          >
            {product.category?.name }s
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <span className="font-semibold text-wellora-on-background">
            {product.name}
          </span>
        </nav>

        <section className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-20">
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-wellora-surface-container-lowest ${index === selectedImageIndex ? "border-wellora-surface-tint" : "border-transparent hover:border-wellora-outline-variant"}`}
                  aria-label={`Product image ${index + 1}`}
                  aria-pressed={index === selectedImageIndex}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
            <div className="group relative flex aspect-[4/5] flex-grow items-center justify-center overflow-hidden rounded-xl bg-wellora-surface-container-lowest shadow-[0_4px_20px_rgba(26,32,44,0.04)]">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={product.altText}
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-wellora-surface-container-lowest/90 px-3 py-1.5 text-xs shadow-sm backdrop-blur-md">
                <span
                  className="material-symbols-outlined fill text-sm text-wellora-tertiary"
                  data-weight="fill"
                >
                  verified
                </span>
                100% Authentic
              </span>
              {product.isTrending && (
                <span className="absolute left-4 top-4 rounded bg-wellora-primary-fixed/90 px-3 py-1 font-label-caps text-[10px] font-semibold text-wellora-on-primary-fixed-variant">
                  BESTSELLER
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-wellora-surface-tint">
              {product.brand}
            </span>
            <h1 className="mt-2 font-headline-md text-3xl font-bold leading-tight md:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Stars rating={product.rating} />
              <span className="font-body-md font-semibold">
                {product.rating}/5
              </span>
              <a
                href="#reviews"
                className="text-sm text-wellora-on-surface-variant underline"
              >
                ({product.reviewsCount} reviews)
              </a>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold">
                ৳{product.price.toLocaleString()}
              </span>
              <span className="font-headline-sm text-wellora-outline line-through">
                ৳{Math.round(product.price * 1.25).toLocaleString()}
              </span>
              <span className="rounded bg-wellora-error-container px-2 py-1 font-label-caps text-[10px] text-wellora-error">
                -20%
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 text-sm font-semibold text-wellora-surface-tint">
                <span className="material-symbols-outlined text-base">
                  check_circle
                </span>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-wellora-tertiary-container/30 px-3 py-1 text-xs text-wellora-tertiary">
                <span className="material-symbols-outlined text-sm">stars</span>
                Earn {product.points * quantity} Points
              </span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-wellora-on-surface-variant">
              {product.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-wellora-outline-variant bg-wellora-surface-container-low p-4">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-wellora-surface-tint">
                  local_shipping
                </span>
                <div>
                  <strong className="block text-sm">Nationwide Delivery</strong>
                  <span className="text-sm text-wellora-on-surface-variant">
                    Estimated 2-4 days
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-wellora-surface-tint">
                  payments
                </span>
                <div>
                  <strong className="block text-sm">COD Available</strong>
                  <span className="text-sm text-wellora-on-surface-variant">
                    Charge from ৳60
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["spa", "Calming"],
                ["water_drop", "Hydrating"],
                ["science", "Quality tested"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-wellora-outline-variant bg-wellora-surface-container-lowest p-3 text-center"
                >
                  <span className="material-symbols-outlined text-2xl text-wellora-surface-tint">
                    {icon}
                  </span>
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4 border-t border-wellora-outline-variant pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 items-center overflow-hidden rounded-lg border border-wellora-outline">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-full w-10 hover:bg-wellora-surface-container-low"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-10 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-full w-10 hover:bg-wellora-surface-container-low"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-wellora-primary-container font-headline-sm text-wellora-on-primary-fixed-variant transition-colors hover:bg-wellora-surface-tint hover:text-wellora-on-primary disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                  Add to Cart
                </button>
              </div>
              <button
                onClick={openPartnerOrder}
                className="h-12 w-full rounded-lg bg-wellora-on-background font-headline-sm text-wellora-on-primary hover:bg-wellora-on-surface-variant"
              >
                Buy as Partner
              </button>
              {notice && (
                <p className="text-center text-sm text-wellora-surface-tint">
                  {notice}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mb-20 rounded-2xl border border-wellora-outline-variant bg-wellora-surface-container-low px-6 py-10">
          <h2 className="mb-8 text-center font-headline-md text-2xl">
            Why Shop with WELLORA
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {[
              ["verified", "100% Authentic"],
              ["fact_check", "Quality Checked"],
              ["inventory_2", "Secure Packaging"],
              ["payments", "Cash on Delivery"],
              ["support_agent", "Expert Support"],
            ].map(([icon, label]) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wellora-primary-container text-wellora-surface-tint">
                  <span className="material-symbols-outlined">{icon}</span>
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-6 flex gap-8 overflow-x-auto border-b border-wellora-outline">
            {detailTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-3 font-headline-sm ${activeTab === tab ? "border-b-2 border-wellora-surface-tint text-wellora-surface-tint" : "text-wellora-on-surface-variant"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="max-w-4xl leading-relaxed text-wellora-on-surface-variant">
            {tabContent[activeTab]}
          </p>
        </section>

        <section className="mb-20">
          <h2 className="mb-8 font-headline-md text-2xl">
            How to Use in Your Routine
          </h2>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {[
              "water_drop|Cleanser",
              "spa|Toner",
              "science|Serum",
              "lotion|Moisturizer",
              "light_mode|Sunscreen",
            ].map((item, index) => {
              const [icon, label] = item.split("|");
              return (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full border ${index === 1 ? "border-2 border-wellora-surface-tint bg-wellora-primary-container text-wellora-surface-tint" : "border-wellora-outline-variant bg-wellora-surface-container-lowest text-wellora-on-surface-variant"}`}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </span>
                    <span
                      className={`text-sm ${index === 1 ? "font-bold text-wellora-surface-tint" : "text-wellora-on-surface-variant"}`}
                    >
                      {index + 1}. {label}
                    </span>
                  </div>
                  {index < 4 && (
                    <span className="material-symbols-outlined hidden text-wellora-outline md:block">
                      arrow_forward
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="reviews"
          className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2"
        >
          <div>
            <h2 className="mb-6 font-headline-md text-2xl">Customer Reviews</h2>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-5xl font-bold">{product.rating}</span>
              <div>
                <Stars rating={product.rating} />
                <span className="text-sm text-wellora-on-surface-variant">
                  Based on {product.reviewsCount} reviews
                </span>
              </div>
            </div>
            {[
              "Absolutely love this product. It calmed my redness and feels wonderfully light on the skin.",
              "A gentle, reliable addition to my routine. The texture absorbs quickly without feeling sticky.",
            ].map((review) => (
              <article
                key={review}
                className="border-b border-wellora-outline-variant py-5"
              >
                <div className="flex items-center gap-2">
                  <Stars rating={5} />
                  <span className="flex items-center gap-1 text-xs font-semibold text-wellora-surface-tint">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>
                    Verified Purchase
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-wellora-on-surface-variant">
                  {review}
                </p>
              </article>
            ))}
          </div>
          <div>
            <h2 className="mb-6 font-headline-md text-2xl">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                [
                  "Is this product 100% original?",
                  "Yes. WELLORA products are sourced through official brands or authorized distributors.",
                ],
                [
                  "Is it suitable for sensitive skin?",
                  `This product is suitable for ${product.skinType.join(", ")}. Please patch test first.`,
                ],
                [
                  "How long does delivery take?",
                  "Dhaka delivery usually takes 1-2 business days and nationwide delivery takes 2-4 days.",
                ],
              ].map(([question, answer]) => (
                <details
                  key={question}
                  className="rounded-lg border border-wellora-outline-variant bg-wellora-surface-container-lowest p-4"
                  open={question === "Is this product 100% original?"}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-headline-sm text-sm">
                    {question}
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-wellora-on-surface-variant">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="related" className="pb-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-headline-md text-2xl">You may also like</h2>
            <Link
              href="/#trending-section"
              className="flex items-center gap-1 text-sm font-semibold text-wellora-surface-tint hover:underline"
            >
              View All{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((item) => (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className="group"
              >
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-wellora-outline-variant bg-wellora-surface-container-lowest">
                  <img
                    src={item.image}
                    alt={item.altText}
                    className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-label-caps text-xs uppercase tracking-wider text-wellora-on-surface-variant">
                  {item.brand}
                </span>
                <h3 className="mt-1 line-clamp-2 font-headline-sm text-base">
                  {item.name}
                </h3>
                <span className="mt-2 block font-semibold">
                  ৳{item.price.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
