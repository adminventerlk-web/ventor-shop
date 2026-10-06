'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import BrandLogo from '@/components/common/BrandLogo';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { language } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const quickLinks = [
    { label: language === 'ta' ? 'ஷாப்' : 'Shop All', href: '/shop' },
    { label: language === 'ta' ? 'மளிகை' : 'Groceries', href: '/shop?category=groceries' },
    { label: language === 'ta' ? 'கால்நடை தீவனம்' : 'Rani Animal Feed', href: '/shop?category=animal-feed' },
    { label: language === 'ta' ? 'ஏற்றுமதி' : 'Ceylon Export Hub', href: '/export' },
    { label: language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us', href: '/about' },
    { label: language === 'ta' ? 'தொடர்பு கொள்ள' : 'Contact Us', href: '/contact' },
  ];

  const customerService = [
    { label: language === 'ta' ? 'எனது ஆர்டர்கள்' : 'My Orders & Tracking', href: '/dashboard/orders' },
    { label: language === 'ta' ? 'விநியோகம் & அனுப்புதல்' : 'Islandwide Delivery Info', href: '/contact' },
    { label: language === 'ta' ? 'திரும்பப் பெறுதல்' : 'Returns & Refunds', href: '/contact' },
    { label: language === 'ta' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy', href: '/contact' },
    { label: language === 'ta' ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Conditions', href: '/contact' },
  ];

  return (
    <footer className="bg-[#021838] text-gray-200 text-xs font-semibold border-t-4 border-[#FFB800]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-blue-900/50">
          
          {/* Col 1: Brand & Socials (Span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl inline-block shadow-md">
              <BrandLogo variant="light" size="md" showSubtitle={true} />
            </div>

            <p className="text-xs text-blue-100/80 leading-relaxed font-normal max-w-sm">
              Sri Lanka’s premier digital e-commerce hub for Ceylon Exports, Daily Supermarket Groceries, Rani Animal Feed, and verified seller shops.
            </p>

            {/* Contact details */}
            <div className="space-y-2 text-xs text-amber-300 font-bold pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>Colombo & Jaffna, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>+94 (0) 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>support@ventershop.lk</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-[#FFB800] font-black text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-xs text-blue-100 font-semibold">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-[#FFB800] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Support (Span 3) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-[#FFB800] font-black text-xs uppercase tracking-widest">Customer Support</h4>
            <ul className="space-y-2 text-xs text-blue-100 font-semibold">
              {customerService.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-[#FFB800] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Guarantee (Span 3) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="space-y-2">
              <h4 className="text-[#FFB800] font-black text-xs uppercase tracking-widest">Stay Updated</h4>
              <p className="text-xs text-blue-100/90 font-normal leading-relaxed">
                Subscribe to receive special discounts, Ceylon export updates & exclusive vouchers.
              </p>
              
              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="flex gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white text-gray-900 px-3 py-2 rounded-lg text-xs w-full outline-none font-semibold"
                />
                <button
                  type="submit"
                  className="bg-[#FFB800] hover:bg-[#FFA500] text-[#021838] px-4 py-2 rounded-lg text-xs font-black shrink-0 transition-colors shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-bold">✓ Subscribed successfully!</p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-blue-200/70 font-semibold gap-2">
          <p>© 2026 VENTERSHOP. Find More. Shop Smart. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
            <span>100% Secured Ceylon E-Commerce Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
