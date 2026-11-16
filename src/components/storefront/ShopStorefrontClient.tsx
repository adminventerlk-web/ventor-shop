'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  BadgeCheck,
  Search,
  ShoppingCart,
  Check,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IShopClientProps {
  shop: any;
  initialProducts: any[];
}

export default function ShopStorefrontClient({ shop, initialProducts }: IShopClientProps) {
  const { addToCart } = useCart();
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const banner =
    shop.bannerUrl ||
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80';
  const logo =
    shop.logoUrl ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';

  const cleanPhone = shop.ownerPhone?.replace(/[^0-9]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hello ${shop.shopName}, I found your store on VENTERSHOP and would like to inquire about your products.`
      )}`
    : null;

  const handleQuickAdd = (product: any) => {
    const defaultVariant = product.variants?.[0];
    const itemPrice = defaultVariant ? defaultVariant.price : product.retailPrice;
    addToCart(
      product._id,
      1,
      defaultVariant?.name,
      itemPrice,
      {
        name: product.name,
        image: defaultVariant?.image || product.images?.[0],
        price: itemPrice,
      }
    );
    setAddedMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  const filteredProducts = initialProducts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pb-16">
      {/* 1. SHOP HERO BANNER */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-[#021838] overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-[#021838]/60 to-black/30" />
      </div>

      {/* 2. SHOP INFO HEADER CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Logo + Store Title & Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${logo}')` }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#021838] tracking-tight">
                    {shop.shopName}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified Store
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
                  {shop.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-gray-500 font-bold">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <strong className="text-gray-800">{shop.rating || 4.9}</strong>
                    <span className="text-gray-400 font-normal">(Verified Merchant)</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-[#0052CC]">
                    <Store className="w-3.5 h-3.5" />
                    <span>{shop.category}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
                    <span>{shop.city}, Sri Lanka</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-150">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Shop</span>
                </a>
              )}

              {shop.ownerPhone && (
                <a
                  href={`tel:${shop.ownerPhone}`}
                  className="px-3.5 py-2.5 bg-[#F4F7FC] hover:bg-gray-200 border border-gray-200 text-[#021838] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-[#0052CC]" />
                  <span>Call Store</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. STORE PRODUCTS CATALOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-[#021838]">
              {isTa ? 'கடையின் பொருட்கள்' : 'Store Products'}
            </h2>
            <p className="text-xs text-gray-500">
              Showing {filteredProducts.length} certified items available for delivery
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products in this store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#0052CC]"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const displayImg =
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
              const variants = product.variants || [];
              const isAdded = addedMap[product._id];

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-[#0052CC]/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${displayImg}')` }}
                      />
                      {variants.length > 0 && (
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-[#021838]/90 backdrop-blur-xs text-[#FFB800] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#FFB800]/30 shadow-xs">
                            {variants.length} Sizes / Options
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        SKU: {product.sku}
                      </span>
                      <h3 className="font-bold text-sm text-[#021838] group-hover:text-[#0052CC] transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>

                      <div className="pt-2 flex items-baseline gap-1.5">
                        <span className="text-base font-black text-[#021838]">
                          {formatCurrency(product.retailPrice)}
                        </span>
                        {variants.length > 0 && (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            (from {formatCurrency(Math.min(...variants.map((v: any) => v.price)))})
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 pt-0">
                    {variants.length > 0 ? (
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full py-2 bg-[#F4F7FC] hover:bg-[#0052CC] hover:text-white text-[#0052CC] border border-[#0052CC]/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Select Size & Buy</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0052CC] hover:bg-[#003893] text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

