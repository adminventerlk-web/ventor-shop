'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useSectionEntrance } from './useSectionEntrance';
import { ShoppingCart, Award, Tag, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WhyShopBanner() {
  const sectionRef = useSectionEntrance();
  const { language } = useTranslation();

  // Copy reused from AboutClient, PricingSavingsCalculator and HowItWorks.
  const benefits = [
    { title: 'Quality Products', icon: Award, description: 'We inspect every item in our multi-category catalogs to guarantee standard compliance.' },
    { title: 'Affordable Prices', icon: Tag, description: 'Standard catalog prices with seasonal discounts and promotional vouchers.' },
    { title: 'Secure & Reliable', icon: ShieldCheck, description: 'Our transaction safeguards prioritize client data protection and security.' },
    { title: 'Wide Variety', icon: ShoppingBag, description: 'Explore our wide range of products and add to cart.' },
  ];


  return (
    <section ref={sectionRef} aria-labelledby="why-shop-heading" className="relative isolate overflow-hidden py-10 text-[#122c4e] sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-[#F3F9FF] via-[#EAF5FF] to-[#DCEFFF]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-[10%] -z-10 h-44 w-[120%] -rotate-2 rounded-[50%] border-t border-[#c5e2fa]/60 bg-[#cbe5fa]/35" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-[15%] -z-10 h-48 w-[110%] rotate-3 rounded-[50%] bg-[#bdddf6]/25" />

      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div data-entrance="left" className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <div aria-hidden="true" className="mb-3 flex items-center justify-center gap-4 text-[#0755a4]">
            <span className="h-px w-12 bg-[#99c4e9]" />
            <ShoppingCart className="h-6 w-6" />
            <span className="h-px w-12 bg-[#99c4e9]" />
          </div>
          <h2 id="why-shop-heading" className="font-serif text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.2] tracking-[-.02em] text-[#102b4c]">
            {language === 'ta' ? 'வெண்டர்ஷாப்பில் ஏன் வாங்க வேண்டும்?' : language === 'si' ? 'VENTERSHOP වෙතින් මිලදී ගන්නේ ඇයි?' : 'Why Shop with VENTERSHOP?'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-relaxed text-[#53677d] sm:text-sm">
            {language === 'ta'
                  ? 'கனடா முழுவதும் உள்ள எங்கள் வாடிக்கையாளர்களுக்கு தரமான பொருட்கள், கட்டுப்படியாகும் விலை மற்றும் சிறந்த சேவையை வழங்க நாங்கள் கடமைப்பட்டுள்ளோம்!'
                  : language === 'si'
                  ? 'කැනඩාව පුරා සිටින අපගේ පාරිභෝගිකයින් සඳහා ගුණාත්මක නිෂ්පාදන, සාධාරණ මිල ගණන් සහ හොඳම සේවාව ලබා දීමට අපි බැඳී සිටිමු!'
                  : 'We are committed to providing quality products, affordable prices and the best service to our customers across Canada!'}
          </p>
        </div>

        <div className="grid grid-cols-1 auto-rows-fr gap-3 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map(({ title, icon: Icon, description }, index) => (
            <article key={title} data-entrance="right" data-entrance-delay={100 + index * 85} className="relative isolate flex flex-col items-center overflow-hidden rounded-3xl border border-[#d7e8f7] bg-white p-4 text-center shadow-[0_7px_20px_-12px_#28568033] transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-[5px] hover:shadow-[0_14px_26px_-14px_#28568055] motion-reduce:hover:translate-y-0 motion-reduce:transition-none sm:p-6">
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-14 -left-12 -z-10 h-28 w-28 rounded-full border border-[#dbeefd] bg-[#eff8ff]" />
              <div aria-hidden="true" className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d7eaff] bg-[#eaf5ff] text-[#0755a4] sm:h-16 sm:w-16">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
              </div>
              <h3 className="text-[14px] font-bold leading-snug text-[#122c4e] sm:text-base">{title}</h3>
              <p className="mt-2 text-[11.5px] font-normal leading-[1.65] text-[#53677d] sm:text-xs">{description}</p>
            </article>
          ))}
        </div>

        <div data-entrance="up" data-entrance-delay="650" className="mt-7 flex justify-center sm:mt-8">
          <Link href="/about" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#123e75] bg-[#123e75] px-7 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:border-[#0755a4] hover:bg-[#0755a4] focus-visible:outline-3 focus-visible:outline-[#0755a4] focus-visible:outline-offset-4 motion-reduce:transition-none!">
            <span>{language === 'ta' ? 'மேலும் அறிய' : language === 'si' ? 'තව දැනගන්න' : 'Learn More'}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
