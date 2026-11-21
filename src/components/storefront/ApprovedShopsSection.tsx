'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Store,
  MapPin,
  ArrowRight,
  BadgeCheck,
  Star,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface IApprovedShop {
  _id: string;
  shopName: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating?: number;
  totalProducts?: number;
}

export default function ApprovedShopsSection() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  const [shops, setShops] = useState<IApprovedShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShops() {
      try {
        const res = await fetch('/api/shops');
        if (res.ok) {
          const data = await res.json();
          setShops(data.shops || []);
        }
      } catch (err) {
        console.error('Failed to load approved shops:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShops();
  }, []);

  if (!loading && shops.length === 0) {
    return null; // Don't render empty section
  }

  return (
    <section id="partner-shops-section" className="w-full py-10 sm:py-14 bg-gradient-to-b from-[#F4F7FC] to-white border-y border-gray-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#0052CC]/10 text-[#0052CC]">
                <Store className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0052CC]">
                {isTa
                  ? 'சரிபார்க்கப்பட்ட விற்பனையாளர்கள்'
                  : isSi
                  ? 'තහවුරු කළ සාප්පු'
                  : 'Verified Marketplace Sellers'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#021838] tracking-tight">
              {isTa
                ? 'அங்கீகரிக்கப்பட்ட சிறப்பு கடைகள்'
                : isSi
                ? 'අනුමත හවුල්කාර වෙළඳසැල්'
                : 'Approved Partner Shops & Stores'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
              {isTa
                ? 'எங்கள் சூப்பர் அட்மினால் அங்கீகரிக்கப்பட்ட உள்ளூர் உற்பத்தியாளர்கள் மற்றும் சிறப்பு கடைகளில் இருந்து நேரடியாக வாங்கவும்.'
                : isSi
                ? 'අපගේ සුපිරි පරිපාලක විසින් අනුමත කරන ලද දේශීය නිෂ්පාදකයින්ගෙන් සෘජුවම මිලදී ගන්න.'
                : 'Shop directly from certified local vendors, organic spice growers, and specialty merchants verified by VENTERSHOP.'}
            </p>
          </div>

          <Link
            href="/shops"
            className="text-xs font-bold text-[#0052CC] hover:text-[#003893] flex items-center gap-1.5 transition-colors group shrink-0"
          >
            <span>{isTa ? 'அனைத்து கடைகளும்' : isSi ? 'සියලු වෙළඳසැල්' : 'Explore All Stores'}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Shops Grid - Compact, Product-Card Sized Grid (2 columns on mobile!) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {shops.map((shop) => {
              const banner =
                shop.bannerUrl ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
              const logo =
                shop.logoUrl ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={shop._id}
                  className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0052CC]/50 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-0.5"
                >
                  <div>
                    {/* Banner Image - Compact product card proportion */}
                    <div className="relative h-20 sm:h-28 w-full bg-gray-100 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${banner}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                        <span className="bg-[#021838]/90 backdrop-blur-xs text-[#FFB800] text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border border-[#FFB800]/30 shadow-xs">
                          {shop.category}
                        </span>
                      </div>

                      {/* City Location */}
                      <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-white text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 drop-shadow-sm">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFB800]" />
                        <span className="truncate max-w-[80px] sm:max-w-none">{shop.city}</span>
                      </div>
                    </div>

                    {/* Logo & Content - Compact Padding */}
                    <div className="p-3 sm:p-4 pt-0 relative">
                      {/* Overlapping Logo */}
                      <div className="relative -mt-5 sm:-mt-6 mb-2 sm:mb-2.5 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${logo}')` }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <h3 className="text-xs sm:text-sm font-black text-[#021838] group-hover:text-[#0052CC] transition-colors leading-tight truncate">
                            {shop.shopName}
                          </h3>
                          <span title="Super Admin Verified">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        </div>

                        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                          {shop.description}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5 text-[9px] sm:text-[10px] font-bold text-gray-500">
                          <span className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <strong className="text-gray-800">{shop.rating || 4.9}</strong>
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 flex items-center gap-0.5 truncate">
                            <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0052CC]" />
                            <span>Catalog</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with "Shop Now" Button */}
                  <div className="p-3 sm:p-3.5 pt-2 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      href={`/shops/${shop.slug}`}
                      className="w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-[#0052CC] hover:bg-[#003893] group-hover:bg-[#021838] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs group-hover:shadow-sm cursor-pointer"
                    >
                      <span>
                        {isTa
                          ? 'வாங்கு (Shop)'
                          : isSi
                          ? 'සාප්පු'
                          : 'Shop Now'}
                      </span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

