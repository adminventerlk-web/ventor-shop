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

        {/* Shops Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0052CC]/50 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  <div>
                    {/* Banner Image */}
                    <div className="relative h-36 w-full bg-gray-100 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${banner}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#021838]/90 backdrop-blur-xs text-[#FFB800] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#FFB800]/30 shadow-xs">
                          {shop.category}
                        </span>
                      </div>

                      {/* City Location */}
                      <div className="absolute bottom-2.5 right-3 text-white text-[11px] font-bold flex items-center gap-1 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>{shop.city}, Sri Lanka</span>
                      </div>
                    </div>

                    {/* Logo & Content */}
                    <div className="p-5 pt-0 relative">
                      {/* Overlapping Logo */}
                      <div className="relative -mt-8 mb-3 w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${logo}')` }}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-[#021838] group-hover:text-[#0052CC] transition-colors leading-snug">
                            {shop.shopName}
                          </h3>
                          <span title="Super Admin Verified">
                            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {shop.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-[11px] font-bold text-gray-500">
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <strong className="text-gray-800">{shop.rating || 4.9}</strong>
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3 text-[#0052CC]" />
                            <span>Verified Products</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with "Shop Now" Button */}
                  <div className="p-5 pt-3 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      href={`/shops/${shop.slug}`}
                      className="w-full py-2.5 px-4 bg-[#0052CC] hover:bg-[#003893] group-hover:bg-[#021838] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md cursor-pointer"
                    >
                      <span>
                        {isTa
                          ? 'இப்போதே வாங்கு (Shop Now)'
                          : isSi
                          ? 'දැන් සාප්පු යන්න'
                          : 'Shop Now'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
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

