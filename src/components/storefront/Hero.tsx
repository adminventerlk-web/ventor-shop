'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, CheckCircle2, MapPin, Store, ChevronLeft, ChevronRight, Sparkles, Globe2, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  // 4 Rotating animated hero background slides
  const slides = [
    {
      id: 1,
      image: '/images/sri_lankan_exports.jpg',
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
      titleEn: 'VENTERSHOP DIGITAL ECOSYSTEM',
      titleTa: 'வென்டர்ஷாப் வர்ச்சுவல் சந்தை',
      titleSi: 'වෙන්ටර්ෂොප් වර්චුවල් වෙළඳපල',
      subtitleEn: 'Connecting verified Sri Lankan entrepreneurs and buyers under one trusted e-commerce hub.',
      subtitleTa: 'உள்ளூர் வணிகர்களையும் வாங்குபவர்களையும் இணைக்கும் ஒரே நம்பகமான இணையதளம்.',
      subtitleSi: 'දේශීය ව්‍යවසායකයින් සහ මිලදී ගන්නන් එක් කරන ඩිජිට්ටල් වේදිකාව.',
      tag: '🌟 100% Verified Ceylon Merchants',
      category: 'Virtual Shops',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  // Auto transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full relative overflow-hidden select-none" style={{ margin: 0, padding: 0, lineHeight: 0, fontSize: 0, background: '#021430' }}>
      
      {/* Slideshow Area - No gaps, no borders, no margins */}
      <div className="relative overflow-hidden" style={{ minHeight: '480px', lineHeight: 'normal', fontSize: '14px' }}>
        
        {/* Background Images Layer - Ken Burns animated zoom effect */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                transition: 'opacity 1s ease-in-out',
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Image with Ken Burns zoom animation */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.titleEn}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 6s ease-out',
                    filter: 'brightness(0.9)',
                  }}
                />
              </div>

              {/* Multiple dark overlays for seamless no-gap coverage */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 20, 48, 0.72)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #021430 0%, rgba(2, 20, 48, 0.88) 30%, transparent 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #021430 0%, transparent 25%, transparent 75%, #021430 100%)' }} />
            </div>
          );
        })}

        {/* Hero Content Box */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full" style={{ lineHeight: 'normal' }}>
          <div className="max-w-3xl space-y-4 text-left text-white">
            
            {/* Category Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-[#FFB800] text-[#021430] shadow-md scale-105'
                      : 'bg-white/20 text-white/90 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  {s.category}
                </button>
              ))}
            </div>

            {/* Tag Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0052CC] text-white font-black text-xs uppercase tracking-wider shadow-lg border border-blue-400/40">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{slides[currentSlide].tag}</span>
            </div>

            {/* Main Title & Description - with smooth text transition */}
            <div className="space-y-2">
              <h1
                key={`title-${currentSlide}`}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans drop-shadow-xl"
                style={{
                  animation: 'heroFadeSlideIn 0.6s ease-out both',
                }}
              >
                {isTa
                  ? slides[currentSlide].titleTa
                  : isSi
                  ? slides[currentSlide].titleSi
                  : slides[currentSlide].titleEn}
              </h1>
              <p
                key={`sub-${currentSlide}`}
                className="text-xs sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl"
                style={{
                  animation: 'heroFadeSlideIn 0.6s ease-out 0.15s both',
                }}
              >
                {isTa
                  ? slides[currentSlide].subtitleTa
                  : isSi
                  ? slides[currentSlide].subtitleSi
                  : slides[currentSlide].subtitleEn}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-200 pt-1">
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
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#featured-products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black text-[#021430] bg-[#FFB800] hover:bg-[#FFA500] transition-all shadow-xl transform hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <ShoppingCart className="w-4 h-4 text-[#021430]" />
                <span>{isTa ? 'தயாரிப்புகளைப் பார்க்க' : isSi ? 'නිෂ්පාදන බලන්න' : 'Shop Featured Products'}</span>
                <ArrowRight className="w-4 h-4 text-[#021430]" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0052CC] hover:bg-[#003893] transition-all shadow-lg border border-blue-400/40 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-amber-300" />
                <span>{isTa ? 'கடைகளை ஆராய்க' : isSi ? 'සාප්පු ගවේෂණය කරන්න' : 'Browse All Shops'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/50 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#FFB800]" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/50 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 shadow-xl"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-[#FFB800]" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#FFB800] shadow-lg border border-amber-200'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Seamless Location Strip - zero gap with hero */}
      <div style={{ background: '#0052CC', color: 'white', padding: '10px 16px', textAlign: 'center', fontWeight: 700, fontSize: '12px', lineHeight: '1.4', margin: 0, border: 'none' }}>
        <p className="flex items-center justify-center gap-2 tracking-wide" style={{ margin: 0, padding: 0 }}>
          <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" style={{ display: 'inline-block' }} />
          <span>{isTa ? 'இலங்கை முழுவதும் இல்லங்களுக்கு விரைவான விநியோகம் & சர்வதேச ஏற்றுமதி.' : isSi ? 'ශ්‍රී ලංකාව පුරාම නිවසටම බෙදාහැරීම සහ ගෝලීය අපනයන.' : 'Fast Delivery Across All 25 Districts in Sri Lanka & Direct Global Export.'}</span>
        </p>
      </div>

      {/* CSS Keyframes for text animation */}
      <style jsx>{`
        @keyframes heroFadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
