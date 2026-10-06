'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Star, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  badge: { label: string; type: 'best_seller' | 'popular' | 'new' };
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

const DEFAULT_FEATURED: ProductItem[] = [
  {
    _id: 'ceylon-black-tea-500g',
    name: 'Ceylon Black Tea 500g',
    slug: 'ceylon-black-tea-500g',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Pure Ceylon single origin tea',
    price: 8.90,
    rating: 5,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'ceylon-cinnamon-sticks-250g',
    name: 'Ceylon Cinnamon Sticks',
    slug: 'ceylon-cinnamon-sticks-250g',
    badge: { label: 'Popular Export', type: 'popular' },
    description: 'Authentic Alba grade cinnamon',
    price: 9.80,
    rating: 5,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'ponni-rice-5kg',
    name: 'Ponni Rice 5kg',
    slug: 'ponni-rice-5kg',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Premium quality steamed rice',
    price: 12.50,
    rating: 5,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-chicken-feed-10kg',
    name: 'RANI Chicken Feed 10kg',
    slug: 'rani-chicken-feed-10kg',
    badge: { label: 'Popular', type: 'popular' },
    description: 'High nutrition poultry feed',
    price: 11.50,
    rating: 5,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'organic-virgin-coconut-oil-500ml',
    name: 'Virgin Coconut Oil 500ml',
    slug: 'organic-virgin-coconut-oil-500ml',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Cold pressed organic coconut oil',
    price: 7.20,
    rating: 5,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-cow-feed-25kg',
    name: 'RANI Cow Feed 25kg',
    slug: 'rani-cow-feed-25kg',
    badge: { label: 'Popular Feed', type: 'popular' },
    description: 'Complete nutrient feed for cows',
    price: 23.50,
    rating: 5,
    reviewsCount: 87,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'whole-spices-pack-1kg',
    name: 'Organic Whole Spices Pack',
    slug: 'whole-spices-pack-1kg',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'Assorted premium aromatic spices',
    price: 15.40,
    rating: 5,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'sun-flower-oil-1l',
    name: 'Sun Flower Oil 1L',
    slug: 'sun-flower-oil-1l',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure sunflower oil',
    price: 4.50,
    rating: 5,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'wireless-headphones',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'High quality sound & bass',
    price: 24.90,
    rating: 5,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'soft-blankets',
    name: 'Soft Blankets',
    slug: 'soft-blankets',
    badge: { label: 'Popular', type: 'popular' },
    description: 'Warm & comfortable fleece',
    price: 18.90,
    rating: 5,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'traditional-handloom-bedsheet',
    name: 'Ceylon Handloom Bedsheet',
    slug: 'traditional-handloom-bedsheet',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure cotton handcrafted',
    price: 22.00,
    rating: 5,
    reviewsCount: 99,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'stainless-kitchen-set',
    name: 'Stainless Cookware Set',
    slug: 'stainless-kitchen-set',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'Durable multi-piece cookware',
    price: 45.00,
    rating: 5,
    reviewsCount: 43,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FeaturedProducts() {
  const { language } = useTranslation();
  const { addToCart } = useCart();
  const [products] = useState<ProductItem[]>(DEFAULT_FEATURED);

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod._id, 1);
  };

  return (
    <section id="featured-products" className="pt-6 pb-12 bg-[#F8FAFC] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0052CC] rounded-xl text-[#FFB800] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#021838] tracking-tight">
                {language === 'ta' ? 'சிறப்பு தயாரிப்புகள்' : language === 'si' ? 'විශේෂිත නිෂ්පාදන' : 'FEATURED PRODUCTS'}
              </h2>
              <p className="text-xs font-semibold text-gray-500">
                {language === 'ta' ? 'அதிகமாக விற்பனையாகும் மற்றும் சிறந்த சலுகைகள்' : 'Best selling products & top quality imports'}
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0052CC] hover:text-[#003893] transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
          >
            <span>{language === 'ta' ? 'அனைத்து தயாரிப்புகளும்' : 'View All Products'} →</span>
          </Link>
        </div>

        {/* 12 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {products.map((prod) => {
            const isBestSeller = prod.badge.type === 'best_seller';
            const isPopular = prod.badge.type === 'popular';

            return (
              <div
                key={prod._id}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#0052CC] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group p-3 relative"
              >
                {/* Badge top-left */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white shadow-sm ${
                      isBestSeller ? 'bg-[#0052CC]' : isPopular ? 'bg-[#FF9900] text-[#021838]' : 'bg-[#10B981]'
                    }`}
                  >
                    {prod.badge.label}
                  </span>
                </div>

                {/* Image Container */}
                <Link
                  href={`/product/${prod.slug}`}
                  className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 relative"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="pt-3 space-y-1.5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[10px] font-bold text-gray-600">5.0</span>
                    </div>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="text-xs font-bold text-gray-900 group-hover:text-[#0052CC] transition-colors line-clamp-1 block leading-snug"
                    >
                      {prod.name}
                    </Link>
                    <p className="text-[10px] text-gray-500 line-clamp-1 font-medium mt-0.5">
                      {prod.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-1">
                    <p className="text-sm sm:text-base font-black text-[#0052CC]">
                      {formatCurrency(prod.price)}
                    </p>
                  </div>

                  {/* Add to Cart Solid Button */}
                  <div className="pt-2">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="w-full py-2 px-2 bg-[#0052CC] hover:bg-[#003893] text-white transition-all rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
