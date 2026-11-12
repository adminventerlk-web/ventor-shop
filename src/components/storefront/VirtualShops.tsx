'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useSectionEntrance } from './useSectionEntrance';
import {
  ShoppingBag,
  Footprints,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Settings,
  MoreHorizontal,
  ArrowRight,
} from 'lucide-react';

export default function VirtualShops() {
  const sectionRef = useSectionEntrance();
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  const virtualShops = [
    {
      id: 'supermarket',
      title: isTa ? 'வர்ச்சுவல் சூப்பர் மார்க்கெட்' : isSi ? 'වර්චුවල් සුපර්මාර්කට්' : 'Virtual Supermarket',
      desc: isTa ? 'மளிகை & அன்றாட அத்தியாவசிய பொருட்கள்' : isSi ? 'බඩු බාහිරාදිය සහ එදිනෙදා අවශ්‍යතා' : 'Groceries & Daily Essentials',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#EBF3FE]',
      borderColor: 'border-[#D0E2FF]',
      iconBg: 'bg-[#007AFF]',
      titleColor: 'text-[#004085]',
      descColor: 'text-[#4A607A]',
      ctaColor: 'text-[#007AFF]',
      href: '/shop?category=groceries',
      buttonText: isTa ? 'இப்போதே வாங்கு' : isSi ? 'දැන් මිලදී ගන්න' : 'Shop Now',
      isAvailable: true,
    },
    {
      id: 'shoe-shop',
      title: isTa ? 'வர்ச்சுவல் ஷூ ஷாப்' : isSi ? 'වර්චුවල් සපත්තු සාප්පුව' : 'Virtual Shoe Shop',
      desc: isTa ? 'காலணிகள், செருப்புகள் & ஆக்சஸரீஸ்' : isSi ? 'සපත්තු, සෙරෙප්පු සහ උපාංග' : 'Shoes, Slippers & Accessories',
      icon: Footprints,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FCE8ED]',
      borderColor: 'border-[#F8D2DC]',
      iconBg: 'bg-[#E11D48]',
      titleColor: 'text-[#881337]',
      descColor: 'text-[#7A4A56]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
    {
      id: 'book-shop',
      title: isTa ? 'வர்ச்சுவல் புக் லேப்' : isSi ? 'වර්චුවල් පොත් සාප්පුව' : 'Virtual Book Lab',
      desc: isTa ? 'புத்தகங்கள், எழுதுபொருட்கள் & கல்வி' : isSi ? 'පොත්, ලිපිද්‍රව්‍ය සහ අධ්‍යාපනික' : 'Books, Stationery & Educational Items',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#F0E6FF]',
      borderColor: 'border-[#E0CCFF]',
      iconBg: 'bg-[#7C3AED]',
      titleColor: 'text-[#4C1D95]',
      descColor: 'text-[#5E4A7A]',
      ctaColor: 'text-[#7C3AED]',
      href: '/shop?category=books-stationery',
      buttonText: isTa ? 'இப்போதே வாங்கு' : isSi ? 'දැන් මිලදී ගන්න' : 'Shop Now',
      isAvailable: true,
    },
    {
      id: 'computer-center',
      title: isTa ? 'வர்ச்சுவல் கணினி மையம்' : isSi ? 'වර්චුවල් පරිගණක මධ්‍යස්ථානය' : 'Virtual Computer Center',
      desc: isTa ? 'கணினிகள், லேப்டாப்கள் & சாதனங்கள்' : isSi ? 'පරිගණක, ලැප්ටොප් සහ උපාංග' : 'Computers, Laptops & Accessories',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#E1F5FE]',
      borderColor: 'border-[#B3E5FC]',
      iconBg: 'bg-[#0284C7]',
      titleColor: 'text-[#0369A1]',
      descColor: 'text-[#4A6B7A]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
    {
      id: 'phone-shop',
      title: isTa ? 'வர்ச்சுவல் போன் ஷாப்' : isSi ? 'වර්චුවල් දුරකථන සාප්පුව' : 'Virtual Phone Shop',
      desc: isTa ? 'மொபைல் போன்கள் & ஆக்சஸரீஸ்' : isSi ? 'ජංගම දුරකථන සහ උපාංග' : 'Mobile Phones & Accessories',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#E6F4EA]',
      borderColor: 'border-[#CEEAD6]',
      iconBg: 'bg-[#0F9D58]',
      titleColor: 'text-[#137333]',
      descColor: 'text-[#4A7A5A]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
    {
      id: 'fashion-store',
      title: isTa ? 'வர்ச்சுவல் ஃபேஷன் ஸ்டோர்' : isSi ? 'වර්චුවල් ඇඳුම් සාප්පුව' : 'Virtual Fashion Store',
      desc: isTa ? 'ஆடைகள், பேக்குகள் & ஃபேஷன்' : isSi ? 'ඇඳුම් පැළඳුම්, බෑග් සහ උපාංග' : 'Clothing, Bags & Accessories',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FFE4E6]',
      borderColor: 'border-[#FECDD3]',
      iconBg: 'bg-[#F43F5E]',
      titleColor: 'text-[#9F1239]',
      descColor: 'text-[#7A4A56]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
    {
      id: 'electronics-shop',
      title: isTa ? 'வர்ச்சுவல் எலக்ட்ரானிக்ஸ்' : isSi ? 'වර්චුවල් ඉලෙක්ට්‍රොනික්ස්' : 'Virtual Electronics Shop',
      desc: isTa ? 'வீட்டு உபயோக & மின்னணு பொருட்கள்' : isSi ? 'ගෘහස්ථ සහ විද්‍යුත් උපකරණ' : 'Home Appliances & Electronics',
      icon: Settings,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FFF8E1]',
      borderColor: 'border-[#FFE082]',
      iconBg: 'bg-[#D97706]',
      titleColor: 'text-[#B45309]',
      descColor: 'text-[#7A6B4A]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
    {
      id: 'more-shops',
      title: isTa ? 'மேலும் கடைகள் விரைவில்' : isSi ? 'තවත් සාප්පු ළඟදීම' : 'More Shops Coming Soon',
      desc: isTa ? 'காத்திருங்கள்!' : isSi ? 'රැඳී සිටින්න!' : 'Stay Tuned!',
      icon: MoreHorizontal,
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#EDE9FE]',
      borderColor: 'border-[#DDD6FE]',
      iconBg: 'bg-[#6366F1]',
      titleColor: 'text-[#4338CA]',
      descColor: 'text-[#5E4A7A]',
      ctaColor: 'text-gray-500',
      href: '#',
      buttonText: isTa ? 'விரைவில்' : isSi ? 'ළඟදීම' : 'Coming Soon',
      isAvailable: false,
    },
  ];

  return (
    <section ref={sectionRef} id="virtual-shops" className="py-8 sm:py-12 bg-white border-b border-gray-100 font-sans scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div data-entrance="up" className="relative text-center space-y-3">
          <span className="inline-flex items-center justify-center gap-3 text-[10px] font-bold tracking-[.12em] text-[#800020] uppercase before:h-px before:w-6 before:bg-[#800020]/25 after:h-px after:w-6 after:bg-[#800020]/25 sm:before:w-12 sm:after:w-12">
            {isTa ? 'எங்களின் பிற வர்ச்சுவல் கடைகள்' : 'OUR OTHER VIRTUAL SHOPS'}
          </span>
          <h2 className="mx-auto max-w-3xl font-serif text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.2] tracking-[-.02em] text-[#102b4c]">
            {isTa ? 'VENTERSHOP இல் மேலும் கடைகளை ஆராயுங்கள்' : 'Explore More Shops on VENTERSHOP'}
          </h2>
          <p className="mx-auto max-w-2xl text-xs font-medium leading-relaxed text-[#64748b] sm:text-sm">
            {isTa ? 'பல்வேறு கடைகள், பல சாத்தியக்கூறுகள் - ஒரே தளத்தில்' : 'Different Shops, More Possibilities – All in One Platform'}
          </p>

          {/* Top Right "View All Shops" Button */}
          <div className="flex justify-center lg:justify-end">
            <Link
              href="/virtual-shops"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:text-[#990000] hover:border-[#990000] shadow-xs transition-all duration-200 focus-visible:outline-3 focus-visible:outline-[#075bb9] focus-visible:outline-offset-4 motion-reduce:transition-none!"
            >
              <span>{isTa ? 'அனைத்து கடைகளையும் காண்க' : 'View All Shops'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Existing shop content and availability, presented in a responsive grid. */}
        <div data-shop-grid className="mx-auto grid grid-cols-2 auto-rows-fr gap-3 sm:gap-5 lg:w-[94%] lg:grid-cols-4">
          {virtualShops.map((shop, index) => {
            const Icon = shop.icon;
            const cardClassName = `group flex min-w-0 flex-col rounded-3xl border ${shop.borderColor} ${shop.cardBg} bg-linear-to-b from-white/65 to-transparent p-2.5 text-center shadow-[0_6px_18px_-12px_#264b7040] transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-[5px] hover:shadow-[0_14px_26px_-14px_#264b7055] motion-reduce:hover:translate-y-0 motion-reduce:transition-none! sm:p-4`;
            const content = (
              <>
                <div className="relative mb-6 w-full sm:mb-7">
                  <div className="h-[112px] overflow-hidden rounded-2xl bg-white/60 sm:h-[180px] lg:h-[170px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shop.image} alt={shop.title} loading="lazy" width={400} height={280}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:scale-100! motion-reduce:transition-none" />
                  </div>
                  <span aria-hidden="true" className={`absolute -bottom-4 right-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white ${shop.iconBg} text-white shadow-sm sm:-bottom-5 sm:right-3 sm:h-11 sm:w-11`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <h3 className={`flex min-h-[36px] items-center justify-center text-[13px] font-bold leading-[1.35] tracking-[-.015em] ${shop.titleColor} sm:min-h-[44px] sm:text-base`}>{shop.title}</h3>
                  <p className={`mt-1 mb-4 text-[11px] font-medium leading-[1.5] ${shop.descColor} sm:text-xs`}>{shop.desc}</p>
                  <span className={`mt-auto inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-[11px] font-bold leading-[1.3] sm:mt-auto sm:min-h-11 sm:px-3 sm:text-xs ${shop.isAvailable ? (shop.id === 'supermarket' ? 'border-[#004085] bg-[#004085] text-white' : 'border-[#4C1D95] bg-[#4C1D95] text-white') : 'border-white/80 bg-white/60 text-[#566176]'}`}>
                    {shop.buttonText}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  </span>
                </div>
              </>
            );
            return shop.isAvailable ? (
              <Link key={shop.id} data-entrance="up" data-entrance-delay={100 + index * 85} href={shop.href} className={`${cardClassName} focus-visible:outline-3 focus-visible:outline-[#075bb9] focus-visible:outline-offset-4`}>
                {content}
              </Link>
            ) : (
              <div key={shop.id} data-entrance="up" data-entrance-delay={100 + index * 85} aria-disabled="true" className={cardClassName}>
                {content}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
