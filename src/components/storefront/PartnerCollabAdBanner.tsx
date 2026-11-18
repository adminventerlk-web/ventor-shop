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
  Star,
  Flame,
  Award,
  Zap,
  PhoneCall,
  Clock,
  Compass,
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

const DEFAULT_COLLAB_SLIDES: IAdSlide[] = [
  {
    id: 'slide-1',
    badge: 'Official Partner Spotlight',
    title: 'Ceylon Organic Spice Merchants',
    tagline: 'Export-grade Alba Ceylon Cinnamon, High-altitude Cardamom & Handpicked Whole Cloves delivered fresh across the island and worldwide.',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=900&q=80',
    ],
    shopName: 'Ruhunu Organic Spice Co.',
    shopCategory: 'Ceylon Spices & Agri Export',
    highlightStat: '50K+ Monthly Shoppers Reached',
    ctaText: 'Visit Partner Store',
    ctaLink: '/virtual-shops',
    accentColor: '#FFB800',
    offerPill: '🔥 15% OFF On Bulk Spices',
    rating: '4.9 ★ (1,840+ Orders)',
  },
  {
    id: 'slide-2',
    badge: 'Featured Dairy & Farm Partner',
    title: 'Highland Dairy & Fresh Farm Produce',
    tagline: 'Farm-churned pure butter, cold-pressed virgin coconut oils, and authentic rural provisions harvested daily and delivered chilled directly to your kitchen.',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=900&q=80',
    ],
    shopName: 'Kandy Green Fields Farm',
    shopCategory: 'Fresh Grocery & Farm Supplies',
    highlightStat: '100% Verified Quality Vendor',
    ctaText: 'Explore Partner Store',
    ctaLink: '/virtual-shops',
    accentColor: '#10B981',
    offerPill: '🌿 100% Chemical-Free Organic',
    rating: '4.95 ★ (3,200+ Reviews)',
  },
  {
    id: 'slide-3',
    badge: 'Artisan Heritage Partner',
    title: 'Authentic Handloom & Ceylon Crafts',
    tagline: 'Master-crafted pure cotton apparel, hand-woven sarees, and traditional handcrafted wood and brass home decor directly from rural artisan collectives.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
    ],
    shopName: 'Lanka Heritage Handlooms',
    shopCategory: 'Handloom, Textile & Exports',
    highlightStat: 'Zero Setup Cost • Verified Seller',
    ctaText: 'View Store Collection',
    ctaLink: '/virtual-shops',
    accentColor: '#38BDF8',
    offerPill: '✨ Authentic Handmade Craft',
    rating: '4.88 ★ (950+ Global Shipments)',
  },
];

