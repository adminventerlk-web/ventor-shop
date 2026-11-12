'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useSectionEntrance } from './useSectionEntrance';
import {
  ShieldCheck,
  Truck,
  Award,
  Headphones,
  RotateCcw,
} from 'lucide-react';

export default function TrustBadges() {
  const sectionRef = useSectionEntrance();
  const { language } = useTranslation();

  const badges = [
    {
      icon: ShieldCheck,
      title: language === 'ta' ? '100% பாதுகாப்பான கட்டணம்' : language === 'si' ? '100% ආරක්ෂිත ගෙවීම්' : '100% Secure Payments',
      desc: language === 'ta' ? 'உங்கள் பரிவர்த்தனைகள் பாதுகாப்பானவை.' : language === 'si' ? 'ඔබගේ ගෙවීම් අප සමඟ සුරක්ෂිතයි.' : 'Your payments are safe with us.',
    },
    {
      icon: Truck,
      title: language === 'ta' ? 'வேகமான நம்பகமான டெலிவரி' : language === 'si' ? 'වේගවත් බෙදාහැරීම' : 'Fast & Reliable Delivery',
      desc: language === 'ta' ? 'கனடா முழுவதும் விநியோகம்.' : language === 'si' ? 'කැනඩාව පුරා බෙදාහැරීම.' : 'Delivery across Canada.',
    },
    {
      icon: Award,
      title: language === 'ta' ? 'தர உறுதிப்பாடு' : language === 'si' ? 'ගුණාත්මකභාවය' : 'Quality Assurance',
      desc: language === 'ta' ? 'உங்களுக்காக சிறந்த தயாரிப்புகள் மட்டுமே.' : language === 'si' ? 'ඔබ සඳහා හොඳම දේ පමණි.' : 'Only the best for you.',
    },
    {
      icon: Headphones,
      title: language === 'ta' ? 'வாடிக்கையாளர் ஆதரவு' : language === 'si' ? 'පාරිභෝගික සහාය' : 'Customer Support',
      desc: language === 'ta' ? 'உங்களுக்கு உதவ நாங்கள் தயாராக உள்ளோம்.' : language === 'si' ? 'ඔබට උපකාර කිරීමට අපි සූදානම්.' : "We're here to help you.",
    },
    {
      icon: RotateCcw,
      title: language === 'ta' ? 'எளிதான ரிட்டர்ன்ஸ்' : language === 'si' ? 'පහසු ආපසු ලබාදීම්' : 'Easy Returns',
      desc: language === 'ta' ? 'சிரமமில்லாத பணத்தைத் திரும்பப்பெறுதல்.' : language === 'si' ? 'කරදරයකින් තොර මුදල් ආපසු ලබාදීම.' : 'Hassle free returns & refunds.',
    },
  ];

  return (
    <section ref={sectionRef} aria-label="Service Benefits" className="py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 items-stretch gap-3 lg:grid-cols-5">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} data-entrance="up" data-entrance-delay={idx * 80} className="flex min-h-16 min-w-0 items-center gap-2 rounded-full border border-[#93C5FD] bg-[#fcfeff] px-3 py-3 shadow-[0_4px_12px_-6px_#2563eb40] last:col-span-2 last:w-[calc(50%_-_6px)] last:justify-self-center sm:gap-2.5 lg:last:col-span-1 lg:last:w-full">
                <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#075bb9] stroke-[1.75]" />
                <span aria-hidden="true" className="h-7 w-0.5 shrink-0 rounded-full bg-[#FACC15]" />
                <h4 className="min-w-0 text-xs font-bold leading-[1.35] text-[#0B1B45] sm:text-[13px] lg:text-xs xl:text-[13px]">
                  {item.title}
                </h4>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
