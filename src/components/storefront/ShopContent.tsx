'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, ShoppingBag, LayoutGrid, Apple, CookingPot, BookOpen, Shirt, Smartphone, PawPrint, Flower2, Gift } from 'lucide-react';

import { fallbackProducts, fallbackCategories } from '@/lib/data/fallbackData';

interface ICategoryData {
  _id: string;
  name: string;
  slug: string;
}

interface IProductData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  wholesaleMinQty?: number;
}

const initialProductData: IProductData[] = fallbackProducts.map((p) => ({
  _id: p._id,
  name: p.name,
  slug: p.slug,
  sku: p.sku,
  description: p.description,
  shortDescription: p.shortDescription,
  images: p.images,
  retailPrice: p.retailPrice,
  communityPrice: p.communityPrice,
  wholesalePrice: p.wholesalePrice,
  stock: p.stock,
  lowStockThreshold: p.lowStockThreshold,
  isFeatured: p.isFeatured,
  isBestSeller: p.isBestSeller,
  isNewArrival: p.isNewArrival,
  wholesaleMinQty: p.wholesaleMinQty,
}));

const initialCategoryData: ICategoryData[] = fallbackCategories.map((c) => ({
  _id: c._id,
  name: c.name,
  slug: c.slug,
}));

const categoryIcons: Record<string, typeof ShoppingBag> = {
  groceries: Apple, home: CookingPot, books: BookOpen, 'books-stationery': BookOpen,
  clothing: Shirt, electronics: Smartphone, 'animal-feed': PawPrint, plants: Flower2, gifts: Gift,
};

