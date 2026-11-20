'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  GraduationCap,
  Sprout,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Coins,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IDonationRecord {
  _id: string;
  title: string;
  amount: number;
  category: string;
  beneficiary: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  status?: string;
}

export default function RevenueDonationSection() {
  const [records, setRecords] = useState<IDonationRecord[]>([]);
  const [stats, setStats] = useState({
    totalDonated: 1045000,
    totalCauses: 3,
    beneficiariesCount: '500+ Individuals & Families',
  });
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function loadDonations() {
      try {
        const res = await fetch('/api/donations/showcase');
        if (res.ok) {
          const data = await res.json();
          if (data.records && Array.isArray(data.records) && data.records.length > 0) {
            setRecords(data.records);
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.warn('Error loading donation showcase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, []);

  if (!loading && records.length === 0) {
    return null;
  }

  const currentRecord = records[activeSlide] || records[0];

  return (
    <section
      id="community-donations-showcase"
      aria-labelledby="donations-showcase-heading"
      className="w-full py-6 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* ── Main Showcase Container ── */}
        <div
          className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/70 shadow-2xl transition-all"
          style={{
            backgroundColor: '#021838',
            backgroundImage:
              'radial-gradient(ellipse at 85% 15%, rgba(16, 185, 129, 0.25) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(0, 82, 204, 0.3) 0%, transparent 65%), linear-gradient(135deg, #01142f 0%, #032759 50%, #010f24 100%)',
            color: '#ffffff',
          }}
        >
          {/* Top Status & Summary Header Strip */}
          <div className="relative z-10 px-5 pt-4 sm:px-7 sm:pt-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-xs">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Community Giveback Showcase
                  </span>
                  <span className="text-[10px] font-bold text-blue-200/80 hidden sm:inline">
                    • எங்களின் சமூக நல பங்களிப்புகள்
                  </span>
                </div>
              </div>
            </div>

            {/* Total Impact Stats Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-white text-xs font-black">
                <Coins className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Total Donated: </span>
                <span className="text-emerald-300 font-extrabold">{formatCurrency(stats.totalDonated)}</span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-blue-200/80 bg-white/10 px-2.5 py-1 rounded-lg">
                <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{stats.beneficiariesCount}</span>
              </span>
            </div>
          </div>

          {/* Main Grid: Story Copy & Featured Image */}
          <div className="relative z-10 p-5 sm:p-7 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column: Donation Cause & Impact Story */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Donation Completed & Disbursed</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-[#01142F] px-2.5 py-1 rounded-xl border border-blue-900">
                    <Sparkles className="w-3 h-3 text-[#FFB800]" />
                    <span>{currentRecord?.badge || '100% Platform Revenue Share'}</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    {currentRecord?.category || 'Community Welfare'}
                  </span>
                  <h3
                    id="donations-showcase-heading"
                    className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight"
                  >
                    {currentRecord?.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
                  {currentRecord?.description}
                </p>

                {/* Beneficiary & Location Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#01142F]/90 border border-blue-900/80 space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-blue-300/70">Beneficiary / Recipient</p>
                    <p className="text-xs font-black text-white truncate">{currentRecord?.beneficiary}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#01142F]/90 border border-blue-900/80 space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-blue-300/70">Location & Date</p>
                    <p className="text-xs font-black text-white flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#FFB800] shrink-0" />
                      <span>{currentRecord?.location} • {currentRecord?.date}</span>
                    </p>
                  </div>
                </div>

                {/* Big Donated Amount Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-[#01142F] border border-emerald-500/40 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                      Direct Financial Contribution
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">
                      {formatCurrency(currentRecord?.amount || 0)}
                    </span>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                    Verified Contribution ✓
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Photo Showcase & Selector */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-emerald-500/50 shadow-xl bg-gray-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      currentRecord?.imageUrl ||
                      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={currentRecord?.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021838]/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#FFB800]">
                    Cause {activeSlide + 1} of {records.length}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 bg-[#021838]/90 backdrop-blur-md rounded-xl border border-blue-400/30 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white truncate max-w-[200px]">
                      {currentRecord?.beneficiary}
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {formatCurrency(currentRecord?.amount || 0)}
                    </span>
                  </div>
                </div>

                {/* Causes Selector Tabs if Multiple Records */}
                {records.length > 1 && (
                  <div className="flex items-center justify-between gap-2 p-1.5 bg-[#01142F] rounded-xl border border-blue-900/60">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
                      {records.map((r, idx) => (
                        <button
                          key={r._id || idx}
                          type="button"
                          onClick={() => setActiveSlide(idx)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                            activeSlide === idx
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          Cause {idx + 1}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSlide((prev) => (prev - 1 + records.length) % records.length)
                        }
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        aria-label="Previous cause"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSlide((prev) => (prev + 1) % records.length)
                        }
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        aria-label="Next cause"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
