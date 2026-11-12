'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useSectionEntrance } from './useSectionEntrance';
import { ArrowRight, Globe, Plane, Leaf, Boxes, ShieldCheck } from 'lucide-react';

export default function InternationalBuyers() {
  const sectionRef = useSectionEntrance();
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  const exportPoints = isTa
    ? [
        'இலங்கை விநியோகஸ்தர்களிடமிருந்து நேரடியாக',
        'ஏற்றுமதிக்கு தயார்நிலையில் உள்ள பொருட்கள்',
        'மொத்த வியாபாரம் & பல்க் ஆர்டர்கள்',
        'உலகளாவிய ஷிப்பிங் ஆதரவு',
      ]
    : isSi
    ? [
        'ශ්‍රී ලාංකික සැපයුම්කරුවන්ගෙන් සෘජුවම',
        'අපනයනයට සූදානම් නිෂ්පාදන',
        'තොග සහ විශාල ඇණවුම්',
        'ලොව පුරා බෙදාහැරීමේ සහාය',
      ]
    : [
        'Direct from Sri Lankan Suppliers',
        'Export-Ready Products',
        'Wholesale & Bulk Orders',
        'Worldwide Shipping Support',
      ];


  const benefitIcons = [Leaf, ShieldCheck, Boxes, Globe];

  return (
    <section ref={sectionRef} id="export" aria-labelledby="international-buyers-heading" className="py-4 lg:py-10  font-sans text-[#0B1B45] scroll-mt-20">

      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="rounded-3xl border border-[#F8DEC5] bg-[#FFF8F1] px-4 py-5 lg:py-1 shadow-[0_7px_22px_-14px_#80502b33] sm:px-6">
            <header data-entrance="up" className="mx-auto mb-5 lg:mb-2 max-w-3xl text-center">
              <div aria-hidden="true" className="mb-2 lg:mb-0.5 flex items-center justify-center gap-3 text-[#ea6a17]">
                <span className="h-px w-12 bg-[#f4bd94]" />
                <span className="relative inline-flex"><Globe className="h-6 w-6" /><Plane className="absolute -bottom-1 -right-2 h-4 w-4 fill-[#FFF8F1]" /></span>
                <span className="h-px w-12 bg-[#f4bd94]" />
              </div>
              <p className="mb-2 lg:mb-0.5 inline-block rounded-full border border-[#f9dcc4] bg-[#ffead8] px-3 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#a54512]">{isTa ? 'வர்ச்சுவல் வெளிநாட்டு வாங்குவோர்' : 'VIRTUAL FOREIGN BUYERS'}</p>
              <h2 id="international-buyers-heading" className="font-serif text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.2] tracking-[-.02em] text-[#0B1B45]">
                {isTa
                        ? 'சர்வதேச வாங்குபவர்களுக்கான இலங்கை தயாரிப்புகள்'
                        : 'Sri Lankan Products for International Buyers'}
              </h2>
              <p className="mt-2 lg:mt-0.5 text-xs font-medium leading-relaxed text-[#647184] sm:text-sm">{isTa
                        ? 'இலங்கையின் உயர்தர பொருட்களை உலகளாவிய சந்தையுடன் இணைக்கிறது'
                        : 'Connecting Sri Lankan Quality Products to the Global Market'}</p>
            </header>

            <div data-export-layout className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-5">
              <div data-entrance="left" data-entrance-delay="120" className="group relative mx-auto w-full max-w-md min-w-0">
                <div className="overflow-hidden rounded-2xl border border-[#F8DEC5] shadow-[0_5px_14px_-10px_#80502b40]">
                  <Image src="/images/hero/ceylon-exports.png" alt="Ceylon Tea, Spices, Handicrafts & Souvenirs" width={1672} height={941} sizes="(min-width: 1280px) 390px, (min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw" className="lg:aspect-[1672/772] lg:object-[center_25%] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:scale-100! motion-reduce:transition-none" />
                </div>
              </div>

              <div className="min-w-0 lg:border-x lg:border-[#F8DEC5] lg:px-3">
                <ul className="space-y-2 lg:space-y-1">
                  {exportPoints.map((point, index) => {
                    const Icon = benefitIcons[index];
                    return (
                      <li key={point} data-entrance="up" data-entrance-delay={180 + index * 80} className="flex items-center gap-3 rounded-2xl px-1 py-1 lg:py-0.5 transition-[transform,translate] duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 motion-reduce:transition-none">
                        <span aria-hidden="true" className="flex h-10 w-10 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-2xl border border-[#f9dcc4] bg-[#ffead8] text-[#ea6a17]"><Icon className="h-5 w-5" /></span>
                        <span className="text-xs font-semibold leading-relaxed text-[#0B1B45] sm:text-[13px]">{point}</span>
                      </li>
                    );
                  })}
                </ul>
                <div data-entrance="up" data-entrance-delay="640" className="mt-3 lg:mt-1 flex justify-center">
                  <Link href="/shop?export=true" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#F97316] bg-[#F97316] px-5 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:border-[#df6010] hover:bg-[#df6010] focus-visible:outline-3 focus-visible:outline-[#b54708] focus-visible:outline-offset-4 motion-reduce:transition-none!">
                    <span>{isTa ? 'ஏற்றுமதி பொருட்களை ஆராயுங்கள்' : 'Explore Export Products'}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <figure data-entrance="right" data-entrance-delay="240" className="group mx-auto w-full max-w-md min-w-0 md:col-span-2 lg:col-span-1 lg:max-w-[310px]">
                <div className="relative overflow-hidden rounded-2xl border border-[#F8DEC5] shadow-[0_5px_14px_-10px_#80502b40]">
                  <div className="overflow-hidden rounded-2xl">
                    <Image src="/images/sri_lankan_exports.webp" alt="Sri Lankan Export Products" width={1200} height={896} sizes="(min-width: 1280px) 390px, (min-width: 1024px) 32vw, 448px" className="lg:aspect-[1200/735] lg:object-top h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:scale-100! motion-reduce:transition-none" />
                  </div>
                </div>
              </figure>
            </div>
        </div>
      </div>
    </section>
  );
}
