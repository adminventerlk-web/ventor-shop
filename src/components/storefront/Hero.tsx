'use client';

import React, { useState, useEffect } from 'react';
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
      subtitleSi: 'දේශීය ව්‍යවසායකයින් සහ මිලදී ගන්නන් එක් කරන ඩිජිටල් වේදිකාව.',
      tag: '🌟 100% Verified Ceylon Merchants',
      category: 'Virtual Shops',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto transition every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full bg-[#FCFAF7] relative overflow-hidden select-none border-b border-gray-200">
      
      {/* Slideshow Area */}
      <div className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
        
        {/* Background Images Layer with Soft Contrast Overlay */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.titleEn}
                className={`w-full h-full object-cover object-center transform transition-transform duration-5000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Bright clean gradient overlay for crisp white/light aesthetic */}
              <div className="absolute inset-0 bg-white/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40" />
            </div>
          );
        })}

        {/* Hero Content Box */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
          <div className="max-w-3xl space-y-4 text-left text-gray-900">
            
            {/* Category Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    idx === currentSlide
                      ? 'bg-[#0052CC] text-white shadow-md scale-105'
                      : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#0052CC] border border-gray-200'
                  }`}
                >
                  {s.category}
                </button>
              ))}
            </div>

            {/* Tag Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB800] text-[#021838] font-black text-xs uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#021838]" />
              <span>{slides[currentSlide].tag}</span>
            </div>

            {/* Main Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#021838] leading-tight font-sans">
                {isTa
                  ? slides[currentSlide].titleTa
                  : isSi
                  ? slides[currentSlide].titleSi
                  : slides[currentSlide].titleEn}
              </h1>
              <p className="text-xs sm:text-base text-gray-700 font-semibold leading-relaxed max-w-2xl">
                {isTa
                  ? slides[currentSlide].subtitleTa
                  : isSi
                  ? slides[currentSlide].subtitleSi
                  : slides[currentSlide].subtitleEn}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-gray-800 pt-1">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0052CC] shrink-0" />
                <span>{isTa ? '100% அசல் தர உத்தரவாதம்' : isSi ? '100% විශ්වාසනීය නිෂ්පාදන' : '100% Genuine Quality Goods'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs">
                <Globe2 className="w-4 h-4 text-[#0052CC] shrink-0" />
                <span>{isTa ? 'சர்வதேச ஏற்றுமதி விநியோகம்' : isSi ? 'ගෝලීය අපනයන සේවාව' : 'Direct Global Export Shipping'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs">
                <Truck className="w-4 h-4 text-[#0052CC] shrink-0" />
                <span>{isTa ? 'இலங்கை முழுவதும் வேகமான டெலிவரி' : isSi ? 'දිවයින පුරාම බෙදාහැරීම' : 'Fast Delivery Across Sri Lanka'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0052CC] shrink-0" />
                <span>{isTa ? 'பாதுகாப்பான கட்டணம் & வவுச்சர்கள்' : isSi ? 'ආරක්ෂිත ගෙවීම්' : 'Safe Checkout & Vouchers'}</span>
              </div>
            </div>

            {/* Dual Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#featured-products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#0052CC] hover:bg-[#003893] transition-all shadow-xl transform hover:-translate-y-1 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <ShoppingCart className="w-4 h-4 text-[#FFB800]" />
                <span>{isTa ? 'தயாரிப்புகளைப் பார்க்க' : isSi ? 'නිෂ්පාදන බලන්න' : 'Shop Featured Products'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#021838] bg-[#FFB800] hover:bg-[#FFA500] transition-all shadow-md transform hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#021838]" />
                <span>{isTa ? 'கடைகளை ஆராய்க' : isSi ? 'සාප්පු ගවේෂණය කරන්න' : 'Browse All Shops'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-30 p-2.5 rounded-full bg-white/80 hover:bg-[#0052CC] text-[#021838] hover:text-white backdrop-blur-md border border-gray-200 transition-all cursor-pointer hover:scale-110 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-30 p-2.5 rounded-full bg-white/80 hover:bg-[#0052CC] text-[#021838] hover:text-white backdrop-blur-md border border-gray-200 transition-all cursor-pointer hover:scale-110 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#0052CC] shadow-md'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Delivery Bar Directly Attached */}
      <div className="w-full bg-[#0052CC] text-white py-2.5 px-4 text-center border-t border-blue-400/40">
        <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide">
          <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
          <span>{isTa ? 'இலங்கை முழுவதும் இல்லங்களுக்கு விரைவான விநியோகம் & சர்வதேச ஏற்றுமதி.' : isSi ? 'ශ්‍රී ලංකාව පුරාම නිවසටම බෙදාහැරීම සහ ගෝලීය අපනයන.' : 'Fast Delivery Across All 25 Districts in Sri Lanka & Direct Global Export.'}</span>
        </p>
      </div>
    </div>
  );
}
