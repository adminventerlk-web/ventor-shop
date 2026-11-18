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
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import FeaturedAdvertisementCard from '@/components/ads/FeaturedAdvertisementCard';

const COLLAB_PREVIEW_IMAGES = [
  {
    title: 'Daily Supermarket & Provisions',
    category: 'Groceries & Household',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    stat: 'Over 2,500+ Daily Orders',
  },
  {
    title: 'Ceylon Organic Spices & Exports',
    category: 'Agri Exports & Spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
    stat: 'Islandwide & Global Dispatch',
  },
  {
    title: 'Authentic Handloom & Apparel',
    category: 'Textiles & Handicrafts',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    stat: 'Master Artisan Collective',
  },
];

export default function PartnerCollabAdBanner() {
  const [realAds, setRealAds] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [collabImgIdx, setCollabImgIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real ads from DB for HOMEPAGE_FEATURED
  useEffect(() => {
    async function loadRealAds() {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
    loadRealAds();
  }, []);

  // Slide rotation if multiple real ads exist
  useEffect(() => {
    if (isPaused || realAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % realAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, realAds.length]);

  // Collab showcase auto-cycling every 3.5 seconds
  useEffect(() => {
    if (realAds.length > 0 || isPaused) return;
    const interval = setInterval(() => {
      setCollabImgIdx((prev) => (prev + 1) % COLLAB_PREVIEW_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [realAds.length, isPaused]);

  const hasRealAds = realAds.length > 0;
  const activeAd = hasRealAds ? realAds[currentSlide] : null;
  const activeCollab = COLLAB_PREVIEW_IMAGES[collabImgIdx];

  return (
    <section
      id="partner-collab-ad-section"
      aria-labelledby="partner-ad-heading"
      className="w-full py-6 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* ── CASE 1: REAL ADS EXIST (ADMIN CREATED / APPROVED) ── */}
        {hasRealAds && activeAd ? (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="space-y-3"
          >
            {/* Multi-Ad Story Tabs */}
            {realAds.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <div className="flex items-center gap-2 shrink-0 pr-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFB800] text-[#021838] shadow-xs">
                    <Store className="w-3.5 h-3.5 text-[#021838]" />
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-800">
                    FEATURED PROMOTIONS ({realAds.length})
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {realAds.map((s, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <button
                        key={s._id || idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#021838] text-white border-[#0052CC] shadow-md ring-1 ring-[#0052CC]/50'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        <Store
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-[#FFB800]' : 'text-gray-400'
                          }`}
                        />
                        <span className="font-black truncate max-w-[140px] sm:max-w-none">
                          {s.businessName || s.shopName}
                        </span>
                        {isActive && (
                          <span
                            className="w-2 h-2 rounded-full animate-ping ml-0.5"
                            style={{ backgroundColor: s.accentColor || '#FFB800' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/advertise-with-us"
                  className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>+ Advertise With Us</span>
                </Link>
              </div>
            )}

            {/* Render dynamically adapted FeaturedAdvertisementCard */}
            <FeaturedAdvertisementCard ad={activeAd} variant="billboard" />

            {/* Bottom Controls if Multiple Ads */}
            {realAds.length > 1 && (
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-1.5">
                  {realAds.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 transition-all rounded-full cursor-pointer ${
                        currentSlide === idx ? 'w-8 bg-[#0052CC]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev - 1 + realAds.length) % realAds.length)
                    }
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                    aria-label="Previous ad"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % realAds.length)}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                    aria-label="Next ad"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── CASE 2: HIGH-IMPACT VISUAL COLLABORATION BILLBOARD WITH ATTRACTIVE IMAGERY ── */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden rounded-3xl border-2 border-[#FFB800] shadow-2xl transition-all duration-500"
            style={{
              backgroundColor: '#021838',
              backgroundImage:
                'radial-gradient(ellipse at 85% 15%, rgba(0, 82, 204, 0.45) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255, 184, 0, 0.2) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #052357 50%, #010E24 100%)',
              color: '#ffffff',
            }}
          >
            {/* Ambient Lighting */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0052CC]/35 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status Strip */}
            <div className="relative z-10 px-5 pt-4 sm:px-8 sm:pt-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#FFB800] text-[#021838] shadow-sm">
                  <Megaphone className="w-4 h-4 text-[#021838]" />
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-[10px] font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                    <span>MERCHANT COLLABORATION OPPORTUNITY</span>
                  </span>
                  <span className="text-[11px] font-bold text-blue-200/80 hidden sm:inline">
                    வணிக கூட்டாண்மை விளம்பரம்
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black tracking-wider transition-all shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp: 077 833 1202</span>
                </a>
              </div>
            </div>

            {/* Main Collaboration Pitch Grid */}
            <div className="relative z-10 p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Commercial Pitch */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-[#021838] font-black text-xs uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>GROW WITH VENTERSHOP</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-xl">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Zero Setup Cost • Verified Seller Portal</span>
                    </span>
                  </div>

                  <h2
                    id="partner-ad-heading"
                    className="text-2xl sm:text-3xl lg:text-4.5xl font-black text-white leading-tight tracking-tight"
                  >
                    உங்கள் கடையை VENTERSHOP-ல் இணைத்து வணிகத்தை நாடு முழுவதும் விரிவுபடுத்துங்கள்!
                  </h2>

                  <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-xl">
                    Are you a store owner, distributor, or brand in Sri Lanka? Reach over{' '}
                    <strong className="text-[#FFB800]">50,000+ active shoppers</strong> with your dedicated
                    online storefront, multi-vendor logistics, and prime homepage billboard promotion.
                  </p>

                  {/* 4 Value Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-lg">
                    <div className="flex items-center gap-2 text-xs font-black text-[#FFB800] bg-[#01142F]/90 px-3.5 py-2.5 rounded-xl border border-blue-900/80 shadow-xs">
                      <TrendingUp className="w-4 h-4 text-[#FFB800] shrink-0" />
                      <span>50,000+ Monthly Shoppers</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#01142F]/90 px-3.5 py-2.5 rounded-xl border border-blue-900/80 shadow-xs">
                      <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Custom Virtual Storefront</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#01142F]/90 px-3.5 py-2.5 rounded-xl border border-blue-900/80 shadow-xs">
                      <Zap className="w-4 h-4 text-[#FFB800] shrink-0" />
                      <span>Instant Direct Bank Payouts</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#01142F]/90 px-3.5 py-2.5 rounded-xl border border-blue-900/80 shadow-xs">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Official Verified Vendor Badge</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href="/advertise-with-us"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apply For Advertising</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>WhatsApp Direct (+94)</span>
                    </a>

                    <Link
                      href="/vendor/register"
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-[#FFB800]" />
                      <span>Register Store</span>
                    </Link>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: HIGH-IMPACT VISUAL SHOWCASE CARD WITH MULTI-IMAGE GALLERY ── */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFB800] shadow-2xl bg-gray-950 group">
                    {/* Main Image Showcase */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={activeCollab.image}
                        src={activeCollab.image}
                        alt={activeCollab.title}
                        className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-106 animate-fadeIn"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#021838]/85 backdrop-blur-md border border-blue-400/30 text-[10px] font-black text-white shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>VERIFIED MERCHANT NETWORK</span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#FFB800] shadow-md">
                        <TrendingUp className="w-3 h-3 text-[#FFB800]" />
                        <span>50K+ Monthly Reach</span>
                      </div>

                      {/* Floating Glassmorphic Partner Card on Image */}
                      <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-[#021838]/95 backdrop-blur-lg rounded-2xl border border-blue-400/40 flex items-center justify-between shadow-2xl">
                        <div>
                          <p className="text-[9px] uppercase font-black text-[#FFB800] tracking-widest">
                            {activeCollab.category}
                          </p>
                          <h4 className="text-sm font-black text-white">{activeCollab.title}</h4>
                          <p className="text-[10px] text-emerald-400 font-bold">{activeCollab.stat}</p>
                        </div>
                        <Link
                          href="/advertise-with-us"
                          className="px-3.5 py-2 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-md shrink-0 cursor-pointer"
                        >
                          <span>Advertise</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Interactive Thumbnail Selector Strip Below Main Image */}
                    <div className="p-3 bg-[#01142F] border-t border-blue-900/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {COLLAB_PREVIEW_IMAGES.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCollabImgIdx(idx)}
                            className={`relative w-14 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              collabImgIdx === idx
                                ? 'border-[#FFB800] scale-105 shadow-md'
                                : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <span className="text-[10px] font-bold text-blue-200/70 hidden sm:inline">
                        Click photo to preview
                      </span>
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
