'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Sprout,
  Stethoscope,
  HeartHandshake,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const PROGRAMS = [
  {
    icon: <GraduationCap className="w-7 h-7" />,
    color: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-100 text-blue-700',
    label: 'Education',
    title: 'Student Study Grants',
    desc: 'Financial support for university & higher education students to cover tuition, books and essentials.',
    badge: 'Scholarship',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    icon: <Sprout className="w-7 h-7" />,
    color: 'from-emerald-600 to-emerald-800',
    iconBg: 'bg-emerald-100 text-emerald-700',
    label: 'Agriculture',
    title: 'Organic Spice Farmer Aid',
    desc: 'Supporting small-scale organic spice cultivators across Sri Lanka with direct financial assistance.',
    badge: 'Farm Support',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    icon: <Stethoscope className="w-7 h-7" />,
    color: 'from-rose-600 to-rose-800',
    iconBg: 'bg-rose-100 text-rose-700',
    label: 'Healthcare',
    title: 'Emergency Medical Relief',
    desc: 'Urgent financial aid for families facing critical medical expenses and healthcare emergencies.',
    badge: 'Medical Aid',
    badgeColor: 'bg-rose-100 text-rose-800',
  },
];

export default function RevenueDonationSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section
      id="community-grants-section"
      aria-labelledby="grants-ad-heading"
      className="w-full py-0 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* ━━━ MAIN AD BILLBOARD ━━━ */}
        <div
          className="relative overflow-hidden rounded-3xl border-2 border-[#FFB800] shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #021838 0%, #042D6E 55%, #010f24 100%)' }}
        >
          {/* Ambient glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0052CC]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-14">

            {/* Top Ad Label */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFB800] text-[#021838] text-[11px] font-black uppercase tracking-widest shadow-lg">
                <Megaphone className="w-4 h-4" />
                <span>Community Welfare Grant Program</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Headline */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2
                id="grants-ad-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
              >
                Financial Assistance{' '}
                <span className="text-[#FFB800]">&amp; Welfare Grants</span>
                <br />
                <span className="text-blue-200 text-2xl sm:text-3xl font-bold">Coming Soon to VENTERSHOP</span>
              </h2>
              <p className="mt-4 text-blue-100 text-sm sm:text-base font-semibold leading-relaxed max-w-2xl mx-auto">
                We are preparing a direct financial grant program to support students, organic spice farmers, and families
                facing medical emergencies across Sri Lanka — 100% free, zero middlemen.
              </p>
            </div>

            {/* Grant Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {PROGRAMS.map((prog, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-3 transition-all duration-300 cursor-default border-2 ${
                    hoveredCard === idx
                      ? 'border-[#FFB800] -translate-y-1 shadow-2xl shadow-[#FFB800]/20'
                      : 'border-transparent'
                  }`}
                >
                  {/* Icon + Label */}
                  <div className="flex items-center justify-between">
                    <span className={`p-3 rounded-xl ${prog.iconBg}`}>
                      {prog.icon}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${prog.badgeColor}`}>
                      {prog.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-gray-900 leading-snug">{prog.title}</h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed flex-1">{prog.desc}</p>

                  {/* Coming Soon Tag */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Applications Opening Soon
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl p-5 border border-blue-500/40 mb-10"
              style={{ backgroundColor: 'rgba(1, 20, 47, 0.8)' }}
            >
              {[
                { value: 'LKR 1.9M+', label: 'Grant Fund Planned', color: 'text-[#FFB800]' },
                { value: '300+', label: 'Applicants Target', color: 'text-emerald-300' },
                { value: '100%', label: 'Direct Disbursement', color: 'text-cyan-300' },
                { value: 'Zero Fees', label: 'Free to Apply', color: 'text-amber-300' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center p-2 ${idx < 3 ? 'border-r border-blue-800/60' : ''}`}
                >
                  <span className={`text-xl sm:text-2xl font-black font-mono block ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider block mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Benefits List + CTA */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Checkmarks */}
              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                {[
                  'No repayment required',
                  'Direct bank transfer',
                  'Sri Lanka-wide coverage',
                  'Verified fair process',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-blue-100 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Coming Soon CTA */}
              <div className="shrink-0 text-center">
                <div className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FFB800] text-[#021838] font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FFB800]/30 cursor-default select-none">
                  <HeartHandshake className="w-5 h-5" />
                  <span>Notify Me When Open</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <p className="text-blue-200/80 text-[11px] font-semibold mt-2">
                  Grant applications will open soon — stay tuned!
                </p>
              </div>
            </div>

          </div>
        </div>
        {/* ━━━ END AD BILLBOARD ━━━ */}

      </div>
    </section>
  );
}
