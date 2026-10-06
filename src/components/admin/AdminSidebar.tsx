'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Ticket,
  Settings,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Clock,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const links = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Categories', href: '/admin/categories', icon: <Layers className="w-4 h-4" /> },
    { label: 'V2CC-PMS Members', href: '/admin/communities', icon: <Users className="w-4 h-4" /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Vouchers & Offers', href: '/admin/vouchers', icon: <Ticket className="w-4 h-4" /> },
    { label: 'Global Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Audit Logs', href: '/admin/audit', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* ── MOBILE HEADER BAR (< lg) ── */}
      <header className="lg:hidden w-full bg-[#021838] text-white p-4 flex items-center justify-between border-b border-[#0052CC]/30 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 bg-[#0052CC] hover:bg-[#003893] rounded-xl text-white transition-colors"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
            <span className="font-black text-xs tracking-wider uppercase font-mono text-white">VENTERSHOP ADMIN</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] py-1.5 px-3 rounded-lg transition-colors text-white shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </header>

      {/* ── MOBILE DRAWER OVERLAY & PANEL (< lg) ── */}
      {mobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#021838] text-white flex flex-col justify-between shadow-2xl border-r border-[#0052CC]/30 lg:hidden">
            <div>
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-[#0052CC]/30 bg-[#010e24] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
                  <div>
                    <h2 className="font-black text-xs tracking-widest uppercase text-white">VENTERSHOP</h2>
                    <span className="text-[9px] text-[#FFB800] font-extrabold uppercase">CONTROL PANEL</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              {user && (
                <div className="p-4 border-b border-[#0052CC]/30 bg-[#0052CC]/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFB800] text-[#021838] flex items-center justify-center font-black text-sm shadow-sm">
                    {user.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate leading-normal text-white">{user.firstName} {user.lastName}</p>
                    <span className="bg-[#FFB800]/20 text-[#FFB800] text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider inline-block mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
                {links.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#0052CC] text-white shadow-md border border-blue-400/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className={isActive ? 'text-[#FFB800]' : 'text-gray-400'}>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-[#0052CC]/30 space-y-2 bg-[#010e24]">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-200 hover:text-white bg-[#0052CC] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Store</span>
              </Link>
              <button
                onClick={() => { setMobileDrawerOpen(false); logoutUser(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/30 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#021838] text-white flex-col justify-between border-r border-[#0052CC]/30 min-h-screen sticky top-0 shadow-2xl">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#0052CC]/30 bg-[#010e24] flex items-center gap-3">
            <div className="p-1.5 bg-[#0052CC] rounded-xl text-[#FFB800] shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest uppercase text-white font-sans">VENTERSHOP</h1>
              <span className="text-[9px] text-[#FFB800] font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Admin Panel
              </span>
            </div>
          </div>

          {/* User Card */}
          {user && (
            <div className="p-4 border-b border-[#0052CC]/30 bg-[#0052CC]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFB800] text-[#021838] flex items-center justify-center font-black text-sm shadow-sm">
                {user.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs truncate leading-normal text-white">{user.firstName} {user.lastName}</p>
                <span className="bg-[#FFB800]/20 text-[#FFB800] text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider inline-block mt-0.5 border border-[#FFB800]/30">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Menu Navigation */}
          <nav className="p-3 space-y-1">
            {links.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#0052CC] text-white shadow-md border border-blue-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-[#FFB800]' : 'text-gray-400'}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#0052CC]/30 space-y-1.5 bg-[#010e24]">
          <Link
            href="/"
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0052CC] hover:bg-[#003893] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFB800]" />
            <span>Exit to Store</span>
          </Link>
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 py-2 px-4 text-left rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
