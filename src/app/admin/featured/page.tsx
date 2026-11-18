'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  Store,
  ShieldCheck,
  ArrowLeft,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  stats: { total: number; featured: number };
}

interface IProductItem {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  retailPrice: number;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: { _id: string; name: string; slug: string };
  vendorId: string | null;
  shopName: string | null;
  source: 'vendor' | 'admin';
}

export default function FeaturedProductsAdminPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'admin' | 'vendor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const maxPerCategory = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/featured');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load featured admin data:', err);
      setNotification({ type: 'error', message: 'Network error loading featured products data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeatured = async (product: IProductItem) => {
    const nextStatus = !product.isFeatured;
    const catId = product.categoryId?._id;

    // Check frontend limit if enabling
    if (nextStatus && catId) {
      const categoryFeaturedCount = products.filter(
        (p) => p.categoryId?._id === catId && p.isFeatured
      ).length;

      if (categoryFeaturedCount >= maxPerCategory) {
        setNotification({
          type: 'error',
          message: `Category "${product.categoryId?.name}" already has ${maxPerCategory} featured products. Unfeature one before adding another.`,
        });
        return;
      }
    }

    setUpdatingId(product._id);
    setNotification(null);

    try {
      const res = await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          isFeatured: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update featured status');
      }

      // Update local state smoothly
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, isFeatured: nextStatus } : p))
      );

      // Update category stats
      if (catId) {
        setCategories((prev) =>
          prev.map((c) => {
            if (c._id === catId) {
              const delta = nextStatus ? 1 : -1;
              return {
                ...c,
                stats: { ...c.stats, featured: Math.max(0, c.stats.featured + delta) },
              };
            }
            return c;
          })
        );
      }

      setNotification({
        type: 'success',
        message: nextStatus
          ? `⭐ "${product.name}" is now featured on the homepage!`
          : `Removed "${product.name}" from featured products.`,
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Update failed' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'all' && p.categoryId?._id !== selectedCategory) {
      return false;
    }
    // Source match
    if (sourceFilter === 'admin' && p.source !== 'admin') return false;
    if (sourceFilter === 'vendor' && p.source !== 'vendor') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchShop = (p.shopName || '').toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchShop) return false;
    }

    return true;
  });

  const activeCategoryObj = categories.find((c) => c._id === selectedCategory);
  const activeCatFeaturedCount = activeCategoryObj
    ? products.filter((p) => p.categoryId?._id === selectedCategory && p.isFeatured).length
    : 0;

  return (
    <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-400/40">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#021838]">
                  Featured Products Manager
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Category-Wise Max 10
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Super Admin control to select up to 10 showcase products per category for the VENTERSHOP homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
              title="Refresh product list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0052CC] hover:bg-[#003d99] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Package className="w-4 h-4" />
              <span>Catalog Manager</span>
            </Link>
          </div>
        </div>

        {/* Status Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold border animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Category Limit Info Bar */}
        {activeCategoryObj && (
          <div className="bg-gradient-to-r from-[#021838] to-[#042861] text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB800] block">
                Active Category Selection
              </span>
              <h3 className="text-lg font-black text-white">{activeCategoryObj.name}</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Maximum allowed: 10 featured products. These appear in the homepage category showcase.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-[#FFB800]">
                  {activeCatFeaturedCount} / {maxPerCategory}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-300 block">
                  Slots Occupied
                </span>
              </div>
              <div className="w-24 bg-blue-900/80 rounded-full h-3 p-0.5 border border-blue-500/50">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeCatFeaturedCount >= maxPerCategory
                      ? 'bg-rose-500'
                      : activeCatFeaturedCount > 0
                      ? 'bg-[#FFB800]'
                      : 'bg-gray-600'
                  }`}
                  style={{ width: `${Math.min(100, (activeCatFeaturedCount / maxPerCategory) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          {/* Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#021838] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => {
              const catFeatCount = products.filter(
                (p) => p.categoryId?._id === cat._id && p.isFeatured
              ).length;

              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat._id
                      ? 'bg-[#0052CC] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      catFeatCount >= maxPerCategory
                        ? 'bg-rose-500 text-white'
                        : catFeatCount > 0
                        ? 'bg-[#FFB800] text-[#021838]'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {catFeatCount}/{maxPerCategory}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Source Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by Name or Shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0052CC] focus:outline-none"
              />
            </div>

            {/* Source Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold self-stretch sm:self-auto">
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  sourceFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setSourceFilter('admin')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  sourceFilter === 'admin' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Direct</span>
              </button>
              <button
                onClick={() => setSourceFilter('vendor')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  sourceFilter === 'vendor' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Vendor Shops</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-black border-b border-gray-200 text-[11px] tracking-wider">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Origin / Vendor</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Featured Status</th>
                  <th className="p-4 text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Loading products and featured status...</span>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400 space-y-2">
                      <Package className="w-10 h-10 mx-auto text-gray-300" />
                      <p className="font-bold text-gray-700">No products found</p>
                      <p className="text-xs text-gray-400">
                        {searchQuery ? `No match for "${searchQuery}"` : 'No products in this category yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const catFeatCount = products.filter(
                      (p) => p.categoryId?._id === prod.categoryId?._id && p.isFeatured
                    ).length;
                    const isLimitReached = !prod.isFeatured && catFeatCount >= maxPerCategory;
                    const isUpdating = updatingId === prod._id;

                    return (
                      <tr
                        key={prod._id}
                        className={`hover:bg-blue-50/40 transition-colors ${
                          prod.isFeatured ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Details */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl bg-cover bg-center border border-gray-200 shrink-0 bg-gray-100"
                              style={{
                                backgroundImage: `url('${prod.images[0] || '/images/hero_banner.png'}')`,
                              }}
                            />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="inline-block bg-blue-50 text-[#0052CC] px-2.5 py-1 rounded-md text-xs font-bold border border-blue-200">
                            {prod.categoryId?.name || 'Uncategorized'}
                          </span>
                        </td>

                        {/* Origin / Vendor */}
                        <td className="p-4">
                          {prod.source === 'vendor' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-black text-[11px]">
                              <Store className="w-3.5 h-3.5 text-amber-600" />
                              <span>{prod.shopName || 'Shop Partner'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 font-bold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Admin Direct</span>
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="p-4 font-mono font-bold text-gray-900">
                          {formatCurrency(prod.retailPrice)}
                        </td>

                        {/* Featured Status Badge */}
                        <td className="p-4 text-center">
                          {prod.isFeatured ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-400 font-black text-xs shadow-xs animate-pulse">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>FEATURED</span>
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400 font-bold text-[11px]">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Super Admin Action Button */}
                        <td className="p-4 text-right">
                          {prod.isFeatured ? (
                            <button
                              onClick={() => handleToggleFeatured(prod)}
                              disabled={isUpdating}
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              title="Click to remove from Featured"
                            >
                              {isUpdating ? 'Saving...' : '⭐ Featured (Remove)'}
                            </button>
                          ) : isLimitReached ? (
                            <button
                              disabled
                              className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs cursor-not-allowed border border-gray-200"
                              title="Maximum 10 products reached in this category. Unfeature one to add this."
                            >
                              Limit (10/10)
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleFeatured(prod)}
                              disabled={isUpdating}
                              className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003893] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              {isUpdating ? 'Saving...' : '+ Make Featured'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
