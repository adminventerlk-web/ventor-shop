'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  ExternalLink,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  BadgeCheck,
} from 'lucide-react';

export default function VendorSidebar() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Overview', href: '/vendor', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Products & Variants', href: '/vendor/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Store Orders', href: '/vendor/orders', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  const shopSlug = user?.shopSlug || 'store';
  const shopName = user?.shopName || 'My Vendor Shop';

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden w-full bg-[#021838] text-white p-4 flex items-center justify-between border-b border-[#0052CC]/30 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 bg-[#0052CC] hover:bg-[#003893] rounded-xl text-white transition-colors"
            aria-label="Open vendor menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FFB800]" />
            <span className="font-black text-xs tracking-wider uppercase text-white truncate max-w-[150px]">
              {shopName}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] py-1.5 px-3 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#021838] text-white flex flex-col justify-between shadow-2xl border-r border-[#0052CC]/30 lg:hidden">
            <div>
              <div className="p-4 border-b border-[#0052CC]/30 bg-[#010e24] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#FFB800]" />
                  <div>
                    <h2 className="font-black text-xs tracking-wider uppercase text-white truncate max-w-[180px]">
                      {shopName}
                    </h2>
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> VERIFIED VENDOR
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0052CC] text-white shadow-sm'
                          : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <Link
                  href={`/shops/${shopSlug}`}
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#FFB800] hover:bg-white/5 transition-all mt-3 pt-3 border-t border-blue-900/40"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View My Live Store</span>
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-[#0052CC]/30 space-y-2 bg-[#010e24]">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-bold text-blue-200/80 hover:text-white py-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Customer Marketplace</span>
              </Link>
              <button
                onClick={() => logoutUser()}
                className="w-full flex items-center gap-2 text-xs font-bold text-red-300 hover:text-red-100 py-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#021838] border-r border-[#0052CC]/30 flex-col justify-between min-h-screen sticky top-0 shadow-xl">
        <div>
          {/* Brand & Store Header */}
          <div className="p-5 border-b border-[#0052CC]/30 bg-[#010e24]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#0052CC]/20 border border-[#0052CC] text-[#FFB800]">
                <Store className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-black text-sm text-white truncate">{shopName}</h2>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> VERIFIED SELLER
                </span>
              </div>
            </div>

            <Link
              href={`/shops/${shopSlug}`}
              target="_blank"
              className="mt-3 w-full py-2 px-3 bg-[#0052CC]/30 hover:bg-[#0052CC] border border-[#0052CC]/60 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>View Live Storefront</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0052CC] text-white shadow-md shadow-[#0052CC]/30 ring-1 ring-white/10'
                      : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#0052CC]/30 bg-[#010e24] space-y-2">
          <div className="px-3 py-2 bg-[#021838] border border-blue-900/60 rounded-xl text-[11px] text-blue-200/80">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Logged in as</span>
            <span className="font-bold text-white truncate block">{user?.email}</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-blue-200/80 hover:bg-white/5 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Store Homepage</span>
          </Link>

          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/10 hover:text-red-100 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

