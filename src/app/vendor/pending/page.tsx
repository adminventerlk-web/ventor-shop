'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Clock, Store, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VendorPendingPage() {
  const { user, logoutUser } = useAuth();

  const shopName = user?.shopName || 'Your Store';
  const firstName = user?.firstName || 'Shop Owner';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#010e24] via-[#021838] to-[#010e24] text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0052CC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <span className="text-xl font-black tracking-wider text-[#FFB800] font-mono">VENTERPRISE</span>
        </div>

        {/* Waiting Icon with Animated Ring */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#FFB800]/15 border-2 border-dashed border-[#FFB800]/50 animate-spin-slow" />
          <span className="w-20 h-20 rounded-full bg-[#021838] border-2 border-[#FFB800]/60 flex items-center justify-center shadow-xl shadow-[#FFB800]/20">
            <Clock className="w-10 h-10 text-[#FFB800]" />
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Application Under Review
          </h1>
          <p className="text-sm text-blue-200/70 mt-1">
            Hi <strong className="text-white">{firstName}</strong>, your shop registration for{' '}
            <strong className="text-[#FFB800]">{shopName}</strong> has been received.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[#021838] border border-[#FFB800]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
          <div className="flex items-center gap-3 pb-3 border-b border-[#0052CC]/30">
            <Store className="w-5 h-5 text-[#FFB800]" />
            <h3 className="font-black text-sm text-white">What happens next?</h3>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              {
                step: '1',
                text: 'Your shop registration details are being reviewed by our Super Admin team.',
                done: true,
              },
              {
                step: '2',
                text: 'The Super Admin will verify your shop details, category, and location within 24–48 hours.',
                done: false,
              },
              {
                step: '3',
                text: 'Once approved, you will receive a confirmation email with access to your Vendor Dashboard.',
                done: false,
              },
              {
                step: '4',
                text: 'From your Vendor Dashboard, you can upload products, set variants & prices, and start selling.',
                done: false,
              },
            ].map(({ step, text, done }) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border ${
                    done
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'bg-[#0052CC]/20 border-[#0052CC]/60 text-blue-300'
                  }`}
                >
                  {done ? '✓' : step}
                </span>
                <span className={done ? 'text-blue-200' : 'text-gray-400'}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Banner */}
        <div className="bg-[#0052CC]/15 border border-[#0052CC]/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-left">
          <ShieldCheck className="w-6 h-6 text-[#FFB800] shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 text-xs text-blue-200/80">
            <strong className="text-white block">Need urgent support?</strong>
            Contact the Super Admin team at{' '}
            <a href="mailto:adminventerlk@gmail.com" className="text-[#FFB800] underline">
              adminventerlk@gmail.com
            </a>{' '}
            with your registration email and shop name.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#021838] border border-[#0052CC]/50 text-blue-200 hover:text-white hover:bg-[#0052CC]/30 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>

          <button
            onClick={logoutUser}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* CSS for slow spin */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
