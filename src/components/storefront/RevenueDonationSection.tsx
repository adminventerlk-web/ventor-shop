'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  GraduationCap,
  Sprout,
  Stethoscope,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
} from 'lucide-react';

export default function RevenueDonationSection() {
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="community-grants-section"
      aria-labelledby="grants-heading"
      className="w-full py-4 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Welfare Aid Strip */}
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/80 shadow-xl transition-all"
          style={{
            backgroundColor: '#021838',
            backgroundImage: 'linear-gradient(135deg, #01142f 0%, #032759 60%, #010f24 100%)',
            color: '#ffffff',
          }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Left: Icon + Heading + Tagline */}
            <div className="flex items-start sm:items-center gap-3.5 max-w-2xl">
              <span className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5 sm:mt-0 shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Community Welfare Aid • நேரடி உதவி
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                    Coming Soon
                  </span>
                </div>
                <h3
                  id="grants-heading"
                  className="text-base sm:text-lg font-black text-white leading-snug"
                >
                  Need Financial Assistance? Community Welfare Grants Program
                </h3>
                <p className="text-xs text-blue-100 font-medium mt-0.5 line-clamp-2">
                  Direct financial grants for higher education students, organic spice farmers, and families facing emergency medical relief across Sri Lanka.
                </p>
              </div>
            </div>

            {/* Middle: 3 Quick Program Badges */}
            <div className="hidden md:flex flex-wrap items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#01142F] text-xs font-bold text-blue-200 border border-blue-700/60">
                <GraduationCap className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Education Grants</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#01142F] text-xs font-bold text-blue-200 border border-blue-700/60">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spice Farmer Aid</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#01142F] text-xs font-bold text-blue-200 border border-blue-700/60">
                <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
                <span>Medical Relief</span>
              </span>
            </div>

            {/* Right: Action Button */}
            <div className="shrink-0 w-full sm:w-auto flex items-center justify-end">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setNotifyModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Notify Me When Open</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── NOTIFICATION MODAL ── */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-white border-2 border-emerald-600 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#021838] text-white flex items-center justify-between border-b-2 border-emerald-600">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Get Notified on Grant Launch
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold">
                    Direct Financial Assistance • 100% Free
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotifyModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 text-xs bg-white space-y-4">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">You&apos;re On The List!</h4>
                  <p className="text-gray-600 text-xs max-w-xs mx-auto">
                    We will send an SMS / WhatsApp notification to your number as soon as welfare grant applications open.
                  </p>
                  <button
                    onClick={() => setNotifyModalOpen(false)}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="space-y-3.5">
                  <p className="text-gray-600 font-medium">
                    Enter your name and WhatsApp number to receive an instant alert when grant application forms go live:
                  </p>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. S. Ramanathan"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>No repayment needed. Grants are provided directly to approved beneficiaries.</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setNotifyModalOpen(false)}
                      className="px-4 py-2.5 text-gray-600 font-bold hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Notify Me</span>
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