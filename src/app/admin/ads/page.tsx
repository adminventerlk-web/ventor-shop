'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Store,
  ExternalLink,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  X,
  Layers,
  RefreshCw,
  UploadCloud,
  Award,
} from 'lucide-react';

interface IAdItem {
  _id: string;
  title: string;
  shopName: string;
  shopCategory: string;
  tagline: string;
  badge: string;
  highlightStat: string;
  images: string[];
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  offerPill?: string;
  rating?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<IAdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<IAdItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('Partner Merchant');
  const [tagline, setTagline] = useState('');
  const [badge, setBadge] = useState('Official Partner Spotlight');
  const [highlightStat, setHighlightStat] = useState('50K+ Monthly Shoppers');
  const [offerPill, setOfferPill] = useState('🔥 15% OFF On First Order');
  const [rating, setRating] = useState('4.9 ★ Verified Partner');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Visit Partner Store');
  const [ctaLink, setCtaLink] = useState('/virtual-shops');
  const [accentColor, setAccentColor] = useState('#FFB800');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Compress device images into clean, lightweight data URLs
  const compressImageFile = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (err) {
      console.error('Failed to load ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const openCreateModal = () => {
    setEditingAd(null);
    setTitle('');
    setShopName('');
    setShopCategory('Groceries & Provisions');
    setTagline('');
    setBadge('Official Partner Spotlight');
    setHighlightStat('50K+ Monthly Shoppers Reached');
    setOfferPill('🔥 Special Partner Deal');
    setRating('4.9 ★ Verified Partner');
    // Default image if none provided yet
    setImages(['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80']);
    setNewImageUrl('');
    setCtaText('Visit Partner Store');
    setCtaLink('/virtual-shops');
    setAccentColor('#FFB800');
    setIsActive(true);
    setDisplayOrder(ads.length);
    setIsModalOpen(true);
  };

  const openEditModal = (ad: IAdItem) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setShopName(ad.shopName);
    setShopCategory(ad.shopCategory || 'Partner Merchant');
    setTagline(ad.tagline);
    setBadge(ad.badge || 'Official Partner Spotlight');
    setHighlightStat(ad.highlightStat || 'Featured Merchant');
    setOfferPill(ad.offerPill || '🔥 Verified Partner Store');
    setRating(ad.rating || '4.9 ★ Verified Partner');
    setImages(
      ad.images && ad.images.length > 0
        ? ad.images
        : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80']
    );
    setNewImageUrl('');
    setCtaText(ad.ctaText || 'Visit Partner Store');
    setCtaLink(ad.ctaLink || '/virtual-shops');
    setAccentColor(ad.accentColor || '#FFB800');
    setIsActive(ad.isActive);
    setDisplayOrder(ad.displayOrder || 0);
    setIsModalOpen(true);
  };

  // Device file upload with multi-select and canvas compression
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const promises = Array.from(files).map((file) => compressImageFile(file));
      const compressedList = await Promise.all(promises);

