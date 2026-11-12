'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  LogOut,
  Headphones,
  Package,
  House,
  ShoppingBag,
  Store,
  Mail,
  type LucideIcon,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import styles from './Header.module.css';

function NavbarLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={compact ? styles.drawerLogo : styles.logo} aria-label="VentorShop home">
      <Image
        src="/images/ventershop-logo.png"
        alt="VENTERSHOP - Find more. Shop smart."
        width={1254}
        height={1254}
        sizes={compact ? '44px' : '(max-width: 767px) 44px, 64px'}
        preload={!compact}
      />
      <span className={styles.brandText}>
        <span className={styles.brandName}>VENTER<span>SHOP</span></span>
        <span className={styles.tagline}>FIND MORE. SHOP SMART.</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const { language, setLanguage } = useTranslation();
  const { cartCount } = useCart();
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const menuButton = menuButtonRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
      if (event.key !== 'Tab') return;
      const items = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button, input');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1280) setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      menuButton?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      // Synchronize the initial browser URL after hydration.
      if (q) queueMicrotask(() => setSearchQuery(q));
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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
    icon: LucideIcon;
  }

  const navLinks: INavLink[] = [
    { label: language === 'ta' ? 'முகப்பு' : 'Home', href: '/', isHome: true, icon: House },
    { label: language === 'ta' ? 'ஷாப்' : 'Shop', href: '/shop', icon: ShoppingBag },
    { label: language === 'ta' ? 'வர்ச்சுவல் கடைகள்' : 'Virtual Shops', href: '/virtual-shops', icon: Store },
    { label: language === 'ta' ? 'ஏற்றுமதி' : 'Export', href: '/export', icon: Globe },
    { label: language === 'ta' ? 'தொடர்பு' : 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full text-xs font-semibold ${styles.header}`}>
      
      {/* 1. TOP ROYAL BLUE & GOLD NOTIFICATION BAR */}
      <div className="w-full bg-[#022B69] py-2 px-4 sm:px-8 text-white">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row justify-between items-center text-xs gap-2">
          <div className="flex items-center gap-2 text-white/95 font-medium">
            <span className="text-amber-300 font-bold">✨</span>
            <span>
              {language === 'ta'
                ? 'தொழில்முனைவோரை வலுப்படுத்துதல் • சந்தைகளை இணைத்தல் • ஒன்றாக வளர்வது'
                : language === 'si'
                ? 'ව්‍යවසායකයින් බලගැන්වීම • වෙළඳපල සම්බන්ධ කිරීම • එක්ව වර්ධනය වීම'
                : 'Empowering Entrepreneurs • Connecting Markets • Growing Together'}
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-white/90 text-xs">
            {user && (
              <>
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <Link href="/admin" className="hover:text-amber-200 transition-colors flex items-center gap-1 font-bold text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Admin Control Panel</span>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="hover:text-amber-200 transition-colors flex items-center gap-1 font-bold text-amber-200">
                    <User className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <span className="text-white/40">|</span>
              </>
            )}
            <Link href="/contact" className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-amber-300" />
              <span>Help & Support</span>
            </Link>
            <span className="text-white/40">|</span>
            {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? (
              <Link href="/admin/orders" className="hover:text-amber-200 transition-colors flex items-center gap-1.5 font-bold">
                <Package className="w-3.5 h-3.5 text-amber-300" />
                <span>Store Orders</span>
              </Link>
            ) : (
              <Link href="/dashboard/orders" className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-300" />
                <span>Track Order</span>
              </Link>
            )}
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${language === 'en' ? 'bg-amber-400 text-[#022B69] font-black' : 'hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${language === 'ta' ? 'bg-amber-400 text-[#022B69] font-black' : 'hover:text-white'}`}
              >
                தமிழ்
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLanguage('si')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${language === 'si' ? 'bg-amber-400 text-[#022B69] font-black' : 'hover:text-white'}`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navShell}>
        <div className={styles.navbar}>
          <div className={styles.leftSide}>
            <button ref={menuButtonRef} onClick={() => setMobileMenuOpen(true)} className={styles.menuButton}
              aria-label="Open menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
              <Menu className="w-5 h-5" />
            </button>
            <nav aria-label="Main navigation" className={styles.desktopNav}>
              {navLinks.slice(0, 4).map((item) => {
                const isActive = item.isHome ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}>
                    <item.icon className={styles.navIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <NavbarLogo />
          {/* Right Side: Search + Account + Cart */}
          <div className={styles.rightSide}>
            <Link href="/contact" className={`${styles.contactLink} ${styles.navLink}`}><Mail className={styles.navIcon} aria-hidden="true" />{navLinks[4].label}</Link>
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              role="search" aria-label="Product search" className={styles.search}
            >
              <input
                type="text"
                aria-label="Search products" placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F8FF] text-gray-800 text-xs pl-3 pr-8 py-2 rounded-full border border-blue-200 focus:border-[#0052CC] focus:bg-white outline-none transition-all font-semibold"
              />
              <button
                type="submit"
                className="absolute right-2.5 text-gray-400 hover:text-[#0052CC] cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    aria-label="Account" aria-expanded={accountDropdownOpen}
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex flex-col items-center text-[#132d50] hover:text-[#0052CC] transition-colors px-1 cursor-pointer"
                  >
                    <User className="w-5 h-5 text-[#132d50]" />
                    <span className="text-[10px] font-bold truncate max-w-[60px]">
                      {user.firstName || 'Account'}
                    </span>
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-xs font-semibold">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-blue-50 text-[#0052CC] rounded-full font-bold">
                          {user.customerType || 'CUSTOMER'}
                        </span>
                      </div>
                      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 font-bold"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#0052CC]" />
                            <span>Admin Control Panel</span>
                          </Link>
                          <Link
                            href="/admin/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[#132d50] hover:bg-gray-50"
                          >
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>Manage Store Orders</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[#132d50] hover:bg-gray-50"
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[#132d50] hover:bg-gray-50"
                          >
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>My Orders</span>
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left border-t border-gray-100 mt-1 cursor-pointer"
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
                  aria-label="Account"
                  className="flex flex-col items-center text-[#132d50] hover:text-[#0052CC] transition-colors px-1"
                >
                  <User className="w-5 h-5 text-[#132d50]" />
                  <span className="text-[10px] font-bold">Account</span>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <Link
              href="/cart" aria-label={`Cart, ${cartCount} items`}
              className="flex items-center gap-1.5 text-[#132d50] hover:text-[#0052CC] transition-colors px-1"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#132d50]" />
                <span className="absolute -top-1.5 -right-2 bg-amber-300 text-[#132d50] text-[9px] font-black min-w-4 px-0.5 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="hidden 2xl:inline text-xs font-bold">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#071d3d]/50 xl:hidden flex">
          <div ref={drawerRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <NavbarLogo compact />
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu" className="p-2.5 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 text-xs px-3 py-2.5 rounded-lg border border-gray-200 outline-none font-semibold"
              />
              <button type="submit" aria-label="Search" className="absolute right-3 top-2.5 text-[#132d50]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 mt-5 text-xs font-bold">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 border-b border-gray-50 flex items-center gap-2 ${
                    (item.isHome ? pathname === '/' : pathname.startsWith(item.href)) ? 'text-[#0052CC]' : 'text-gray-800 hover:text-[#0052CC]'
                  }`}
                >
                  <item.icon className={styles.navIcon} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Language & Account Footer */}
            <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px] uppercase tracking-wider px-1">
                  <Globe className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Select Language</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'en' ? 'bg-[#0052CC] text-white shadow-xs' : 'bg-gray-100 text-[#132d50] hover:bg-gray-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ta')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'ta' ? 'bg-[#0052CC] text-white shadow-xs' : 'bg-gray-100 text-[#132d50] hover:bg-gray-200'
                    }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => setLanguage('si')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      language === 'si' ? 'bg-[#0052CC] text-white shadow-xs' : 'bg-gray-100 text-[#132d50] hover:bg-gray-200'
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
                  className="block w-full py-2.5 bg-[#0052CC] text-white text-center rounded-lg text-xs font-bold shadow-sm"
                >
                  Sign In / Register
                </Link>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                    <p className="font-extrabold text-gray-900 text-xs truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 px-3 bg-[#0052CC] text-white text-center rounded-lg text-xs font-bold"
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
