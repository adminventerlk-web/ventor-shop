'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          otp: 'PASSWORD_LOGIN',
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        const role = data.user?.role;
        const customerType = data.user?.customerType;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN' || customerType === 'ADMIN') {
          // Hard refresh to reload JWT admin_session cookie set by server
          window.location.href = '/admin';
        } else {
          setErrorMsg('Access denied. This account does not have Administrator privileges.');
        }
      } else {
        setErrorMsg(data.error || 'Invalid administrator email or password.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex flex-col justify-center items-center p-4 font-sans antialiased text-xs font-semibold select-none relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0052CC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container Box */}
      <div className="w-full max-w-md bg-[#1C2A4A]/90 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative z-10">
        
        {/* Glow ambient accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo & Header */}
        <div className="text-center space-y-3 relative z-10 flex flex-col items-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105 mb-1">
            <img
              src="/images/logo.png"
              alt="VENTERSHOP Logo"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
          </Link>
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              ADMIN CONTROL PANEL PORTAL
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs font-extrabold flex items-start gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0D182E] border border-white/10 rounded-xl outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white font-bold text-xs transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold block">Password</label>
              <Link
                href="/login"
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Reset via OTP?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#0D182E] border border-white/10 rounded-xl outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white font-bold text-xs transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#F5A623] via-[#E69500] to-[#D97706] hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Login to Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Footer Return Link */}
      <Link
        href="/"
        className="mt-6 text-gray-400 hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors"
      >
        ← Return to Storefront
      </Link>

    </div>
  );
}
