'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, CheckCircle2, MapPin, Store, ChevronLeft, ChevronRight, Sparkles, Globe2, ShieldCheck, Truck } from 'lucide-react';

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
      subtitleEn: 'Authentic Ceylon cinnamon, tea, pure spices & local goods exported worldwide.',
      subtitleTa: 'அசல் இலங்கை கருவாபட்டைய, தேயிலை மற்றும் நறுமணப் பொருட்கள் உலகளாவிய விநியோகம்.',
      subtitleSi: 'සැබෑ ලංකා කුරුඳු, තේ සහ කුළුබඩු ලොව පුරා යැවීම.',
      tag: '🔥 #1 Ceylon Export Portal',
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
      subtitleEn: 'Farm fresh essentials, household items & rice delivered to your home.',
      subtitleTa: 'புதிய உணவுப் பொருட்கள் மற்றும் வீட்டுத் தேவைகள் உங்கள் வீட்டிற்கே விநியோகம்.',
      subtitleSi: 'නැවුම් අත්‍යවශ්‍ය ද්‍රව්‍ය නිවසටම ගෙනැවිත් දෙනු ලැබේ.',
      tag: '🛒 Fast Home Delivery',
    },
    {
      id: 3,
      image: '/images/rani_animal_feed.jpg',
      badgeEn: 'AUTHORIZE DISTRIBUTOR',
      badgeTa: 'அங்கீகரிக்கப்பட்ட விநியோகஸ்தர்',
      badgeSi: 'බලයලත් බෙදාහරින්නා',
      titleEn: 'RANI ANIMAL FEED SOLUTIONS',
      titleTa: 'ராணி விலங்கு தீவன தீர்வுகள்',
      titleSi: 'රාණි සතුන්ගේ ආහාර විසඳුම්',
      subtitleEn: 'Premium poultry, cattle & livestock feeds engineered for optimal health.',
      subtitleTa: 'கோழி மற்றும் கால்நடை வளர்ப்புக்கான உயர்தர ஊட்டச்சத்து தீவனங்கள்.',
      subtitleSi: 'පශු සම්පත් සඳහා උසස් තත්ත්වයේ ආහාර විසඳුම්.',
      tag: '🌾 Trusted Livestock Nutrition',
    },
    {
      id: 4,
      image: '/images/storefront_3d.jpg',
      badgeEn: 'MULTI-CATEGORY STORE',
      badgeTa: 'பல்வேறு வகை கடைகள்',
      badgeSi: 'බහු-වර්ගවල වෙළඳසැල',
      titleEn: 'VENTERSHOP VIRTUAL MARKETPLACE',
      titleTa: 'வென்டர்ஷாப் வர்ச்சுவல் சந்தை',
      titleSi: 'වෙන්ටර්ෂොප් වර්චුවල් වෙළඳපල',
      subtitleEn: 'Connecting local entrepreneurs and buyers under one digital e-commerce hub.',
      subtitleTa: 'உள்ளூர் வணிகர்களையும் வாங்குபவர்களையும் இணைக்கும் ஒரே இணையதளம்.',
      subtitleSi: 'දේශීය ව්‍යවසායකයින් සහ මිලදී ගන්නන් එක් කරන ඩිජිටල් වේදිකාව.',
      tag: '🌟 Verified Ceylon Sellers',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto transition every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full bg-[#021838] relative overflow-hidden border-b-4 border-[#FFB800]">
      
      {/* Dynamic Animated Background Slideshow */}
      <div
        className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image Carousel Layer */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image with subtle zoom keyframe */}
            <img
              src={slide.image}
              alt={slide.titleEn}
              className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                index === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Premium Dark Gradient Overlay for optimal legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#021430]/95 via-[#021838]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-transparent to-[#021838]/50" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Animated Text & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left text-white">
              
              {/* Tag / Category Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800] text-[#021838] font-black text-xs uppercase tracking-wider shadow-lg animate-bounce-slow">
                <Sparkles className="w-3.5 h-3.5 text-[#021838]" />
                <span>{slides[currentSlide].tag}</span>
              </div>

              {/* Main Subtitle Slogan */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wider uppercase">
                  {isTa ? 'ஷாப்பிங் வாய்ப்புகளை சந்திக்கும் இடம்' : isSi ? 'සාප්පු සවාරිය අවස්ථාවන් සමඟ හමුවන ස්ථානය' : 'Where Shopping Meets Opportunity'}
                </p>
              </div>

              {/* Animated Main Slide Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-md">
                {isTa
                  ? slides[currentSlide].titleTa
                  : isSi
                  ? slides[currentSlide].titleSi
                  : slides[currentSlide].titleEn}
              </h1>

              {/* Slide Description */}
              <p className="text-xs sm:text-base text-blue-100 font-medium leading-relaxed max-w-xl">
                {isTa
                  ? slides[currentSlide].subtitleTa
                  : isSi
                  ? slides[currentSlide].subtitleSi
                  : slides[currentSlide].subtitleEn}
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-gray-200">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/15">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>{isTa ? '100% அசல் தயாரிப்புகள்' : isSi ? '100% විශ්වාසනීය නිෂ්පාදන' : '100% Genuine Quality Products'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/15">
                  <Globe2 className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>{isTa ? 'சர்வதேச ஏற்றுமதி வசதி' : isSi ? 'ගෝලීය අපනයන සේවාව' : 'Worldwide Export Shipping'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/15">
                  <Truck className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>{isTa ? 'இலங்கை முழுவதும் வேகமான விநியோகம்' : isSi ? 'දිවයින පුරාම බෙදාහැරීම' : 'Fast Delivery Across Sri Lanka'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/15">
                  <ShieldCheck className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>{isTa ? 'பாதுகாப்பான கட்டணம் & வவுச்சர்கள்' : isSi ? 'ආරක්ෂිත ගෙවීම්' : 'Secure Checkout & Vouchers'}</span>
                </div>
              </div>

              {/* Action Buttons with Logo Matching Blue & Gold theme */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="#featured-products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black text-[#021838] bg-[#FFB800] hover:bg-[#FFA800] transition-all shadow-xl transform hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isTa ? 'தயாரிப்புகளைப் பார்க்க' : isSi ? 'නිෂ්පාදන බලන්න' : 'Shop Featured Products'}</span>
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0052CC] hover:bg-[#0041A8] transition-all shadow-lg border border-blue-400/30 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-amber-300" />
                  <span>{isTa ? 'கடைகளை ஆராய்க' : isSi ? 'සාප්පු ගවේෂණය කරන්න' : 'Browse All Shops'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Glassmorphism Showcase Card with Badge Logo */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative">
              <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-center space-y-4 transform hover:scale-102 transition-transform duration-300">
                <div className="relative mx-auto w-36 h-36 flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 shadow-inner">
                  <img
                    src="/images/logo-badge.png"
                    alt="VENTERSHOP Official Badge"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-wide uppercase">VENTERSHOP CEYLON</h3>
                  <p className="text-amber-300 text-xs font-bold mt-0.5">Find More. Shop Smart.</p>
                </div>
                <div className="pt-2 border-t border-white/15 text-[11px] text-blue-100 flex justify-around font-semibold">
                  <div>
                    <span className="block text-amber-400 font-extrabold text-sm">1000+</span>
                    <span>Products</span>
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <div>
                    <span className="block text-amber-400 font-extrabold text-sm">25+</span>
                    <span>Distributors</span>
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <div>
                    <span className="block text-amber-400 font-extrabold text-sm">24/7</span>
                    <span>Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#0052CC] text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots (4 Slides) */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#FFB800] shadow-md'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Blue & Gold Location & Guarantee Strip */}
      <div className="w-full bg-[#0052CC] text-white py-3 px-4 text-center border-t border-blue-400/20">
        <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide">
          <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
          <span>{isTa ? 'இலங்கை முழுவதும் இல்லங்களுக்கு விரைவான விநியோகம் & சர்வதேச ஏற்றுமதி.' : isSi ? 'ශ්‍රී ලංකාව පුරාම නිවසටම බෙදාහැරීම සහ ගෝලීය අපනයන.' : 'Fast Delivery Across All 25 Districts in Sri Lanka & Direct Global Export.'}</span>
        </p>
      </div>
    </div>
  );
}
