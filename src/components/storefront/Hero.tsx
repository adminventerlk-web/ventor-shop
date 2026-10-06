'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Truck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  // 4 Rotating animated hero background slides - tailored specifically for VENTERSHOP
  const slides = [
    {
      id: 1,
      image: '/images/sri_lankan_exports.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoKAAcABUB8JagCdADcqZqWUAAA3NdCC3rJvBeyyj4GX54CRDgEe/6TiCkCWygTzQAAAA==',
      dominantColor: '#021430',
      tagEn: '🇱🇰 DIRECT CEYLON EXPORTS & SPICES',
      tagTa: '🇱🇰 இலங்கை நேரடி ஏற்றுமதி & மசாலா பொருட்கள்',
      tagSi: '🇱🇰 ශ්‍රී ලාංකීය සෘජු කුළුබඩු සහ අපනයන',
      titleLine1En: 'AUTHENTIC CEYLON EXPORTS,',
      titleLine1Ta: 'உண்மையான இலங்கை ஏற்றுமதி பொருட்கள்,',
      titleLine1Si: 'නියම ශ්‍රී ලාංකීය අපනයන නිෂ්පාදන,',
      titleLine2En: 'SHIPPED DIRECTLY WORLDWIDE.',
      titleLine2Ta: 'உலகெங்கும் பாதுகாப்பாக டெலிவரி.',
      titleLine2Si: 'ලොව පුරා සුරක්ෂිතව බෙදාහැරේ.',
      subtitleEn:
        'Direct source Ceylon cinnamon, premium single-origin black tea, cloves, and authentic local goods shipped securely from Sri Lanka to international buyers.',
      subtitleTa:
        'உண்மையான இலங்கை இலவங்கப்பட்டை, பிரீமியம் கருப்பு தேயிலை, கிராம்பு மற்றும் பாரம்பரிய உள்ளூர் பொருட்கள் இலங்கையிலிருந்து உலகெங்கும் உள்ள வாங்குபவர்களுக்கு பாதுகாப்பாக அனுப்பப்படுகிறது.',
      subtitleSi:
        'ශ්‍රී ලාංකීය කුරුඳු, තේ, කරාබුනැටි ඇතුළු ගුණාත්මක නිෂ්පාදන ලොව පුරා පාරිභෝගිකයින් වෙත විශ්වාසනීයව සෘජුවම ලබාගන්න.',
      ctaTextEn: 'Explore Export Catalog',
      ctaTextTa: 'ஏற்றுமதி பட்டியலை காண்க',
      ctaTextSi: 'අපනයන නාමාවලිය',
      ctaLink: '/export',
    },
    {
      id: 2,
      image: '/images/groceries_basket.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoKAAoABUB8JZACdAEQE6TU+OQAAP7h7OSV4Mw7NC5KofJeBv1dQ7j5CMfDpt7eZiSzhP5bGoyaEz2gAAA=',
      dominantColor: '#021430',
      tagEn: '🛒 DAILY ESSENTIALS & SUPERMARKET',
      tagTa: '🛒 மளிகை பொருட்கள் & சூப்பர் மார்க்கெட்',
      tagSi: '🛒 දෛනික අත්‍යවශ්‍ය ආහාර ද්‍රව්‍ය',
      titleLine1En: 'FRESH DAILY PROVISIONS,',
      titleLine1Ta: 'புதிய மளிகைப் பொருட்கள்,',
      titleLine1Si: 'නැවුම් දෛනික ආහාර ද්‍රව්‍ය,',
      titleLine2En: 'DELIVERED TO YOUR DOORSTEP.',
      titleLine2Ta: 'உங்கள் இல்லத்திற்கே விரைவான டெலிவரி.',
      titleLine2Si: 'ඔබේ නිවසටම කඩිනමින් බෙදාහැරේ.',
      subtitleEn:
        'Top-quality rice, pantry staples, cooking essentials, and household goods delivered safely across all 25 districts in Sri Lanka.',
      subtitleTa:
        'உயர்தர அரிசி வகைகள், சமையல் பொருட்கள், மற்றும் வீட்டு உபயோகப் பொருட்கள் இலங்கை முழுவதும் உள்ள 25 மாவட்டங்களுக்கும் விரைவாக அனுப்பி வைக்கப்படுகிறது.',
      subtitleSi:
        'උසස් තත්ත්වයේ සහල්, දෛනික කුළුබඩු සහ ගෘහස්ථ ද්‍රව්‍ය දිවයිනේ සියලු දිස්ත්‍රික්ක වෙත ආරක්ෂිතව බෙදාහැරේ.',
      ctaTextEn: 'Shop Daily Groceries',
      ctaTextTa: 'மளிகை பொருட்கள் வாங்க',
      ctaTextSi: 'ආහාර ද්‍රව්‍ය මිලදී ගන්න',
      ctaLink: '/shop?category=groceries',
    },
    {
      id: 3,
      image: '/images/rani_animal_feed.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoKAAoABUB8JZACdAEQFOxffEAA/uDObunmPptbt2mELJiOCathnh1oNkWVc2GPmOAJzaAA',
      dominantColor: '#021430',
      tagEn: '🌾 OFFICIAL RANI LIVESTOCK & POULTRY FEED',
      tagTa: '🌾 ராணி கால்நடை & கோழி தீவனங்கள்',
      tagSi: '🌾 රාණි සත්ව සහ කුකුළු ආහාර',
      titleLine1En: 'MAXIMIZE FARM YIELD & HEALTH,',
      titleLine1Ta: 'பண்ணை உற்பத்தி மற்றும் ஆரோக்கியத்தை அதிகரிக்க,',
      titleLine1Si: 'ගොවිපල ඵලදායිතාව ඉහළ නැංවීමට,',
      titleLine2En: 'WITH SCIENTIFICALLY FORMULATED FEED.',
      titleLine2Ta: 'அறிவியல் முறைப்படி தயாரிக்கப்பட்ட தீவனங்கள்.',
      titleLine2Si: 'විද්‍යාත්මකව සකස් කළ පෝෂණ ආහාර.',
      subtitleEn:
        'Scientifically balanced poultry, broiler, layer, and dairy cattle feeds. Order in bulk for farms and retail stores across Sri Lanka.',
      subtitleTa:
        'கோழி வளர்ப்பு, முட்டை உற்பத்தி மற்றும் கறவை மாடுகளுக்கான உயர்தர அறிவியல் ஊட்டச்சத்து தீவனங்கள். இலங்கை முழுவதும் பண்ணைகளுக்கே நேரடியாக டெலிவரி.',
      subtitleSi:
        'කුකුළු, බිත්තර සහ කිරි ගවයන් සඳහා විද්‍යාත්මකව සකස් කළ උසස් පෝෂණ ආහාර. දිවයින පුරා ගොවිපල වෙත තොග වශයෙන් බෙදාහැරේ.',
      ctaTextEn: 'Order Animal Feed',
      ctaTextTa: 'தீவனங்களை ஆர்டர் செய்க',
      ctaTextSi: 'සත්ව ආහාර ඇණවුම් කරන්න',
      ctaLink: '/shop?category=animal-feed',
    },
    {
      id: 4,
      image: '/images/storefront_3d.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoKAAoABUB8JaACdADZPzzgAAD+xnBz1pLw4noBNpyC03+WiBhk631mDIKD1rJ7lorAlWQ+sAA=',
      dominantColor: '#021430',
      tagEn: '🏪 SRI LANKAN MERCHANT MARKETPLACE',
      tagTa: '🏪 இலங்கை விற்பனையாளர்களின் டிஜிட்டல் சந்தை',
      tagSi: '🏪 දේශීය ව්‍යවසායක ඩිජිටල් වෙළඳපල',
      titleLine1En: 'SUPPORT LOCAL MERCHANTS,',
      titleLine1Ta: 'உள்ளூர் வணிகர்களை ஆதரிப்போம்,',
      titleLine1Si: 'දේශීය ව්‍යවසායකයින් ශක්තිමත් කරමු,',
      titleLine2En: 'SHOP DIRECT WITH COMMUNITY SAVINGS.',
      titleLine2Ta: 'சிறப்பு வவுச்சர்களுடன் வாங்குங்கள்.',
      titleLine2Si: 'විශේෂ වවුචර් සමඟ මිලදී ගන්න.',
      subtitleEn:
        'Connect with verified local producers, access V2CC community discounts, student vouchers, and wholesale pricing on authentic Sri Lankan products.',
      subtitleTa:
        'சரிபார்க்கப்பட்ட இலங்கை விற்பனையாளர்களிடம் இருந்து நேரடியாகப் பொருட்கள் வாங்கவும், V2CC சமூக வவுச்சர்கள் மற்றும் தள்ளுபடிகளைப் பெறவும் வென்டர்ஷாப்பில் இணையுங்கள்.',
      subtitleSi:
        'තහවුරු කළ දේශීය නිෂ්පාදකයින්ගෙන් සෘජුවම මිලදී ගෙන, V2CC ප්‍රජා වවුචර් සහ තොග වට්ටම් දීමනා ලබාගන්න.',
      ctaTextEn: 'Explore Virtual Shops',
      ctaTextTa: 'கடைகளை ஆராய்க',
      ctaTextSi: 'සාප්පු ගවේෂණය කරන්න',
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
      {/* Hero Section - Matching Sithisha Masala & Snacks structure with flex-center and generous vertical padding */}
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
                backgroundColor: slide.dominantColor || '#021430',
              }}
            >
              {/* Ken Burns zooming image with Next.js Image optimizations */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ backgroundColor: slide.dominantColor || '#021430' }}
              >
                <Image
                  src={slide.image}
                  alt={slide.titleLine1En}
                  fill
                  priority={index === 0}
                  placeholder="blur"
                  blurDataURL={slide.blurDataURL}
                  sizes="100vw"
                  className="w-full h-full object-cover object-center"
                  style={{
                    transform: isActive ? 'scale(1.10)' : 'scale(1)',
                    transition: 'transform 7s ease-out',
                    filter: 'brightness(0.85)',
                  }}
                />
              </div>

              {/* Seamless Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#021430]/95 via-[#021430]/80 to-[#021430]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021430] via-transparent to-[#021430]/60" />
            </div>
          );
        })}

        {/* Glowing Decorative Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-[1]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none z-[1]" />

        {/* Content Container - generous padding so buttons and text are 100% visible */}
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

            {/* 2. Main Title with gradient accent */}
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

            {/* 5. Real Trust Features Row - NO FAKE RATINGS, only real platform values */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap gap-6 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>
                  {isTa
                    ? 'சரிபார்க்கப்பட்ட இலங்கை வணிகர்கள்'
                    : isSi
                    ? 'තහවුරු කළ දේශීය වෙළඳුන්'
                    : 'Verified Ceylon Merchants'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>
                  {isTa
                    ? '25 மாவட்டங்களுக்கும் டெலிவரி'
                    : isSi
                    ? 'සියලු දිස්ත්‍රික්ක වෙත බෙදාහැරීම'
                    : 'Islandwide Delivery (All 25 Districts)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {isTa
                    ? 'சர்வதேச நேரடி ஏற்றுமதி'
                    : isSi
                    ? 'ගෝලීය අපනයන සේවාව'
                    : 'Direct Worldwide Export'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>
                  {isTa
                    ? 'சமூக வவுச்சர்கள் & மொத்த விலை'
                    : isSi
                    ? 'ප්‍රජා වවුචර් සහ තොග මිල'
                    : 'Community Vouchers & Wholesale'}
                </span>
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

        {/* Slide Indicators Centered at Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
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

      {/* Sithisha-Style Running Marquee Ticker Bar with Ventershop Real Value Props */}
      <div className="w-full bg-[#011638] text-[#FFB800] py-3.5 overflow-hidden border-y border-blue-900/60 shadow-inner">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2].map((group) => (
            <React.Fragment key={group}>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>CEYLON SPICES & TEA EXPORTS</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>FRESH DAILY GROCERIES</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>OFFICIAL RANI ANIMAL FEED</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>VERIFIED MERCHANT STORES</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>ISLANDWIDE DELIVERY (ALL 25 DISTRICTS)</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>DIRECT GLOBAL EXPORT SHIPPING</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>V2CC COMMUNITY VOUCHERS</span>
                <span className="text-[#FFB800]/50 text-base">•</span>
              </div>
              <div className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
                <span>WHOLESALE & BULK ORDERS</span>
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
