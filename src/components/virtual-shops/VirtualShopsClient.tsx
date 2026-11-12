'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FlipShopCard from './FlipShopCard';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Store,
  ShoppingBag,
  Footprints,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Settings,
  MoreHorizontal,
  ArrowRight,
  Globe,
} from 'lucide-react';

export default function VirtualShopsClient() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const shopsList = [
    {
      id: 'supermarket',
      title: isTa ? 'வர்ச்சுவல் சூப்பர் மார்க்கெட்' : 'Virtual Supermarket',
      subtitle: isTa ? 'மளிகை & அன்றாட அத்தியாவசிய பொருட்கள்' : 'Groceries, Spices & Daily Essentials',
      desc: isTa
        ? 'இலங்கையின் பாரம்பரிய மசாலாக்கள், பொன்னி அரிசி, பருப்பு, எண்ணெய் மற்றும் அனைத்து மளிகைப் பொருட்களையும் ஒரே இடத்தில் பெறுங்கள்.'
        : 'Fresh groceries, authentic Ceylon spices, rice, pulses, and pantry essentials delivered direct to your doorstep.',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'நேரலை' : 'Live Now',
      badgeColor: 'bg-[#15793B] text-white',
      cardBg: 'bg-[#EEF7F2]',
      borderColor: 'border-[#C8E6D3]',
      iconBg: 'bg-[#15793B]',
      titleColor: 'text-[#15793B]',
      href: '/shop?category=groceries',
      isAvailable: true,
      features: isTa
        ? ['பிரெஷ் மளிகை பொருட்கள்', 'மலிவு விலை', 'வீட்டு வாசலில் டெலிவரி']
        : ['Fresh Produce & Spices', 'Competitive Pricing', 'Doorstep Delivery'],
    },
    {
      id: 'shoe-shop',
      title: isTa ? 'வர்ச்சுவல் ஷூ ஷாப்' : 'Virtual Shoe Shop',
      subtitle: isTa ? 'காலணிகள், செருப்புகள் & ஆக்சஸரீஸ்' : 'Footwear, Slippers & Accessories',
      desc: isTa
        ? 'ஆண்கள், பெண்கள் மற்றும் குழந்தைகளுக்கான நவீன காலணிகள், கேசுவல் செருப்புகள் மற்றும் அலுவலக ஷூக்கள்.'
        : 'Trending collection of casual shoes, formal footwear, sandals, and sports slippers for all age groups.',
      icon: Footprints,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FCE8ED]',
      borderColor: 'border-[#F8D2DC]',
      iconBg: 'bg-[#E11D48]',
      titleColor: 'text-[#881337]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['சௌகரியமான வடிவமைப்பு', 'நீடித்து உழைக்கும் தரம்', 'பல்வேறு அளவுகள்']
        : ['Ergonomic Comfort', 'Durable Materials', 'All Sizes Available'],
    },
    {
      id: 'book-shop',
      title: isTa ? 'வர்ச்சுவல் புக் லேப்' : 'Virtual Book Lab',
      subtitle: isTa ? 'புத்தகங்கள் & கல்வி பொருட்கள்' : 'Books, Stationery & Educational',
      desc: isTa
        ? 'பள்ளி மற்றும் கல்லூரி புத்தகங்கள், நாவல்கள், தமிழ் இலக்கியங்கள், எழுதுபொருட்கள் மற்றும் கல்வி உபகரணங்கள்.'
        : 'Educational textbooks, stationery kits, Tamil & English literature, classic novels, and academic supplies.',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'நேரலை' : 'Live Now',
      badgeColor: 'bg-[#0D9488] text-white',
      cardBg: 'bg-[#E6F7F5]',
      borderColor: 'border-[#BCECE7]',
      iconBg: 'bg-[#0D9488]',
      titleColor: 'text-[#115E59]',
      href: '/shop?category=books-stationery',
      isAvailable: true,
      features: isTa
        ? ['தமிழ் & ஆங்கில புத்தகங்கள்', 'பள்ளி எழுதுபொருட்கள்', 'பல்க் ஆர்டர் தள்ளுபடி']
        : ['Tamil & English Titles', 'Quality Stationery', 'Bulk School Orders'],
    },
    {
      id: 'computer-shop',
      title: isTa ? 'வர்ச்சுவல் கம்ப்யூட்டர் சென்டர்' : 'Virtual Computer Center',
      subtitle: isTa ? 'கணினிகள், லேப்டாப்கள் & பாகங்கள்' : 'Computers, Laptops & Components',
      desc: isTa
        ? 'லேப்டாப்கள், டெஸ்க்டாப் கம்ப்யூட்டர்கள், விசைப்பலகை, மவுஸ், மானிட்டர்கள் மற்றும் கணினி பாகங்கள்.'
        : 'High-performance laptops, desktop systems, monitors, gaming accessories, and PC hardware components.',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#F3E8FF]',
      borderColor: 'border-[#E9D5FF]',
      iconBg: 'bg-[#7C3AED]',
      titleColor: 'text-[#581C87]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['அங்கீகரிக்கப்பட்ட உத்தரவாதம்', 'நவீன மாடல்கள்', 'தொழில்நுட்ப உதவி']
        : ['Genuine Warranty', 'Latest Specifications', 'Tech Support'],
    },
    {
      id: 'mobile-shop',
      title: isTa ? 'வர்ச்சுவல் மொபைல் ஷாப்' : 'Virtual Phone Shop',
      subtitle: isTa ? 'ஸ்மார்ட்போன்கள் & ஆக்சஸரீஸ்' : 'Smartphones, Gadgets & Accessories',
      desc: isTa
        ? 'ஸ்மார்ட்போன்கள், ஹெட்போன்கள், பவர் பேங்க்கள், சார்ஜர்கள் மற்றும் மொபைல் கவர்கள்.'
        : 'Smartphones, wireless earbuds, smartwatches, power banks, and essential phone accessories.',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FEF3C7]',
      borderColor: 'border-[#FDE68A]',
      iconBg: 'bg-[#D97706]',
      titleColor: 'text-[#78350F]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['பிராண்டட் ஆக்சஸரீஸ்', 'வேகமான சார்ஜிங் தீர்வுகள்', 'நம்பகமான தரம்']
        : ['Branded Accessories', 'Fast Charging Kits', 'Verified Quality'],
    },
    {
      id: 'fashion-shop',
      title: isTa ? 'வர்ச்சுவல் ஆடை கடை' : 'Virtual Fashion Store',
      subtitle: isTa ? 'ஆடைகள், சேலைகள் & பேஷன்' : 'Clothing, Traditional & Modern Fashion',
      desc: isTa
        ? 'பாரம்பரிய பட்டுச் சேலைகள், குர்தாக்கள், டி-ஷர்ட்கள், ஜீன்ஸ் மற்றும் நவீன ஆடைகள்.'
        : 'Traditional silk sarees, ethnic wear, casual tees, denim, and trendy modern apparel collections.',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FAE8FF]',
      borderColor: 'border-[#F5D0FE]',
      iconBg: 'bg-[#C026D3]',
      titleColor: 'text-[#701A75]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['பாரம்பரிய & நவீன உடைகள்', 'பிரீமியம் துணி வகை', 'அனைத்து அளவுகள்']
        : ['Ethnic & Western Wear', 'Premium Fabrics', 'Complete Fit Range'],
    },
    {
      id: 'hardware-shop',
      title: isTa ? 'வர்ச்சுவல் எலக்ட்ரானிக்ஸ் & ஹார்ட்வேர்' : 'Virtual Electronics & Hardware',
      subtitle: isTa ? 'கருவிகள், உபகரணங்கள் & எலக்ட்ரானிக்ஸ்' : 'Appliances, Tools & Hardware Supplies',
      desc: isTa
        ? 'வீட்டு பராமரிப்பு கருவிகள், எலக்ட்ரிக்கல் உதிரிபாகங்கள், பிளம்பிங் உபகரணங்கள் மற்றும் வீட்டு உபயோக பொருட்கள்.'
        : 'Home appliances, power tools, electrical fittings, plumbing gear, and building hardware essentials.',
      icon: Settings,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#F3F4F6]',
      borderColor: 'border-[#E5E7EB]',
      iconBg: 'bg-[#4B5563]',
      titleColor: 'text-[#1F2937]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['உறுதியான கருவிகள்', 'பாதுகாப்பான உபகரணங்கள்', 'தொழில்துறை தரம்']
        : ['Heavy Duty Build', 'Safety Certified', 'Industrial Grade'],
    },
    {
      id: 'other-shops',
      title: isTa ? 'மேலும் கடைகள் விரைவில்' : 'More Shops Coming Soon',
      subtitle: isTa ? 'புதிய சிறப்பு கடைகள் விரைவில் இணையும்' : 'Specialty Categories & Brands',
      desc: isTa
        ? 'விரைவில் மேலும் பல பிரத்யேக வர்ச்சுவல் கடைகள் VENTERSHOP தளத்தில் இணைக்கப்படவுள்ளன.'
        : 'More exciting virtual shops and specialty partner brand stores will be launching soon.',
      icon: MoreHorizontal,
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#EDE9FE]',
      borderColor: 'border-[#DDD6FE]',
      iconBg: 'bg-[#6366F1]',
      titleColor: 'text-[#4338CA]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['புதிய கடைகள்', 'சிறப்பு தயாரிப்புகள்', 'பிரத்யேக சலுகைகள்']
        : ['New Curated Shops', 'Exclusive Lines', 'Member Benefits'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] [&>header]:bg-none! [&>header]:bg-inherit! font-sans antialiased text-xs font-semibold">
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-inherit" />}>
        <Header />
      </Suspense>

      {/* Virtual specialty shops hero */}
      <section aria-labelledby="virtual-shops-hero-heading" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-4">
        <div className="relative isolate overflow-hidden rounded-[36px] border border-[#4d80cc]/30 bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-[0_16px_40px_-22px_#071f5070] sm:p-9 lg:flex lg:h-[350px] lg:min-h-0 xl:h-[320px] lg:items-center lg:px-12 lg:py-6">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[520px] w-[620px] -rotate-12 rounded-[50%] border border-white/10 bg-linear-to-br from-[#247bec]/30 to-[#0759D6]/5" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-64 -z-10 h-[540px] w-[640px] rounded-[50%] border border-white/5 bg-linear-to-b from-[#4d92f2]/15 to-transparent" />
          <div className="grid min-w-0 items-center gap-8 md:grid-cols-2 lg:w-full lg:gap-10">
            <div className="relative z-10 min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#dceaff]">
                <Store aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{isTa ? 'எங்களின் சிறப்பு வர்ச்சுவல் கடைகள்' : 'Specialized Virtual Marketplace'}</span>
              </div>
              <h1 id="virtual-shops-hero-heading" className="mt-5 lg:mt-3 font-serif text-[clamp(30px,3.5vw,48px)] font-bold leading-[1.12] tracking-[-.025em] text-white">
                {isTa ? 'ஒரே தளத்தில் பல்வேறு சிறப்பு கடைகள்' : <>Explore All <span className="text-[#FFC400]">Virtual</span> Specialty Shops</>}
              </h1>
              <p className="mt-4 lg:mt-2 max-w-xl text-xs font-medium leading-[1.8] text-[#dceaff] sm:text-sm">
                {isTa
              ? 'சூப்பர் மார்க்கெட் மற்றும் புக் லேப் இப்போது நேரலையில் உள்ளது. பிற கடைகள் விரைவில் திறக்கப்படவுள்ளன.'
              : 'Virtual Supermarket and Virtual Book Lab are live for shopping now. Additional specialty shops are launching soon.'}
              </p>
              <div className="mt-6 lg:mt-3 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
                <Link href={shopsList[0].href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FFC400] px-5 py-3 text-xs font-bold text-[#071F50] transition-colors hover:bg-[#efb900] focus-visible:outline-3 focus-visible:outline-white focus-visible:outline-offset-3 motion-reduce:transition-none!">
                  Shop Virtual Supermarket <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </Link>
                <Link href={shopsList[2].href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-[#FFC400] focus-visible:outline-offset-3 motion-reduce:transition-none!">
                  Visit Book Lab <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>

            <div role="img" aria-label="Laptop storefront with a grocery basket and a stack of books" className="relative mx-auto aspect-[1.2] w-full max-w-[500px] min-w-0 lg:aspect-[2.1818182]">
              <div className="contents lg:absolute lg:inset-x-0 lg:top-1/2 lg:block lg:aspect-[1.2] lg:-translate-y-1/2 lg:scale-[.55]">
              <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-[#4f9bff]/25 blur-3xl" />
              <div className="absolute left-[7%] right-[2%] top-[8%] [transform:perspective(1000px)_rotateY(-8deg)_rotateX(4deg)]">
                <div className="rounded-t-2xl border border-[#b9d8ff]/50 bg-[#07172f] p-2 shadow-[0_18px_35px_-12px_#020b2799] sm:p-2.5">
                  <div className="mb-1.5 flex justify-center"><span className="h-1 w-1 rounded-full bg-[#7192b5]" /></div>
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-[#f4f8ff]">
                    <div className="flex h-5 items-center gap-1.5 bg-[#0759D6] px-3"><span className="h-1 w-6 rounded bg-[#FFC400]" /><span className="ml-auto h-1 w-4 rounded bg-white/65" /><span className="h-1 w-4 rounded bg-white/65" /></div>
                    <div className="grid aspect-[1.6] grid-cols-[1.2fr_1fr] gap-2 p-2 sm:p-3">
                      <div className="relative overflow-hidden rounded-lg bg-[#ead0a6]"><Image src="/images/storefront_3d.webp" alt="" fill sizes="(min-width: 1024px) 240px, 40vw" className="object-contain" /></div>
                      <div className="flex flex-col justify-center gap-2">
                        <div className="h-2 w-4/5 rounded bg-[#082B68]/80" /><div className="h-1.5 w-full rounded bg-[#9abce6]" /><div className="h-1.5 w-3/4 rounded bg-[#c7dafa]" />
                        <div className="grid grid-cols-3 gap-1.5">{[ShoppingBag, BookOpen, Store].map((Icon, i) => <span key={i} className="flex aspect-square items-center justify-center rounded-md border border-[#cee1f8] bg-white text-[#0759D6]"><Icon className="h-4 w-4 sm:h-6 sm:w-6" /></span>)}</div>
                        <div className="h-3.5 w-3/5 rounded-full bg-[#FFC400]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative -mx-[5%] h-3 rounded-b-[50%] border-t border-white/70 bg-linear-to-b from-[#e0edff] to-[#709bc8] shadow-lg sm:h-4"><div className="mx-auto h-1 w-1/4 rounded-b-full bg-[#819bb8]" /></div>
              </div>
              <div className="absolute -bottom-[3%] -left-[4%] z-10 aspect-square w-[55%] [mask-image:radial-gradient(ellipse_at_50%_58%,#000_42%,transparent_72%)]">
                <Image src="/images/groceries_basket.webp" alt="" fill sizes="(min-width: 1024px) 280px, 45vw" className="object-contain" />
              </div>
              <div aria-hidden="true" className="absolute bottom-[6%] right-[3%] w-[36%] -rotate-6 drop-shadow-[0_12px_10px_#020b2766]">
                <div className="relative ml-3 h-7 rounded-r-lg border-y-[5px] border-[#d4e7ff] bg-white [transform:skewY(-5deg)] sm:h-9"><span className="absolute inset-y-0 left-0 w-4 bg-[#0759D6]" /></div>
                <div className="relative -mt-1 h-7 rounded-r-lg border-y-[5px] border-[#0759D6] bg-[#f8fbff] [transform:skewY(-5deg)] sm:h-9"><span className="absolute inset-y-0 left-0 w-4 bg-[#082B68]" /></div>
                <div className="relative -mt-1 ml-2 h-7 rounded-r-lg border-y-[5px] border-[#FFC400] bg-white [transform:skewY(-5deg)] sm:h-9"><span className="absolute inset-y-0 left-0 w-4 bg-[#dfac00]" /></div>
                <BookOpen className="absolute -right-2 -top-6 h-8 w-8 -rotate-12 text-[#dceaff]" />
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shops Grid Showcase */}
      <main className="max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        <div data-virtual-shop-grid className="grid grid-cols-1 auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-4">
          {shopsList.map(shop => <FlipShopCard key={shop.id} shop={shop} isTa={isTa} />)}
        </div>

        {/* 5. Direct Foreign Buyers & Export Gateway Banner */}
        <div className="relative rounded-3xl border border-[#c7def5] bg-linear-to-br from-[#f5faff] via-[#EAF5FF] to-[#dceeff] p-6 sm:p-8 text-[#082B63] shadow-[0_8px_24px_-16px_#082b6333] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#0755B8] text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{isTa ? 'சர்வதேச பல்க் ஏற்றுமதி' : 'International Bulk Supply'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-[#082B63]">
                {isTa
                  ? 'வெளிநாட்டு இறக்குமதியாளர்கள் & மொத்த வியாபாரிகள்'
                  : 'Are You a Foreign Buyer or Wholesale Importer?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#526681] font-medium leading-relaxed max-w-2xl">
                {isTa
                  ? 'இலங்கையிலிருந்து நேரடி மசாலாக்கள், தேயிலை, மளிகைப் பொருட்கள் மற்றும் ராணி கால்நடை தீவனங்களை பல்க் ஆர்டரில் இறக்குமதி செய்ய எங்கள் பிரத்யேக ஏற்றுமதி தளத்தைப் பார்வையிடுங்கள்.'
                  : 'Source bulk commercial containers (FCL/LCL) and priority air cargo direct from Sri Lankan manufacturers with certified documentation and FOB/CIF pricing.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/export"
                className="px-6 py-3.5 bg-[#0755B8] hover:bg-[#082B63] text-white text-center rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all focus-visible:outline-3 focus-visible:outline-[#0755B8] focus-visible:outline-offset-3 motion-reduce:transition-none! flex items-center justify-center gap-2"
              >
                <span>{isTa ? 'ஏற்றுமதி தளம் செல்ல' : 'Visit Export Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white hover:bg-[#EAF5FF] text-[#082B63] text-center rounded-xl font-bold uppercase tracking-wider border border-[#9fc5ed] transition-colors focus-visible:outline-3 focus-visible:outline-[#0755B8] focus-visible:outline-offset-3 motion-reduce:transition-none!"
              >
                {isTa ? 'தொடர்பு கொள்ள' : 'Contact Support Desk'}
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
