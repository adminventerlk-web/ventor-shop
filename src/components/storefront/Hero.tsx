'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, CheckCircle2, MapPin, Store, ChevronLeft, ChevronRight, Sparkles, Globe2, ShieldCheck, Truck, ArrowRight, Play, Pause } from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  // 4 Rotating animated hero background slides
  const slides = [
    {
      id: 1,
      image: '/images/sri_lankan_exports.jpg',
      badgeEn: 'PREMIUM EXPORT QUALITY',
      badgeTa: 'உயர்தர ஏற்றுமதி தரம்',
      badgeSi: 'ප්‍රමුඛ අපනයන ගුණාත්මකභාවය',
      titleEn: 'CEYLON SPICES & GLOBAL EXPORT',
      titleTa: 'இலங்கை நறுமணப் பொருட்கள் & ஏற்றுமதி',
      titleSi: 'ලංකා කුළුබඩු සහ ගෝලීය අපනයන',
      subtitleEn: 'Authentic Ceylon cinnamon, single origin tea, pure spices & local goods exported worldwide.',
      subtitleTa: 'அசல் இலங்கை கருவாபட்டை, தேயிலை மற்றும் நறுமணப் பொருட்கள் உலகளாவிய விநியோகம்.',
      subtitleSi: 'සැබෑ ලංකා කුරුඳු, තේ සහ කුළුබඩු ලොව පුරා යැවීම.',
      tag: '🔥 #1 Ceylon Export Portal',
      category: 'Export Spices & Tea',
    },
    {
      id: 2,
      image: '/images/groceries_basket.jpg',
      badgeEn: 'SUPERMARKET DIRECT',
      badgeTa: 'நேரடி சூப்பர் மார்க்கெட்',
      badgeSi: 'සුපිරි වෙළඳසැලෙන්ම සෘජුව',
      titleEn: 'FRESH DAILY GROCERIES & FOOD',
      titleTa: 'புதிய தினசரி மளிகைப் பொருட்கள்',
      titleSi: 'නැවුම් එදිනෙදා ද්‍රව්‍ය සහ ආහාර',
      subtitleEn: 'Farm fresh essentials, household items & staple grains delivered straight to your home.',
      subtitleTa: 'புதிய உணவுப் பொருட்கள் மற்றும் வீட்டுத் தேவைகள் உங்கள் வீட்டிற்கே விரைவாக விநியோகம்.',
      subtitleSi: 'නැවුම් අත්‍යවශ්‍ය ද්‍රව්‍ය නිවසටම ගෙනැවිත් දෙනු ලැබේ.',
      tag: '🛒 Fast Islandwide Home Delivery',
      category: 'Groceries & Rice',
    },
    {
      id: 3,
      image: '/images/rani_animal_feed.jpg',
      badgeEn: 'AUTHORIZED DISTRIBUTOR',
      badgeTa: 'அங்கீகரிக்கப்பட்ட விநியோகஸ்தர்',
      badgeSi: 'බලයලත් බෙදාහරින්නා',
      titleEn: 'RANI ANIMAL FEED SOLUTIONS',
      titleTa: 'ராணி விலங்கு தீவன தீர்வுகள்',
      titleSi: 'රාණි සතුන්ගේ ආහාර විසඳුම්',
      subtitleEn: 'High grade poultry, cattle & livestock nutrition feeds engineered for health & maximum yield.',
      subtitleTa: 'கோழி மற்றும் கால்நடை வளர்ப்புக்கான உயர்தர ஊட்டச்சத்து தீவனங்கள்.',
      subtitleSi: 'පශු සම්පත් සඳහා උසස් තත්ත්වයේ ආහාර විසඳුම්.',
      tag: '🌾 Trusted Livestock Nutrition',
      category: 'Rani Feed',
    },
    {
      id: 4,
      image: '/images/storefront_3d.jpg',
      badgeEn: 'MULTI-CATEGORY MARKETPLACE',
      badgeTa: 'பல்வேறு வகை கடைகள்',
      badgeSi: 'බහු-වර්ගවල වෙළඳසැල',
      titleEn: 'VENTERSHOP DIGITAL ECOSYSTEM',
      titleTa: 'வென்டர்ஷாப் வர்ச்சுவல் சந்தை',
      titleSi: 'වෙන්ටර්ෂොප් වර්චුවල් වෙළඳපල',
      subtitleEn: 'Connecting verified Sri Lankan entrepreneurs and buyers under one trusted e-commerce hub.',
      subtitleTa: 'உள்ளூர் வணிகர்களையும் வாங்குபவர்களையும் இணைக்கும் ஒரே நம்பகமான இணையதளம்.',
      subtitleSi: 'දේශීය ව්‍යවසායකයින් සහ මිලදී ගන්නන් එක් කරන ඩිජිටල් වේදිකාව.',
      tag: '🌟 100% Verified Ceylon Merchants',
      category: 'Virtual Shops',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto transition every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full bg-[#021430] relative overflow-hidden select-none m-0 p-0 leading-none">
      
      {/* Main Slideshow Container with tight bounds */}
      <div
        className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center justify-center p-0 m-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Images Layer */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.titleEn}
              className="w-full h-full object-cover object-center filter brightness-90 transform transition-transform duration-7000 ease-linear scale-105"
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#021430]/95 via-[#021838]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021430] via-transparent to-[#021430]/60" />
          </div>
        ))}

        {/* Slide Counter Top Right */}
        <div className="absolute top-5 right-6 z-30 hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
          <span className="text-[11px] font-black text-amber-300 tracking-wider">
            SLIDE 0{currentSlide + 1} / 0{slides.length}
          </span>
          <span className="text-white/40">|</span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/80 hover:text-white transition-colors"
            title={isPaused ? "Resume Auto-slide" : "Pause Auto-slide"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Full-width Content Container (Clean, centered left layout) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
          <div className="max-w-3xl space-y-5 text-left text-white leading-normal">
            
            {/* Category Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-[#FFB800] text-[#021430] shadow-md scale-105'
                      : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
                  }`}
                >
                  {s.category}
                </button>
              ))}
            </div>

            {/* Tag Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0052CC] text-white font-black text-xs uppercase tracking-wider shadow-lg border border-blue-400/40">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{slides[currentSlide].tag}</span>
            </div>

            {/* Main Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans drop-shadow-xl">
                {isTa
                  ? slides[currentSlide].titleTa
                  : isSi
                  ? slides[currentSlide].titleSi
                  : slides[currentSlide].titleEn}
              </h1>
              <p className="text-xs sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl">
                {isTa
                  ? slides[currentSlide].subtitleTa
                  : isSi
                  ? slides[currentSlide].subtitleSi
                  : slides[currentSlide].subtitleEn}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-semibold text-gray-200">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{isTa ? '100% அசல் தர உத்தரவாதம்' : isSi ? '100% විශ්වාසනීය නිෂ්පාදන' : '100% Genuine Quality Goods'}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
                <Globe2 className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{isTa ? 'சர்வதேச ஏற்றுமதி விநியோகம்' : isSi ? 'ගෝලීය අපනයන සේවාව' : 'Direct Global Export Shipping'}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
                <Truck className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{isTa ? 'இலங்கை முழுவதும் வேகமான டெலிவரி' : isSi ? 'දිවයින පුරාම බෙදාහැරීම' : 'Fast Delivery Across Sri Lanka'}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{isTa ? 'பாதுகாப்பான கட்டணம் & வவுச்சர்கள்' : isSi ? 'ආරක්ෂිත ගෙවීම්' : 'Safe Checkout & Vouchers'}</span>
              </div>
            </div>

            {/* Dual Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="#featured-products"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-xs sm:text-sm font-black text-[#021430] bg-[#FFB800] hover:bg-[#FFA500] transition-all shadow-xl transform hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-[#021430]" />
                <span>{isTa ? 'தயாரிப்புகளைப் பார்க்க' : isSi ? 'නිෂ්පාදන බලන්න' : 'Shop Featured Products'}</span>
                <ArrowRight className="w-4 h-4 text-[#021430]" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0052CC] hover:bg-[#003893] transition-all shadow-lg border border-blue-400/40 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <Store className="w-4.5 h-4.5 text-amber-300" />
                <span>{isTa ? 'கடைகளை ஆராய்க' : isSi ? 'සාප්පු ගවේෂණය කරන්න' : 'Browse All Shops'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-30 p-3 rounded-full bg-black/50 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#FFB800]" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-30 p-3 rounded-full bg-black/50 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-[#FFB800]" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-10 bg-[#FFB800] shadow-lg border border-amber-200'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Zero Gap Location Strip directly attached to Hero */}
      <div className="w-full bg-[#0052CC] text-white py-3 px-4 text-center border-t border-blue-400/30 m-0 leading-normal">
        <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide">
          <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
          <span>{isTa ? 'இலங்கை முழுவதும் இல்லங்களுக்கு விரைவான விநியோகம் & சர்வதேச ஏற்றுமதி.' : isSi ? 'ශ්‍රී ලංකාව පුරාම නිවසටම බෙදාහැරීම සහ ගෝලීය අපනයන.' : 'Fast Delivery Across All 25 Districts in Sri Lanka & Direct Global Export.'}</span>
        </p>
      </div>
    </div>
  );
}
