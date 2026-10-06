'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  User,
  Mail,
  Clock,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

function LoginContent() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const { refreshSession, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Tabs: 'login' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Steps: 1 = Form inputs, 2 = Verify OTP (For register or forgot password)
  const [step, setStep] = useState(1);

  // Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password specific fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState('BUYER');
  const [prefLang, setPrefLang] = useState<'en' | 'ta' | 'si'>('en');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to dashboard or callbackUrl immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    }
  }, [user, callbackUrl, router]);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (activeTab === 'login') {
      if (!password) {
        setErrorMsg(isTa ? 'தயவுசெய்து உங்கள் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password.');
        setLoading(false);
        return;
      }

      // 1. PASSWORD-BASED LOGIN FLOW
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
            otp: 'PASSWORD_LOGIN',
          }),
        });

        const data = await res.json();
        if (res.ok) {
          await refreshSession();
          if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push(callbackUrl);
          }
        } else {
          setErrorMsg(data.error || (isTa ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.' : 'Invalid email or password.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. உள்நுழைய முடியவில்லை.' : 'Network error. Failed to log in.');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'register') {
      // 2. REGISTRATION FLOW (Requires OTP verification)
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !password) {
        setErrorMsg(isTa ? 'அனைத்து தேவையான விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill in all required registration fields.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMsg(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            purpose: 'REGISTER',
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(isTa ? 'சரிபார்ப்புக் குறியீடு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது!' : 'Verification code sent to your email!');
          setStep(2);
        } else {
          setErrorMsg(data.error || (isTa ? 'OTP அனுப்ப முடியவில்லை.' : 'Failed to send OTP code.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Network error. Failed to send OTP.');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'forgot') {
      // 3. FORGOT PASSWORD FLOW (Step 1: Request OTP)
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            purpose: 'FORGOT_PASSWORD',
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(isTa ? 'கடவுச்சொல் மீட்டமைப்பு குறியீடு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது!' : 'Password reset code sent to your email!');
          setStep(2);
        } else {
          setErrorMsg(data.error || (isTa ? 'மின்னஞ்சல் முகவரியைக் கண்டுபிடிக்க முடியவில்லை.' : 'Account not found with this email.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Network error. Failed to send reset code.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Verify OTP for Registration (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the verification code.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          password: password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          customerType: customerType,
          preferredLanguage: prefLang,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshSession();
        router.push(callbackUrl);
      } else {
        setErrorMsg(data.error || (isTa ? 'தவறான சரிபார்ப்புக் குறியீடு.' : 'Invalid verification code.'));
      }
    } catch (err) {
      setErrorMsg(isTa ? 'இணைப்பு பிழை. சரிபார்க்க முடியவில்லை.' : 'Network error. Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password with OTP (Forgot Password Step 2)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the verification code.');
      setLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(isTa ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(isTa ? 'கடவுச்சொற்கள் பொருந்தவில்லை. தயவுசெய்து சரிபார்க்கவும்.' : 'Passwords do not match. Please check again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshSession();
        setSuccessMsg(isTa ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! உள்நுழைகிறது...' : 'Password reset successfully! Redirecting...');
        setTimeout(() => {
          if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push(callbackUrl);
          }
        }, 1000);
      } else {
        setErrorMsg(data.error || (isTa ? 'கடவுச்சொல்லை மாற்ற முடியவில்லை.' : 'Failed to reset password.'));
      }
    } catch (err) {
      setErrorMsg(isTa ? 'இணைப்பு பிழை. கடவுச்சொல்லை மாற்ற முடியவில்லை.' : 'Network error. Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'forgot') {
      return step === 1
        ? (isTa ? 'கடவுச்சொல்லை மீட்டமைக்க' : 'Forgot Password')
        : (isTa ? 'புதிய கடவுச்சொல்லை அமைக்க' : 'Reset Password');
    }
    if (step === 2) {
      return isTa ? 'OTP சரிபார்ப்பு' : 'OTP Verification';
    }
    return activeTab === 'login'
      ? (isTa ? 'வாடிக்கையாளர் உள்நுழைவு' : 'Customer Sign In')
      : (isTa ? 'புதிய கணக்கு பதிவு' : 'Create Account');
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'forgot') {
      return step === 1
        ? (isTa ? 'உங்கள் கணக்கின் மின்னஞ்சலை உள்ளிட்டு OTP குறியீட்டைப் பெறுங்கள்.' : 'Enter your registered email to receive a password reset OTP.')
        : (isTa ? `${email} முகவரிக்கு அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிட்டு புதிய கடவுச்சொல்லை அமைக்கவும்.` : `Enter the 6-digit code sent to ${email} and set your new password.`);
    }
    if (step === 2) {
      return isTa ? `${email} முகவரிக்கு அனுப்பப்பட்ட 6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.` : `Enter the 6-digit verification code sent to ${email}`;
    }
    return activeTab === 'login'
      ? (isTa ? 'உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லைப் பயன்படுத்தி பாதுகாப்பாக உள்நுழையுங்கள்.' : 'Sign in securely to manage orders, access community vouchers & wholesale pricing.')
      : (isTa ? 'உங்கள் கணக்கு வகையைத் தேர்ந்தெடுத்து பதிவை நிறைவு செய்யுங்கள்.' : 'Choose your account type and join Sri Lanka’s verified merchant platform.');
  };

  return (
    <div className="w-full max-w-lg mx-auto my-6 sm:my-10 p-6 sm:p-9 bg-[#021A3E]/95 text-white rounded-3xl border border-blue-500/30 shadow-[0_20px_60px_-15px_rgba(2,26,62,0.85)] backdrop-blur-2xl space-y-6 text-xs font-semibold relative overflow-hidden transition-all duration-300 hover:border-blue-400/50">
      
      {/* Decorative top ambient shimmer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />

      {/* Header Info */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-600/40 text-[#FFB800] text-[10px] font-black uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>VENTERSHOP SECURE PORTAL</span>
        </div>

        <div className="w-14 h-14 bg-blue-950/80 rounded-2xl flex items-center justify-center border border-[#FFB800]/40 text-[#FFB800] mx-auto shadow-inner shadow-blue-950">
          {activeTab === 'forgot' ? <KeyRound className="w-7 h-7 text-[#FFB800]" /> : <User className="w-7 h-7 text-[#FFB800]" />}
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
          {getHeaderTitle()}
        </h2>
        <p className="text-xs text-blue-200/80 font-medium leading-relaxed max-w-md mx-auto">
          {getHeaderSubtitle()}
        </p>
      </div>

      {/* Tabs Selector - Only shown on Step 1 when not in forgot password mode */}
      {step === 1 && (
        <div className="flex bg-[#01142F]/80 p-1 rounded-xl border border-blue-900/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 text-center py-2.5 font-bold uppercase tracking-wider transition-all rounded-lg text-xs cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#FFB800] text-[#021430] shadow-md font-black'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            {isTa ? 'உள்நுழைவு' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 text-center py-2.5 font-bold uppercase tracking-wider transition-all rounded-lg text-xs cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#FFB800] text-[#021430] shadow-md font-black'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            {isTa ? 'பதிவு செய்க' : 'Create Account'}
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-200 p-3 rounded-xl font-bold flex items-center gap-2 text-xs">
          <span className="text-red-400 text-base">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 p-3 rounded-xl font-bold flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* STEP 1: Enter Details (Login / Register / Forgot Step 1) */}
      {step === 1 && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Account Type Selection (Only for Register) */}
          {activeTab === 'register' && (
            <div className="space-y-1.5 pt-1 pb-1">
              <label className="text-blue-100 font-extrabold block text-xs">
                {isTa ? 'கணக்கு வகை (Account Type) *' : 'Account Type *'}
              </label>
              <div className="relative">
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 text-white font-bold text-xs appearance-none cursor-pointer"
                >
                  <option value="BUYER" className="bg-[#021A3E] text-white">{isTa ? 'Buyer (வாங்குபவர்)' : 'Buyer (Retail Consumer)'}</option>
                  <option value="V2CC_PMS_MEMBER" className="bg-[#021A3E] text-white">V2CC-PMS Member (Community Member Pricing)</option>
                  <option value="WHOLESALE_BUYER" className="bg-[#021A3E] text-white">Wholesale Buyer (Bulk B2B Pricing)</option>
                  <option value="SELLER_SUPPLIER" className="bg-[#021A3E] text-white">Seller / Supplier (விற்பனையாளர் / சப்ளையர்)</option>
                  <option value="PARTNER_STORE" className="bg-[#021A3E] text-white">Partner Store (பங்குதாரர் கடை)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FFB800] text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[10px] text-blue-300/70 font-medium pt-0.5">
                {customerType === 'BUYER' && 'Standard consumer retail ordering and islandwide doorstep delivery.'}
                {customerType === 'V2CC_PMS_MEMBER' && 'Exclusive community member benefits & discounted tier pricing.'}
                {customerType === 'WHOLESALE_BUYER' && 'High-volume wholesale catalog & bulk commercial rates.'}
                {customerType === 'SELLER_SUPPLIER' && 'Register as merchant/supplier to distribute products.'}
                {customerType === 'PARTNER_STORE' && 'Partner store franchise & integrated inventory point.'}
              </p>
            </div>
          )}

          {/* Email Address - Always required */}
          <div className="space-y-1.5">
            <label className="text-blue-100 font-bold block mb-1">
              {isTa ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-blue-300/60" />
              <input
                type="email"
                required
                placeholder="e.g. customer@ventershop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 text-white font-bold placeholder-blue-300/30 transition-all"
              />
            </div>
          </div>

          {/* Password field - for login and register */}
          {activeTab !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-blue-100 font-bold block">
                  {isTa ? 'கடவுச்சொல் *' : 'Password *'}
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setStep(1);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-[#FFB800] hover:underline cursor-pointer"
                  >
                    {isTa ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-blue-300/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 text-white font-bold placeholder-blue-300/30 transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-blue-300/60 hover:text-white cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Registration only fields */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-blue-100 font-bold block mb-1">
                    {isTa ? 'முதல் பெயர் *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white font-bold placeholder-blue-300/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-blue-100 font-bold block mb-1">
                    {isTa ? 'கடைசி பெயர் *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white font-bold placeholder-blue-300/30"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-blue-100 font-bold block mb-1">
                  {isTa ? 'தொலைபேசி எண் *' : 'Phone Number *'}
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-blue-300/60" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s()-]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white font-bold placeholder-blue-300/30"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1.5">
                <label className="text-blue-100 font-bold block mb-1">
                  {isTa ? 'விருப்பமான மொழி *' : 'Preferred Language *'}
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 w-4 h-4 text-blue-300/60" />
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value as 'en' | 'ta' | 'si')}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white appearance-none cursor-pointer"
                  >
                    <option value="en" className="bg-[#021A3E]">English</option>
                    <option value="ta" className="bg-[#021A3E]">தமிழ் (Tamil)</option>
                    <option value="si" className="bg-[#021A3E]">සිංහල (Sinhala)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl uppercase tracking-wider shadow-lg hover:shadow-[#FFB800]/25 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer disabled:bg-gray-600 disabled:text-gray-400 text-xs"
          >
            {loading
              ? (isTa ? 'செயலாக்குகிறது...' : 'Processing...')
              : activeTab === 'login'
              ? (isTa ? 'பாதுகாப்பாக உள்நுழைக' : 'Secure Sign In')
              : activeTab === 'register'
              ? (isTa ? 'பதிவு OTP அனுப்புக' : 'Send Registration OTP')
              : (isTa ? 'மீட்டமைப்பு OTP அனுப்புக' : 'Send Reset OTP')}
          </button>

          {/* Forgot Password: Back to Login link */}
          {activeTab === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full text-center py-2 text-xs text-blue-300 hover:text-white font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isTa ? 'மீண்டும் உள்நுழைவு செல்ல' : 'Back to Login'}</span>
            </button>
          )}

        </form>
      )}

      {/* STEP 2 for Registration: Enter OTP */}
      {step === 2 && activeTab === 'register' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-blue-100 font-bold block mb-1">
              {isTa ? '6 இலக்க சரிபார்ப்புக் குறியீடு *' : '6-Digit Verification Code *'}
            </label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-blue-300/60" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] font-mono tracking-widest text-center text-sm font-extrabold text-white"
              />
            </div>
            <p className="text-[11px] text-blue-300/60">
              {isTa ? '5 நிமிடங்களுக்கு செல்லுபடியாகும். உங்கள் இன்பாக்ஸ் & ஸ்பேம் கோப்புறையை சரிபார்க்கவும்.' : 'Valid for 5 minutes. Check your inbox and spam folder.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:bg-gray-600 text-xs"
          >
            {loading ? (isTa ? 'சரிபார்க்கிறது...' : 'Verifying Account...') : (isTa ? 'பதிவை முடித்து உள்நுழைக' : 'Complete Registration & Sign In')}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center py-2 text-xs text-blue-300 hover:text-white font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'படிவத்திற்குத் திரும்பு' : 'Back to form'}</span>
          </button>
        </form>
      )}

      {/* STEP 2 for Forgot Password: Enter OTP & Set New Password */}
      {step === 2 && activeTab === 'forgot' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          
          {/* OTP Input */}
          <div className="space-y-1.5">
            <label className="text-blue-100 font-bold block mb-1">
              {isTa ? '6 இலக்க சரிபார்ப்புக் குறியீடு *' : '6-Digit Verification Code *'}
            </label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-blue-300/60" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] font-mono tracking-widest text-center text-sm font-extrabold text-white"
              />
            </div>
          </div>

          {/* New Password Input with Eye toggle */}
          <div className="space-y-1.5">
            <label className="text-blue-100 font-bold block mb-1">
              {isTa ? 'புதிய கடவுச்சொல் *' : 'New Password *'}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-blue-300/60" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white font-bold"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 text-blue-300/60 hover:text-white cursor-pointer p-0.5"
                title={showNewPassword ? 'Hide password' : 'Show password'}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-blue-300/60 font-medium">
              {isTa ? 'குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Must be at least 6 characters.'}
            </p>
          </div>

          {/* Confirm New Password Input with Eye toggle */}
          <div className="space-y-1.5">
            <label className="text-blue-100 font-bold block mb-1">
              {isTa ? 'புதிய கடவுச்சொல்லை உறுதிப்படுத்துக *' : 'Confirm New Password *'}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-blue-300/60" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#01142F] border border-blue-800/80 rounded-xl outline-none focus:border-[#FFB800] text-white font-bold"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-blue-300/60 hover:text-white cursor-pointer p-0.5"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:bg-gray-600 text-xs"
          >
            {loading ? (isTa ? 'மாற்றுகிறது...' : 'Resetting Password...') : (isTa ? 'கடவுச்சொல்லை மாற்றி உள்நுழைக' : 'Reset Password & Sign In')}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center py-2 text-xs text-blue-300 hover:text-white font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'மின்னஞ்சல் மாற்ற' : 'Change Email Address'}</span>
          </button>
        </form>
      )}

      {/* Trust reassurance footer */}
      <div className="pt-4 border-t border-blue-900/60 flex items-center justify-center gap-2 text-[11px] text-blue-200/70 font-medium">
        <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
        <span>256-Bit SSL Encrypted Ceylon Merchant Platform</span>
      </div>

    </div>
  );
}

export default function LoginClient() {
  return (
    <div className="min-h-screen flex flex-col bg-[#021430] text-white relative overflow-hidden">
      {/* Header rendered directly for instantaneous first paint */}
      <Header />

      {/* Ambient background glowing orbs matching Hero section */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <Suspense
          fallback={
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
