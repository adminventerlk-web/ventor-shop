'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { formatCurrency } from '@/lib/utils/currency';
import {
  Gift,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Check,
  ShoppingBag,
  HelpCircle,
  AlertCircle,
  Sparkles,
  KeyRound,
  UserCheck,
  Send,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface IStudentVoucher {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  institution: string;
  studentIdNumber?: string;
  phone?: string;
  gradeOrYear?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  voucherAmount: number;
  discountCode: string;
  isRedeemed: boolean;
  appliedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export default function VouchersClient() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const { user } = useAuth();
  const { setAppliedVoucherCode, appliedVoucherCode } = useCart();

  const [loading, setLoading] = useState(true);
  const [studentVoucher, setStudentVoucher] = useState<IStudentVoucher | null>(null);

  // Request Form States
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [gradeOrYear, setGradeOrYear] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Verification & Redeem States
  const [verifyName, setVerifyName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setFullName(name);
      setVerifyName(name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Load student voucher status
  const fetchStudentVoucher = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/vouchers/student/claim');
      if (res.ok) {
        const data = await res.json();
        if (data.voucher) {
          setStudentVoucher(data.voucher);
          if (data.voucher.discountCode && data.voucher.discountCode !== 'PENDING_APPROVAL') {
            setVerifyCode(data.voucher.discountCode);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load student voucher status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentVoucher();
  }, [user]);

  // Handle Submit Application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setRequestError(null);
    setRequestSuccess(null);

    if (!institution.trim()) {
      setRequestError(isTa ? 'தயவுசெய்து உங்கள் பள்ளி அல்லது கல்லூரி பெயரை உள்ளிடவும்.' : 'Please enter your school or institute name.');
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await fetch('/api/vouchers/student/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          institution: institution.trim(),
          studentIdNumber: studentIdNumber.trim(),
          phone: phone.trim(),
          gradeOrYear: gradeOrYear.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRequestSuccess(
          isTa
            ? 'மாணவர் பரிசு வவுச்சர் விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! Admin சரிபார்ப்பிற்குப் பிறகு உங்களுக்கு குறியீடு வழங்கப்படும்.'
            : 'Application submitted successfully! Your voucher code will be issued once approved by Admin.'
        );
        setStudentVoucher(data.voucher);
      } else {
        setRequestError(data.error || 'Failed to submit application.');
      }
    } catch {
      setRequestError(isTa ? 'இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Network error. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Handle Verify & Redeem (Name + Code)
  const handleVerifyAndRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setVerifySuccess(null);

    if (!verifyName.trim() || !verifyCode.trim()) {
      setVerifyError(isTa ? 'முழு பெயர் மற்றும் வவுச்சர் குறியீடு இரண்டும் தேவை.' : 'Both Student Full Name and Voucher Code are required.');
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch('/api/vouchers/student/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentFullName: verifyName.trim(),
          voucherCode: verifyCode.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const cleanCode = verifyCode.trim().toUpperCase();
        setAppliedVoucherCode(cleanCode);
        setVerifySuccess(
          isTa
            ? `வவுச்சர் வெற்றிகரமாக சரிபார்க்கப்பட்டது! சலுகை உங்கள் கார்ட்டில் செயல்படுத்தப்பட்டுள்ளது (${data.voucher?.discountType === 'PERCENTAGE' ? data.voucher?.discountValue + '% தள்ளுபடி' : formatCurrency(data.voucher?.discountValue) + ' தள்ளுபடி'}).`
            : `Voucher successfully verified! ${data.voucher?.discountType === 'PERCENTAGE' ? data.voucher?.discountValue + '% OFF' : formatCurrency(data.voucher?.discountValue) + ' OFF'} has been activated on your cart.`
        );
        await fetchStudentVoucher();
      } else {
        setVerifyError(data.error || 'Verification failed. Please check full name and code.');
      }
    } catch {
      setVerifyError(isTa ? 'இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Network error during verification.');
    } finally {
      setVerifying(false);
    }
  };

  const studentFeatures = isTa
    ? [
        'பாடப் புத்தகங்கள் மற்றும் கல்வி வழிகாட்டிகள்',
        'எழுதுபொருட்கள், குறிப்பேடுகள் மற்றும் வடிவியல் பெட்டிகள்',
        'பள்ளி பைகள் மற்றும் மாணவர் அத்தியாவசிய உபகரணங்கள்',
        'கல்வி கணினி பாகங்கள் மற்றும் கற்றல் சாதனங்கள்',
      ]
    : [
        'Educational Textbooks & Study Guides',
        'Stationery Kits, Notebooks & Geometry Sets',
        'School Bags & Student Daily Accessories',
        'Student PC Accessories & Digital Learning Aids',
      ];

  const faqs = [
    {
      q: isTa ? 'மாணவர் பரிசு வவுச்சரை யார் பெறலாம்?' : 'Who is eligible for the Student Gift Voucher?',
      a: isTa
        ? 'VENTERPRISE தளத்தில் பதிவு செய்துள்ள மாணவர்கள் மற்றும் V2CC கல்வி வங்கி திட்டத்தின் கீழ் இணைந்த கற்பவர்கள் இந்த வவுச்சருக்கு விண்ணப்பிக்கலாம்.'
        : 'Registered students on VENTERPRISE and learners associated with the V2CC Educating Bank System can apply for this subsidy voucher.',
    },
    {
      q: isTa ? 'வவுச்சர் குறியீடு எவ்வாறு கிடைக்கும்?' : 'How do I receive my voucher code?',
      a: isTa
        ? 'நீங்கள் விண்ணப்பப் படிவத்தை சமர்ப்பித்ததும், Super Admin உங்கள் கல்வி விவரங்களை சரிபார்த்து ஒப்புதல் அளித்தவுடன், உங்கள் பிரத்யேக வவுச்சர் குறியீடு இங்கே காண்பிக்கப்படும்.'
        : 'Once you submit your student details, the Super Admin reviews and approves your request, after which your exclusive voucher code is generated directly on this page.',
    },
    {
      q: isTa ? 'வவுச்சரை எவ்வாறு சரிபார்த்து சலுகையைப் பெறுவது?' : 'How do I verify and obtain the offer?',
      a: isTa
        ? 'Admin ஒப்புதல் அளித்தவுடன், உங்கள் பதிவு செய்யப்பட்ட முழுப் பெயரையும் வழங்கப்பட்ட வவுச்சர் குறியீட்டையும் உள்ளிட்டு "சரிபார்த்து சலுகையைப் பெறு" பட்டனை அழுத்தினால், சலுகை உங்கள் கார்ட்டில் சேர்க்கப்பட்டு பொருட்களுக்கான விலையில் கழிவு செய்யப்படும்.'
        : 'Once approved, enter your registered Full Name and Voucher Code into the verification box and click "Verify & Obtain Offer". The discount will automatically apply to eligible educational items in your cart.',
    },
    {
      q: isTa ? 'சலுகை சதவீதம் அல்லது நிலையான தொகையா?' : 'Is the offer a percentage or fixed amount?',
      a: isTa
        ? 'நிர்வாகியால் (Admin) நிர்ணயிக்கப்பட்டபடி குறிப்பிட்ட சதவீதம் (எ.கா. 15% தள்ளுபடி) அல்லது குறிப்பிட்ட தொகை (எ.கா. LKR 2,500 மானியம்) உங்கள் கல்விப் பொருட்களுக்குப் பொருந்தும்.'
        : 'The discount is set by Admin as either a percentage (e.g. 15% OFF) or a fixed subsidy amount (e.g. LKR 2,500), deducted directly from your final payable total.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] font-sans antialiased text-xs font-semibold">
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-inherit" />}>
        <Header />
      </Suspense>

      {/* 2. Hero Banner */}
      <section aria-label="Community voucher introduction" className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-[#4d80cc]/30 bg-gradient-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-xl sm:p-10 lg:flex lg:items-center lg:justify-between gap-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#dceaff] text-[11px] font-extrabold uppercase tracking-widest">
              <Gift className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>{isTa ? 'V2CC கல்வி வங்கி ஆதரவு' : 'Supported by Educating Bank System of V2CC'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              {isTa ? (
                <>மாணவர் கல்வி <span className="text-[#FFC400]">பரிசு வவுச்சர்</span> திட்டம்</>
              ) : (
                <>V2CC Student <span className="text-[#FFC400]">Gift Voucher</span> Program</>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#dceaff] font-medium leading-relaxed">
              {isTa
                ? 'இலங்கை மாணவர்களின் கல்வித் தேவைகளுக்கான பாடப்புத்தகங்கள், எழுதுபொருட்கள் மற்றும் கற்றல் உபகரணங்களை மானிய விலையிலும் சிறப்பு தள்ளுபடியிலும் பெறுவதற்கான பிரத்யேக திட்டம்.'
                : 'Special educational subsidies and discounts for registered students across Sri Lanka to access school textbooks, stationery sets, and learning equipment at reduced prices.'}
            </p>
          </div>

          <div className="hidden lg:flex shrink-0 items-center justify-center">
            <div className="relative w-36 h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-20 h-20 text-[#FFC400]" />
              <span className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-[#0052CC] border border-white/30 text-white shadow-lg">
                <Sparkles className="w-5 h-5 text-[#FFC400]" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Student Voucher Card & Workflow */}
      <main className="max-w-6xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl border border-[#c7def5] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Top Badge & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2eefb]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF5FF] text-[#0759D6] flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#082B68]">
                    {isTa ? 'மாணவர் பரிசு வவுச்சர்' : 'Student Educational Gift Voucher'}
                  </h2>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                    V2CC Active
                  </span>
                </div>
                <p className="text-xs text-[#526681] font-semibold">
                  Official Sponsor: <strong className="text-[#0759D6]">Educating Bank System of V2CC</strong>
                </p>
              </div>
            </div>

            {studentVoucher?.status === 'VERIFIED' ? (
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{isTa ? 'அங்கீகரிக்கப்பட்டது' : 'Admin Approved'}</span>
              </span>
            ) : studentVoucher?.status === 'PENDING' ? (
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>{isTa ? 'சரிபார்ப்பில் உள்ளது' : 'Pending Approval'}</span>
              </span>
            ) : (
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#0759D6] text-white shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFC400]" />
                <span>{isTa ? 'விண்ணப்பிக்கலாம்' : 'Open for Students'}</span>
              </span>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="bg-[#f7fbff] border border-[#d6e7f8] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-[#082B68] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0759D6]" />
              <span>{isTa ? 'தகுதியான கல்விப் பொருட்கள் & சலுகை விபரம்:' : 'Eligible Student Items & Educational Benefits:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {studentFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium bg-white p-2.5 rounded-xl border border-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-[#0759D6] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              DYNAMIC INTERACTIVE WORKFLOW
             ───────────────────────────────────────────────────────────── */}

          {/* 1. GUEST USER (Not Logged In) -> Prompt to Register First */}
          {!user ? (
            <div className="bg-gradient-to-r from-[#021838] to-[#07337a] text-white rounded-3xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FFB800]/20 border border-[#FFB800]/40 text-[#FFB800] flex items-center justify-center mx-auto shadow-md">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {isTa ? 'மாணவர்கள் மட்டும் விண்ணப்பிக்கலாம்' : 'Registered Students Only'}
                </h3>
                <p className="text-xs text-blue-200/80 leading-relaxed font-medium">
                  {isTa
                    ? 'இந்த மாணவர் பரிசு வவுச்சரை பெற நீங்கள் VENTERPRISE தளத்தில் மாணவராக அல்லது V2CC உறுப்பினராக பதிவு செய்திருக்க வேண்டும். தயவுசெய்து முதலில் பதிவு செய்யவும் அல்லது உள்நுழையவும்.'
                    : 'To apply for the V2CC Student Gift Voucher, you must be a registered student or V2CC community member. Please register or sign in to submit your voucher request.'}
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login?tab=register&callbackUrl=/vouchers"
                  className="w-full sm:w-auto px-6 py-3 bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{isTa ? 'மாணவர் கணக்கு பதிவு செய்' : 'Register Student Account'}</span>
                </Link>
                <Link
                  href="/login?callbackUrl=/vouchers"
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all text-center"
                >
                  {isTa ? 'உள்நுழைக' : 'Sign In'}
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 text-[#0759D6] animate-spin" />
              <p className="text-xs text-gray-500 font-bold">{isTa ? 'விவரங்கள் ஏற்றப்படுகின்றன...' : 'Checking student voucher status...'}</p>
            </div>
          ) : studentVoucher?.status === 'VERIFIED' ? (
            /* 2. APPROVED BY ADMIN -> SHOW CODE + VERIFICATION INPUT BOX (Full Name + Code) */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950 via-[#042817] to-emerald-900 border border-emerald-500/40 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTa ? 'நிர்வாகியால் ஒப்புதல் அளிக்கப்பட்டது' : 'Super Admin Approved & Issued'}</span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {isTa ? 'உங்கள் மாணவர் வவுச்சர் தயார்!' : 'Your Student Voucher is Ready!'}
                    </h3>
                    <p className="text-xs text-emerald-200/90 font-medium">
                      Student: <strong className="text-white">{studentVoucher.userName}</strong> ({studentVoucher.institution})
                    </p>
                  </div>

                  <div className="bg-[#021838] border-2 border-dashed border-[#FFB800] rounded-2xl px-6 py-3.5 text-center shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800] block">
                      {isTa ? 'உங்களுக்கு ஒதுக்கப்பட்ட குறியீடு' : 'Issued Voucher Code'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest block pt-0.5">
                      {studentVoucher.discountCode}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-400 block mt-1">
                      {studentVoucher.discountType === 'PERCENTAGE'
                        ? `${studentVoucher.discountValue}% DISCOUNT`
                        : `${formatCurrency(studentVoucher.discountValue || studentVoucher.voucherAmount)} SUBSIDY`}
                    </span>
                  </div>
                </div>
              </div>

              {/* VERIFICATION FORM: Full Name + Voucher Code to Obtain Offer */}
              <div className="bg-[#EAF5FF] border border-[#BFDBFE] rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0052CC] text-white shadow-sm shrink-0">
                    <KeyRound className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-[#082B68]">
                      {isTa ? 'வவுச்சரை சரிபார்த்து சலுகையைப் பெறுங்கள்' : 'Verify Details & Obtain Student Offer'}
                    </h4>
                    <p className="text-xs text-[#526681] font-medium mt-0.5">
                      {isTa
                        ? 'சலுகையைப் பெற உங்கள் பதிவு செய்யப்பட்ட முழுப்பெயரையும் வவுச்சர் குறியீட்டையும் கீழே சரியாக உள்ளிடவும்:'
                        : 'Enter your exact registered Student Full Name and Voucher Code below to verify and activate the offer in your cart:'}
                    </p>
                  </div>
                </div>

                {verifySuccess && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{verifySuccess}</span>
                  </div>
                )}

                {verifyError && (
                  <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-900 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyAndRedeem} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'மாணவரின் முழுப் பெயர் *' : 'Student Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. K. Mohamed Shifan"
                        value={verifyName}
                        onChange={(e) => setVerifyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'வவுச்சர் குறியீடு *' : 'Voucher Code *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. STU-12345"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-mono font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {isTa ? 'சரிபார்க்கப்பட்டதும் சலுகை உங்கள் கார்ட் தொகையில் கழிக்கப்படும்.' : 'Once verified, the discount amount will automatically be deducted from your final product price.'}
                    </span>

                    <button
                      type="submit"
                      disabled={verifying}
                      className="px-6 py-2.5 bg-[#0759D6] hover:bg-[#082B68] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {verifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isTa ? 'சரிபார்க்கப்படுகிறது...' : 'Verifying...'}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-[#FFC400]" />
                          <span>{isTa ? 'சரிபார்த்து சலுகையைப் பெறு' : 'Verify & Obtain Offer'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Direct Action to Educational Catalog */}
                <div className="pt-4 border-t border-[#BFDBFE]/60 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/shop?category=cat_books_03"
                    className="flex-1 py-3 px-5 bg-[#082B68] hover:bg-[#071F50] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isTa ? 'கல்விப் புத்தகங்கள் & உபகரணங்களை வாங்க' : 'Shop Educational Books & Stationery'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/cart"
                    className="py-3 px-5 bg-white border border-[#082B68] hover:bg-[#EAF5FF] text-[#082B68] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
                  >
                    {isTa ? 'ஷாப்பிங் கார்ட்டிற்கு செல்லவும்' : 'View In Cart'}
                  </Link>
                </div>
              </div>
            </div>
          ) : studentVoucher?.status === 'PENDING' ? (
            /* 3. APPLICATION PENDING ADMIN APPROVAL */
            <div className="bg-gradient-to-r from-[#021838] to-[#042452] border border-[#0052CC]/50 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-[#FFB800] font-black text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>{isTa ? 'விண்ணப்பம் நிலுவையில் உள்ளது' : 'Application Submitted & Pending Approval'}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isTa ? 'உங்கள் விண்ணப்பம் Admin பரிசீலனையில் உள்ளது' : 'Your Student Application is Pending Admin Review'}
                </h3>
                <p className="text-xs text-blue-200/80 leading-relaxed max-w-xl font-medium">
                  {isTa
                    ? `வணக்கம் ${studentVoucher.userName}, ${studentVoucher.institution} நிறுவனத்திற்கான உங்கள் மாணவர் பரிசு வவுச்சர் விண்ணப்பம் பெறப்பட்டுள்ளது. Super Admin ஒப்புதல் அளித்தவுடன் உங்கள் வவுச்சர் குறியீடு இங்கே காண்பிக்கப்படும்.`
                    : `Hello ${studentVoucher.userName}, your student voucher application for ${studentVoucher.institution} is under review by Super Admin. Once approved, your exclusive voucher code will appear right here.`}
                </p>
              </div>

              <div className="bg-[#01142F] border border-blue-900/60 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <strong className="text-white">{studentVoucher.userName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Institution</span>
                  <strong className="text-[#FFB800]">{studentVoucher.institution}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                  <strong className="text-white">{new Date(studentVoucher.appliedAt).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-blue-300 font-medium">
                  {isTa ? 'சரிபார்ப்பிற்கு 24 மணிநேரத்திற்குள் ஒப்புதல் வழங்கப்படும்.' : 'Voucher requests are typically approved within 24 business hours.'}
                </span>
                <button
                  onClick={fetchStudentVoucher}
                  className="px-4 py-2 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isTa ? 'நிலையை சரிபார்' : 'Check Status'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* 4. NOT YET APPLIED (Or Rejected) -> STUDENT APPLICATION FORM */
            <div className="space-y-6">
              {studentVoucher?.status === 'REJECTED' && (
                <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-900 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <p>{isTa ? 'முந்தைய விண்ணப்பம் நிராகரிக்கப்பட்டது:' : 'Previous application was rejected:'}</p>
                    <p className="font-normal text-red-800">{studentVoucher.adminNotes || 'Please verify your educational institution details and re-apply.'}</p>
                  </div>
                </div>
              )}

              <div className="bg-[#f7fbff] border border-[#BFDBFE] rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0759D6] text-white shadow-sm shrink-0">
                    <Send className="w-5 h-5 text-[#FFC400]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#082B68]">
                      {isTa ? 'மாணவர் பரிசு வவுச்சருக்கு விண்ணப்பிக்கவும்' : 'Apply for V2CC Student Gift Voucher'}
                    </h3>
                    <p className="text-xs text-[#526681] font-medium mt-0.5">
                      {isTa
                        ? 'உங்கள் கல்வி விவரங்களை பூர்த்தி செய்து சமர்ப்பிக்கவும். Admin சரிபார்த்த பின் வவுச்சர் குறியீடு உங்களுக்கு வழங்கப்படும்.'
                        : 'Fill in your student information below to request your subsidized voucher. Once approved by Admin, an exclusive discount code will be assigned to you.'}
                    </p>
                  </div>
                </div>

                {requestSuccess && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{requestSuccess}</span>
                  </div>
                )}

                {requestError && (
                  <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-900 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{requestError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'மாணவரின் முழுப் பெயர் *' : 'Student Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. K. Mohamed Shifan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>

                    {/* School / College / Institute */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'பள்ளி / கல்லூரி / கல்வி நிறுவனம் *' : 'School / College / University *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal College Colombo / Jaffna Hindu College"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>

                    {/* Student ID / Admission No */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'மாணவர் அடையாள எண் / அட்மிஷன் எண்' : 'Student ID / Admission Number'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. STU-2026-8491"
                        value={studentIdNumber}
                        onChange={(e) => setStudentIdNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#082B68] block">
                        {isTa ? 'தொடர்பு தொலைபேசி எண்' : 'Contact Phone Number'}
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0771234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                      />
                    </div>
                  </div>

                  {/* Grade / Academic Level */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#082B68] block">
                      {isTa ? 'வகுப்பு / கல்வி நிலை (Grade / Year)' : 'Grade / Academic Stream / Year'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grade 11 / A/L Science / University Year 2"
                      value={gradeOrYear}
                      onChange={(e) => setGradeOrYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#BFDBFE] rounded-xl text-xs font-bold text-[#082B68] outline-none focus:border-[#0759D6]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {isTa ? 'உங்கள் தகவல்கள் V2CC கல்வி வங்கி சரிபார்ப்புக்கு மட்டுமே பயன்படுத்தப்படும்.' : 'Your details are strictly used for V2CC student educational subsidy verification.'}
                    </span>

                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="px-6 py-3 bg-[#0759D6] hover:bg-[#082B68] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                      {submittingRequest ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isTa ? 'சமர்ப்பிக்கப்படுகிறது...' : 'Submitting...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#FFC400]" />
                          <span>{isTa ? 'வவுச்சருக்கு விண்ணப்பிக்கவும்' : 'Submit Voucher Request'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* 4. FAQ Section */}
        <section aria-labelledby="vouchers-faq-heading" className="bg-white rounded-3xl border border-[#c7def5] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#0759D6]" />
            <h2 id="vouchers-faq-heading" className="text-lg font-bold text-[#082B68]">
              {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-[#f8fbff] rounded-2xl border border-blue-100 space-y-1.5">
                <h3 className="text-xs font-black text-[#082B68]">{faq.q}</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
