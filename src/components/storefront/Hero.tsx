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
  UserPlus,
  ShoppingBag,
  HeartHandshake,
  PhoneCall,
  Briefcase,
  Layers,
} from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  // 4 Rotating animated hero background slides - tailored specifically for VENTERPRISE
  const slides = [
    {
      id: 1,
      image: '/images/hero_banner.webp',
      imageClass: styles.ceylon,
      blurDataURL:
        'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoKAAcABUB8JagCdADcqZqWUAAA3NdCC3rJvBeyyj4GX54CRDgEe/6TiCkCWygTzQAAAA==',
      dominantColor: '#021430',
      tagEn: '🇱🇰 100% CEYLON LOCAL & DOMESTIC PRODUCTS',
      tagTa: '🇱🇰 100% உள்ளூர் உற்பத்தி பொருட்கள்',
      tagSi: '🇱🇰 100% දේශීය නිෂ්පාදන සහ භාණ්ඩ',
      titleLine1En: 'PROUDLY CELEBRATING,',
      titleLine1Ta: 'பெருமையுடன் வழங்கும்,',
      titleLine1Si: 'අභිමානවත් ලෙස පිරිනමන,',
      titleLine2En: 'AUTHENTIC LOCAL PRODUCTS.',
      titleLine2Ta: 'உண்மையான உள்ளூர் உற்பத்தி பொருட்கள்.',
      titleLine2Si: 'නියම දේශීය නිෂ්පාදන එකතුව.',
      subtitleEn:
        'Discover authentic homegrown provisions, pure Ceylon spices, handcrafted domestic goods, and quality artisan products manufactured across Sri Lanka.',
      subtitleTa:
        'இலங்கை முழுவதிலும் உள்ள கைவினைப் பொருட்கள், புதிய விவசாய விளைபொருட்கள், தூய மசாலாக்கள் மற்றும் உயர்தர உள்ளூர் உற்பத்திப் பொருட்களை நேரடியாகப் பெற்றுக்கொள்ளுங்கள்.',
      subtitleSi:
        'දිවයින පුරා දේශීයව නිෂ්පාදිත අත්කම් භාණ්ඩ, නැවුම් ගොවිපල අස්වැන්න, කුළුබඩු සහ සුවිශේෂී දේශීය නිෂ්පාදන එකම තැනකින් පහසුවෙන් මිලදී ගන්න.',
      primaryCtaTextEn: 'Register as Customer',
      primaryCtaTextTa: 'இப்போதே இணையுங்கள்',
      primaryCtaTextSi: 'පාරිභෝගික ලියාපදිංචිය',
      primaryCtaLink: '/login?tab=register',
      secondaryCtaTextEn: 'Browse Catalog',
      secondaryCtaTextTa: 'தயாரிப்பு பட்டியல்',
      secondaryCtaTextSi: 'නාමාවලිය බලන්න',
      secondaryCtaLink: '/shop',
      secondaryIconType: 'bag',
    },
    {
      id: 2,
      image: '/images/storefront_3d.webp',
      imageClass: styles.storefront,
      blurDataURL:
        'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoKAAoABUB8JaACdADZPzzgAAD+xnBz1pLw4noBNpyC03+WiBhk631mDIKD1rJ7lorAlWQ+sAA=',
      dominantColor: '#021430',
      tagEn: '🏬 VIRTUAL MULTISHOP MARKETPLACE',
      tagTa: '🏬 டிஜிட்டல் மல்டிஷாப் சந்தை',
      tagSi: '🏬 අතථ්‍ය බහු-වෙළඳසැල් වෙළඳපල',
      titleLine1En: 'ONE PLATFORM,',
      titleLine1Ta: 'ஒரே மேடையில்,',
      titleLine1Si: 'එක් ඩිජිටල් තලයකින්,',
      titleLine2En: 'HUNDREDS OF VIRTUAL SHOPS.',
      titleLine2Ta: 'நூற்றுக்கணக்கான டிஜிட்டல் கடைகள்.',
      titleLine2Si: 'සිය ගණනක් අතථ්‍ය වෙළඳසැල්.',
      subtitleEn:
        'Explore our interactive Virtual Multishop where verified merchants showcase certified boutique storefronts, regional collections, and direct-from-origin goods.',
      subtitleTa:
        'சரிபார்க்கப்பட்ட வணிகர்களின் பிரத்யேக டிஜிட்டல் கடைகள், பிராந்திய தயாரிப்புகள் மற்றும் சிறப்பு ஸ்டோர்களை ஒரே இடத்தில் பார்வையிட்டு மகிழுங்கள்.',
      subtitleSi:
        'තහවුරු කළ වෙළඳුන්ගේ සුවිශේෂී ඩිජිටල් වෙළඳසැල් සහ සන්නාම කුටි වෙත පිවිස දිවයිනේ විශිෂ්ටතම නිෂ්පාදන සෘජුවම මිලදී ගන්න.',
      primaryCtaTextEn: 'Explore Shops',
      primaryCtaTextTa: 'கடைகளை ஆராய்க',
      primaryCtaTextSi: 'සාප්පු ගවේෂණය',
      primaryCtaLink: '/shops',
      secondaryCtaTextEn: 'Register Your Shop',
      secondaryCtaTextTa: 'உங்கள் கடையை சேர்க்க',
      secondaryCtaTextSi: 'වෙළඳසැල එක්කරන්න',
      secondaryCtaLink: '/login?tab=register&role=vendor',
      secondaryIconType: 'store',
    },
    {
      id: 3,
      image: '/images/groceries_basket.webp',
      imageClass: styles.groceries,
      blurDataURL:
        'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoKAAoABUB8JZACdAEQE6TU+OQAAP7h7OSV4Mw7NC5KofJeBv1dQ7j5CMfDpt7eZiSzhP5bGoyaEz2gAAA=',
      dominantColor: '#021430',
      tagEn: '🤝 PEOPLE MULTI SHOP & V2CC SAVINGS',
      tagTa: '🤝 மக்கள் மல்டிஷாப் & V2CC சமூகம்',
      tagSi: '🤝 ජනතා බහු-වෙළඳසැල සහ V2CC ප්‍රතිලාභ',
      titleLine1En: "PEOPLE'S MULTI-SHOP,",
      titleLine1Ta: 'மக்கள் மல்டிஷாப்,',
      titleLine1Si: 'ජනතා බහු-වෙළඳසැල,',
      titleLine2En: 'COMMUNITY DISCOUNTS & SUBSIDIES.',
      titleLine2Ta: 'சமூக சேமிப்பு & சிறப்பு சலுகைகள்.',
      titleLine2Si: 'ප්‍රජා වට්ටම් සහ විශේෂ දීමනා.',
      subtitleEn:
        'Register as a V2CC Community Member to unlock exclusive welfare offers, subsidized consumer rates, student gift vouchers, and maximum household savings.',
      subtitleTa:
        'V2CC சமூக உறுப்பினராகப் பதிவு செய்து பிரத்யேக தள்ளுபடி சலுகைகள், மானிய விலைகள், கல்வி வவுச்சர்கள் மற்றும் குடும்பத்திற்கான அதிகபட்ச சேமிப்பு நன்மைகளைப் பெறுங்கள்.',
      subtitleSi:
        'V2CC ප්‍රජා සාමාජිකයෙකු ලෙස ලියාපදිංචි වී සුවිශේෂී සහනාධාර මිල ගණන්, අධ්‍යාපනික වවුචර් දීමනා සහ විශේෂ වට්ටම් රැසක් අත්විඳින්න.',
      primaryCtaTextEn: 'Join V2CC Member',
      primaryCtaTextTa: 'V2CC உறுப்பினராக சேர',
      primaryCtaTextSi: 'V2CC සාමාජිකයෙකු වන්න',
      primaryCtaLink: '/login?tab=register',
      secondaryCtaTextEn: 'Explore Shops',
      secondaryCtaTextTa: 'கடைகளை ஆராய்க',
      secondaryCtaTextSi: 'සාප්පු ගවේෂණය',
      secondaryCtaLink: '/shops',
      secondaryIconType: 'store',
    },
    {
      id: 4,
      image: '/images/hero/ceylon-exports.png',
      imageClass: styles.feed,
      blurDataURL:
        'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoKAAoABUB8JZACdAEQFOxffEAA/uDObunmPptbt2mELJiOCathnh1oNkWVc2GPmOAJzaAA',
      dominantColor: '#021430',
      tagEn: '📈 INVESTOR RELATIONS & PARTNERSHIPS',
      tagTa: '📈 முதலீட்டாளர்கள் & வணிகக் கூட்டு',
      tagSi: '📈 ආයෝජක සම්බන්ධතා සහ හවුල්කාරිත්වය',
      titleLine1En: 'GROW WITH VENTERPRISE,',
      titleLine1Ta: 'வென்டர்பிரைஸ் உடன் இணையுங்கள்,',
      titleLine1Si: 'වෙන්ටර්ප්‍රයිස් සමඟ එක්වන්න,',
      titleLine2En: 'SCALE COMMERCE & EXPORT VENTURES.',
      titleLine2Ta: 'வலுவான வணிக வளர்ச்சி காண்போம்.',
      titleLine2Si: 'ඉහළ ප්‍රතිලාභ ලබන වාණිජ්‍යය.',
      subtitleEn:
        'Partner with Sri Lanka’s next-generation e-commerce ecosystem. Invest in localized supply chains, digital producer empowerment, and high-growth commercial export networks.',
      subtitleTa:
        'இலங்கையின் அதிவேகமாக வளரும் டிஜிட்டல் சந்தை வலையமைப்பில் முதலீடு செய்து, உள்ளூர் உற்பத்தியாளர்கள் மேம்பாடு மற்றும் சர்வதேச ஏற்றுமதி வளர்ச்சியில் கூட்டு சேருங்கள்.',
      subtitleSi:
        'ශ්‍රී ලංකාවේ වේගයෙන්ම වර්ධනය වන ඩිජිටල් වෙළඳපල ජාලය සමඟ එක්ව දේශීය සැපයුම් දාම සහ අපනයන ක්ෂේත්‍රයේ නව ආයෝජන අවස්ථා ලබාගන්න.',
      primaryCtaTextEn: 'Explore Shops',
      primaryCtaTextTa: 'கடைகளை ஆராய்க',
      primaryCtaTextSi: 'සාප්පු ගවේෂණය',
      primaryCtaLink: '/shops',
      secondaryCtaTextEn: 'Contact Us',
      secondaryCtaTextTa: 'தொடர்பு கொள்ள',
      secondaryCtaTextSi: 'අප අමතන්න',
      secondaryCtaLink: '/contact',
      secondaryIconType: 'contact',
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

            {/* 4. Action Buttons - Tailored specifically per slide */}
            <div
              key={`cta-${currentSlide}`}
              className={styles.actions}
              style={{ animation: 'heroFadeSlideIn 0.5s ease-out 0.3s both' }}
            >
              <Link
                href={current.primaryCtaLink}
                className={styles.primary}
              >
                <span>
                  {isTa
                    ? current.primaryCtaTextTa
                    : isSi
                    ? current.primaryCtaTextSi
                    : current.primaryCtaTextEn}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href={current.secondaryCtaLink}
                className={styles.secondary}
              >
                {current.secondaryIconType === 'bag' && <ShoppingBag className="w-4 h-4" />}
                {current.secondaryIconType === 'store' && <Store className="w-4 h-4" />}
                {current.secondaryIconType === 'contact' && <PhoneCall className="w-4 h-4" />}
                <span>
                  {isTa
                    ? current.secondaryCtaTextTa
                    : isSi
                    ? current.secondaryCtaTextSi
                    : current.secondaryCtaTextEn}
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
