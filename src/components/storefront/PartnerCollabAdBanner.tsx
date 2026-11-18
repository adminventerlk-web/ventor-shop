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
  Mail,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  PhoneCall,
  Clock,
  Compass,
  Building2,
  Users,
  Briefcase,
  Star,
} from 'lucide-react';

export interface IAdSlide {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  images: string[];
  shopName: string;
  shopCategory: string;
  highlightStat: string;
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  offerPill?: string;
  rating?: string;
}

export default function PartnerCollabAdBanner() {
  const [realAds, setRealAds] = useState<IAdSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Groceries & Provisions');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real ads from DB
  useEffect(() => {
    async function loadRealAds() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/ads');
        if (res.ok) {
          const data = await res.json();
          if (data.ads && Array.isArray(data.ads) && data.ads.length > 0) {
            const formatted: IAdSlide[] = data.ads.map((ad: any) => ({
              id: ad._id,
              badge: ad.badge || 'Official Partner Spotlight',
              title: ad.title,
              tagline: ad.tagline,
              images: Array.isArray(ad.images) && ad.images.length > 0
                ? ad.images
                : ['/images/hero_banner.png'],
              shopName: ad.shopName,
              shopCategory: ad.shopCategory || 'Partner Merchant',
              highlightStat: ad.highlightStat || 'Featured Verified Merchant',
              ctaText: ad.ctaText || 'Visit Partner Store',
              ctaLink: ad.ctaLink || '/virtual-shops',
              accentColor: ad.accentColor || '#FFB800',
              offerPill: ad.offerPill || '🔥 Verified Partner',
              rating: ad.rating || '4.9 ★ Verified Partner',
            }));
            setRealAds(formatted);
          } else {
            setRealAds([]);
          }
        }
      } catch (err) {
        console.warn('Error fetching ads, displaying collaboration billboard:', err);
        setRealAds([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadRealAds();
  }, []);

  // Reset internal image index and progress when slide changes
  useEffect(() => {
    setCurrentImageIdx(0);
    setProgress(0);
  }, [currentSlide]);

  // Smooth progress bar tick & Slide rotation (if multiple real ads exist)
  useEffect(() => {
    if (isPaused || realAds.length <= 1) return;

    const interval = 50;
    const totalDuration = 6000;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % realAds.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, realAds.length]);

  // Multi-image cycling inside active real ad (every 2.6s)
  useEffect(() => {
    if (realAds.length === 0) return;
    const active = realAds[currentSlide];
    if (!active || !active.images || active.images.length <= 1 || isPaused) return;

    const imgInterval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % active.images.length);
    }, 2600);

    return () => clearInterval(imgInterval);
  }, [currentSlide, realAds, isPaused]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const hasRealAds = realAds.length > 0;
  const activeAd = hasRealAds ? realAds[currentSlide] : null;
  const activeImage =
    activeAd && activeAd.images && activeAd.images.length > 0
      ? activeAd.images[currentImageIdx] || activeAd.images[0]
      : '';

  return (
    <section
      id="partner-collab-ad-section"
      aria-labelledby="partner-ad-heading"
      className="w-full py-6 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* ── CASE 1: REAL ADS EXIST (ADMIN CREATED) ── */}
        {hasRealAds && activeAd ? (
          <>
            {/* Top Interactive Merchant Story Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2 shrink-0 pr-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFB800] text-[#021838] shadow-xs">
                  <Store className="w-3.5 h-3.5 text-[#021838]" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-800">
                  PARTNER STORES ({realAds.length})
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1">
                {realAds.map((s, idx) => {
                  const isActive = currentSlide === idx;
                  return (
                    <button
                      key={s.id || idx}
                      onClick={() => {
                        setCurrentSlide(idx);
                        setProgress(0);
                      }}
                      className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#021838] text-white border-[#0052CC] shadow-md ring-1 ring-[#0052CC]/50'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <Store className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB800]' : 'text-gray-400'}`} />
                      <span className="font-black truncate max-w-[140px] sm:max-w-none">{s.shopName}</span>
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

              <button
                onClick={() => {
                  setSubmitted(false);
                  setInquiryModalOpen(true);
                }}
                className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>+ Advertise Shop</span>
              </button>
            </div>

            {/* Main Ad Billboard */}
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative overflow-hidden rounded-3xl border-2 shadow-2xl transition-all duration-500"
              style={{
                backgroundColor: '#021838',
                borderColor: activeAd.accentColor || '#FFB800',
                backgroundImage:
                  'radial-gradient(ellipse at 85% 20%, rgba(0, 82, 204, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 15% 90%, rgba(255, 184, 0, 0.15) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #051F4A 50%, #010E24 100%)',
                color: '#ffffff',
              }}
            >
              {/* Top Progress Bar */}
              {realAds.length > 1 && (
                <div className="relative w-full h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full transition-all duration-75 ease-linear"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: activeAd.accentColor || '#FFB800',
                      boxShadow: `0 0 10px ${activeAd.accentColor || '#FFB800'}`,
                    }}
                  />
                </div>
              )}

              {/* Ambient Glows */}
              <div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
                style={{ backgroundColor: activeAd.accentColor || '#FFB800' }}
              />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0052CC]/30 rounded-full blur-3xl pointer-events-none" />

              {/* Header Strip */}
              <div className="relative z-10 px-5 pt-4 sm:px-8 sm:pt-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#FFB800] text-[#021838] shadow-sm">
                    <Megaphone className="w-4 h-4 text-[#021838]" />
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE PARTNER AD</span>
                    </span>
                    <span className="text-[11px] font-bold text-blue-200/90 hidden sm:inline">
                      வணிக கூட்டாண்மை விளம்பரம்
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white text-[11px] font-black border border-white/20 transition-all cursor-pointer shadow-xs group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB800] group-hover:text-[#021838]" />
                    <span>Advertise Your Shop</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative z-10 p-5 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left Column: Brand Story */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-gray-900 shadow-sm"
                        style={{ backgroundColor: activeAd.accentColor || '#FFB800' }}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{activeAd.badge}</span>
                      </div>

                      {activeAd.offerPill && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black tracking-wide">
                          <span>{activeAd.offerPill}</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-200/90 bg-[#01142F] px-2.5 py-1 rounded-xl border border-blue-900">
                        <Store className="w-3 h-3 text-[#FFB800]" />
                        <span>{activeAd.shopCategory}</span>
                      </div>
                    </div>

                    <h2
                      id="partner-ad-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight transition-all duration-300"
                    >
                      {activeAd.title}
                    </h2>

                    <p className="text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed max-w-xl">
                      {activeAd.tagline}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-lg">
                      <div className="flex items-center gap-2 text-xs font-black text-[#FFB800] bg-[#01142F]/90 px-3.5 py-2 rounded-xl border border-blue-900/80 shadow-xs">
                        <TrendingUp className="w-4 h-4 text-[#FFB800] shrink-0" />
                        <span className="truncate">{activeAd.highlightStat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#01142F]/90 px-3.5 py-2 rounded-xl border border-blue-900/80 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{activeAd.rating || '4.9 ★ Verified Partner'}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <Link
                        href={activeAd.ctaLink}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <span>{activeAd.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setInquiryModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-sm"
                      >
                        <Mail className="w-4 h-4 text-[#FFB800]" />
                        <span>Promote Your Store</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase */}
                  <div className="lg:col-span-5 relative">
                    <div
                      className="relative rounded-3xl overflow-hidden border-2 shadow-2xl group aspect-[4/3] bg-gray-950 transition-all duration-500"
                      style={{
                        borderColor: activeAd.accentColor || '#FFB800',
                        boxShadow: `0 20px 40px -15px ${activeAd.accentColor || '#FFB800'}40`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={activeImage}
                        src={activeImage}
                        alt={activeAd.title}
                        className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-106 animate-fadeIn"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-black/20 to-transparent pointer-events-none" />

                      {activeAd.images && activeAd.images.length > 1 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                          <span className="text-[10px] font-black text-white tracking-wider">
                            PHOTO {currentImageIdx + 1} OF {activeAd.images.length}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-[#021838]/85 backdrop-blur-md px-3 py-1 rounded-full border border-blue-400/30 shadow-md flex items-center gap-1 text-[10px] font-bold text-white">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Store</span>
                      </div>

                      {/* Interactive Thumbnails */}
                      {activeAd.images && activeAd.images.length > 1 && (
                        <div className="absolute bottom-16 left-3 right-3 flex items-center gap-2 z-20 overflow-x-auto pb-1 scrollbar-none">
                          {activeAd.images.map((imgUrl, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setCurrentImageIdx(i)}
                              className={`relative w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                currentImageIdx === i
                                  ? 'border-[#FFB800] scale-105 shadow-md'
                                  : 'border-white/40 opacity-70 hover:opacity-100'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Floating Glass Card */}
                      <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#021838]/95 backdrop-blur-lg rounded-2xl border border-blue-400/40 flex items-center justify-between shadow-2xl z-20">
                        <div>
                          <p className="text-[9px] uppercase font-black text-[#FFB800] tracking-widest">
                            {activeAd.shopCategory}
                          </p>
                          <h4 className="text-sm font-black text-white truncate max-w-[170px] sm:max-w-[210px]">
                            {activeAd.shopName}
                          </h4>
                        </div>
                        <Link
                          href={activeAd.ctaLink}
                          className="px-3.5 py-1.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm shrink-0"
                        >
                          <span>Explore Shop</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Navigation Arrows if Multiple Real Ads */}
                    {realAds.length > 1 && (
                      <div className="flex items-center justify-between mt-3 px-1">
                        <div className="flex items-center gap-1.5">
                          {realAds.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrentSlide(idx);
                                setProgress(0);
                              }}
                              className={`h-2 transition-all rounded-full cursor-pointer ${
                                currentSlide === idx ? 'w-8 bg-[#FFB800]' : 'w-2 bg-white/30 hover:bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setCurrentSlide((prev) => (prev - 1 + realAds.length) % realAds.length);
                              setProgress(0);
                            }}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentSlide((prev) => (prev + 1) % realAds.length);
                              setProgress(0);
                            }}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── CASE 2: NO DUMMY ADS — OUT-OF-THE-BOX OFFICIAL COLLABORATION BILLBOARD ── */
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

            {/* Main Collaboration Pitch Grid */}
            <div className="relative z-10 p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Collaboration Pitch */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-[#021838] font-black text-xs uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>PARTNER WITH VENTERSHOP</span>
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
                    Are you a store owner, artisan, distributor, or brand in Sri Lanka? Collaborate with VENTERSHOP today. Reach over <strong className="text-[#FFB800]">50,000+ active shoppers</strong> with your dedicated online store, multi-vendor logistics, and prime homepage billboard showcase.
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
                    <a
                      href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Contact For Collaboration (WhatsApp)</span>
                    </a>

                    <Link
                      href="/vendor/register"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0052CC] hover:bg-[#003893] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-[#FFB800]" />
                      <span>Register Your Store</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setInquiryModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-[#FFB800]" />
                      <span>Submit Ad Inquiry</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Out-of-the-Box Holographic Collaboration Badge Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#01142F]/95 to-[#021838]/95 border-2 border-[#FFB800] shadow-2xl space-y-5 text-center overflow-hidden">
                    {/* Glowing background rays */}
                    <div className="absolute inset-0 bg-radial-gradient from-blue-600/20 via-transparent to-transparent pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052CC] to-[#021838] border-2 border-[#FFB800] flex items-center justify-center mx-auto text-[#FFB800] shadow-xl">
                      <Briefcase className="w-8 h-8 text-[#FFB800]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB800] block mb-1">
                        VENTERSHOP COMMERCIAL NETWORK
                      </span>
                      <h3 className="text-xl font-black text-white">
                        வணிக கூட்டாண்மை விளம்பரம்
                      </h3>
                      <p className="text-xs text-blue-200/80 mt-1 max-w-xs mx-auto leading-relaxed">
                        உங்கள் வணிகத்திற்கான விளம்பரத்தை முகப்புப் பக்கத்தில் இடம்பெறச் செய்ய இப்போதே விண்ணப்பிக்கவும்.
                      </p>
                    </div>

                    {/* Features summary box */}
                    <div className="bg-[#021838] border border-blue-900/80 rounded-2xl p-4 text-left space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span className="text-gray-400">Target Audience</span>
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

                    <a
                      href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20VENTERSHOP."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PARTNER AD INQUIRY MODAL (WITH WHATSAPP QUICK CONNECT) ── */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-white border-2 border-[#0052CC] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#021838] text-white flex items-center justify-between border-b-2 border-blue-900">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#0052CC] text-[#FFB800]">
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Promote Your Store On VENTERSHOP
                  </h3>
                  <p className="text-xs text-[#FFB800] font-bold">
                    Reach 50,000+ shoppers island-wide
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 text-xs bg-white space-y-4">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">Inquiry Received!</h4>
                  <p className="text-gray-600 text-xs max-w-xs mx-auto">
                    Thank you! Our merchant marketing team will contact you via WhatsApp / Phone (077 833 1202) within 24 hours to setup your interactive billboard ad.
                  </p>
                  <button
                    onClick={() => setInquiryModalOpen(false)}
                    className="mt-2 px-5 py-2.5 bg-[#0052CC] text-white rounded-xl font-black text-xs uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                  <p className="text-gray-600 font-medium">
                    Showcase your brand billboard on the VENTERSHOP homepage. Submit your details or reach our team directly:
                  </p>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      Shop / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopNameInput}
                      onChange={(e) => setShopNameInput(e.target.value)}
                      placeholder="e.g. Royal Spice Traders"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      WhatsApp / Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      Product Category *
                    </label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    >
                      <option value="Groceries & Provisions">Groceries & Provisions</option>
                      <option value="Ceylon Spices">Ceylon Spices & Agri Export</option>
                      <option value="Animal Feed">Rani Animal Feed</option>
                      <option value="Books & Stationery">Books & Stationery</option>
                      <option value="Handloom & Apparel">Handloom & Apparel</option>
                      <option value="Electronics">Electronics & Accessories</option>
                      <option value="Other">Other Specialty Products</option>
                    </select>
                  </div>

                  {/* Direct WhatsApp Option */}
                  <a
                    href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20collaborate%20and%20advertise%20my%20store%20on%20the%20homepage."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant WhatsApp Inquiry (+94 77 833 1202)</span>
                  </a>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(false)}
                      className="px-4 py-2.5 text-gray-600 font-bold hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#021838] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Form</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
