'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, ArrowRight, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IProductData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  wholesaleMinQty?: number;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product, variant = 'default' }: { product: IProductData; variant?: 'default' | 'shop' }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t, language } = useTranslation();

  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : FALLBACK_IMAGE
  );

  // 1. Determine Dynamic Pricing
  let price = product.retailPrice || 0;
  let crossedOutPrice: number | null = null;
  let priceBadge: string | null = null;

  if (user) {
    if (user.customerType === 'WHOLESALE_BUYER' || user.customerType === 'WHOLESALE') {
      price = product.wholesalePrice || product.retailPrice;
      priceBadge = language === 'ta' ? 'மொத்த விலை (B2B)' : 'Wholesale Price';
      if (product.retailPrice > product.wholesalePrice) {
        crossedOutPrice = product.retailPrice;
      }
    } else if (user.customerType === 'V2CC_PMS_MEMBER' || user.customerType === 'COMMUNITY') {
      price = product.communityPrice || product.retailPrice;
      priceBadge = language === 'ta' ? 'V2CC-PMS விலை' : 'Member Price';
      if (product.retailPrice > product.communityPrice) {
        crossedOutPrice = product.retailPrice;
      }
    }
  }

  // 2. Stock Checks
  const isOutOfStock = product.stock <= 0;

  // 3. Handle Add to Cart action
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addToCart(product._id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedPrice = formatCurrency(price);
  const formattedCrossedPrice = crossedOutPrice ? formatCurrency(crossedOutPrice) : null;

  if (variant === 'shop') {
    return (
      <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-[#d5e7fb] bg-white p-2.5 text-[#082B68] shadow-[0_6px_18px_-12px_#0759d640] transition-shadow duration-300 hover:border-[#93baf1] hover:shadow-[0_10px_24px_-12px_#0759d650] sm:p-3.5">
        <div className="relative">
          <Link href={`/product/${product.slug}`} className="block aspect-square overflow-hidden rounded-xl bg-[#F2F8FF] focus-visible:outline-2 focus-visible:outline-[#0759D6] focus-visible:outline-offset-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt={product.name} onError={() => setImgSrc(FALLBACK_IMAGE)} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:scale-100! motion-reduce:transition-none" />
          </Link>
          <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-16px)] flex-col items-start gap-1">
            {product.isBestSeller && <span className="rounded-full bg-[#082B68] px-2 py-1 text-[9px] font-bold leading-tight text-white">Best Seller</span>}
            {product.isNewArrival && <span className="rounded-full bg-[#0759D6] px-2 py-1 text-[9px] font-bold leading-tight text-white">New Arrival</span>}
            {product.isFeatured && !product.isBestSeller && !product.isNewArrival && <span className="rounded-full bg-[#FFC400] px-2 py-1 text-[9px] font-bold leading-tight text-[#071F50]">Popular</span>}
          </div>
        </div>
        <div className="flex flex-1 flex-col pt-3">
          <span className="break-all text-[9px] font-semibold uppercase tracking-wide text-[#64748B] sm:text-[10px]">SKU: {product.sku}</span>
          <Link href={`/product/${product.slug}`} className="mt-1 focus-visible:outline-2 focus-visible:outline-[#0759D6] focus-visible:outline-offset-2">
            <h3 className="line-clamp-2 min-h-[35px] text-[13px] font-bold leading-[1.35] text-[#082B68] transition-colors hover:text-[#0759D6] sm:min-h-[38px] sm:text-sm">{product.name}</h3>
          </Link>
          {product.shortDescription && <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-[#64748B]">{product.shortDescription}</p>}
          <div className="mt-auto pt-3">
            <div className="mb-3 flex flex-wrap items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#0759D6] sm:text-lg">{formattedPrice}</span>
              {formattedCrossedPrice && <span className="text-[11px] font-semibold text-[#64748B] line-through">{formattedCrossedPrice}</span>}
              {priceBadge && <span className="inline-flex items-center gap-1 rounded-full border border-[#bbd7fa] bg-[#F2F8FF] px-2 py-0.5 text-[9px] font-bold text-[#0759D6]"><Sparkles className="h-2.5 w-2.5" />{priceBadge}</span>}
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <button onClick={handleAddToCart} disabled={isOutOfStock} className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#0759D6] focus-visible:outline-offset-2 motion-reduce:transition-none! sm:text-xs ${isOutOfStock ? 'cursor-not-allowed border-[#d5e7fb] bg-[#F2F8FF] text-[#64748B]' : added ? 'border-[#0759D6] bg-[#0759D6] text-white' : 'cursor-pointer border-[#0759D6] bg-white text-[#0759D6] hover:bg-[#DBEDFF]'}`}>
                {added ? <><Check className="h-3.5 w-3.5 shrink-0" /><span>Added</span></> : <><ShoppingCart className="h-3.5 w-3.5 shrink-0" /><span>Add to Cart</span></>}
              </button>
              <Link href={`/product/${product.slug}`} className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent bg-[#FFC400]/70 px-2 py-2 text-[11px] font-bold text-[#071F50] transition-colors hover:bg-[#edb700] focus-visible:outline-2 focus-visible:outline-[#0759D6] focus-visible:outline-offset-2 motion-reduce:transition-none! sm:text-xs">
                <span>View Details</span><ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#0052CC]/40 hover:shadow-lg overflow-hidden flex flex-col justify-between h-full relative transition-all duration-300 p-3.5">
      
      {/* Top Feature Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isBestSeller && (
          <span className="bg-[#1B5E20] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#1B5E20] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            New Arrival
          </span>
        )}
        {product.isFeatured && !product.isBestSeller && !product.isNewArrival && (
          <span className="bg-[#0052CC] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            Popular
          </span>
        )}
      </div>

      {/* Product Image Box with Uniform Aspect-Square Frame */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full flex items-center justify-center bg-[#FAF9F6] rounded-xl overflow-hidden mb-3 group-hover:bg-[#F5F3ED] transition-colors"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content Info */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            SKU: {product.sku}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-gray-900 hover:text-[#0052CC] text-xs sm:text-sm leading-snug line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Pricing & Add to cart button */}
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-[#0052CC]">
              {formattedPrice}
            </span>
            {formattedCrossedPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                {formattedCrossedPrice}
              </span>
            )}
            {priceBadge && (
              <span className="inline-flex items-center gap-0.5 bg-amber-50 text-[#D97706] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200">
                <Sparkles className="w-2.5 h-2.5" />
                {priceBadge}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : added
                ? 'bg-[#1B5E20] text-white shadow-sm'
                : 'border border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white shadow-xs hover:shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <ShoppingCart className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
