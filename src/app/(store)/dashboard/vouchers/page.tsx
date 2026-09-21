'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Building2,
  Gift,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IVoucherItem {
  _id: string;
  institution: string;
  studentIdNumber?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  voucherAmount: number;
  discountCode: string;
  appliedAt: string;
  verifiedAt?: string;
}

export default function UserVouchersPage() {
  const [voucher, setVoucher] = useState<IVoucherItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadVoucher() {
      try {
        const res = await fetch('/api/vouchers/student/claim');
        if (res.ok) {
          const data = await res.json();
          setVoucher(data.voucher || null);
        }
      } catch (err) {
        console.error('Failed to load voucher:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVoucher();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-xs font-semibold text-gray-900">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0055D4] flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              My Community Gift Vouchers
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Manage your Student Gift Voucher applications, verification status, and active balance.
            </p>
          </div>
        </div>

        <Link
          href="/shop"
          className="px-4 py-2 bg-[#801414] hover:bg-[#600e0e] text-white rounded-xl font-extrabold flex items-center gap-1.5 shadow-2xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Now</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
          <div className="inline-block w-6 h-6 border-3 border-[#0055D4] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Checking your voucher status...</p>
        </div>
      ) : !voucher ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-blue-50 text-[#0055D4] rounded-2xl flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-black text-gray-900 uppercase">No Student Voucher Claimed Yet</h3>
            <p className="text-xs text-gray-500 font-medium">
              You have not applied for a Student Gift Voucher. Claim your LKR 2,500 educational voucher today!
            </p>
          </div>
          <Link
            href="/vouchers#student"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066E6] hover:bg-[#0052B8] text-white font-extrabold rounded-xl text-xs shadow-md transition-all"
          >
            <span>Apply for Student Voucher</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Status Display Card */}
          <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 sm:p-8 shadow-md space-y-6">
            
            {/* Top Info Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F1FD] text-[#0066E6] flex items-center justify-center shadow-md shrink-0">
                  <GraduationCap className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#003B7A] uppercase tracking-tight">
                    Student Gift Voucher
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>{voucher.institution}</span>
                    {voucher.studentIdNumber && (
                      <span className="text-[11px] font-mono text-gray-400">
                        ({voucher.studentIdNumber})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {voucher.status === 'PENDING' && (
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-full font-black text-xs shadow-2xs">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>PENDING VERIFICATION</span>
                  </div>
                )}

                {voucher.status === 'VERIFIED' && (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-full font-black text-xs shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>VERIFIED & ACTIVE</span>
                  </div>
                )}

                {voucher.status === 'REJECTED' && (
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-800 border border-red-200 px-4 py-2 rounded-full font-black text-xs shadow-2xs">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>REJECTED BY ADMIN</span>
                  </div>
                )}

                {voucher.status === 'USED' && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-full font-black text-xs shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span>VOUCHER REDEEMED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Detail Explanation Banner */}
            {voucher.status === 'PENDING' && (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5 text-amber-900">
                <div className="flex items-center gap-2 font-black text-xs">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Application Under Review</span>
                </div>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Your Student Gift Voucher request has been received! Our administration team is reviewing your school affiliation ({voucher.institution}). Once verified, your status will turn to <strong className="font-extrabold text-emerald-700">VERIFIED & ACTIVE</strong> and your LKR 2,500 discount will automatically apply during checkout.
                </p>
              </div>
            )}

            {voucher.status === 'VERIFIED' && (
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1.5 text-emerald-900">
                <div className="flex items-center gap-2 font-black text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Verified Student Beneficiary</span>
                </div>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Congratulations! Your student affiliation has been verified. Your <strong>{formatCurrency(voucher.voucherAmount)}</strong> voucher discount is active and ready for use.
                </p>
              </div>
            )}

            {/* Voucher Card Code & Balance Box */}
            <div className="bg-[#F0F6FE] border border-[#BFDBFE] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-extrabold text-[#0055D4] uppercase tracking-wider block">
                  Voucher Value / Active Balance
                </span>
                <p className="text-2xl font-black text-[#003B7A]">
                  {formatCurrency(voucher.voucherAmount)}
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Voucher Code: <strong className="font-mono text-gray-900">{voucher.discountCode}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopy(voucher.discountCode)}
                  className="px-4 py-2.5 bg-white hover:bg-[#0066E6] text-[#0066E6] hover:text-white border border-[#0066E6]/30 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-[#0066E6] hover:bg-[#0052B8] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Redeem at Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
