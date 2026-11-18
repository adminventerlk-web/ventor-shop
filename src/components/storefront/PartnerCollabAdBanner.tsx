'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Store,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import FeaturedAdvertisementCard from '@/components/ads/FeaturedAdvertisementCard';

const COLLAB_PREVIEW_IMAGES = [
  {
    title: 'Daily Supermarket & Fresh Provisions',
    category: 'Groceries & Household Supplies',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    stat: 'Over 2,500+ Active Islandwide Orders',
  },
  {
    title: 'Ceylon Organic Spices & Agri Exports',
    category: 'Pure Ceylon Spices & Agro Produces',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
    stat: 'Islandwide & International Shipping',
  },
  {
    title: 'Authentic Handloom & Apparel Crafts',
    category: 'Textiles, Garments & Handicrafts',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    stat: 'Master Artisan & Retail Collective',
  },
];

export default function PartnerCollabAdBanner() {
  const [realAds, setRealAds] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [collabImgIdx, setCollabImgIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch real ads from DB for HOMEPAGE_FEATURED
  useEffect(() => {
    async function loadRealAds() {
      try {
        const res = await fetch('/api/ads?placement=HOMEPAGE_FEATURED');
        if (res.ok) {
          const data = await res.json();
          if (data.ads && Array.isArray(data.ads) && data.ads.length > 0) {
            setRealAds(data.ads);
          } else {
            setRealAds([]);
          }
        }
      } catch (err) {
        console.warn('Error fetching homepage ads:', err);
        setRealAds([]);
      }
    }
    loadRealAds();
  }, []);

  // Slide rotation if multiple real ads exist (every 6s)
  useEffect(() => {
    if (isPaused || realAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % realAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, realAds.length]);

  // Collab visual auto-cycling every 3.2s with smooth crossfade
  useEffect(() => {
    if (realAds.length > 0 || isPaused) return;
    const interval = setInterval(() => {
      setCollabImgIdx((prev) => (prev + 1) % COLLAB_PREVIEW_IMAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [realAds.length, isPaused]);

  const hasRealAds = realAds.length > 0;
  const activeAd = hasRealAds ? realAds[currentSlide] : null;
  const activeCollab = COLLAB_PREVIEW_IMAGES[collabImgIdx];

  return (
    <section
      id="partner-collab-ad-section"
      aria-labelledby="partner-ad-heading"
      className="w-full py-3 sm:py-4 px-3 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* ── CASE 1: REAL ADS EXIST (ADMIN CREATED / APPROVED) ── */}
        {hasRealAds && activeAd ? (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="space-y-2.5"
          >
            {/* Multi-Ad Story Pills */}
            {realAds.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <div className="flex items-center gap-1.5 shrink-0 pr-1">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#FFB800] text-[#021838]">
                    <Store className="w-3 h-3 text-[#021838]" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-800">
                    FEATURED ({realAds.length})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-1">
                  {realAds.map((s, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <button
                        key={s._id || idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`group relative flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#021838] text-white border-[#0052CC] shadow-sm'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        <span className="font-black truncate max-w-[120px] sm:max-w-none">
                          {s.businessName || s.shopName}
                        </span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-ping ml-0.5"
                            style={{ backgroundColor: s.accentColor || '#FFB800' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/advertise-with-us"
                  className="shrink-0 hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-[#FFB800]" />
                  <span>+ Advertise</span>
                </Link>
              </div>
            )}

            {/* Render Compact FeaturedAdvertisementCard */}
            <FeaturedAdvertisementCard ad={activeAd} variant="billboard" />

            {/* Bottom Controls if Multiple Ads */}
            {realAds.length > 1 && (
              <div className="flex items-center justify-between px-1 pt-0.5">
                <div className="flex items-center gap-1">
                  {realAds.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        currentSlide === idx ? 'w-6 bg-[#0052CC]' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev - 1 + realAds.length) % realAds.length)
                    }
                    className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % realAds.length)}
                    className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── CASE 2: COMPACT, ELEGANT COLLABORATION BILLBOARD (ENGLISH + AUTO-ANIMATING PHOTOS) ── */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden rounded-2xl border-2 border-[#FFB800] shadow-xl transition-all"
            style={{
              backgroundColor: '#021838',
              backgroundImage:
                'radial-gradient(ellipse at 85% 15%, rgba(0, 82, 204, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255, 184, 0, 0.15) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #052357 50%, #010E24 100%)',
              color: '#ffffff',
            }}
          >
            {/* Top Compact Status Strip */}
            <div className="relative z-10 px-4 pt-3 sm:px-6 sm:pt-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/50 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#FFB800] text-[#021838] shadow-xs">
                  <Megaphone className="w-3.5 h-3.5 text-[#021838]" />
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-[9px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                  <span>MERCHANT PARTNERSHIP & ADVERTISING</span>
                </span>
                <span className="text-[10px] text-blue-200/70 hidden md:inline">• OFFICIAL ADVERTISING PORTAL</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black tracking-wider transition-all shadow-xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>WhatsApp: 077 833 1202</span>
                </a>
              </div>
            </div>

            {/* Main Content Grid (Compact proportions) */}
            <div className="relative z-10 p-4 sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
                {/* Left Column: Commercial Pitch in English */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500 text-[#021838] font-black text-[10px] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>PARTNER WITH VENTERSHOP</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Zero Setup Cost • Verified Seller Portal</span>
                    </span>
                  </div>

                  <h2
                    id="partner-ad-heading"
                    className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight"
                  >
                    Promote Your Shop & Reach 50,000+ Customers Across Sri Lanka
                  </h2>

                  <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed max-w-xl">
                    Are you a retailer, distributor, or brand in Sri Lanka? Partner with VENTERSHOP today.
                    Showcase your products on our homepage billboard and get your own verified virtual storefront with
                    islandwide delivery logistics.
                  </p>

                  {/* 4 Value Pillars in 2x2 Compact Grid */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg pt-0.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFB800] bg-[#01142F]/90 px-3 py-1.5 rounded-lg border border-blue-900/80">
                      <TrendingUp className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                      <span>50,000+ Monthly Shoppers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#01142F]/90 px-3 py-1.5 rounded-lg border border-blue-900/80">
                      <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Dedicated Storefront URL</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#01142F]/90 px-3 py-1.5 rounded-lg border border-blue-900/80">
                      <Zap className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                      <span>Direct Bank Settlements</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#01142F]/90 px-3 py-1.5 rounded-lg border border-blue-900/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Official Verified Badge</span>
                    </div>
                  </div>

                  {/* Compact CTA Buttons */}
                  <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/advertise-with-us"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply For Advertising</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>

                    <Link
                      href="/vendor/register"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
                    >
                      <span>Register Store</span>
                    </Link>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: AUTO-ANIMATING MULTI-IMAGE VISUAL CAROUSEL ── */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border border-[#FFB800] shadow-xl bg-gray-950">
                    {/* Auto-Crossfading Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {COLLAB_PREVIEW_IMAGES.map((item, idx) => (
                        <div
                          key={idx}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            collabImgIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transform scale-100 transition-transform duration-3000 ease-out"
                          />
                        </div>
                      ))}

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#021838]/90 backdrop-blur-md border border-blue-400/40 text-[9px] font-black text-white shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>VERIFIED SELLER NETWORK</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-bold text-[#FFB800]">
                        <span>Photo {collabImgIdx + 1}/3</span>
                      </div>

                      {/* Floating Glassmorphic Partner Card on Image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 p-2.5 bg-[#021838]/95 backdrop-blur-md rounded-xl border border-blue-400/40 flex items-center justify-between shadow-lg">
                        <div className="min-w-0 pr-2">
                          <p className="text-[8px] uppercase font-black text-[#FFB800] tracking-wider truncate">
                            {activeCollab.category}
                          </p>
                          <h4 className="text-xs font-black text-white truncate">{activeCollab.title}</h4>
                          <p className="text-[9px] text-emerald-400 font-semibold truncate">{activeCollab.stat}</p>
                        </div>
                        <Link
                          href="/advertise-with-us"
                          className="px-2.5 py-1.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 shadow-xs"
                        >
                          <span>Advertise</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Interactive Thumbnail Selector & Animated Progress Dots */}
                    <div className="p-2 bg-[#01142F] border-t border-blue-900/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {COLLAB_PREVIEW_IMAGES.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCollabImgIdx(idx)}
                            className={`relative w-12 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                              collabImgIdx === idx
                                ? 'border-[#FFB800] scale-105 shadow-sm'
                                : 'border-white/20 opacity-50 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        {COLLAB_PREVIEW_IMAGES.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              collabImgIdx === idx ? 'w-4 bg-[#FFB800]' : 'w-1.5 bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
