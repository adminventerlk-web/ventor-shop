'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useSectionEntrance } from './useSectionEntrance';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ArrowRight,
  Gift,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Building2,
  ShieldCheck,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IVoucherStatus {
  _id: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  voucherAmount: number;
  institution: string;
}

interface ICommunityVoucherStatus {
  _id: string;
  title: string;
  supportedBy: string;
  voucherCode: string;
  status: 'ON' | 'OFF';
  discountType?: 'FIXED' | 'PERCENTAGE';
  discountValue?: number;
  voucherAmount?: number;
  noticeMessage?: string;
}

export default function PromoBanners() {
  const sectionRef = useSectionEntrance();
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';
  const { user } = useAuth();
  const router = useRouter();

  const [voucher, setVoucher] = useState<IVoucherStatus | null>(null);
  const [communityVoucher, setCommunityVoucher] = useState<ICommunityVoucherStatus | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchCommunityVoucher = async () => {
    try {
      const res = await fetch('/api/vouchers/community');
      if (res.ok) {
        const data = await res.json();
        if (data.vouchers && data.vouchers.length > 0) {
          setCommunityVoucher(data.vouchers[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch community voucher:', err);
    }
  };

  const fetchUserVoucher = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/vouchers/student/claim');
      if (res.ok) {
        const data = await res.json();
        if (data.voucher) {
          setVoucher(data.voucher);
        }
      }
    } catch (err) {
      console.error('Failed to fetch voucher status:', err);
    }
  };

  useEffect(() => {
    fetchCommunityVoucher();
  }, []);

  useEffect(() => {
    fetchUserVoucher();
  }, [user]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUseVoucherClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?callbackUrl=/vouchers#student');
      return;
    }

    if (voucher) {
      router.push('/vouchers');
    } else {
      router.push('/vouchers');
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim()) return;

    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch('/api/vouchers/student/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution: institution.trim(),
          studentIdNumber: studentId.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setVoucher(data.voucher);
        setModalOpen(false);
        alert(
          isTa
            ? 'மாணவர் வவுச்சர் விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! நிலுவையில் (Pending) உள்ளது.'
            : 'Student Voucher Application submitted! Status is currently Pending verification.'
        );
      } else {
        setMsg(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setMsg('Network error. Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} aria-labelledby="community-vouchers-heading" className="pb-8 pt-2 text-[#800020] font-sans sm:pb-10 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[#800020] [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[#800020] [&_button:focus-visible]:outline-offset-4 motion-reduce:[&_*]:animate-none! motion-reduce:[&_*]:transition-none!">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* COMMUNITY GIFT VOUCHERS BANNER */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-[#d6b46a]/40 bg-linear-to-br from-[#780019] via-[#A50030] to-[#570015] p-5 shadow-[0_10px_28px_-18px_#57001580] sm:p-7 lg:p-8">
          
          <span aria-hidden="true" className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full border border-[#e4bd63]/30" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full border border-[#e4bd63]/25" />

          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7 lg:items-center">
            
            {/* Left Column: Gift Box Icon + Text Info */}
            <div data-entrance="up" className="min-w-0 lg:col-span-4">
              
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#edcc83]/40 bg-white/5 text-[#f0ce7a]">
                <Gift className="h-6 w-6" aria-hidden="true" />
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white">COMMUNITY & STUDENT BENEFITS</p>
                <h2 id="community-vouchers-heading" className="font-serif text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.2] tracking-[-.02em] text-white">
                  {isTa ? 'சிறப்பு பரிசு வவுச்சர்கள்' : isSi ? 'විශේෂ ත්‍යාග වවුචර' : 'Special Gift Vouchers'}
                </h2>
                <div aria-hidden="true" className="h-0.5 w-12 rounded-full bg-[#edc76a]" />
                <p className="text-[13px] font-semibold leading-relaxed text-white">
                  {isTa ? 'கல்வி மற்றும் சமூக உறுப்பினர்களுக்கான ஆதரவு' : isSi ? 'අධ්‍යාපනය සහ ප්‍රජා සාමාජිකයින් සඳහා සහය වීම' : 'Supporting Education & Community Members'}
                </p>

                <p className="text-xs font-normal leading-[1.7] text-white/90">
                  {isTa
                    ? 'மாணவர்கள் மற்றும் V2CC சமூக உறுப்பினர்களுக்கான பிரத்தியேக பரிசு வவுச்சர்கள் மூலம் VENTERPRISE வழியாக சிறப்பு சலுகை விலையில் பொருட்களைப் பெறலாம்.'
                    : isSi
                    ? 'සිසුන් සහ V2CC ප්‍රජා සාමාජිකයින් සඳහා වූ විශේෂ වවුචර හරහා VENTERPRISE වෙතින් වට්ටම් සහිතව භාණ්ඩ ලබා ගත හැක.'
                    : 'Exclusive gift vouchers for students and registered V2CC community members to access special offers and benefits across VENTERPRISE.'}
                </p>
              </div>
            </div>

            {/* Right Column: 2 Voucher Interactive Cards (Student & Community) */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              
              {/* Card 1: Student Gift Voucher Card */}
              <div data-entrance="left" data-entrance-delay="120" className="flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-5 text-gray-900 shadow-[0_5px_16px_-10px_#4e152333] transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_#4e152340] motion-reduce:hover:translate-y-0 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FCE4E6] text-[#800020] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <GraduationCap className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-[16px] font-black leading-snug text-[#800020]">
                      {isTa ? 'மாணவர் பரிசு வவுச்சர்' : isSi ? 'ශිෂ්‍ය ත්‍යාග වවුචරය' : 'Student Gift Voucher'}
                    </h4>
                    <p className="text-[10px] text-[#64748B] font-semibold">Supported by</p>
                    <span className="inline-block bg-[#FCE4E6] text-[#800020] text-[10px] font-bold px-2 py-0.5 rounded-md max-w-full whitespace-normal">
                      VENTERPRISE Student Program
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  {isTa
                    ? 'பதிவுசெய்யப்பட்ட மாணவர்களுக்கான பிரத்தியேக வவுச்சர் சலுகை. விண்ணப்பித்து, நிர்வாகி ஒப்புதல் பெற்றதும் உங்கள் வவுச்சர் குறியீட்டைப் பெற்றுக்கொள்ளுங்கள்.'
                    : 'Exclusive educational voucher benefit for registered students. Apply and obtain your verified discount voucher code.'}
                </p>

                {/* Dynamic Status Display */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  
                  {!voucher && (
                    <div className="inline-flex items-center gap-1.5 bg-[#800020] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <span>ON (AVAILABLE)</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    </div>
                  )}

                  {voucher?.status === 'PENDING' && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>PENDING VERIFICATION</span>
                    </div>
                  )}

                  {voucher?.status === 'VERIFIED' && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      <span>VERIFIED & ACTIVE</span>
                    </div>
                  )}

                  {voucher?.status === 'REJECTED' && (
                    <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <XCircle className="w-3 h-3" />
                      <span>REJECTED</span>
                    </div>
                  )}
                </div>

                {/* CTA Action Button */}
                <button
                  onClick={handleUseVoucherClick}
                  className="w-full min-h-11 py-2.5 px-3 bg-[#800020] hover:bg-[#650019] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all text-center cursor-pointer"
                >
                  <span>
                    {voucher?.status === 'PENDING'
                      ? (isTa ? 'விண்ணப்ப நிலை (View Status)' : 'Check Application Status')
                      : voucher?.status === 'VERIFIED'
                      ? (isTa ? 'வவுச்சரை சரிபார்த்து பயன்படுத்துக' : 'Verify & Redeem Voucher')
                      : (isTa ? 'மாணவர் வவுச்சருக்கு விண்ணப்பிக்கவும்' : 'Apply for Student Voucher')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: V2CC Community Member Voucher Card */}
              <div data-entrance="right" data-entrance-delay="240" className="flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-5 text-gray-900 shadow-[0_5px_16px_-10px_#4e152333] transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_#4e152340] motion-reduce:hover:translate-y-0 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FCE4E6] text-[#800020] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Users className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-[16px] font-black leading-snug text-[#800020]">
                      {communityVoucher?.title || (isTa ? 'V2CC சமூக உறுப்பினர் வவுச்சர்' : isSi ? 'V2CC ප්‍රජා සාමාජික වවුචරය' : 'V2CC Community Voucher')}
                    </h4>
                    <p className="text-[10px] text-[#64748B] font-semibold">Supported by</p>
                    <span className="inline-block bg-[#FCE4E6] text-[#800020] text-[10px] font-bold px-2 py-0.5 rounded-md max-w-full whitespace-normal">
                      {communityVoucher?.supportedBy || 'V2CC-PMS Community Program'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium">
                  {isTa
                    ? 'Admin சரிபார்த்த V2CC உறுப்பினர்களுக்கான பிரத்தியேக சமூக சலுகை வவுச்சர். ஒரு முறை மட்டுமே பயன்படுத்தலாம்.'
                    : isSi
                    ? 'පරිපාලක විසින් තහවුරු කරන ලද V2CC සාමාජිකයින් සඳහා වූ විශේෂ ප්‍රජා වවුචරය.'
                    : 'Exclusive one-time community voucher benefit for Admin-verified V2CC-PMS members.'}
                </p>

                {/* Dynamic Status Toggle Display: ON vs OFF */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  
                  {communityVoucher?.status === 'OFF' ? (
                    <div className="inline-flex items-center gap-1.5 bg-gray-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>OFF (PAUSED)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-[#800020] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <span>ON (AVAILABLE)</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {communityVoucher?.status === 'OFF' ? (
                  <Link
                    href="/vouchers"
                    className="w-full min-h-11 py-2.5 px-3 bg-white hover:bg-[#fff5f6] text-[#800020] border border-[#800020] text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer"
                  >
                    <span>{isTa ? 'விபரங்களைப் பார்க்க' : isSi ? 'විස්තර බලන්න' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/vouchers"
                    className="w-full min-h-11 py-2.5 px-3 bg-[#800020] hover:bg-[#650019] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all text-center cursor-pointer"
                  >
                    <span>{isTa ? 'சமூக வவுச்சரைப் பயன்படுத்துக' : isSi ? 'ප්‍රජා වවුචරය භාවිතා කරන්න' : 'Use Community Voucher'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Student Voucher Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#003B7A]">
                <GraduationCap className="w-6 h-6" />
                <h3 className="font-black text-base uppercase tracking-tight">
                  {isTa ? 'மாணவர் வவுச்சர் விண்ணப்பம்' : 'Claim Student Gift Voucher'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium">
              {isTa
                ? 'உங்கள் பள்ளி / கல்லூரி விபரங்களை உள்ளிட்டு விண்ணப்பிக்கவும். நிர்வாகி சரிபார்த்த பின் (Admin Verification) வவுச்சர் உங்கள் கணக்கில் சேர்க்கப்படும்.'
                : 'Enter your school/university details to apply. Once verified by admin, your LKR 2,500 voucher will be activated.'}
            </p>

            {msg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100">
                ⚠️ {msg}
              </div>
            )}

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {isTa ? 'பள்ளி / கல்லூரி / பல்கலைக்கழகம் பெயர் *' : 'School / University Name *'}
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal College Colombo / University of Jaffna"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0066E6] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {isTa ? 'மாணவர் அடையாள எண் (Optional)' : 'Student ID Number (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-2024-8841"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0066E6] text-xs font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#0066E6] hover:bg-[#0052B8] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Claim Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
