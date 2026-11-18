'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Store,
  TrendingUp,
  CheckCircle2,
  Users,
  Eye,
  Mail,
  X,
  Send,
} from 'lucide-react';

interface ICollabSlide {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  image: string;
  shopName: string;
  shopCategory: string;
  highlightStat: string;
  ctaText: string;
  ctaLink: string;
  accentColor: string;
}

const COLLAB_SLIDES: ICollabSlide[] = [
  {
    id: 'slide-1',
    badge: 'Verified Merchant Spotlight',
    title: 'Ceylon Organic Spice Merchants',
    tagline: 'Premium Alba Ceylon Cinnamon & Pure Highland Cardamom delivered island-wide & globally.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    shopName: 'Ruhunu Organic Spice Co.',
    shopCategory: 'Ceylon Spices & Agri Export',
    highlightStat: '50K+ Monthly Shoppers Reached',
    ctaText: 'Visit Partner Store',
    ctaLink: '/virtual-shops',
    accentColor: '#FFB800',
  },
  {
    id: 'slide-2',
    badge: 'Partner Store Showcase',
    title: 'Highland Dairy & Fresh Farm Produce',
    tagline: 'Farm-fresh dairy, pure virgin coconut oils, and authentic rural provisions directly to your doorstep.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    shopName: 'Kandy Green Fields Farm',
    shopCategory: 'Fresh Grocery & Farm Supplies',
    highlightStat: '100% Verified Quality Vendor',
    ctaText: 'Explore Partner Store',
    ctaLink: '/virtual-shops',
    accentColor: '#10B981',
  },
  {
    id: 'slide-3',
    badge: 'Artisan Commercial Partner',
    title: 'Authentic Handloom & Ceylon Crafts',
    tagline: 'Pure cotton handcrafted apparel, heritage home furnishings & traditional Ceylon handicraft exports.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    shopName: 'Lanka Heritage Handlooms',
    shopCategory: 'Handloom, Textile & Exports',
    highlightStat: 'Zero Setup Cost • Verified Seller',
    ctaText: 'View Store Collection',
    ctaLink: '/virtual-shops',
    accentColor: '#38BDF8',
  },
];

export default function PartnerCollabAdBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Groceries');
  const [submitted, setSubmitted] = useState(false);

  // Auto-rotate every 4 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % COLLAB_SLIDES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = COLLAB_SLIDES[currentSlide];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="partner-collab-ad-section"
      aria-labelledby="partner-ad-heading"
      className="w-full py-4 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Ad Billboard Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-3xl border-2 border-[#FFB800] shadow-2xl transition-all"
          style={{
            backgroundColor: '#021838',
            backgroundImage: 'linear-gradient(135deg, #021838 0%, #062660 55%, #011129 100%)',
            color: '#ffffff',
          }}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#0052CC]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Ad Label + Sponsor Pitch */}
          <div className="relative z-10 px-5 pt-5 sm:px-8 sm:pt-6 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FFB800] text-[#021838] shadow-sm">
                <Megaphone className="w-4 h-4 text-[#021838]" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FFB800]">
                FEATURED PARTNER STORES • வணிக கூட்டாண்மை விளம்பரம்
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setInquiryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#021838] text-white text-[11px] font-bold border border-white/20 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800] group-hover:text-[#021838]" />
                <span>Advertise Your Shop Here</span>
              </button>
            </div>
          </div>

          {/* Animated Carousel Body */}
          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Merchant Details */}
              <div className="lg:col-span-7 space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01142F] border border-blue-500/50 text-xs font-black uppercase tracking-wider text-emerald-300">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeSlide.badge}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white font-medium">{activeSlide.shopCategory}</span>
                </div>

                {/* Title */}
                <h2
                  id="partner-ad-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight transition-all duration-300"
                >
                  {activeSlide.title}
                </h2>

                {/* Subtitle / Tagline */}
                <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-xl">
                  {activeSlide.tagline}
                </p>

                {/* Highlights Strip */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#FFB800] bg-[#01142F] px-3 py-1.5 rounded-xl border border-blue-800">
                    <TrendingUp className="w-4 h-4 text-[#FFB800]" />
                    <span>{activeSlide.highlightStat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 bg-[#01142F] px-3 py-1.5 rounded-xl border border-blue-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified Shop Partner</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={activeSlide.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#FFB800]" />
                    <span>Promote Your Store</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Showcase Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFB800]/80 shadow-2xl group aspect-[4/3] bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-black/20 to-transparent" />

                  {/* Floating Merchant Info Card on Image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#021838]/90 backdrop-blur-md rounded-xl border border-blue-500/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black text-[#FFB800] tracking-wider">
                        {activeSlide.shopCategory}
                      </p>
                      <h4 className="text-sm font-black text-white">{activeSlide.shopName}</h4>
                    </div>
                    <Link
                      href="/virtual-shops"
                      className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-lg text-xs font-black transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-3 px-1">
                  {/* Dots */}
                  <div className="flex items-center gap-1.5">
                    {COLLAB_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 transition-all rounded-full cursor-pointer ${
                          currentSlide === idx ? 'w-6 bg-[#FFB800]' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Prev / Next Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (prev) => (prev - 1 + COLLAB_SLIDES.length) % COLLAB_SLIDES.length
                        )
                      }
                      aria-label="Previous slide"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % COLLAB_SLIDES.length)}
                      aria-label="Next slide"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PARTNER AD INQUIRY MODAL ── */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-white border-2 border-[#0052CC] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#021838] text-white flex items-center justify-between border-b-2 border-blue-900">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#0052CC] text-[#FFB800]">
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Promote Your Store On VENTERSHOP
                  </h3>
                  <p className="text-xs text-[#FFB800] font-bold">
                    Reach 50,000+ shoppers island-wide
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 text-xs bg-white space-y-4">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">Inquiry Received!</h4>
                  <p className="text-gray-600 text-xs max-w-xs mx-auto">
                    Thank you! Our merchant marketing team will contact you via WhatsApp / Phone within 24 hours to discuss advertising options.
                  </p>
                  <button
                    onClick={() => setInquiryModalOpen(false)}
                    className="mt-2 px-5 py-2.5 bg-[#0052CC] text-white rounded-xl font-black text-xs uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                  <p className="text-gray-600 font-medium">
                    Showcase your brand banner on VENTERSHOP homepage and category pages. Submit your details below:
                  </p>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      Shop / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopNameInput}
                      onChange={(e) => setShopNameInput(e.target.value)}
                      placeholder="e.g. Royal Spice Traders"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      WhatsApp / Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                      Product Category *
                    </label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 font-semibold focus:border-[#0052CC] focus:outline-none"
                    >
                      <option value="Groceries">Groceries & Provisions</option>
                      <option value="Ceylon Spices">Ceylon Spices & Agri Export</option>
                      <option value="Animal Feed">Rani Animal Feed</option>
                      <option value="Books">Books & Stationery</option>
                      <option value="Handloom">Handloom & Apparel</option>
                      <option value="Electronics">Electronics & Accessories</option>
                      <option value="Other">Other Specialty Products</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(false)}
                      className="px-4 py-2.5 text-gray-600 font-bold hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#021838] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Ad Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}