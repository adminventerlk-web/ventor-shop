'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
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
      image: '/images/hero/ceylon-exports.png',
      imageClass: styles.ceylon,
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
      imageClass: styles.groceries,
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
      imageClass: styles.feed,
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
      imageClass: styles.storefront,
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
  const secondLine = isTa ? current.titleLine2Ta : isSi ? current.titleLine2Si : current.titleLine2En;
  const secondLineWords = secondLine.split(' ');
  const highlightWordCount = (currentSlide === 0 && !isTa && !isSi) || secondLineWords.length <= 2 ? 1 : 2;
  const highlightedPhrase = secondLineWords.slice(-highlightWordCount).join(' ');
  const highlightStart = secondLine.length - highlightedPhrase.length;

  return (
    <>
      <section className={styles.hero} aria-label="Featured collections" aria-roledescription="carousel"
        onKeyDown={(event) => {
          if ((event.target as HTMLElement).tagName === 'INPUT') return;
          if (event.key === 'ArrowLeft') { event.preventDefault(); handlePrev(); }
          if (event.key === 'ArrowRight') { event.preventDefault(); handleNext(); }
        }}>
        <div className={styles.stage}>
          <div className={styles.content} aria-live="off">
            {/* 1. Tag Highlight Badge */}
            <div
              key={`tag-${currentSlide}`}
              className={styles.badge}
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out both' }}
            >
              <Sparkles className="w-4 h-4 text-green-600" />
              <span>
                {isTa ? current.tagTa : isSi ? current.tagSi : current.tagEn}
              </span>
            </div>

            {/* 2. Main Title with a short blue accent */}
            <h1
              key={`title-${currentSlide}`}
              className="my-[15px] font-serif text-[clamp(21.32px,5.576vw,24.6px)] font-[600] not-italic leading-[1.18] tracking-[-.02em] text-[#0F172A] [overflow-wrap:anywhere] md:my-4 md:text-[clamp(24.6px,2.706vw,27.88px)] lg:text-[clamp(29.52px,2.1648vw,32.8px)]"
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.1s both' }}
            >
              {isTa
                ? current.titleLine1Ta
                : isSi
                ? current.titleLine1Si
                : current.titleLine1En}{' '}
              <span className="mt-1 block">
                {secondLine.slice(0, highlightStart)}
                <span className="text-[#0B5DBB]">{highlightedPhrase}</span>
              </span>
            </h1>

            {/* 3. Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className={styles.description}
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
              className={styles.actions}
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.3s both' }}
            >
              <Link
                href={current.ctaLink}
                className={styles.primary}
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
                className={styles.secondary}
              >
                <Store className="w-4 h-4" />
                <span>
                  {isTa
                    ? 'கடைகளை ஆராய்க'
                    : isSi
                    ? 'සාප්පු ගවේෂණය'
                    : 'Explore Shops'}
                </span>
              </Link>
            </div>


          </div>
          <div className={styles.visual}>
            <div className={styles.imageFrame}>
              {slides.map((slide, index) => (
                <div key={slide.id} className={`${styles.imageSlide} ${slide.imageClass}`} aria-hidden={index !== currentSlide}
                  style={{ opacity: index === currentSlide ? 1 : 0 }}>
                  <Image src={slide.image} alt={slide.titleLine1En} fill loading={index === 0 ? 'eager' : 'lazy'}
                    unoptimized={index === 0} fetchPriority={index === 0 ? 'high' : 'auto'}
                    placeholder={index === 0 ? 'empty' : 'blur'} blurDataURL={slide.blurDataURL}
                    sizes="(max-width: 767px) 100vw, 54vw" className={styles.artwork} />
                </div>
              ))}
            </div>
            <div className={styles.indicators} aria-label="Choose a slide">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => goToSlide(idx)}
                  className={styles.indicator} aria-current={idx === currentSlide ? 'true' : undefined}
                  aria-label={`Go to slide ${idx + 1}`} />
              ))}
            </div>
          </div>
          <button onClick={handlePrev} className={`${styles.arrow} ${styles.previous}`} aria-label="Previous Slide">
            <ChevronLeft size={22} />
          </button>
          <button onClick={handleNext} className={`${styles.arrow} ${styles.next}`} aria-label="Next Slide">
            <ChevronRight size={22} />
          </button>
        </div>
            {/* 5. Real Trust Features Row - NO FAKE RATINGS, only real platform values */}
            <div className={styles.trustStrip}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#073979] shrink-0" />
                <span>
                  {isTa
                    ? 'சரிபார்க்கப்பட்ட இலங்கை வணிகர்கள்'
                    : isSi
                    ? 'තහවුරු කළ දේශීය වෙළඳුන්'
                    : 'Verified Ceylon Merchants'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#073979] shrink-0" />
                <span>
                  {isTa
                    ? '25 மாவட்டங்களுக்கும் டெலிவரி'
                    : isSi
                    ? 'සියලු දිස්ත්‍රික්ක වෙත බෙදාහැරීම'
                    : 'Islandwide Delivery (All 25 Districts)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#073979] shrink-0" />
                <span>
                  {isTa
                    ? 'சர்வதேச நேரடி ஏற்றுமதி'
                    : isSi
                    ? 'ගෝලීය අපනයන සේවාව'
                    : 'Direct Worldwide Export'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#073979] shrink-0" />
                <span>
                  {isTa
                    ? 'சமூக வவுச்சர்கள் & மொத்த விலை'
                    : isSi
                    ? 'ප්‍රජා වවුචර් සහ තොග මිල'
                    : 'Community Vouchers & Wholesale'}
                </span>
              </div>
            </div>
      </section>

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