export default function PartnerCollabAdBanner() {
  const [slides, setSlides] = useState<IAdSlide[]>(DEFAULT_COLLAB_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Groceries');
  const [submitted, setSubmitted] = useState(false);

  // Fetch dynamic ads from DB
  useEffect(() => {
    async function loadDynamicAds() {
      try {
        const res = await fetch('/api/ads');
        if (res.ok) {
          const data = await res.json();
          if (data.ads && data.ads.length > 0) {
            const formatted: IAdSlide[] = data.ads.map((ad: any) => ({
              id: ad._id,
              badge: ad.badge || 'Verified Partner Spotlight',
              title: ad.title,
              tagline: ad.tagline,
              images: Array.isArray(ad.images) && ad.images.length > 0
                ? ad.images
                : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80'],
              shopName: ad.shopName,
              shopCategory: ad.shopCategory || 'Partner Merchant',
              highlightStat: ad.highlightStat || 'Featured Merchant',
              ctaText: ad.ctaText || 'Visit Partner Store',
              ctaLink: ad.ctaLink || '/virtual-shops',
              accentColor: ad.accentColor || '#FFB800',
              offerPill: ad.offerPill || '🔥 Verified Partner Store',
              rating: ad.rating || '4.9 ★ Verified Partner',
            }));
            setSlides(formatted);
          }
        }
      } catch (err) {
        console.warn('Using default collab slides:', err);
      }
    }
    loadDynamicAds();
  }, []);

  // Reset internal image index and progress when slide changes
  useEffect(() => {
    setCurrentImageIdx(0);
    setProgress(0);
  }, [currentSlide]);

  // Smooth progress bar tick & Slide rotation (every 6 seconds)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = 50; // update progress every 50ms
    const totalDuration = 6000;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Multi-image cycling inside active slide (every 2.6s)
  useEffect(() => {
    const active = slides[currentSlide];
    if (!active || !active.images || active.images.length <= 1 || isPaused) return;

    const imgInterval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % active.images.length);
    }, 2600);

    return () => clearInterval(imgInterval);
  }, [currentSlide, slides, isPaused]);

  const activeSlide = slides[currentSlide] || slides[0] || DEFAULT_COLLAB_SLIDES[0];
  const activeImage =
    activeSlide.images?.[currentImageIdx] ||
    activeSlide.images?.[0] ||
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="partner-collab-ad-section"
      aria-labelledby="partner-ad-heading"
      className="w-full py-6 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* ── TOP INTERACTIVE MERCHANT STORY TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0 pr-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFB800] text-[#021838] shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-[#021838]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-800">
              FEATURED MERCHANTS
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            {slides.map((s, idx) => {
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

                  {/* Active story mini indicator dot */}
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

          {/* Advertise CTA Pill */}
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

        {/* ── MAIN INTERACTIVE BILLBOARD CONTAINER ── */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-3xl border-2 shadow-2xl transition-all duration-500"
          style={{
            backgroundColor: '#021838',
            borderColor: activeSlide.accentColor || '#FFB800',
            backgroundImage:
              'radial-gradient(ellipse at 85% 20%, rgba(0, 82, 204, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 15% 90%, rgba(255, 184, 0, 0.15) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #051F4A 50%, #010E24 100%)',
            color: '#ffffff',
          }}
        >
          {/* Top Story Progress Bar (Instagram-style animated timer) */}
          <div className="relative w-full h-1 bg-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-75 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: activeSlide.accentColor || '#FFB800',
                boxShadow: `0 0 10px ${activeSlide.accentColor || '#FFB800'}`,
              }}
            />
          </div>

          {/* Ambient Glowing Watermark */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
            style={{ backgroundColor: activeSlide.accentColor || '#FFB800' }}
          />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0052CC]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Live Status & Category Indicator */}
          <div className="relative z-10 px-5 pt-4 sm:px-8 sm:pt-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#FFB800] text-[#021838] shadow-sm">
                <Megaphone className="w-4 h-4 text-[#021838]" />
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VERIFIED SPONSORED SHOWCASE</span>
                </span>
                <span className="text-[11px] font-bold text-blue-200/90 hidden sm:inline">
                  வணிக கூட்டாண்மை விளம்பரம்
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white/70 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 hidden md:inline">
                {currentSlide + 1} of {slides.length} Stores
              </span>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setInquiryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white text-[11px] font-black border border-white/20 transition-all cursor-pointer shadow-xs group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800] group-hover:text-[#021838]" />
                <span>Advertise Here</span>
              </button>
            </div>
          </div>

          {/* ── MAIN CONTENT GRID ── */}
          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Brand Story & Conversion Pitch */}
              <div className="lg:col-span-7 space-y-4">
                {/* Badges Strip */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-gray-900 shadow-sm"
                    style={{ backgroundColor: activeSlide.accentColor || '#FFB800' }}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{activeSlide.badge}</span>
                  </div>

                  {activeSlide.offerPill && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black tracking-wide">
                      <span>{activeSlide.offerPill}</span>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-200/90 bg-[#01142F] px-2.5 py-1 rounded-xl border border-blue-900">
                    <Store className="w-3 h-3 text-[#FFB800]" />
                    <span>{activeSlide.shopCategory}</span>
                  </div>
                </div>

                {/* Title */}
                <h2
                  id="partner-ad-heading"
                  className="text-2xl sm:text-3xl lg:text-4.5xl font-black text-white leading-tight tracking-tight transition-all duration-300"
                >
                  {activeSlide.title}
                </h2>

                {/* Tagline */}
                <p className="text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed max-w-xl">
                  {activeSlide.tagline}
                </p>

                {/* Highlights Strip (3 dynamic trust pills) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-lg">
                  <div className="flex items-center gap-2 text-xs font-black text-[#FFB800] bg-[#01142F]/90 px-3.5 py-2 rounded-xl border border-blue-900/80 shadow-xs">
                    <TrendingUp className="w-4 h-4 text-[#FFB800] shrink-0" />
                    <span className="truncate">{activeSlide.highlightStat}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#01142F]/90 px-3.5 py-2 rounded-xl border border-blue-900/80 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{activeSlide.rating || '4.9 ★ Verified Partner'}</span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={activeSlide.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span>{activeSlide.ctaText}</span>
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

              {/* Right Column: Visual Showcase Card with Multi-Image Animation */}
              <div className="lg:col-span-5 relative">
                <div
                  className="relative rounded-3xl overflow-hidden border-2 shadow-2xl group aspect-[4/3] bg-gray-950 transition-all duration-500"
                  style={{
                    borderColor: activeSlide.accentColor || '#FFB800',
                    boxShadow: `0 20px 40px -15px ${activeSlide.accentColor || '#FFB800'}40`,
                  }}
                >
                  {/* Hero Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-106 animate-fadeIn"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-black/20 to-transparent pointer-events-none" />

                  {/* Top-Right Badge: Multi-image Counter with Live Crossfade */}
                  {activeSlide.images && activeSlide.images.length > 1 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                      <span className="text-[10px] font-black text-white tracking-wider">
                        PHOTO {currentImageIdx + 1} OF {activeSlide.images.length}
                      </span>
                    </div>
                  )}

                  {/* Top-Left Trust Badge */}
                  <div className="absolute top-3 left-3 bg-[#021838]/85 backdrop-blur-md px-3 py-1 rounded-full border border-blue-400/30 shadow-md flex items-center gap-1 text-[10px] font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Partner</span>
                  </div>

                  {/* Bottom Interactive Thumbnail Strip */}
                  {activeSlide.images && activeSlide.images.length > 1 && (
                    <div className="absolute bottom-16 left-3 right-3 flex items-center gap-2 z-20 overflow-x-auto pb-1 scrollbar-none">
                      {activeSlide.images.map((imgUrl, i) => (
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

                  {/* Floating Glassmorphic Merchant Card at Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#021838]/95 backdrop-blur-lg rounded-2xl border border-blue-400/40 flex items-center justify-between shadow-2xl z-20">
                    <div>
                      <p className="text-[9px] uppercase font-black text-[#FFB800] tracking-widest">
                        {activeSlide.shopCategory}
                      </p>
                      <h4 className="text-sm font-black text-white truncate max-w-[170px] sm:max-w-[210px]">
                        {activeSlide.shopName}
                      </h4>
                    </div>
                    <Link
                      href={activeSlide.ctaLink}
                      className="px-3.5 py-1.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <span>Explore Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Navigation Strip (Dots + Arrows) */}
                <div className="flex items-center justify-between mt-3 px-1">
                  {/* Slide Indicators */}
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlide(idx);
                          setProgress(0);
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 transition-all rounded-full cursor-pointer ${
                          currentSlide === idx ? 'w-8 bg-[#FFB800]' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                        setProgress(0);
                      }}
                      aria-label="Previous partner store"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev + 1) % slides.length);
                        setProgress(0);
                      }}
                      aria-label="Next partner store"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                    Thank you! Our merchant marketing team will contact you via WhatsApp / Phone within 24 hours to setup your interactive billboard ad.
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
                      <option value="Groceries">Groceries & Provisions</option>
                      <option value="Ceylon Spices">Ceylon Spices & Agri Export</option>
                      <option value="Animal Feed">Rani Animal Feed</option>
                      <option value="Books">Books & Stationery</option>
                      <option value="Handloom">Handloom & Apparel</option>
                      <option value="Electronics">Electronics & Accessories</option>
                      <option value="Other">Other Specialty Products</option>
                    </select>
                  </div>

                  {/* Direct WhatsApp Option */}
                  <a
                    href="https://wa.me/94770000000?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20advertise%20my%20store%20on%20the%20homepage."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant WhatsApp Inquiry (+94)</span>
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
