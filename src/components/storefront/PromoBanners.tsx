'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ArrowRight,
  Gift,
  GraduationCap,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Building2,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IVoucherStatus {
  _id: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  voucherAmount: number;
  institution: string;
}

interface ICommunityProgramVoucher {
  _id: string;
  title: string;
  supportedBy: string;
  communityType: string;
  voucherCode: string;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
}

export default function PromoBanners() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';
  const { user } = useAuth();
  const router = useRouter();

  const [voucher, setVoucher] = useState<IVoucherStatus | null>(null);
  const [communityVouchers, setCommunityVouchers] = useState<ICommunityProgramVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const fetchCommunityVouchers = async () => {
    try {
      const res = await fetch('/api/vouchers/community');
      if (res.ok) {
        const data = await res.json();
        setCommunityVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error('Failed to fetch community vouchers:', err);
    }
  };

  useEffect(() => {
    fetchUserVoucher();
    fetchCommunityVouchers();
  }, [user]);

  const handleUseVoucherClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?callbackUrl=/vouchers#student');
      return;
    }

    if (voucher) {
      router.push('/dashboard/vouchers');
    } else {
      setModalOpen(true);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Get active family support / community voucher if configured
  const familyVoucher = communityVouchers.find((cv) => cv.communityType === 'FAMILY_SUPPORT') || communityVouchers[0];

  const isFamilyOn = familyVoucher?.status === 'ON';

  return (
    <section className="py-6 sm:py-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* COMMUNITY GIFT VOUCHERS BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#7B0000] via-[#8D0606] to-[#6A0000] p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-red-900/40">
          
          {/* Subtle Decorative Background Glows */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* Left Column: Gift Box Icon + Text Info */}
            <div className="lg:col-span-6 flex items-start gap-4 sm:gap-5">
              
              {/* Gift Box Graphic Frame with % Badge */}
              <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-2 border border-red-400/30 flex items-center justify-center shadow-lg group">
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300 stroke-[2.5]" />
                
                {/* Floating Ribbon Percent Badge */}
                <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-red-950 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] font-black">
                  %
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                  {isTa ? 'சமூக பரிசு வவுச்சர்கள்' : isSi ? 'සමූහ ත්‍යාග වවුචර' : 'COMMUNITY GIFT VOUCHERS'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-white/95">
                  {isTa ? 'கல்வி மற்றும் சமூகப் பராமரிப்பிற்கு ஆதரவளித்தல்' : isSi ? 'අධ්‍යාපනය සහ සමාජ සුභසාධනය සඳහා සහය වීම' : 'Supporting Education & Community Care'}
                </p>
                
                {/* Yellow Underline Accent */}
                <div className="w-12 h-1 bg-yellow-400 rounded-full my-1.5" />

                <p className="text-[11px] sm:text-xs text-red-100/90 font-medium leading-relaxed pt-0.5">
                  {isTa
                    ? 'எங்கள் சமூகத் திட்டங்கள் மூலம் வழங்கப்படும் பரிசு வவுச்சர்கள் மாணவர்கள் மற்றும் குடும்பங்கள் VENTERSHOP மூலம் அத்தியாவசிய பொருட்களைப் பெற உதவுகின்றன.'
                    : isSi
                    ? 'අපගේ සමූහ වැඩසටහන් හරහා ලබා දෙන ත්‍යාග වවුචර මගින් සිසුන්ට සහ පවුල්වලට VENTERSHOP හරහා අවශ්‍ය ද්‍රව්‍ය ලබා ගැනීමට උපකාරී වේ.'
                    : 'Gift vouchers provided through our community programmes help students and families access essential items through VENTERSHOP.'}
                </p>
              </div>
            </div>

            {/* Right Column: 2 Voucher Interactive Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. Student Gift Voucher Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-900 shadow-lg border border-gray-100 flex flex-col justify-between space-y-3">
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F1FD] text-[#0055D4] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <GraduationCap className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#003B7A] leading-tight truncate">
                      {isTa ? 'மாணவர் பரிசு வவுச்சர்' : isSi ? 'ශිෂ්‍ය ත්‍යාග වවුචරය' : 'Student Gift Voucher'}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">Supported by</p>
                    <span className="inline-block bg-[#E8F1FD] text-[#0055D4] text-[9px] font-extrabold px-2 py-0.5 rounded-md truncate max-w-full">
                      Educating Bank System of V2CC
                    </span>
                  </div>
                </div>

                {/* Dynamic Status Toggle Display */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  
                  {!voucher && (
                    <div className="inline-flex items-center gap-1.5 bg-[#00A859] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <span>ON</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    </div>
                  )}

                  {voucher?.status === 'PENDING' && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>PENDING</span>
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
                  className="w-full py-2 px-3 bg-[#0066E6] hover:bg-[#0052B8] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all text-center cursor-pointer"
                >
                  <span>
                    {voucher?.status === 'PENDING'
                      ? (isTa ? 'நிலுவையில் உள்ளது (View Status)' : 'Pending Verification')
                      : voucher?.status === 'VERIFIED'
                      ? (isTa ? 'அங்கீகரிக்கப்பட்டது (View Voucher)' : 'Verified (Use Voucher)')
                      : (isTa ? 'மாணவர் வவுச்சரைப் பயன்படுத்துக' : 'Use Student Voucher')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Family Support / Community Voucher Card (DYNAMIC ON/OFF STATUS) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-900 shadow-lg border border-gray-100 flex flex-col justify-between space-y-3">
                
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                      isFamilyOn ? 'bg-[#E8F8EE] text-[#0E703C]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Home className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E703C] leading-tight truncate">
                      {familyVoucher?.title || (isTa ? 'குடும்ப ஆதரவு வவுச்சர்' : 'Family Support Voucher')}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">Supported by</p>
                    <span className="inline-block bg-[#E8F8EE] text-[#0E703C] text-[9px] font-extrabold px-2 py-0.5 rounded-md truncate max-w-full">
                      {familyVoucher?.supportedBy || 'TMSAP Project of V2CC'}
                    </span>
                  </div>
                </div>

                {/* Status Toggle Display: ON or OFF */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  
                  {isFamilyOn ? (
                    <div className="inline-flex items-center gap-1.5 bg-[#00A859] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                      <span>ON</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                      <span>OFF</span>
                    </div>
                  )}
                </div>

                {/* Dynamic Action Button */}
                {isFamilyOn ? (
                  <button
                    onClick={() => handleCopyCode(familyVoucher?.voucherCode || 'FAMILY-V2CC')}
                    className="w-full py-2 px-3 bg-[#0E703C] hover:bg-[#0a522c] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all text-center cursor-pointer"
                  >
                    {copiedCode === (familyVoucher?.voucherCode || 'FAMILY-V2CC') ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Code Copied ({familyVoucher?.voucherCode})!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Use Code ({familyVoucher?.voucherCode})</span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/vouchers#family"
                    className="w-full py-2 px-3 bg-white hover:bg-gray-50 text-[#0066E6] border border-[#0066E6]/30 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all text-center"
                  >
                    <span>{isTa ? 'விபரங்களைப் பார்க்க' : isSi ? 'විස්තර බලන්න' : 'View Details'}</span>
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
