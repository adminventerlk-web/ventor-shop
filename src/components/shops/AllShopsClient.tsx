'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Store,
  MapPin,
  ArrowRight,
  BadgeCheck,
  Star,
  ShoppingBag,
  Search,
  Sparkles,
  Building2,
  Filter,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface IShopItem {
  _id: string;
  shopName: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  address?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating?: number;
  totalProducts?: number;
}

const CATEGORIES = [
  'All Categories',
  'Ceylon Spices',
  'Groceries & Organics',
  'Books & Stationery',
  'Clothing & Fashion',
  'Mobiles & Electronics',
  'Handicrafts & Decor',
  'Pet Supplies',
  'General Store',
];

const CITIES = [
  'All Cities',
  'Colombo',
  'Kandy',
  'Jaffna',
  'Galle',
  'Batticaloa',
  'Gampaha',
  'Kurunegala',
  'Anuradhapura',
];

export default function AllShopsClient() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const isSi = language === 'si';

  const [shops, setShops] = useState<IShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      try {
        const res = await fetch('/api/shops');
        if (res.ok) {
          const data = await res.json();
          setShops(data.shops || []);
        }
      } catch (err) {
        console.error('Failed to load shops:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  const filteredShops = shops.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.shopName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      s.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesCity =
      selectedCity === 'All Cities' ||
      s.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FC] font-sans antialiased text-[#111827]">
      <Header />

      <main className="flex-1 w-full pb-16">
        {/* ── Top Hero Banner ── */}
        <section
          className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{
            backgroundColor: '#021838',
            backgroundImage:
              'radial-gradient(ellipse at 80% 20%, rgba(0, 82, 204, 0.45) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255, 184, 0, 0.15) 0%, transparent 60%), linear-gradient(135deg, #021838 0%, #042559 50%, #010E24 100%)',
            color: '#ffffff',
          }}
        >
          <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0052CC]/40 border border-[#0052CC] text-[#FFB800] text-xs font-black uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>{isTa ? 'சரிபார்க்கப்பட்ட சிறப்பு கடைகள்' : 'Verified Merchant Marketplace'}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {isTa
                    ? 'எங்கள் வணிகர்களின் சிறப்பு கடைகள்'
                    : 'Shop Certified Partner Stores'}
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                  {isTa
                    ? 'இலங்கை முழுவதும் உள்ள பதிவுசெய்யப்பட்ட மற்றும் சரிபார்க்கப்பட்ட வணிகர்களின் தயாரிப்புகளை நேரடியாக ஆராய்ந்து வாங்குங்கள்.'
                    : 'Discover authentic local producers, organic spice cultivators, bookshops, and boutique merchants approved by VENTERSHOP.'}
                </p>
              </div>

              <Link
                href="/login?tab=register&role=vendor"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-[#021838] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#021838]" />
                <span>{isTa ? 'உங்கள் கடையை சேர்க்க' : '+ Register Your Shop'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Filters & Search Bar ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-8 sm:mb-10">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="sm:col-span-6 relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder={
                    isTa
                      ? 'கடை பெயர், நகரம் அல்லது தயாரிப்பு மூலம் தேடுங்கள்...'
                      : 'Search shops by name, city, or specialty...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0052CC] focus:bg-white transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-[#0052CC] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-[#0052CC] cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Counts */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-gray-500">
              <span>
                Showing <strong className="text-[#021838]">{filteredShops.length}</strong>{' '}
                {filteredShops.length === 1 ? 'store' : 'stores'}
              </span>

              {(searchQuery ||
                selectedCategory !== 'All Categories' ||
                selectedCity !== 'All Cities') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedCity('All Cities');
                  }}
                  className="text-xs text-[#0052CC] hover:underline font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Shops Grid ── */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20"
        >
          {loading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: '32px' }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-72 bg-white rounded-3xl animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center mx-auto">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900">No stores found</h3>
              <p className="text-xs text-gray-500">
                Try adjusting your search query or selecting a different category/city filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedCity('All Cities');
                }}
                className="px-5 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#003893] transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: '32px' }}
            >
              {filteredShops.map((shop) => {
                const banner =
                  shop.bannerUrl ||
                  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
                const logo =
                  shop.logoUrl ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';

                return (
                  <article
                    key={shop._id}
                    className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0052CC]/50 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="relative h-40 sm:h-48 w-full bg-gray-100 overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${banner}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                          <span className="bg-[#021838]/90 backdrop-blur-xs text-[#FFB800] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#FFB800]/30 shadow-xs">
                            {shop.category}
                          </span>
                        </div>

                        {/* City Location */}
                        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 drop-shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{shop.city}</span>
                        </div>
                      </div>

                      {/* Logo & Content */}
                      <div className="p-4 sm:p-5 pt-0 relative">
                        {/* Overlapping Logo */}
                        <div className="relative -mt-7 sm:-mt-8 mb-3 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${logo}')` }}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-sm sm:text-base font-black text-[#021838] group-hover:text-[#0052CC] transition-colors leading-tight truncate">
                              {shop.shopName}
                            </h2>
                            <span title="Super Admin Verified">
                              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {shop.description}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <strong className="text-gray-800">{shop.rating || 4.9}</strong>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600 flex items-center gap-1 truncate">
                              <ShoppingBag className="w-3.5 h-3.5 text-[#0052CC]" />
                              <span>Store Catalog</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with "Visit Shop" Button */}
                    <div className="p-4 sm:p-5 pt-3 border-t border-gray-100 bg-gray-50/50">
                      <Link
                        href={`/shops/${shop.slug}`}
                        prefetch={true}
                        className="w-full py-2.5 sm:py-3 px-4 bg-[#0052CC] hover:bg-[#003893] group-hover:bg-[#021838] text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md cursor-pointer"
                      >
                        <span>{isTa ? 'கடையை பார்வையிடு' : 'Visit Store'}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Merchant Callout Banner ── */}
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ marginTop: '64px', marginBottom: '32px' }}
        >
          <div className="bg-gradient-to-r from-[#021838] via-[#042A63] to-[#0052CC] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40">
                Join VentorShop Merchant Network
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Are you a Shop Owner or Producer in Sri Lanka?
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Register your store today and start selling directly to 50,000+ shoppers with islandwide delivery logistics and automated WhatsApp notifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/login?tab=register&role=vendor"
                className="px-6 py-3 bg-[#FFB800] hover:bg-[#FFA500] text-[#021838] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg"
              >
                Register Your Shop
              </Link>
              <Link
                href="/advertise-with-us"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all"
              >
                Advertise With Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
