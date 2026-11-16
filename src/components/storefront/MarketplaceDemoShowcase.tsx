'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Store,
  ShoppingCart,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
  ExternalLink,
  Tag,
  Eye,
  Camera,
} from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';
import { formatCurrency } from '@/lib/utils/currency';

interface IDemoVariant {
  name: string;
  price: number;
  image: string;
  weight: string;
}

const DEMO_VARIANTS: IDemoVariant[] = [
  {
    name: '100g Pouch',
    price: 850,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    weight: '100g',
  },
  {
    name: '250g Pack',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    weight: '250g',
  },
  {
    name: '500g Value Pack',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
    weight: '500g',
  },
  {
    name: '1kg Commercial Carton',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    weight: '1kg',
  },
];

export default function MarketplaceDemoShowcase() {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<IDemoVariant>(DEMO_VARIANTS[1]);
  const [justAdded, setJustAdded] = useState(false);

  const handleTestAddToCart = () => {
    addToCart(
      'prod_ceylon_cinnamon_alba_01',
      1,
      selectedVariant.name,
      selectedVariant.price,
      {
        name: 'Pure Ceylon Alba Cinnamon Quills',
        image: selectedVariant.image,
        price: selectedVariant.price,
      }
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const scrollToDonations = () => {
    const el = document.getElementById('revenue-donations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#010e24] via-[#021838] to-[#010e24] text-white border-y border-[#0052CC]/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0052CC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#0052CC]/30 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Feature Demo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Try All New Features Live on This Page
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-1 max-w-2xl">
              Experience dynamic variant pricing, direct shop owner storefronts, add-to-cart popup notifications, and the Super Admin revenue donation program.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Demo Ready</span>
          </span>
        </div>

        {/* Main Grid: Interactive Variant Tester + 3 Quick Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Live Dynamic Variant & Add to Cart Tester (7 cols) */}
          <div className="lg:col-span-7 bg-[#021838] border-2 border-[#0052CC] hover:border-[#FFB800]/70 rounded-3xl p-5 sm:p-6 shadow-2xl relative transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/50 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#0052CC]/30 text-[#FFB800]">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#FFB800] block">
                    Feature 1 • Live Tester
                  </span>
                  <h3 className="font-black text-sm text-white">
                    Dynamic Variant Pricing & Instant Pop-up
                  </h3>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold uppercase">
                Try Clicking Below
              </span>
            </div>

            {/* Product Demo Card Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Product Photo */}
              <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-[#0052CC]/50 shadow-inner group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedVariant.image}
                  alt={selectedVariant.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-[#021838]/90 text-[#FFB800] border border-[#FFB800]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                  Ceylon Royal Spices
                </span>
                <span className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  {selectedVariant.weight}
                </span>
              </div>

              {/* Product Controls & Pricing */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <h4 className="text-base font-black text-white leading-tight">
                    Pure Ceylon Alba Cinnamon Quills
                  </h4>
                  <p className="text-[11px] text-blue-200/70 mt-0.5">
                    Click different sizes below to observe the price change dynamically in real time:
                  </p>
                </div>

                {/* Clickable Variant Chips */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-blue-300 block mb-1.5">
                    Select Size / Weight (விலை மற்றும் அளவு):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_VARIANTS.map((v) => {
                      const isSelected = selectedVariant.name === v.name;
                      return (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0052CC] border-[#FFB800] text-white shadow-md'
                              : 'bg-[#01142F] border-blue-900/80 text-blue-200 hover:border-[#0052CC] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold">{v.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800]" />}
                          </div>
                          <span
                            className={`text-xs font-mono font-black block mt-0.5 ${
                              isSelected ? 'text-[#FFB800]' : 'text-emerald-400'
                            }`}
                          >
                            {formatCurrency(v.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Dynamic Price Highlight */}
                <div className="p-3 bg-[#01142F] rounded-2xl border border-blue-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Dynamic Live Price:
                    </span>
                    <span className="text-xl font-black text-[#FFB800] font-mono">
                      {formatCurrency(selectedVariant.price)}
                    </span>
                  </div>

                  <span className="text-[10px] text-blue-300 bg-blue-900/40 px-2 py-1 rounded-lg">
                    Selected: <strong>{selectedVariant.name}</strong>
                  </span>
                </div>

                {/* Add to Cart Test Button (Triggers Popup Modal) */}
                <button
                  onClick={handleTestAddToCart}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {justAdded ? '✓ Added! (Check Bottom-Right Pop-up)' : 'Add to Cart — Test Live Pop-up'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 Action Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Card 1: Shop Storefront */}
            <div className="bg-[#021838] border border-[#0052CC]/40 hover:border-[#FFB800]/60 rounded-2xl p-4 shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-amber-500/20 text-[#FFB800] shrink-0">
                  <Store className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#FFB800]">
                    Feature 2 • Approved Storefront
                  </span>
                  <h4 className="font-bold text-xs text-white">
                    Vendor Store Pages with Isolated Products
                  </h4>
                  <p className="text-[11px] text-blue-200/70 mt-0.5">
                    When customers click &quot;Shop Now&quot; on verified sellers, only that shop&apos;s items are displayed.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-900/50 flex justify-end">
                <Link
                  href="/shops/ceylon-royal-spices"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFB800] hover:text-amber-300 transition-colors"
                >
                  <span>Visit Ceylon Royal Spices Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Vendor Dashboard & Direct Device Photo Upload */}
            <div className="bg-[#021838] border border-[#0052CC]/40 hover:border-[#FFB800]/60 rounded-2xl p-4 shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
                  <Camera className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-300">
                    Feature 3 • Shop Owner Dashboard
                  </span>
                  <h4 className="font-bold text-xs text-white">
                    Device Photo Upload & Order Status Management
                  </h4>
                  <p className="text-[11px] text-blue-200/70 mt-0.5">
                    Upload photos directly from phone/PC (no links!), set variant prices, and update order statuses.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-900/50 flex justify-between items-center text-xs">
                <Link
                  href="/login"
                  className="text-blue-300 hover:text-white font-bold transition-colors"
                >
                  Register Shop (/login)
                </Link>
                <Link
                  href="/vendor"
                  className="inline-flex items-center gap-1 font-bold text-[#FFB800] hover:text-amber-300 transition-colors"
                >
                  <span>Open Vendor Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Revenue Donations Aid */}
            <div className="bg-[#021838] border border-[#0052CC]/40 hover:border-[#FFB800]/60 rounded-2xl p-4 shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    Feature 4 • Social Impact Program
                  </span>
                  <h4 className="font-bold text-xs text-white">
                    Super Admin Revenue Donations & Community Grants
                  </h4>
                  <p className="text-[11px] text-blue-200/70 mt-0.5">
                    Platform revenue dedicated to student education, spice cultivators, and medical assistance.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-900/50 flex justify-between items-center text-xs">
                <Link
                  href="/admin/donations"
                  className="text-gray-400 hover:text-white font-bold transition-colors"
                >
                  Admin Grants Panel
                </Link>
                <button
                  type="button"
                  onClick={scrollToDonations}
                  className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
                >
                  <span>Apply for Aid (Scroll Down)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