export default function ShopContent() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [products, setProducts] = useState<IProductData[]>(initialProductData);
  const [categories, setCategories] = useState<ICategoryData[]>(initialCategoryData);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 1. Fetch categories list on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    }
    fetchCategories();
  }, []);

  // 2. Parse search params on change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('q') || '');
    setMinPriceInput(searchParams.get('minPrice') || '');
    setMaxPriceInput(searchParams.get('maxPrice') || '');
    setInStockOnly(searchParams.get('inStock') === 'true');
    setSortOption(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // 3. Helper to update search params and push URL
  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [searchParams, pathname, router]
  );

  // 4. Fetch Products matching active URL params
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(Array.from(searchParams.entries())).toString();
        const res = await fetch(`/api/products?${urlParams}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams]);

  // Handle Form Submissions for Filters
  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
  };

  const handleToggleStock = (checked: boolean) => {
    setInStockOnly(checked);
    updateParams({ inStock: checked ? 'true' : null });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    updateParams({ category: slug === 'all' ? null : slug });
    setMobileFiltersOpen(false);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    updateParams({ sort: sort === 'newest' ? null : sort });
  };

  const handleResetFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
    setSelectedCategory('all');
    setSortOption('newest');
    router.push(pathname);
    setMobileFiltersOpen(false);
  };

  const getLocalizedCategoryName = (cat: ICategoryData) => {
    if (language === 'ta' || language === 'si') {
      if (cat.slug === 'groceries') return t('navGroceries');
      if (cat.slug === 'animal-feed') return t('navAnimalFeed');
      if (cat.slug === 'books') return t('navBooks');
      if (cat.slug === 'electronics') return t('navElectronics');
      if (cat.slug === 'daily-needs') return t('navDailyNeeds');
      if (cat.slug === 'home') return t('navHome');
    }
    return cat.name;
  };

  const getVirtualShopName = (slug: string) => {
    switch (slug) {
      case 'groceries':
        return language === 'ta' ? '🛒 வர்ச்சுவல் சூப்பர் மார்க்கெட்' : language === 'si' ? '🛒 වර්චුවල් සුපර්මාර්කට්' : '🛒 Virtual Supermarket';
      case 'footwear':
      case 'shoes':
        return language === 'ta' ? '👟 வர்ச்சுவல் ஷூ ஷாப்' : language === 'si' ? '👟 වර්චුවල් සපත්තු කඩේ' : '👟 Virtual Shoe Shop';
      case 'books':
        return language === 'ta' ? '📚 வர்ச்சுவல் புக் ஷாப்' : language === 'si' ? '📚 වර්චුවල් පොත් කඩේ' : '📚 Virtual Book Shop';
      case 'computers':
        return language === 'ta' ? '💻 வர்ச்சுவல் கணினி மையம்' : language === 'si' ? '💻 වර්චුවල් පරිගණක මධ්‍යස්ථානය' : '💻 Virtual Computer Center';
      case 'phones':
      case 'mobiles':
        return language === 'ta' ? '📱 வர்ச்சுவல் போன் ஷாப்' : language === 'si' ? '📱 වර්චුවල් ජංගම දුරකථන කඩේ' : '📱 Virtual Phone Shop';
      case 'clothing':
      case 'fashion':
        return language === 'ta' ? '👕 வர்ச்சுவல் ஃபேஷன் ஸ்டோர்' : language === 'si' ? '👕 වර්චුවල් ඇඳුම් සාප්පුව' : '👕 Virtual Fashion Store';
      case 'electronics':
        return language === 'ta' ? '📺 வர்ச்சுவல் எலக்ட்ரானிக்ஸ் ஷாப்' : language === 'si' ? '📺 වර්චුවල් විදුලි උපකරණ සාප්පුව' : '📺 Virtual Electronics Shop';
      case 'animal-feed':
        return language === 'ta' ? '🌾 ராணி கால்நடை தீவனம்' : language === 'si' ? '🌾 රාණි සතුන්ගේ ආහාර' : '🌾 Rani Animal Feed';
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:py-8 sm:px-6 lg:px-8 text-[#082B68] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[#0759D6] [&_button:focus-visible]:outline-offset-2">
      {/* Active Virtual Shop Banner Header */}
      {selectedCategory !== 'all' && getVirtualShopName(selectedCategory) && (
        <div className="mb-6 bg-gradient-to-r from-[#082B68] via-[#0759D6] to-[#071F50] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#0759D6]/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
              {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட வர்ச்சுவல் கடை' : language === 'si' ? 'තෝරාගත් වර්චුවල් කඩే' : 'SELECTED VIRTUAL SHOP'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5">{getVirtualShopName(selectedCategory)}</h1>
            <p className="text-xs text-[#DBEDFF] mt-1 font-semibold">
              {language === 'ta' ? 'இந்த கடையில் உள்ள அனைத்து பிரத்யேக பொருட்களையும் பார்வையிடுகிறீர்கள்.' : language === 'si' ? 'මෙම සාප්පුවේ ඇති සියලුම විශේෂිත නිෂ්පාදන ඔබ නරඹමින් සිටී.' : 'Browsing products exclusively available in this virtual shop outlet.'}
            </p>
          </div>
          <button
            onClick={() => handleCategorySelect('all')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer"
          >
            {language === 'ta' ? 'அனைத்து கடைகளும்' : language === 'si' ? 'සියලුම සාප්පු' : 'View All Shops'}
          </button>
        </div>
      )}

      {/* Active Special Offers Banner Header */}
      {searchParams.get('offers') === 'true' && (
        <div className="mb-6 bg-gradient-to-r from-[#082B68] via-[#0759D6] to-[#071F50] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#0759D6]/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 block">
              🔥 {language === 'ta' ? 'சிறப்பு சலுகைகள்' : language === 'si' ? 'විශේෂ දීමනා' : 'SPECIAL OFFERS & PROMOTIONS'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5">
              {language === 'ta' ? 'சிறப்பு சலுகைகள் & தள்ளுபடி பொருட்கள்' : language === 'si' ? 'විශේෂ දීමනා සහ වට්ටම් නිෂ්පාදන' : 'Special Offers & Exclusive Deals'}
            </h1>
            <p className="text-xs text-[#DBEDFF] mt-1 font-semibold">
              {language === 'ta' ? 'அனைத்து சிறப்பு சலுகைகள் மற்றும் தள்ளுபடி தயாரிப்புகளை பார்வையிடுகிறீர்கள்.' : language === 'si' ? 'VenterShop හි සියලුම විශේෂ දීමනා සහ වට්ටම් සහිත නිෂ්පාදන නරඹන්න.' : 'Browsing all promotional deals, vouchers, and discounted products across VenterShop.'}
            </p>
          </div>
          <button
            onClick={() => router.push('/shop')}
            className="px-4 py-2 bg-white text-[#082B68] hover:bg-[#FFC400] rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <LayoutGrid aria-hidden="true" className="h-4 w-4 shrink-0" />
            {language === 'ta' ? 'அனைத்து பொருட்களும்' : language === 'si' ? 'සියලුම නිෂ්පාදන' : 'All Products'}
          </button>
        </div>
      )}

      {/* Search Header Banner */}
      {searchQuery && (
        <div className="mb-6 bg-white p-4 rounded-2xl border border-[#d5e7fb] shadow-xs flex items-baseline gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search results for:</span>
          <span className="text-lg font-black text-[#082B68]">&quot;{searchQuery}&quot;</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Left Column: SIDEBAR FILTERS (Hidden on small screens) */}
        <aside className="hidden lg:block w-56 xl:w-60 shrink-0 space-y-4">
          
          {/* Categories Filter Block */}
          <div className="bg-white p-5 rounded-2xl border border-[#d5e7fb] shadow-[0_5px_16px_-12px_#0759d640] space-y-4">
            <h3 className="font-bold text-sm text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">
              {language === 'ta' ? 'வகைகள்' : language === 'si' ? 'ප්‍රභේද' : 'Categories'}
            </h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`flex items-center gap-2.5 text-left text-xs py-2.5 px-3 rounded-xl transition-colors font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-linear-to-r from-[#082B68] to-[#0759D6] text-white'
                    : 'text-[#082B68] hover:bg-[#F2F8FF]'
                }`}
              >
                <LayoutGrid aria-hidden="true" className="h-4 w-4 shrink-0" />
                {language === 'ta' ? 'அனைத்து தயாரிப்புகள்' : language === 'si' ? 'සියලුම නිෂ්පාදන' : 'All Products'}
              </button>
              {categories.map((cat) => {
                const CategoryIcon = categoryIcons[cat.slug] || ShoppingBag;
                return (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex items-center gap-2.5 text-left text-xs py-2.5 px-3 rounded-xl transition-colors font-semibold ${
                    selectedCategory === cat.slug
                      ? 'bg-linear-to-r from-[#082B68] to-[#0759D6] text-white'
                      : 'text-[#082B68] hover:bg-[#F2F8FF]'
                  }`}
                >
                  <CategoryIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {getLocalizedCategoryName(cat)}
                </button>
              );
              })}
            </div>
          </div>

          {/* Price Range Filter Block */}
          <div className="bg-white p-5 rounded-2xl border border-[#d5e7fb] shadow-[0_5px_16px_-12px_#0759d640] space-y-4">
            <h3 className="font-bold text-sm text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">
              {language === 'ta' ? 'விலை வரம்பு (LKR)' : language === 'si' ? 'මිල පරාසය (LKR)' : 'Price Range (LKR)'}
            </h3>
            <form onSubmit={handleApplyPriceFilter} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="min-w-0 w-1/2 px-3 py-1.5 text-xs bg-[#F2F8FF] border border-[#c4ddfa] rounded-md focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#DBEDFF] outline-none transition-colors text-gray-900 font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="min-w-0 w-1/2 px-3 py-1.5 text-xs bg-[#F2F8FF] border border-[#c4ddfa] rounded-md focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#DBEDFF] outline-none transition-colors text-gray-900 font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 min-h-10 py-2 bg-[#082B68] hover:bg-[#071F50] text-white font-bold text-xs rounded-md shadow-xs transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'வடிகட்டு' : language === 'si' ? 'යොදන්න' : 'Apply Price'}</span>
              </button>
            </form>
          </div>

          {/* Availability Block */}
          <div className="bg-white p-5 rounded-2xl border border-[#d5e7fb] shadow-[0_5px_16px_-12px_#0759d640] space-y-4">
            <h3 className="font-bold text-sm text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">
              {language === 'ta' ? 'கிடைக்கும் தன்மை' : language === 'si' ? 'ලබාගත හැකි බව' : 'Availability'}
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#082B68] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => handleToggleStock(e.target.checked)}
                className="w-4 h-4 accent-[#0759D6] border-gray-300 rounded-sm focus:ring-[#DBEDFF]"
              />
              <span>{language === 'ta' ? 'இருப்பில் உள்ளவை மட்டும்' : language === 'si' ? 'තොග ඇති දේවල් පමණි' : 'In Stock Only'}</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-[#93baf1] bg-white hover:bg-[#DBEDFF] text-[#082B68] hover:text-[#0759D6] font-bold text-xs rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வடிகட்டல்களை நீக்கு' : language === 'si' ? 'පෙරහන් ඉවත් කරන්න' : 'Reset All Filters'}</span>
          </button>
        </aside>

        {/* Right Column: PRODUCT CONTROLS AND GRID */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#d5e7fb] shadow-[0_5px_16px_-12px_#0759d640] flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-[#082B68] font-bold">
              {loading ? (
                <span className="inline-block w-20 h-4 bg-gray-100 animate-pulse rounded-sm" />
              ) : (
                <span>
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1 py-1.5 px-3 border border-[#c4ddfa] hover:bg-[#F2F8FF] text-[#0759D6] rounded-lg text-xs font-semibold transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sorting Select */}
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#0759D6]" />
                <select aria-label="Sort products"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-[#F2F8FF] border border-[#c4ddfa] rounded-lg py-1.5 px-3 font-semibold text-xs text-[#082B68] focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#DBEDFF] outline-none transition-all cursor-pointer"
                >
                  <option value="newest">{language === 'ta' ? 'புதியவை' : 'Newest'}</option>
                  <option value="bestselling">{language === 'ta' ? 'அதிகம் விற்கப்படுபவை' : 'Best Selling'}</option>
                  <option value="popular">{language === 'ta' ? 'பிரபலமானவை' : 'Popularity'}</option>
                  <option value="price-asc">{language === 'ta' ? 'விலை: குறைந்ததிலிருந்து' : 'Price: Low to High'}</option>
                  <option value="price-desc">{language === 'ta' ? 'விலை: உயர்ந்ததிலிருந்து' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid / Loader / Empty State */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 shadow-sm border border-[#d5e7fb] flex flex-col p-4 space-y-4">
                  <div className="flex-1 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-5 w-2/3 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#d5e7fb] p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-[#F2F8FF] rounded-full flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#082B68]">No products found</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any products matching your active filter criteria. Try resetting or adjusting your parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2 px-6 bg-[#082B68] hover:bg-[#071F50] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} variant="shop" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE FILTER PANEL */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div role="dialog" aria-label="Product filters" aria-modal="true" className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#F2F8FF] rounded-t-3xl z-50 p-6 flex flex-col overflow-y-auto space-y-6 shadow-2xl animate-slide-in-bottom">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#082B68]">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 hover:bg-gray-100 rounded-full font-bold text-[#64748B]"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-3 rounded-2xl border border-[#d5e7fb] bg-white p-4 shadow-[0_4px_12px_-10px_#0759d640]">
              <h4 className="font-bold text-xs text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full text-xs font-semibold border ${
                    selectedCategory === 'all'
                      ? 'bg-linear-to-r from-[#082B68] to-[#0759D6] text-white border-[#0759D6]'
                      : 'bg-white text-[#082B68] border-[#c4ddfa] hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid aria-hidden="true" className="h-4 w-4 shrink-0" />All
                </button>
                {categories.map((cat) => {
                const CategoryIcon = categoryIcons[cat.slug] || ShoppingBag;
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full text-xs font-semibold border ${
                      selectedCategory === cat.slug
                        ? 'bg-linear-to-r from-[#082B68] to-[#0759D6] text-white border-[#0759D6]'
                        : 'bg-white text-[#082B68] border-[#c4ddfa] hover:bg-gray-50'
                    }`}
                  >
                    <CategoryIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {getLocalizedCategoryName(cat)}
                  </button>
                );
              })}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-3 rounded-2xl border border-[#d5e7fb] bg-white p-4 shadow-[0_4px_12px_-10px_#0759d640]">
              <h4 className="font-bold text-xs text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">Price Range</h4>
              <form onSubmit={(event) => {
                handleApplyPriceFilter(event);
                setMobileFiltersOpen(false);
              }} className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="min-w-0 w-1/3 px-3 py-2 bg-[#F2F8FF] border border-[#c4ddfa] rounded-lg text-xs text-gray-900 font-bold outline-none focus:border-[#0759D6] focus:ring-2 focus:ring-[#DBEDFF]"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="min-w-0 w-1/3 px-3 py-2 bg-[#F2F8FF] border border-[#c4ddfa] rounded-lg text-xs text-gray-900 font-bold outline-none focus:border-[#0759D6] focus:ring-2 focus:ring-[#DBEDFF]"
                />
                <button
                  type="submit"
                  className="flex-1 py-2 bg-linear-to-r from-[#082B68] to-[#0759D6] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Mobile Availability */}
            <div className="space-y-3 rounded-2xl border border-[#d5e7fb] bg-white p-4 shadow-[0_4px_12px_-10px_#0759d640]">
              <h4 className="font-bold text-xs text-[#082B68] tracking-wide after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-[#FFC400]">Availability</h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#082B68] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => handleToggleStock(e.target.checked)}
                  className="w-4 h-4 accent-[#0759D6]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-[#c4ddfa] text-[#082B68] font-bold text-xs rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-linear-to-r from-[#082B68] to-[#0759D6] text-white font-bold text-xs rounded-lg"
              >
                See Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
