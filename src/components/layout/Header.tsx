'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Globe,
  Settings,
  LogOut,
  Headphones,
  Package,
  Home,
  ShieldCheck,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { cartCount } = useCart();
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleLogout = async () => {
    setAccountDropdownOpen(false);
    await logoutUser();
  };

  interface INavLink {
    label: string;
    href: string;
    isHome?: boolean;
  }

  const navLinks: INavLink[] = [
    { label: language === 'ta' ? 'முகப்பு' : 'HOME', href: '/', isHome: true },
    { label: language === 'ta' ? 'ஷாப்' : 'SHOP', href: '/shop' },
    { label: language === 'ta' ? 'வர்ச்சுவல் கடைகள்' : 'VIRTUAL SHOPS', href: '/virtual-shops' },
    { label: language === 'ta' ? 'ஏற்றுமதி' : 'EXPORT', href: '/export' },
    { label: language === 'ta' ? 'தொடர்பு' : 'CONTACT', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full text-xs font-semibold shadow-xl select-none">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Deep Navy Blue #010E24) */}
      <div className="w-full bg-[#010E24] py-2 px-4 sm:px-8 text-white border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
          <div className="flex items-center gap-2 text-blue-100 font-medium">
            <span className="text-[#FFB800] font-bold animate-pulse">✨</span>
            <span className="truncate max-w-md sm:max-w-none">
              {language === 'ta'
                ? 'தொழில்முனைவோரை வலுப்படுத்துதல் • சந்தைகளை இணைத்தல் • ஒன்றாக வளர்வது'
                : language === 'si'
                ? 'ව්‍යවසායකයින් බලගැන්වීම • වෙළඳපල සම්බන්ධ කිරීම • එක්ව වර්ධනය වීම'
                : 'Empowering Entrepreneurs • Connecting Markets • Growing Together'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-white/90 text-xs">
            {user && (
              <>
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <Link href="/admin" className="hover:text-amber-200 transition-colors flex items-center gap-1 font-bold text-[#FFB800]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Admin Control Panel</span>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="hover:text-amber-200 transition-colors flex items-center gap-1 font-bold text-amber-300">
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <span className="text-white/30">|</span>
              </>
            )}

            <Link href="/contact" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Help & Support</span>
            </Link>

            <span className="text-white/30">|</span>

            {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? (
              <Link href="/admin/orders" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5 font-bold">
                <Package className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Store Orders</span>
              </Link>
            ) : (
              <Link href="/dashboard/orders" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Track Order</span>
              </Link>
            )}

            <span className="text-white/30">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#FFB800]">
              <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#FFB800] text-[#021838] font-black' : 'hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  language === 'ta' ? 'bg-[#FFB800] text-[#021838] font-black' : 'hover:text-white'
                }`}
              >
                தமிழ்
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage('si')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  language === 'si' ? 'bg-[#FFB800] text-[#021838] font-black' : 'hover:text-white'
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (Deep Navy Blue #021838 with Logo & Gold Accents) */}
      <div className="bg-[#021838] text-white py-3 px-4 sm:px-8 border-b-2 border-[#FFB800]/70 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg lg:hidden transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-[#FFB800]" />
          </button>

          {/* Brand Logo in White/Translucent Frame */}
          <div className="bg-white/95 px-3 py-1 rounded-xl shadow-md backdrop-blur-md">
            <BrandLogo variant="light" size="md" showSubtitle={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-white font-bold text-xs tracking-wider">
            {navLinks.map((item, idx) => {
              let isActive = false;
              if (item.isHome) {
                isActive = pathname === '/';
              } else if (item.href.startsWith('/#')) {
                isActive = false;
              } else if (item.href === '/shop') {
                isActive = pathname === '/shop';
              } else {
                const basePath = item.href.split('?')[0];
                isActive = pathname.startsWith(basePath);
              }

              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FFB800] text-[#021838] font-black shadow-md'
                      : 'text-gray-100 hover:text-[#FFB800] hover:bg-white/10'
                  }`}
                >
                  {item.isHome && <Home className={`w-3.5 h-3.5 ${isActive ? 'text-[#021838]' : 'text-amber-400'}`} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Search + Account + Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex relative items-center w-52 xl:w-64"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#010E24] text-white placeholder-gray-400 text-xs pl-3.5 pr-9 py-2.5 rounded-full border border-blue-500/30 focus:border-[#FFB800] focus:bg-[#021430] outline-none transition-all font-semibold"
              />
              <button
                type="submit"
                className="absolute right-3 text-[#FFB800] hover:text-white cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Account Menu Button */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex flex-col items-center text-white hover:text-[#FFB800] transition-colors px-1 cursor-pointer"
                  >
                    <User className="w-5 h-5 text-[#FFB800]" />
                    <span className="text-[10px] font-bold truncate max-w-[65px] text-white">
                      {user.firstName || 'Account'}
                    </span>
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#021838] border border-blue-500/40 rounded-xl shadow-2xl py-2 z-50 text-xs font-semibold text-white">
                      <div className="px-4 py-2 border-b border-blue-900/50 bg-[#010E24]">
                        <p className="font-bold text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-[#FFB800] text-[#021838] rounded-full font-black">
                          {user.customerType || 'CUSTOMER'}
                        </span>
                      </div>
                      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-[#FFB800] hover:bg-white/10 font-bold"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                            <span>Admin Control Panel</span>
                          </Link>
                          <Link
                            href="/admin/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-200 hover:bg-white/10"
                          >
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>Manage Store Orders</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-200 hover:bg-white/10"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-200 hover:bg-white/10"
                          >
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>My Orders</span>
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/20 text-left border-t border-blue-900/50 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center text-white hover:text-[#FFB800] transition-colors px-1"
                >
                  <User className="w-5 h-5 text-[#FFB800]" />
                  <span className="text-[10px] font-bold">Account</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-white hover:text-[#FFB800] transition-colors px-1"
            >
              <div className="relative">
                <ShoppingCart className="w-5.5 h-5.5 text-white" />
                <span className="absolute -top-1.5 -right-2 bg-[#FFB800] text-[#021838] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold text-amber-300">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden flex backdrop-blur-xs">
          <div className="w-4/5 max-w-sm bg-[#021838] text-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto border-r border-[#FFB800]/40">
            <div className="flex justify-between items-center pb-4 border-b border-blue-900/50">
              <div className="bg-white px-2 py-1 rounded-lg">
                <BrandLogo variant="dark" size="sm" showSubtitle={false} />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5 text-[#FFB800]" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#010E24] text-white text-xs px-3 py-2.5 rounded-lg border border-blue-500/30 outline-none font-semibold"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-[#FFB800]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2 mt-5 text-xs font-bold">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-lg border-b border-blue-900/30 flex items-center gap-2 ${
                    item.isHome ? 'bg-[#FFB800] text-[#021838] font-black' : 'text-gray-100 hover:text-[#FFB800]'
                  }`}
                >
                  {item.isHome && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Language & Account Footer */}
            <div className="mt-auto pt-6 border-t border-blue-900/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#FFB800] font-bold text-[11px] uppercase tracking-wider px-1">
                  <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Select Language</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'en' ? 'bg-[#FFB800] text-[#021838] font-black' : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ta')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'ta' ? 'bg-[#FFB800] text-[#021838] font-black' : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => setLanguage('si')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'si' ? 'bg-[#FFB800] text-[#021838] font-black' : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              </div>

              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 bg-[#FFB800] text-[#021838] text-center rounded-lg text-xs font-black shadow-md"
                >
                  Sign In / Register
                </Link>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-[#010E24] rounded-xl border border-blue-500/30">
                    <p className="font-extrabold text-white text-xs truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 px-3 bg-[#FFB800] text-[#021838] text-center rounded-lg text-xs font-black"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
