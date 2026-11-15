'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Store,
  Clock,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function VendorGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logoutUser } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010e24] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Not logged in -> redirect to login
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/login?callbackUrl=/vendor');
    }
    return null;
  }

  // 2. Not a vendor account
  if (!user.isVendor && user.customerType !== 'SELLER_SUPPLIER') {
    return (
      <div className="min-h-screen bg-[#010e24] text-white flex items-center justify-center p-4">
        <div className="bg-[#021838] border border-[#0052CC]/40 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0052CC]/20 border border-[#0052CC] flex items-center justify-center mx-auto text-[#FFB800]">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Vendor Access Required</h2>
            <p className="text-xs text-blue-200/70 mt-2 leading-relaxed">
              Your account is registered as a customer. To sell products, please register a vendor store account or contact support.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login"
              className="w-full py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Register Shop Account
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-2.5 bg-[#01142F] hover:bg-white/5 border border-blue-800 text-blue-200 rounded-xl text-xs font-bold transition-all"
            >
              Back to Customer Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Vendor status is PENDING approval
  if (user.vendorStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-[#010e24] text-white flex items-center justify-center p-4">
        <div className="bg-[#021838] border border-[#FFB800]/50 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FFB800]/20 border border-[#FFB800] flex items-center justify-center mx-auto text-[#FFB800] animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40">
              Application Under Review
            </span>
            <h1 className="text-2xl font-black text-white pt-2">
              {user.shopName || 'Your Shop'} is Pending Super Admin Approval
            </h1>
            <p className="text-xs text-blue-200/80 leading-relaxed max-w-md mx-auto">
              Thank you for registering on VENTERSHOP! Our marketplace administration team is currently reviewing your store details. Once approved, your vendor dashboard will be fully activated and you can start uploading products with variants.
            </p>
          </div>

          <div className="bg-[#01142F] border border-blue-900/60 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between text-blue-200/70">
              <span>Registered Email:</span>
              <strong className="text-white">{user.email}</strong>
            </div>
            <div className="flex justify-between text-blue-200/70">
              <span>Store Name:</span>
              <strong className="text-[#FFB800]">{user.shopName || 'Merchant Store'}</strong>
            </div>
            <div className="flex justify-between text-blue-200/70">
              <span>Status:</span>
              <span className="text-[#FFB800] font-bold">Pending Super Admin Review</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-4 py-2.5 bg-[#01142F] hover:bg-white/5 border border-blue-800 text-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </Link>
            <button
              onClick={() => logoutUser()}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Vendor status is REJECTED
  if (user.vendorStatus === 'REJECTED') {
    return (
      <div className="min-h-screen bg-[#010e24] text-white flex items-center justify-center p-4">
        <div className="bg-[#021838] border border-red-500/50 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto text-red-400">
            <XCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Application Not Approved</h2>
            <p className="text-xs text-blue-200/70 mt-2 leading-relaxed">
              Your shop application was not approved by the Super Admin team. As per marketplace policy, products cannot be listed under this account.
            </p>
          </div>
          <div className="bg-[#01142F] border border-red-950 rounded-xl p-3 text-xs text-red-300">
            Please check your email for specific feedback or contact support at{' '}
            <a href="mailto:support@ventershop.ca" className="underline font-bold text-white">
              support@ventershop.ca
            </a>
            .
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-4 py-2 bg-[#01142F] hover:bg-white/5 border border-blue-800 text-blue-200 rounded-xl text-xs font-bold"
            >
              Return Home
            </Link>
            <button
              onClick={() => logoutUser()}
              className="px-4 py-2 bg-red-600/30 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Vendor is APPROVED! Render dashboard children
  return <>{children}</>;
}

