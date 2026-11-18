'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';
import AdvertisementImageGallery from './AdvertisementImageGallery';
import { IAdvertisement } from '@/models/Advertisement';

interface FeaturedAdvertisementCardProps {
  ad: IAdvertisement | any;
  variant?: 'billboard' | 'compact' | 'marketplace';
}

export default function FeaturedAdvertisementCard({
  ad,
  variant = 'billboard',
}: FeaturedAdvertisementCardProps) {
  const images = ad.images && ad.images.length > 0 ? ad.images : ['/images/hero_banner.png'];
  const accentColor = ad.accentColor || '#FFB800';
  const destination = ad.destinationUrl || ad.ctaLink || '/virtual-shops';
  const shopName = ad.businessName || ad.shopName || 'Partner Store';
  const category = ad.category || ad.shopCategory || 'General Merchandise';
  const ctaText = ad.ctaText || 'Visit Shop';

  // Validity text calculation
  let validityText = '';
  if (ad.endDate) {
    const end = new Date(ad.endDate);
    if (!isNaN(end.getTime())) {
      validityText = `Valid until ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
  }

  return (
    <article
      className="relative overflow-hidden rounded-3xl border-2 transition-all duration-300 shadow-2xl group"
      style={{
        backgroundColor: '#021838',
        borderColor: accentColor,
        backgroundImage:
          'radial-gradient(ellipse at 85% 20%, rgba(0, 82, 204, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 15% 90%, rgba(255, 184, 0, 0.12) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #051F4A 50%, #010E24 100%)',
        color: '#ffffff',
      }}
    >
      {/* Top Merchant Identity Header Strip */}
      <div className="px-5 pt-4 sm:px-8 sm:pt-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50 pb-3.5">
        <div className="flex items-center gap-3">
          {/* Shop Logo / Avatar */}
          {ad.shopLogo ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.shopLogo} alt={shopName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-[#021838] shadow-sm shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Store className="w-5 h-5 text-[#021838]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base text-white tracking-tight">{shopName}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Partner</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-blue-200/80">{category}</p>
          </div>
        </div>

        {/* Validity / Discount Badge */}
        <div className="flex items-center gap-2">
          {ad.offerPill && (
            <span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black tracking-wide shadow-xs">
              {ad.offerPill}
            </span>
          )}
          {validityText && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              <Calendar className="w-3 h-3 text-[#FFB800]" />
              <span>{validityText}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Copy (Left) + Dynamic Multi-Image Gallery (Right) */}
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Commercial Story & Value Offer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-gray-900 shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{ad.badge || 'Official Partner Spotlight'}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-200/90 bg-[#01142F] px-2.5 py-1 rounded-xl border border-blue-900">
                <Sparkles className="w-3 h-3 text-[#FFB800]" />
                <span>{ad.rating || '4.9 ★ Top Rated'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              {ad.title}
            </h2>

            <p className="text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
              {ad.description || ad.tagline}
            </p>

            {/* Highlights Strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-black text-[#FFB800] bg-[#01142F]/90 px-3.5 py-2 rounded-xl border border-blue-900/80 shadow-xs">
                <TrendingUp className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{ad.highlightStat || '50K+ Monthly Shoppers Reached'}</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={destination}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/advertise-with-us"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Promote Your Shop</span>
              </Link>
            </div>
          </div>

          {/* Right Column: DYNAMIC MULTI-IMAGE GALLERY (1, 2, 3, 4, 5+ layout) */}
          <div className="lg:col-span-6">
            <AdvertisementImageGallery
              images={images}
              title={ad.title}
              aspectRatioPreference={ad.aspectRatioPreference || 'AUTO'}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
