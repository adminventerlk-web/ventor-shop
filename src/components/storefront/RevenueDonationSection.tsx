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
  Clock,
  Coins,
  MapPin,
  Phone,
  FileText,
  Megaphone,
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
      setErrorMessage('Please fill in all mandatory fields to submit your application.');
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
        return <HeartHandshake className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section
      id="revenue-donations-section"
      className="relative w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#010e24] via-[#021838] to-[#010e24] text-white border-y border-[#0052CC]/40 overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0052CC]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Ad-Style Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0052CC]/40 border-2 border-[#FFB800]/80 text-[#FFB800] text-xs font-black uppercase tracking-wider mb-3 shadow-md">
            <Megaphone className="w-4 h-4 text-[#FFB800]" />
            <span>COMMUNITY FINANCIAL ASSISTANCE & WELFARE GRANTS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Need Financial Support? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-300 to-yellow-400">Apply for Grants Today</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-white font-medium leading-relaxed max-w-2xl mx-auto">
            Direct financial grant assistance is now open for students pursuing higher education, small organic spice farmers, and families facing critical medical emergencies across Sri Lanka.
          </p>

          {/* Ad Highlights Strip (High Contrast) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#01142F] border-2 border-[#0052CC]/60 rounded-2xl p-4 shadow-xl">
            <div className="text-center p-2 border-r border-blue-900 last:border-0 sm:last:border-0">
              <span className="text-xl sm:text-2xl font-black text-[#FFB800] block font-mono">
                {formatCurrency(1900000)}
              </span>
              <span className="text-xs text-white font-bold uppercase tracking-wider block mt-0.5">
                Grant Fund Available
              </span>
            </div>
            <div className="text-center p-2 border-r-0 sm:border-r border-blue-900">
              <span className="text-xl sm:text-2xl font-black text-emerald-300 block font-mono">
                280+
              </span>
              <span className="text-xs text-white font-bold uppercase tracking-wider block mt-0.5">
                Recipients Aided
              </span>
            </div>
            <div className="text-center p-2 border-r border-blue-900">
              <span className="text-xl sm:text-2xl font-black text-cyan-300 block font-mono">
                100%
              </span>
              <span className="text-xs text-white font-bold uppercase tracking-wider block mt-0.5">
                Direct Disbursement
              </span>
            </div>
            <div className="text-center p-2">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block font-mono">
                Zero Fees
              </span>
              <span className="text-xs text-white font-bold uppercase tracking-wider block mt-0.5">
                Free to Apply
              </span>
            </div>
          </div>
        </div>

        {/* Active Aid Program Cards */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Loading assistance programs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initiatives.map((init) => {
              const allocated = init.allocatedAmount || 500000;
              const maxGrant = init.maxPerApplicant || 30000;

              return (
                <div
                  key={init._id}
                  className="bg-[#021838] border-2 border-blue-600/50 hover:border-[#FFB800] rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:shadow-2xl hover:shadow-[#0052CC]/30 hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-[#01142F] border border-blue-500/60 shadow-inner">
                          {getCategoryIcon(init.category)}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0052CC] text-white">
                          {init.category}
                        </span>
                      </div>

                      {init.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/60">
                          {init.badge}
                        </span>
                      )}
                    </div>

                    {/* Program Title */}
                    <h3 className="text-lg font-black text-white group-hover:text-[#FFB800] transition-colors leading-snug">
                      {init.title}
                    </h3>

                    {/* Program Description (High Contrast) */}
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                      {init.description}
                    </p>

                    {/* Eligibility Box (Crystal Clear Contrast) */}
                    <div className="mt-4 p-3.5 bg-[#01142F] border-2 border-blue-800 rounded-2xl text-xs space-y-1.5 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[#FFB800] font-black uppercase text-[10px] tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                        <span>Who Can Apply (தகுதியுடையோர்):</span>
                      </div>
                      <p className="text-white font-medium leading-relaxed">{init.eligibility}</p>
                    </div>

                    {/* Grant Financial Details */}
                    <div className="mt-4 pt-3.5 border-t border-blue-800/80 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-200 font-bold">Total Program Fund:</span>
                        <span className="font-mono font-black text-emerald-300 text-sm">
                          {formatCurrency(allocated)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-200 font-bold">Maximum Aid per Applicant:</span>
                        <span className="font-mono font-black text-[#FFB800] text-sm">
                          Up to {formatCurrency(maxGrant)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-6 pt-4 border-t border-blue-900/60">
                    <button
                      onClick={() => handleOpenModal(init)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0052CC] to-[#003d99] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
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

      {/* ── APPLICATION MODAL ── */}
      {modalOpen && selectedInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-[#021838] border-2 border-blue-500 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#01142F] to-[#021838] border-b-2 border-blue-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-xl bg-[#0052CC] text-[#FFB800] shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Apply for Financial Assistance
                  </h3>
                  <p className="text-xs text-yellow-300 font-bold truncate max-w-xs mt-0.5">
                    {selectedInitiative.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
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
                    <h4 className="text-xl font-black text-white">Application Submitted!</h4>
                    <p className="text-white text-xs mt-1 max-w-sm mx-auto font-medium">
                      Your assistance application has been received successfully.
                    </p>
                  </div>

                  <div className="bg-[#01142F] border-2 border-blue-500 rounded-2xl p-4 max-w-sm mx-auto text-center space-y-1">
                    <span className="text-xs text-yellow-300 uppercase tracking-widest font-black">
                      Your Reference ID:
                    </span>
                    <p className="text-2xl font-mono font-black text-[#FFB800]">{submittedRef}</p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                      Under Review
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 max-w-sm mx-auto font-medium leading-relaxed">
                    Our team will verify your eligibility details and contact your registered phone / WhatsApp number within 24–48 hours.
                  </p>

                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-2 px-6 py-2.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Done / Close
                  </button>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border-2 border-rose-500 text-white font-bold text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Eligibility Reminder Banner */}
                  <div className="p-3.5 bg-[#01142F] border-2 border-blue-700 rounded-2xl flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                    <div className="text-xs text-white font-medium leading-relaxed">
                      <strong className="text-yellow-300 block mb-0.5">Eligibility Criteria:</strong>
                      {selectedInitiative.eligibility}
                    </div>
                  </div>

                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. S. Ramanathan"
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-semibold placeholder-gray-400 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-semibold placeholder-gray-400 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* Email & NIC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="applicant@email.com"
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-semibold placeholder-gray-400 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        NIC / Student / Reg ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={nicOrId}
                        onChange={(e) => setNicOrId(e.target.value)}
                        placeholder="e.g. 200184910291 or 921029182V"
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-semibold placeholder-gray-400 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* City & Requested Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kandy, Jaffna, Galle"
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-semibold placeholder-gray-400 focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        Requested Aid (LKR) *
                      </label>
                      <input
                        type="number"
                        required
                        max={selectedInitiative.maxPerApplicant || 50000}
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-mono font-black focus:outline-none focus:border-[#FFB800]"
                      />
                      <span className="text-[11px] text-yellow-300 font-bold mt-1 block">
                        Maximum limit: {formatCurrency(selectedInitiative.maxPerApplicant)}
                      </span>
                    </div>
                  </div>

                  {/* Statement of Need */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                      Reason for Assistance / Situation Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain your situation and how these funds will be utilized..."
                      className="w-full px-3.5 py-2.5 bg-[#01142F] border-2 border-blue-600 rounded-xl text-white font-medium placeholder-gray-400 focus:outline-none focus:border-[#FFB800] resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-blue-900">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 text-white hover:text-yellow-300 font-black rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#003d99] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Application</span>
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
