'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Truck,
  Star,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  // 4 Rotating animated hero background slides - matching Sithisha Masala style
  const slides = [
    {
      id: 1,
      image: '/images/sri_lankan_exports.jpg',
      tagEn: '🔥 #1 CEYLON EXPORT & SPICES PORTAL',
      tagTa: '🔥 #1 இலங்கை நறுமணப் பொருட்கள் & ஏற்றுமதி',
      tagSi: '🔥 #1 ලංකා කුළුබඩු සහ අපනයන සේවාව',
      titleLine1En: 'AUTHENTIC CEYLON SPICES,',
      titleLine1Ta: 'அசல் இலங்கை நறுமணம்,',
      titleLine1Si: 'සැබෑ ලංකා කුළුබඩු,',
      titleLine2En: 'DIRECT EXPORT WORLDWIDE.',
      titleLine2Ta: 'உலகளாவிய நேரடி விநியோகம்.',
      titleLine2Si: 'ලොව පුරා සෘජු අපනයනය.',
      subtitleEn:
        'Pure Ceylon cinnamon, single-origin black tea, whole cloves, and verified local goods shipped globally to your doorstep.',
      subtitleTa:
        'அசல் இலங்கை கருவாபட்டை, தேயிலை மற்றும் தூய நறுமணப் பொருட்கள் உலகெங்கிலும் உங்கள் இருப்பிடத்திற்கே அனுப்பப்படும்.',
      subtitleSi:
        'සැබෑ ලංකා කුරුඳු, උසස් තේ සහ කුළුබඩු ලොව පුරා ආරක්ෂිතව ඔබේ නිවසටම ගෙන්වා ගන්න.',
      ctaTextEn: 'Explore Export Collection',
      ctaTextTa: 'ஏற்றுமதி பொருட்களைப் பார்க்க',
      ctaTextSi: 'අපනයන එකතුව ගවේෂණය',
      ctaLink: '/shop?category=export-spices',
    },
    {
      id: 2,
      image: '/images/groceries_basket.jpg',
      tagEn: '🛒 DAILY SUPERMARKET ESSENTIALS',
      tagTa: '🛒 புதிய தினசரி மளிகைப் பொருட்கள்',
      tagSi: '🛒 එදිනෙදා අත්‍යවශ්‍ය ද්‍රව්‍ය',
      titleLine1En: 'FRESH DAILY GROCERIES,',
      titleLine1Ta: 'புதிய மளிகைப் பொருட்கள்,',
      titleLine1Si: 'නැවුම් එදිනෙදා ආහාර,',
      titleLine2En: 'DELIVERED TO YOUR DOOR.',
      titleLine2Ta: 'வீட்டிற்கே விரைவான டெலிவரி.',
      titleLine2Si: 'නිවසටම වේගවත් බෙදාහැරීම.',
      subtitleEn:
        'Farm-fresh produce, staple grains, household essentials, and pantry favorites delivered across Sri Lanka.',
      subtitleTa:
        'பண்ணை புதிய காய்கறிகள், அரிசி, தானியங்கள் மற்றும் அத்தியாவசிய பொருட்கள் அதிவிரைவாக வீட்டிற்கே வழங்கப்படும்.',
      subtitleSi:
        'නැවුම් එළවළු, සහල්, ධාන්‍ය සහ ගෘහස්ථ ද්‍රව්‍ය දිවයින පුරා ඔබේ නිවසටම ලබාදේ.',
      ctaTextEn: 'Shop Daily Groceries',
      ctaTextTa: 'மளிகை வாங்குக',
      ctaTextSi: 'ද්‍රව්‍ය මිලදී ගන්න',
      ctaLink: '/shop?category=groceries',
    },
    {
      id: 3,
      image: '/images/rani_animal_feed.jpg',
      tagEn: '🌾 OFFICIAL RANI LIVESTOCK DISTRIBUTOR',
      tagTa: '🌾 அங்கீகரிக்கப்பட்ட ராணி தீவன விநியோகம்',
      tagSi: '🌾 නිල රාණි සත්ව ආහාර බෙදාහැරීම',
      titleLine1En: 'RANI ANIMAL FEED,',
      titleLine1Ta: 'ராணி விலங்கு தீவனம்,',
      titleLine1Si: 'රාණි සත්ව ආහාර,',
      titleLine2En: 'NUTRITION FOR MAXIMUM YIELD.',
      titleLine2Ta: 'அதிக உற்பத்திக்கான ஊட்டச்சத்து.',
      titleLine2Si: 'උපරිම ඵලදායිතාව සඳහා පෝෂණය.',
      subtitleEn:
        'Scientifically formulated broiler, layer, dairy cattle, and livestock feeds engineered for optimum farm health and growth.',
      subtitleTa:
        'கோழி, மாடு மற்றும் கால்நடை வளர்ப்புக்கான அறிவியல் பூர்வமாக தயாரிக்கப்பட்ட உயர்தர ஊட்டச்சத்து தீவனங்கள்.',
      subtitleSi:
        'කුකුළු, ගව සහ පශු සම්පත් සඳහා විද්‍යාත්මකව සකස් කරන ලද උසස් තත්ත්වයේ ආහාර විසඳුම්.',
      ctaTextEn: 'Order Animal Feed',
      ctaTextTa: 'தீவனங்களை ஆர்டர் செய்க',
      ctaTextSi: 'සත්ව ආහාර ඇණවුම් කරන්න',
      ctaLink: '/shop?category=animal-feed',
    },
    {
      id: 4,
      image: '/images/storefront_3d.jpg',
      tagEn: '🌟 100% VERIFIED MERCHANT ECOSYSTEM',
      tagTa: '🌟 100% சரிபார்க்கப்பட்ட வணிகர் சந்தை',
      tagSi: '🌟 100% තහවුරු කළ වෙළඳ ප්‍රජාව',
      titleLine1En: 'VENTERSHOP DIGITAL,',
      titleLine1Ta: 'வென்டர்ஷாப் டிஜிட்டல்,',
      titleLine1Si: 'වෙන්ටර්ෂොප් ඩිජිටල්,',
      titleLine2En: 'CONNECTING BUYERS & SELLERS.',
      titleLine2Ta: 'வணிகர்களையும் வாங்குபவரையும் இணைக்கிறது.',
      titleLine2Si: 'ගැණුම්කරුවන් සහ වෙළඳුන් එක් කරයි.',
      subtitleEn:
        'Discover authentic Sri Lankan merchants, virtual storefronts, wholesale discounts, and community savings in one portal.',
      subtitleTa:
        'இலங்கை உற்பத்தியாளர்களின் கடைகள், மொத்த விற்பனை சலுகைகள் மற்றும் சிறப்பு வவுச்சர்களை ஒரே தளத்தில் பெறுங்கள்.',
      subtitleSi:
        'දේශීය නිෂ්පාදකයින්ගේ සාප්පු, තොග වට්ටම් සහ වවුචර් දීමනා එකම වේදිකාවකින් සොයා ගන්න.',
      ctaTextEn: 'Browse Virtual Shops',
      ctaTextTa: 'கடைகளை ஆராய்க',
      ctaTextSi: 'සාප්පු ගවේෂණය',
      ctaLink: '/virtual-shops',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  // Auto transition every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <>
      {/* Hero Section - Matching Sithisha Masala & Snacks structure with flex-center and plenty of vertical room */}
      <section className="relative overflow-hidden bg-[#021430] text-white min-h-[520px] sm:min-h-[600px] lg:min-h-[650px] flex items-center select-none">
        {/* Background Images Layer with smooth Ken Burns animated zoom */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Ken Burns zooming image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.titleLine1En}
                  className="w-full h-full object-cover object-center"
                  style={{
                    transform: isActive ? 'scale(1.10)' : 'scale(1)',
                    transition: 'transform 7s ease-out',
                    filter: 'brightness(0.85)',
                  }}
                />
              </div>

              {/* Seamless Dark Overlay - exactly like Sithisha */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#021430]/95 via-[#021430]/80 to-[#021430]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021430] via-transparent to-[#021430]/60" />
            </div>
          );
        })}

        {/* Glowing Decorative Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-[1]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none z-[1]" />

        {/* Content Container - with generous py so buttons never get cut off */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24 w-full">
          <div className="max-w-3xl space-y-6 text-left">
            {/* 1. Tag Highlight Badge */}
            <div
              key={`tag-${currentSlide}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/80 border border-blue-700/60 text-[#FFB800] text-xs font-black uppercase tracking-widest shadow-md backdrop-blur-md"
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out both' }}
            >
              <Sparkles className="w-4 h-4 text-[#FFB800]" />
              <span>
                {isTa ? current.tagTa : isSi ? current.tagSi : current.tagEn}
              </span>
            </div>

            {/* 2. Main Title with gradient highlight */}
            <h1
              key={`title-${currentSlide}`}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white uppercase font-sans"
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.1s both' }}
            >
              {isTa
                ? current.titleLine1Ta
                : isSi
                ? current.titleLine1Si
                : current.titleLine1En}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-200 to-blue-200 block mt-1">
                {isTa
                  ? current.titleLine2Ta
                  : isSi
                  ? current.titleLine2Si
                  : current.titleLine2En}
              </span>
            </h1>

            {/* 3. Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className="text-sm sm:text-base lg:text-lg text-blue-100 max-w-2xl font-medium leading-relaxed"
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.2s both' }}
            >
              {isTa
                ? current.subtitleTa
                : isSi
                ? current.subtitleSi
                : current.subtitleEn}
            </p>

            {/* 4. Action Buttons - Prominent, fully visible, never clipped */}
            <div
              key={`cta-${currentSlide}`}
              className="pt-2 flex flex-wrap items-center gap-4"
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.3s both' }}
            >
              <Link
                href={current.ctaLink}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-[#FFB800]/25 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
              >
                <span>
                  {isTa
                    ? current.ctaTextTa
                    : isSi
                    ? current.ctaTextSi
                    : current.ctaTextEn}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/virtual-shops"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#FFB800]" />
                <span>
                  {isTa
                    ? 'கடைகளை ஆராய்க'
                    : isSi
                    ? 'සාප්පු ගවේෂණය'
                    : 'Explore Shops'}
                </span>
              </Link>
            </div>

            {/* 5. Trust Features Row - Border top line like Sithisha */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap gap-6 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>
                  {isTa
                    ? '100% அசல் தரம்'
                    : isSi
                    ? '100% විශ්වාසනීය'
                    : '100% Authentic Quality'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {isTa
                    ? 'சர்வதேச ஏற்றுமதி'
                    : isSi
                    ? 'ගෝලීය අපනයනය'
                    : 'Direct Global Shipping'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>
                  {isTa
                    ? 'வேகமான விநியோகம்'
                    : isSi
                    ? 'වේගවත් බෙදාහැරීම'
                    : 'Fast Islandwide Delivery'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFB800] fill-[#FFB800] shrink-0" />
                <span>4.9 / 5 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#FFB800]" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-[#FFB800]" />
        </button>

        {/* Slide Indicators on Bottom Right - exactly like Sithisha */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentSlide
                  ? 'bg-[#FFB800] w-8 shadow-md'
                  : 'bg-white/40 hover:bg-white/70 w-2.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Sithisha-Style Running Marquee Ticker Bar */}
      <div className="w-full bg-[#011638] text-[#FFB800] py-3.5 overflow-hidden border-y border-blue-900/60 shadow-inner">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2].map((group) => (
            <React.Fragment key={group}>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>CEYLON SPICES & TEA</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>FRESH GROCERIES</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>RANI ANIMAL FEED</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>VIRTUAL MERCHANT SHOPS</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>DIRECT GLOBAL EXPORT</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>ISLANDWIDE FAST DELIVERY</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>100% GENUINE PRODUCTS</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>V2CC COMMUNITY VOUCHERS</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes heroFadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
