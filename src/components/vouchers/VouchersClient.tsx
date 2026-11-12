'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Gift,
  GraduationCap,
  Home,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShoppingBag,
  Users,
  HelpCircle,
} from 'lucide-react';

interface ICommunityProgramVoucher {
  _id: string;
  title: string;
  supportedBy: string;
  communityType: string;
  voucherCode: string;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
}

export default function VouchersClient() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [communityVouchers, setCommunityVouchers] = useState<ICommunityProgramVoucher[]>([]);

  useEffect(() => {
    async function loadCommunityVouchers() {
      try {
        const res = await fetch('/api/vouchers/community');
        if (res.ok) {
          const data = await res.json();
          setCommunityVouchers(data.vouchers || []);
        }
      } catch (err) {
        console.error('Failed to load community vouchers:', err);
      }
    }
    loadCommunityVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const familyVoucher = communityVouchers.find((cv) => cv.communityType === 'FAMILY_SUPPORT') || communityVouchers[0];
  const isFamilyOn = familyVoucher?.status === 'ON';

  const studentFeatures = isTa
    ? [
        'பாடப் புத்தகங்கள் மற்றும் குறிப்பேடுகள்',
        'எழுதுபொருட்கள் மற்றும் கல்வி உபகரணங்கள்',
        'பள்ளி பைகள் மற்றும் சீருடை பாகங்கள்',
        'மாணவர் கணினி மற்றும் மொபைல் பாகங்கள்',
      ]
    : [
        'Educational Textbooks & Study Guides',
        'Stationery Kits & Geometry Sets',
        'School Bags & Uniform Accessories',
        'Student PC & Learning Peripherals',
      ];

  const familyFeatures = isTa
    ? [
        'மாதாந்திர மளிகைப் பொதிகள் (அரிசி, பருப்பு, எண்ணெய்)',
        'அன்றாட வீட்டு அத்தியாவசிய தேவைகள்',
        'சமூக உறுப்பினர்களுக்கான மானிய விலை',
        'நேரடி வீட்டு விநியோக ஆதரவு',
      ]
    : [
        'Monthly Essential Grocery Hampers (Rice, Pulses, Oil)',
        'Daily Household Essentials & Hygiene Products',
        'Subsidized Pricing for Verified Community Members',
        'Direct Doorstep Delivery Logistics Support',
      ];

  const faqs = [
    {
      q: isTa ? 'மாணவர் பரிசு வவுச்சரை யார் பெறலாம்?' : 'Who is eligible for the Student Gift Voucher?',
      a: isTa
        ? 'V2CC கல்வி வங்கியால் அங்கீகரிக்கப்பட்ட மாணவர்கள் மற்றும் VENTERSHOP தளத்தில் கல்வித் திட்டத்தின் கீழ் பதிவு செய்த பயனர்கள் இந்த வவுச்சரைப் பயன்படுத்தி கல்விப் பொருட்களுக்கு சிறப்பு சலுகை பெறலாம்.'
        : 'Registered students affiliated with the V2CC Educating Bank System and general learners on VENTERSHOP can redeem this voucher for exclusive discounts on educational books and stationery.',
    },
    {
      q: isTa ? 'குடும்ப ஆதரவு வவுச்சர் எப்போது செயல்படும்?' : 'When will the Family Support Voucher be activated?',
      a: isTa
        ? 'TMSAP திட்டத்தின் கீழ் குடும்பங்களுக்கான சரிபார்ப்புப் பணிகள் நடைபெற்று வருகின்றன. Admin செயல்படுத்தியவுடன் இது நேரலையில் ON நிலைக்கு மாறும்.'
        : 'The TMSAP Project of V2CC is managed by admin. Once activated by admin, status turns ON dynamically for eligible member families.',
    },
    {
      q: isTa ? 'வவுச்சரை செக்-அவுட் பக்கத்தில் எவ்வாறு பயன்படுத்துவது?' : 'How do I redeem my voucher code at checkout?',
      a: isTa
        ? 'நீங்கள் வாங்க விரும்பும் பொருட்களை கார்ட்டில் சேர்த்த பின், கார்ட் அல்லது செக்-அவுட் பக்கத்தில் உள்ள "Voucher Code" கட்டத்தில் வவுச்சர் குறியீட்டை உள்ளிட்டு தள்ளுபடியைப் பெறலாம்.'
        : 'Simply add your items to the Cart and enter the voucher code in the "Apply Voucher" box on the Cart or Checkout screen to automatically apply your subsidy discount.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] [&>header]:bg-none! [&>header]:bg-inherit! [&_main_button]:focus-visible:outline-3 [&_main_button]:focus-visible:outline-offset-3 [&_main_button]:focus-visible:outline-[#0759D6] [&_main_a]:focus-visible:outline-3 [&_main_a]:focus-visible:outline-offset-3 [&_main_a]:focus-visible:outline-[#0759D6] motion-reduce:[&_*]:transition-none! motion-reduce:[&_*]:animate-none! font-sans antialiased text-xs font-semibold">
      
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-inherit" />}>
        <Header />
      </Suspense>

      <section aria-label="Community voucher introduction" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-4">
        <div data-vouchers-hero className="relative isolate overflow-hidden rounded-[36px] border border-[#4d80cc]/30 bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-[0_16px_40px_-22px_#071f5070] sm:p-9 lg:flex lg:h-[320px] lg:items-center lg:px-12 lg:py-6">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[520px] w-[620px] -rotate-12 rounded-[50%] border border-white/10 bg-linear-to-br from-[#247bec]/30 to-[#0759D6]/5" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-64 -z-10 h-[540px] w-[640px] rounded-[50%] border border-white/5 bg-linear-to-b from-[#4d92f2]/15 to-transparent" />
          <div className="grid w-full min-w-0 items-center gap-6 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.65fr_1fr] xl:grid-cols-[1.3fr_1fr] lg:gap-10">
        <div className="relative z-10 min-w-0 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#dceaff] text-[11px] font-extrabold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            <span>{isTa ? 'சமூக மேம்பாட்டு ஆதரவு' : 'Community Support Initiative'}</span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] lg:text-[30px] xl:text-[38px] font-serif font-bold tracking-tight leading-[1.12]">
            {isTa
              ? 'கல்வி மற்றும் சமூகப் பராமரிப்பு பரிசு வவுச்சர்கள்'
              : <>Community <span className="text-[#FFC400]">Gift Vouchers</span> &amp; Educational Care</>}
          </h1>

          <p className="text-xs sm:text-sm text-[#dceaff] font-medium max-w-xl leading-relaxed">
            {isTa
              ? 'V2CC அமைப்பின் கல்வி வங்கி மற்றும் TMSAP திட்டத்தின் ஆதரவோடு, மாணவர்கள் மற்றும் குடும்பங்கள் தங்களுக்குத் தேவையான அத்தியாவசிய பொருட்களை குறைந்த விலையிலும் மானிய அடிப்படையிலும் பெற்றுக்கொள்ள இந்த வவுச்சர்கள் வழங்கப்படுகின்றன.'
              : 'Empowering students and families across Sri Lanka. Supported by the Educating Bank System of V2CC and the TMSAP Project, our community vouchers ensure essential access to educational tools and family care items.'}
          </p>
        </div>

            <div role="img" aria-label="Gift voucher with graduation cap and community support icons" className="relative mx-auto h-48 w-full max-w-[300px]">
              <div aria-hidden="true" className="absolute inset-2 rounded-full border border-white/15 bg-white/5" />
              <div className="absolute inset-x-5 top-11 flex h-28 -rotate-6 items-center justify-center rounded-2xl border border-white/40 bg-[#f2f8ff] shadow-xl"><Gift aria-hidden="true" strokeWidth={1.5} className="h-16 w-16 text-[#0759D6]" /><div aria-hidden="true" className="absolute inset-y-3 right-8 border-l-2 border-dashed border-[#93bdf0]" /></div>
              <span className="absolute left-1 top-0 flex h-16 w-20 -rotate-12 items-center justify-center rounded-2xl bg-[#FFC400] shadow-lg"><GraduationCap aria-hidden="true" className="h-10 w-10 text-[#071F50]" /></span>
              <span className="absolute bottom-0 right-0 flex h-16 w-20 rotate-12 items-center justify-center rounded-2xl border border-white/25 bg-[#0759D6] shadow-lg"><Users aria-hidden="true" className="h-9 w-9 text-white" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Vouchers Showcase */}
      <main className="max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 🎓 CARD 1: Student Gift Voucher (ACTIVE / ON) */}
          <div id="student" className="bg-white rounded-3xl border border-[#c7def5] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden scroll-mt-48">
            
            {/* Active Ribbon */}
            <div className="self-end max-w-full bg-[#0759D6] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{isTa ? 'தற்போது செயலில் உள்ளது (ON)' : 'ACTIVE NOW (ON)'}</span>
            </div>

            <div className="space-y-4">
              {/* Header Icon + Title */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF5FF] text-[#0759D6] flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg sm:text-2xl font-black text-[#082B68] leading-tight">
                    {isTa ? 'மாணவர் பரிசு வவுச்சர்' : 'Student Gift Voucher'}
                  </h2>
                  <p className="text-xs text-[#526681] font-semibold">
                    Supported by <strong className="text-[#0759D6]">Educating Bank System of V2CC</strong>
                  </p>
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="bg-[#f2f8ff] border border-[#BFDBFE] rounded-2xl p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-wider block">
                    {isTa ? 'வவுச்சர் குறியீடு' : 'Promo Voucher Code'}
                  </span>
                  <p className="text-lg font-mono font-bold text-[#082B68] tracking-wide wrap-anywhere">
                    STUDENT-V2CC
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('STUDENT-V2CC')}
                  className="px-4 py-2 bg-white hover:bg-[#0759D6] text-[#0759D6] hover:text-white border border-[#0759D6]/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedCode === 'STUDENT-V2CC' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0759D6]" />
                      <span>{isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isTa ? 'குறியீட்டை காப்பி செய்' : 'Copy Code'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-[#082B68] uppercase tracking-wider">
                  {isTa ? 'தகுதியான கல்விப் பொருட்கள்:' : 'Eligible Student Items & Benefits:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studentFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#0759D6] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#dceaff] flex flex-col xl:flex-row gap-3">
              <Link
                href="/shop?category=books-stationery"
                className="flex-1 py-3 px-5 bg-[#0759D6] hover:bg-[#082B68] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>{isTa ? 'கல்விப் பொருட்களை வாங்க' : 'Shop Student Items'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                href="/dashboard/vouchers"
                className="py-3 px-5 bg-white border border-[#082B68] hover:bg-[#EAF5FF] text-[#082B68] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                {isTa ? 'வாலட்டில் பார்க்க' : 'View in Wallet'}
              </Link>
            </div>

          </div>

          {/* 🏠 CARD 2: Family Support Voucher (DYNAMIC ON / OFF STATUS) */}
          <div id="family" className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden scroll-mt-48 border ${isFamilyOn ? 'border-[#c7def5]' : 'border-[#c7def5]'}`}>
            
            {/* Status Indicator Badge */}
            {isFamilyOn ? (
              <div className="self-end max-w-full bg-[#0759D6] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{isTa ? 'தற்போது செயலில் உள்ளது (ON)' : 'ACTIVE NOW (ON)'}</span>
              </div>
            ) : (
              <div className="self-end max-w-full bg-gray-400 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{isTa ? 'விரைவில் தொடங்குகிறது (OFF)' : 'LAUNCHING SOON (OFF)'}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Header Icon + Title */}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${isFamilyOn ? 'bg-[#EAF5FF] text-[#0759D6]' : 'bg-gray-100 text-[#526681]'}`}>
                  <Home className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg sm:text-2xl font-black text-[#082B68] leading-tight">
                    {familyVoucher?.title || (isTa ? 'குடும்ப ஆதரவு வவுச்சர்' : 'Family Support Voucher')}
                  </h2>
                  <p className="text-xs text-[#526681] font-semibold">
                    Supported by <strong className="text-[#0759D6]">{familyVoucher?.supportedBy || 'TMSAP Project of V2CC'}</strong>
                  </p>
                </div>
              </div>

              {/* Dynamic Code Box when ON */}
              {isFamilyOn ? (
                <div className="bg-[#EAF5FF] border border-[#c7def5] rounded-2xl p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-wider block">
                      {isTa ? 'குடும்ப வவுச்சர் குறியீடு' : 'Family Voucher Code'}
                    </span>
                    <p className="text-lg font-mono font-bold text-[#082B68] tracking-wide wrap-anywhere">
                      {familyVoucher?.voucherCode || 'FAMILY-V2CC'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(familyVoucher?.voucherCode || 'FAMILY-V2CC')}
                    className="px-4 py-2 bg-white hover:bg-[#0759D6] text-[#0759D6] hover:text-white border border-[#0759D6]/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    {copiedCode === (familyVoucher?.voucherCode || 'FAMILY-V2CC') ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0759D6]" />
                        <span>{isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isTa ? 'குறியீட்டை காப்பி செய்' : 'Copy Code'}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Status Note Box when OFF */
                <div className="bg-[#f2f8ff] border border-[#c7def5] rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-wider block">
                    {isTa ? 'திட்ட நிலை விபரம்' : 'Program Status Notice'}
                  </span>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    {familyVoucher?.noticeMessage || (isTa
                      ? 'குடும்பங்களுக்கான பதிவு மற்றும் சரிபார்ப்புப் பணிகள் முடிவடைந்ததும், இந்த வவுச்சர் ஆன்லைனில் செயல்படுத்தப்படும்.'
                      : 'Community household onboarding and verification are in progress. This voucher program will be activated for enrolled member families shortly.')}
                  </p>
                </div>
              )}

              {/* Scope Checklist */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-[#082B68] uppercase tracking-wider">
                  {isTa ? 'திட்டத்தின் நன்மைகள் & பொருட்கள்:' : 'Planned Scope & Grocery Support:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {familyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFamilyOn ? 'text-[#0759D6]' : 'text-gray-400'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#dceaff] flex flex-col xl:flex-row gap-3">
              <Link
                href="/dashboard/community"
                className="flex-1 py-3 px-5 bg-[#0759D6] hover:bg-[#082B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>{isTa ? 'சமூகத்தில் இணைய விண்ணப்பிக்க' : 'Join Community Program'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                href="/contact"
                className="py-3 px-5 bg-white border border-[#082B68] hover:bg-[#f2f8ff] text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                {isTa ? 'தொடர்பு கொள்ள' : 'Contact Us'}
              </Link>
            </div>

          </div>

        </div>

        {/* 5. How to Redeem Steps Infographic */}
        <section className="bg-white rounded-3xl border border-[#c7def5] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isTa ? 'எளிய 3 வழிமுறைகள்' : 'Simple 3-Step Process'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082B68]">
              {isTa ? 'வவுச்சர்களை எவ்வாறு பயன்படுத்துவது?' : 'How to Use Your Community Vouchers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#f2f8ff] border border-[#c7def5] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0759D6] text-white flex items-center justify-center mx-auto font-black text-sm">
                1
              </div>
              <h4 className="text-sm font-black text-[#082B68]">{isTa ? 'பொருட்களைத் தேர்வு செய்க' : 'Select Eligible Items'}</h4>
              <p className="text-xs text-[#526681] font-medium">{isTa ? 'கல்விப் புத்தகங்கள் அல்லது அத்தியாவசிய பொருட்களை கார்ட்டில் சேர்க்கவும்.' : 'Browse our store and add eligible books, stationery or daily essentials to your cart.'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f2f8ff] border border-[#c7def5] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0759D6] text-white flex items-center justify-center mx-auto font-black text-sm">
                2
              </div>
              <h4 className="text-sm font-black text-[#082B68]">{isTa ? 'வவுச்சரைப் பயன்படுத்துக' : 'Apply Voucher Code'}</h4>
              <p className="text-xs text-[#526681] font-medium">{isTa ? 'கார்ட் பக்கத்தில் STUDENT-V2CC போன்ற குறியீட்டை உள்ளிடவும்.' : 'Enter your voucher code during checkout to deduct the community subsidy from your bill.'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f2f8ff] border border-[#c7def5] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#0759D6] text-white flex items-center justify-center mx-auto font-black text-sm">
                3
              </div>
              <h4 className="text-sm font-black text-[#082B68]">{isTa ? 'வீட்டு வாசலில் பெறுக' : 'Doorstep Delivery'}</h4>
              <p className="text-xs text-[#526681] font-medium">{isTa ? 'பாதுகாப்பான முறையில் உங்கள் பொருட்கள் உங்கள் இருப்பிடத்திற்கே அனுப்பி வைக்கப்படும்.' : 'Enjoy secure order fulfillment and fast islandwide shipping direct to your home.'}</p>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="bg-white rounded-3xl border border-[#c7def5] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#0759D6]">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-black text-[#082B68]">
              {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#f2f8ff] border border-[#c7def5]/80 space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-[#082B68]">{faq.q}</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