      setImages((prev) => {
        // If previous only contained the placeholder unsplash photo, replace it
        const hasPlaceholder = prev.some((url) => url.includes('unsplash.com/photo-1596040033229'));
        if (hasPlaceholder && prev.length === 1) {
          return compressedList;
        }
        return [...prev, ...compressedList];
      });
    } catch (err) {
      console.error('Error processing device images:', err);
      alert('Failed to process image files from device.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      alert('At least 1 image is required for the ad billboard.');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shopName.trim() || !tagline.trim()) {
      alert('Please fill in Ad Title, Shop Name, and Tagline.');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image from your device.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        shopName: shopName.trim(),
        shopCategory: shopCategory.trim(),
        tagline: tagline.trim(),
        badge: badge.trim(),
        highlightStat: highlightStat.trim(),
        offerPill: offerPill.trim(),
        rating: rating.trim(),
        images,
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        accentColor,
        isActive,
        displayOrder: Number(displayOrder) || 0,
      };

      let res;
      if (editingAd) {
        res = await fetch('/api/admin/ads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adId: editingAd._id, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setNotification({
          type: 'success',
          message: editingAd ? 'Ad billboard updated successfully!' : 'New Partner Ad published successfully!',
        });
        setIsModalOpen(false);
        await fetchAds();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save ad.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error saving ad.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (ad: IAdItem) => {
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad._id, isActive: !ad.isActive }),
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((item) => (item._id === ad._id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string, adTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${adTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a._id !== id));
        setNotification({ type: 'success', message: 'Ad deleted successfully.' });
      }
    } catch (err) {
      console.error('Failed to delete ad:', err);
    }
  };

  const activeCount = ads.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-400/40">
            <Megaphone className="w-6 h-6 text-amber-600" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#021838]">
                Storefront Partner Ads Manager
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                CRUD Panel
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage multi-image partner billboards, shop collaborations, and live promotions displayed on the homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAds}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="Refresh ads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ad</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Ads</p>
            <p className="text-2xl font-black text-[#021838] mt-1">{ads.length}</p>
          </div>
          <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-bold uppercase">Live on Homepage</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Eye className="w-5 h-5" />
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Inactive / Drafts</p>
            <p className="text-2xl font-black text-gray-600 mt-1">{ads.length - activeCount}</p>
          </div>
          <span className="p-2.5 bg-gray-50 text-gray-400 rounded-xl">
            <EyeOff className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ads List Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Ad Campaigns...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Megaphone className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#021838]">No Custom Ads Created Yet</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Homepage is currently showing default verified partner spotlights. Click &quot;Create New Ad&quot; below to upload shop photos from your device.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Ad</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
                ad.isActive ? 'border-blue-200 hover:border-blue-400' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Ad Card Top Preview */}
              <div>
                <div className="relative h-48 bg-gray-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md text-white border"
                      style={{
                        backgroundColor: `${ad.accentColor || '#FFB800'}40`,
                        borderColor: ad.accentColor || '#FFB800',
                      }}
                    >
                      {ad.badge}
                    </span>

                    <button
                      onClick={() => handleToggleActive(ad)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        ad.isActive
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-gray-800/80 text-gray-300'
                      }`}
                    >
                      {ad.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{ad.isActive ? 'Live' : 'Paused'}</span>
                    </button>
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] font-black uppercase text-[#FFB800] tracking-wider">
                      {ad.shopName} • {ad.shopCategory}
                    </p>
                    <h3 className="text-base font-black truncate">{ad.title}</h3>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                    {ad.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#0052CC]" />
                      <span>{ad.highlightStat}</span>
                    </span>
                    <span className="text-[11px] font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                      {ad.images?.length || 1} Photo{ad.images?.length > 1 ? 's' : ''} (Multi-Animation)
                    </span>
                    {ad.offerPill && (
                      <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {ad.offerPill}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Order: {ad.displayOrder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50/50">
                <Link
                  href={ad.ctaLink || '/virtual-shops'}
                  target="_blank"
                  className="text-xs font-bold text-[#0052CC] hover:underline flex items-center gap-1"
                >
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(ad)}
                    className="p-2 text-gray-700 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Ad"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id, ad.title)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Ad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL (RESPONSIVE WITH FIXED HEADER & FOOTER) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* 1. Modal Fixed Header */}
            <div className="p-5 border-b border-gray-200 shrink-0 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-50 text-[#0052CC] rounded-xl border border-blue-100">
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-[#021838]">
                    {editingAd ? 'Edit Partner Ad Campaign' : 'Create New Partner Ad'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Upload photos directly from your phone/PC & publish to the homepage billboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Form Body */}
            <form id="ad-campaign-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs font-sans">
              {/* Headline & Shop Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    Headline / Ad Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ceylon Organic Spice Merchants"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    Shop / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Ruhunu Organic Spice Co."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Shop Category</label>
                  <input
                    type="text"
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    placeholder="e.g. Ceylon Spices & Agri Export"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Official Partner Spotlight"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
              </div>

              {/* Tagline / Copy */}
              <div>
                <label className="block font-black text-gray-800 mb-1">
                  Tagline / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Export-grade Alba Ceylon Cinnamon & Cardamom delivered fresh across the island and worldwide."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                />
              </div>

              {/* Offer Pill & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Special Offer Pill (Optional)</label>
                  <input
                    type="text"
                    value={offerPill}
                    onChange={(e) => setOfferPill(e.target.value)}
                    placeholder="e.g. 🔥 15% OFF On Bulk Spices"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Trust Rating / Stat</label>
                  <input
                    type="text"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 4.9 ★ (1,840+ Orders)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
              </div>

              {/* ── DEVICE IMAGE UPLOAD SECTION (HERO FEATURE) ── */}
              <div className="border-2 border-dashed border-[#0052CC]/40 rounded-2xl p-4 bg-blue-50/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-black text-sm text-[#021838] flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[#0052CC]" />
                      <span>Upload Photos From Your Device (Phone / PC)</span>
                    </label>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Select 1 to 4 photos. Multiple images will automatically crossfade and animate on the homepage!
                    </p>
                  </div>

                  {/* Device Upload Trigger Button */}
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImages ? 'Compressing...' : 'Choose Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleDeviceImageUpload}
                      disabled={uploadingImages}
                    />
                  </label>
                </div>

                {/* Uploading indicator */}
                {uploadingImages && (
                  <div className="p-3 bg-blue-100 rounded-xl text-center text-xs font-bold text-blue-900 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                    <span>Compressing device photos for high-speed loading...</span>
                  </div>
                )}

                {/* Previews Grid */}
                {images.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-gray-700">
                      Uploaded Photos ({images.length}) — Click (X) to remove:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border-2 border-gray-300 h-24 group bg-black shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Photo Number Pill */}
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-black text-white">
                            #{idx + 1} {idx === 0 ? '(Hero)' : ''}
                          </span>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback Image URL Input */}
                <div className="pt-2 border-t border-blue-100 flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste an image URL (Unsplash / CDN)..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-1.5 bg-gray-800 hover:bg-black text-white rounded-lg font-bold cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Accent Theme Color & Highlight Stat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Highlight Bullet</label>
                  <input
                    type="text"
                    value={highlightStat}
                    onChange={(e) => setHighlightStat(e.target.value)}
                    placeholder="e.g. 50K+ Monthly Shoppers Reached"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Accent Theme Color</label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-9 p-0.5 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      {[
                        { color: '#FFB800', label: 'Gold' },
                        { color: '#10B981', label: 'Emerald' },
                        { color: '#38BDF8', label: 'Sky' },
                        { color: '#0052CC', label: 'Navy' },
                        { color: '#F43F5E', label: 'Rose' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setAccentColor(c.color)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            accentColor === c.color ? 'scale-125 ring-2 ring-[#0052CC]' : 'border-gray-300 hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Text & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Visit Partner Store"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Button Target Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="e.g. /shops/ruhunu or /virtual-shops"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC] focus:bg-white"
                  />
                </div>
              </div>

              {/* Display Order & Active Live Toggle */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0052CC] focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-black text-gray-800">Publish Live on Homepage</span>
                  </label>
                </div>
              </div>
            </form>

            {/* 3. Modal Fixed Footer (ALWAYS visible at the bottom) */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ad-campaign-form"
                disabled={saving || uploadingImages}
                className="px-6 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingAd ? 'Update Ad Campaign' : 'Publish Ad Live'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
