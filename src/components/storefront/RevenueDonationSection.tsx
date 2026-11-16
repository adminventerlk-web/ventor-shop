'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  GraduationCap,
  Sprout,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Send,
  X,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Clock,
  Coins,
  MapPin,
  Phone,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IInitiative {
  _id: string;
  title: string;
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY';
  allocatedAmount: number;
  disbursedAmount: number;
  maxPerApplicant: number;
  description: string;
  eligibility: string;
  bannerImage?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  badge?: string;
  applicationCount?: number;
}

export default function RevenueDonationSection() {
  const [initiatives, setInitiatives] = useState<IInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState<IInitiative | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nicOrId, setNicOrId] = useState('');
  const [city, setCity] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number | string>('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const res = await fetch('/api/donations/initiatives');
        if (res.ok) {
          const data = await res.json();
          setInitiatives(data.initiatives || []);
        }
      } catch (err) {
        console.error('Failed to load donation initiatives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitiatives();
  }, []);

  const handleOpenModal = (init: IInitiative) => {
    setSelectedInitiative(init);
    setRequestedAmount(init.maxPerApplicant || 25000);
    setSubmittedRef(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !nicOrId || !reason || !requestedAmount) {
      setErrorMessage('Please fill in all mandatory fields to submit your aid application.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/donations/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiativeId: selectedInitiative?._id || 'general',
          initiativeTitle: selectedInitiative?.title || 'Community Aid Grant',
          applicantName: fullName,
          phone,
          email,
          nicOrId,
          city,
          requestedAmount: Number(requestedAmount),
          reason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedRef(data.requestId || `AID-${Date.now()}`);
        // Reset form
        setFullName('');
        setPhone('');
        setEmail('');
        setNicOrId('');
        setCity('');
        setReason('');
      } else {
        setErrorMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EDUCATION':
        return <GraduationCap className="w-5 h-5 text-[#FFB800]" />;
      case 'AGRICULTURE':
        return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'HEALTHCARE':
        return <Stethoscope className="w-5 h-5 text-rose-400" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#010e24] via-[#021838] to-[#010e24] text-white border-y border-[#0052CC]/30 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0052CC]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0052CC]/25 border border-[#0052CC]/60 text-[#FFB800] text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FFB800]" />
            <span>VENTERSHOP Social Impact Program</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Our Revenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-yellow-500">Dedicated to Sri Lanka</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-blue-200/80 leading-relaxed">
            At VENTERSHOP, Super Admin donates a direct portion of our marketplace revenue to uplift students, empower local spice farming families, and relieve emergency medical burdens. If you or someone you know qualifies, apply for assistance directly below.
          </p>

          {/* Impact Stats Banner */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#01142F]/80 border border-[#0052CC]/40 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <div className="text-center p-2 border-r border-[#0052CC]/30 last:border-0 sm:last:border-0">
              <span className="text-lg sm:text-2xl font-black text-[#FFB800] block">
                {formatCurrency(1900000)}
              </span>
              <span className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold">Revenue Allocated</span>
            </div>
            <div className="text-center p-2 border-r-0 sm:border-r border-[#0052CC]/30">
              <span className="text-lg sm:text-2xl font-black text-emerald-400 block">
                280+
              </span>
              <span className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold">Grants Disbursed</span>
            </div>
            <div className="text-center p-2 border-r border-[#0052CC]/30">
              <span className="text-lg sm:text-2xl font-black text-cyan-400 block">
                100%
              </span>
              <span className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold">Direct Disbursement</span>
            </div>
            <div className="text-center p-2">
              <span className="text-lg sm:text-2xl font-black text-purple-300 block">
                Super Admin
              </span>
              <span className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold">Directly Verified</span>
            </div>
          </div>
        </div>

        {/* Active Initiatives Cards Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-blue-200/70">Loading active revenue donation initiatives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initiatives.map((init) => {
              const allocated = init.allocatedAmount || 500000;
              const disbursed = init.disbursedAmount || 150000;
              const percent = Math.min(100, Math.round((disbursed / allocated) * 100));

              return (
                <div
                  key={init._id}
                  className="bg-[#021838] border border-[#0052CC]/30 hover:border-[#FFB800]/60 rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:shadow-2xl hover:shadow-[#0052CC]/20 hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Top Tag & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-[#01142F] border border-[#0052CC]/50 shadow-inner">
                          {getCategoryIcon(init.category)}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0052CC]/30 text-blue-200 border border-[#0052CC]/50">
                          {init.category}
                        </span>
                      </div>

                      {init.badge && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40">
                          {init.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#FFB800] transition-colors leading-snug">
                      {init.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-blue-200/80 line-clamp-3 leading-relaxed">
                      {init.description}
                    </p>

                    {/* Eligibility box */}
                    <div className="mt-4 p-3 bg-[#01142F]/70 border border-blue-900/50 rounded-2xl text-[11px] text-gray-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold uppercase text-[9px] tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>Who is Eligible:</span>
                      </div>
                      <p className="text-gray-300 leading-normal line-clamp-2">{init.eligibility}</p>
                    </div>

                    {/* Financial details */}
                    <div className="mt-4 pt-3 border-t border-blue-900/50 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-300 font-semibold">Fund Allocated:</span>
                        <span className="font-mono font-black text-emerald-400">
                          {formatCurrency(allocated)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-300 font-semibold">Max Grant Per Applicant:</span>
                        <span className="font-mono font-black text-[#FFB800]">
                          Up to {formatCurrency(init.maxPerApplicant)}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#01142F] h-2 rounded-full overflow-hidden border border-blue-900/60 mt-1">
                        <div
                          className="bg-gradient-to-r from-[#0052CC] via-[#FFB800] to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{percent}% Disbursed</span>
                        <span>{init.applicationCount || 0} Applicants</span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-6 pt-4 border-t border-[#0052CC]/30">
                    <button
                      onClick={() => handleOpenModal(init)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#0052CC] to-[#003d99] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group-hover:border-[#FFB800]/50"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Apply For Aid / உதவிக்கு விண்ணப்பி</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL: APPLY FOR AID TO SUPER ADMIN ── */}
      {modalOpen && selectedInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-[#021838] border border-[#0052CC]/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#01142F] to-[#021838] border-b border-[#0052CC]/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#0052CC]/30 text-[#FFB800]">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm text-white">
                    Apply for Assistance
                  </h3>
                  <p className="text-[11px] text-blue-200/70 truncate max-w-xs">
                    {selectedInitiative.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Form */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {submittedRef ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">Application Submitted!</h4>
                    <p className="text-blue-200/80 text-xs mt-1 max-w-sm mx-auto">
                      Your request has been directly dispatched to the Super Admin review queue.
                    </p>
                  </div>

                  <div className="bg-[#01142F] border border-[#0052CC]/50 rounded-2xl p-4 max-w-sm mx-auto text-center space-y-1">
                    <span className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">
                      Your Reference ID:
                    </span>
                    <p className="text-xl font-mono font-black text-[#FFB800]">{submittedRef}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Super Admin Review
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                    The Super Admin team will review your eligibility criteria and reach out to your registered phone / WhatsApp number within 24–48 hours.
                  </p>

                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-2 px-6 py-2.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Done / Close
                  </button>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/50 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Fund Details Banner */}
                  <div className="p-3 bg-[#01142F] border border-[#0052CC]/40 rounded-2xl flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-blue-200/80">
                      <strong className="text-white">Eligibility reminder:</strong> {selectedInitiative.eligibility}
                    </div>
                  </div>

                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. S. Ramanathan"
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* Email & NIC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="applicant@email.com"
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        NIC / Student / Reg ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={nicOrId}
                        onChange={(e) => setNicOrId(e.target.value)}
                        placeholder="e.g. 200184910291 or 921029182V"
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* City & Requested Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kandy, Jaffna, Galle"
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                        Requested Aid (LKR) *
                      </label>
                      <input
                        type="number"
                        required
                        max={selectedInitiative.maxPerApplicant || 50000}
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-[#FFB800]"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        Max for this cause: {formatCurrency(selectedInitiative.maxPerApplicant)}
                      </span>
                    </div>
                  </div>

                  {/* Statement of Need */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                      Reason for Assistance / Situation Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain how you match the eligibility criteria and what these funds will be used for..."
                      className="w-full px-3 py-2.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#0052CC]/30">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 text-gray-400 hover:text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#003d99] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Request to Super Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
