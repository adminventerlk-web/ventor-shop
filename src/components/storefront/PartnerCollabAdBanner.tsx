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
} from 'lucide-react';
import FeaturedAdvertisementCard from '@/components/ads/FeaturedAdvertisementCard';

export default function PartnerCollabAdBanner() {
  const [realAds, setRealAds] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const hasRealAds = realAds.length > 0;
  const activeAd = hasRealAds ? realAds[currentSlide] : null;

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
          /* ── CASE 2: NO DUMMY ADS — OFFICIAL OUT-OF-THE-BOX COLLABORATION BILLBOARD ── */
          <div
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

            {/* Top Bar */}
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

            {/* Collaboration Pitch Grid */}
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
                    Are you a business owner, producer, or retailer? Reach over{' '}
                    <strong className="text-[#FFB800]">50,000+ active shoppers</strong> across Sri Lanka.
                    Get verified virtual storefronts, automated payments, delivery network, and prime
                    homepage billboard showcase.
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
                      <span>Chat on WhatsApp</span>
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

                {/* Right Column: Holographic Collaboration Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#01142F]/95 to-[#021838]/95 border-2 border-[#FFB800] shadow-2xl space-y-5 text-center overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052CC] to-[#021838] border-2 border-[#FFB800] flex items-center justify-center mx-auto text-[#FFB800] shadow-xl">
                      <Briefcase className="w-8 h-8 text-[#FFB800]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB800] block mb-1">
                        VENTERSHOP ADVERTISING MARKETPLACE
                      </span>
                      <h3 className="text-xl font-black text-white">வணிக கூட்டாண்மை விளம்பரம்</h3>
                      <p className="text-xs text-blue-200/80 mt-1 max-w-xs mx-auto leading-relaxed">
                        உங்கள் வணிகத்திற்கான விளம்பரத்தை முகப்புப் பக்கத்தில் இடம்பெறச் செய்ய இப்போதே விண்ணப்பிக்கவும்.
                      </p>
                    </div>

                    <div className="bg-[#021838] border border-blue-900/80 rounded-2xl p-4 text-left space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span className="text-gray-400">Target Coverage</span>
                        <span className="text-white font-black">All 9 Provinces, Sri Lanka</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span className="text-gray-400">Store Setup Fee</span>
                        <span className="text-emerald-400 font-black">LKR 0.00 (Free Setup)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span className="text-gray-400">Merchant Helpline</span>
                        <span className="text-[#FFB800] font-mono font-black">+94 77 833 1202</span>
                      </div>
                    </div>

                    <Link
                      href="/advertise-with-us"
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0052CC] to-[#021838] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer border border-[#FFB800]/50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Advertisement Request →</span>
                    </Link>
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
