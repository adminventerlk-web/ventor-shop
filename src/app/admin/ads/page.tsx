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
  Calendar,
  AlertCircle,
  Inbox,
  Filter,
  Check,
  PhoneCall,
  Mail,
  MapPin,
  MoveUp,
  MoveDown,
  Star,
} from 'lucide-react';
import AdvertisementStatusBadge from '@/components/ads/AdvertisementStatusBadge';

interface IAdItem {
  _id: string;
  requestId?: string;
  title: string;
  businessName: string;
  shopName?: string;
  shopLogo?: string;
  category: string;
  description: string;
  tagline?: string;
  badge?: string;
  highlightStat?: string;
  offerPill?: string;
  rating?: string;
  images: string[];
  featuredImage?: string;
  ctaText: string;
  destinationUrl: string;
  placement: 'HOMEPAGE_FEATURED' | 'DISCOVER_SHOPS' | 'SHOP_PAGE' | 'CATEGORY_PAGE' | 'SPECIAL_OFFERS';
  accentColor: string;
  aspectRatioPreference: 'AUTO' | 'POSTER' | 'LANDSCAPE' | 'SQUARE';
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DRAFT';
  isActive: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface IRequestItem {
  _id: string;
  trackingCode: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  shopLocation: string;
  websiteOrSocial?: string;
  advertisementTitle: string;
  description: string;
  productsToPromote?: string;
  preferredPlacement: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
  logo?: string;
  images: string[];
  destinationUrl?: string;
  status: string;
  adminFeedback?: string;
  createdAt: string;
}

export default function AdminAdsPage() {
  const [activeTab, setActiveTab] = useState<'ADS' | 'REQUESTS'>('ADS');

  // Ads state
  const [ads, setAds] = useState<IAdItem[]>([]);
  const [requests, setRequests] = useState<IRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reqLoading, setReqLoading] = useState(false);
  const [filterPlacement, setFilterPlacement] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Stats
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    pausedAds: 0,
    expiredAds: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });

  // Modal State for Ads (Create / Edit)
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<IAdItem | null>(null);
  const [savingAd, setSavingAd] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Ad Form Fields
  const [adTitle, setAdTitle] = useState('');
  const [adBusinessName, setAdBusinessName] = useState('');
  const [adCategory, setAdCategory] = useState('Groceries & Provisions');
  const [adDescription, setAdDescription] = useState('');
  const [adBadge, setAdBadge] = useState('Official Partner Spotlight');
  const [adHighlightStat, setAdHighlightStat] = useState('50K+ Monthly Shoppers Reached');
  const [adOfferPill, setAdOfferPill] = useState('🔥 15% OFF This Week');
  const [adRating, setAdRating] = useState('4.9 ★ Verified Partner');
  const [adImages, setAdImages] = useState<string[]>([]);
  const [adCtaText, setAdCtaText] = useState('Visit Shop');
  const [adDestinationUrl, setAdDestinationUrl] = useState('/virtual-shops');
  const [adPlacement, setAdPlacement] = useState<any>('HOMEPAGE_FEATURED');
  const [adAccentColor, setAdAccentColor] = useState('#FFB800');
  const [adAspectRatio, setAdAspectRatio] = useState<any>('AUTO');
  const [adStatus, setAdStatus] = useState<any>('ACTIVE');
  const [adDisplayOrder, setAdDisplayOrder] = useState(0);
  const [adStartDate, setAdStartDate] = useState('');
  const [adEndDate, setAdEndDate] = useState('');

  // Request Review / Action Modal
  const [selectedRequest, setSelectedRequest] = useState<IRequestItem | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [publishPlacement, setPublishPlacement] = useState('HOMEPAGE_FEATURED');
  const [actionProcessing, setActionProcessing] = useState(false);

  // Client-side canvas compression for high-res images
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> => {
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
      const query = new URLSearchParams();
      if (filterPlacement !== 'ALL') query.append('placement', filterPlacement);
      if (filterStatus !== 'ALL') query.append('status', filterStatus);

      const res = await fetch(`/api/admin/ads?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setReqLoading(true);
    try {
      const res = await fetch('/api/admin/ads/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchRequests();
  }, [filterPlacement, filterStatus]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingAd(null);
    setAdTitle('');
    setAdBusinessName('');
    setAdCategory('Groceries & Provisions');
    setAdDescription('');
    setAdBadge('Official Partner Spotlight');
    setAdHighlightStat('50K+ Monthly Shoppers Reached');
    setAdOfferPill('🔥 Special Promotion');
    setAdRating('4.9 ★ Verified Partner');
    setAdImages(['/images/hero_banner.png']);
    setAdCtaText('Visit Shop');
    setAdDestinationUrl('/virtual-shops');
    setAdPlacement('HOMEPAGE_FEATURED');
    setAdAccentColor('#FFB800');
    setAdAspectRatio('AUTO');
    setAdStatus('ACTIVE');
    setAdDisplayOrder(ads.length);
    setAdStartDate('');
    setAdEndDate('');
    setIsAdModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ad: IAdItem) => {
    setEditingAd(ad);
    setAdTitle(ad.title);
    setAdBusinessName(ad.businessName || ad.shopName || '');
    setAdCategory(ad.category || 'General Store');
    setAdDescription(ad.description || ad.tagline || '');
    setAdBadge(ad.badge || 'Official Partner Spotlight');
    setAdHighlightStat(ad.highlightStat || '50K+ Monthly Shoppers Reached');
    setAdOfferPill(ad.offerPill || '🔥 Special Promotion');
    setAdRating(ad.rating || '4.9 ★ Verified Partner');
    setAdImages(ad.images && ad.images.length > 0 ? ad.images : ['/images/hero_banner.png']);
    setAdCtaText(ad.ctaText || 'Visit Shop');
    setAdDestinationUrl(ad.destinationUrl || '/virtual-shops');
    setAdPlacement(ad.placement || 'HOMEPAGE_FEATURED');
    setAdAccentColor(ad.accentColor || '#FFB800');
    setAdAspectRatio(ad.aspectRatioPreference || 'AUTO');
    setAdStatus(ad.status || 'ACTIVE');
    setAdDisplayOrder(ad.displayOrder || 0);
    setAdStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '');
    setAdEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '');
    setIsAdModalOpen(true);
  };

  // Multi-image upload from device with Canvas compression
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const promises = Array.from(files).map((f) => compressImage(f));
      const compressedList = await Promise.all(promises);

      setAdImages((prev) => {
        // If placeholder only, replace it
        if (prev.length === 1 && prev[0] === '/images/hero_banner.png') {
          return compressedList;
        }
        return [...prev, ...compressedList];
      });
    } catch (err) {
      alert('Failed to process device images.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  // Image Management: Move Image Up
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setAdImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Image Management: Move Image Down
  const moveImageDown = (index: number) => {
    if (index === adImages.length - 1) return;
    setAdImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Image Management: Delete individual image
  const removeIndividualImage = (index: number) => {
    if (adImages.length <= 1) {
      alert('An advertisement must contain at least 1 image.');
      return;
    }
    setAdImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save / Update Ad
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adBusinessName.trim() || !adDescription.trim()) {
      alert('Title, Business Name, and Description are required.');
      return;
    }

    if (adImages.length === 0) {
      alert('Please upload at least 1 promotional image.');
      return;
    }

    setSavingAd(true);
    try {
      const payload = {
        title: adTitle.trim(),
        businessName: adBusinessName.trim(),
        category: adCategory.trim(),
        description: adDescription.trim(),
        badge: adBadge.trim(),
        highlightStat: adHighlightStat.trim(),
        offerPill: adOfferPill.trim(),
        rating: adRating.trim(),
        images: adImages,
        featuredImage: adImages[0],
        ctaText: adCtaText.trim(),
        destinationUrl: adDestinationUrl.trim(),
        placement: adPlacement,
        accentColor: adAccentColor,
        aspectRatioPreference: adAspectRatio,
        status: adStatus,
        displayOrder: Number(adDisplayOrder) || 0,
        startDate: adStartDate || undefined,
        endDate: adEndDate || undefined,
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
          message: editingAd ? 'Advertisement updated successfully!' : 'New advertisement published successfully!',
        });
        setIsAdModalOpen(false);
        await fetchAds();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save ad.');
      }
    } catch (err) {
      alert('Error saving advertisement.');
    } finally {
      setSavingAd(false);
    }
  };

  // Toggle Ad Active/Paused
  const handleToggleAdStatus = async (ad: IAdItem) => {
    const nextStatus = ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad._id, status: nextStatus }),
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((item) => (item._id === ad._id ? { ...item, status: nextStatus, isActive: nextStatus === 'ACTIVE' } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Ad
  const handleDeleteAd = async (id: string, title: string) => {
    if (!confirm(`Delete advertisement "${title}" permanently?`)) return;
    try {
      const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a._id !== id));
        setNotification({ type: 'success', message: 'Advertisement deleted.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Approve and Publish Request
  const handleApproveAndPublishRequest = async () => {
    if (!selectedRequest) return;
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/ads/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          action: 'APPROVE_AND_PUBLISH',
          placement: publishPlacement,
          adminFeedback: 'Approved by Super Admin. Promotion is now live on VentorShop!',
        }),
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          message: `Request for "${selectedRequest.businessName}" approved and published to ${publishPlacement}!`,
        });
        setReviewModalOpen(false);
        await fetchRequests();
        await fetchAds();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to approve request.');
      }
    } catch (err) {
      alert('Network error approving request.');
    } finally {
      setActionProcessing(false);
    }
  };

  // Reject Request
  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/ads/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          status: 'REJECTED',
          adminFeedback: rejectionReason || 'Application does not meet commercial listing requirements.',
        }),
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          message: `Request for "${selectedRequest.businessName}" marked as Rejected.`,
        });
        setReviewModalOpen(false);
        setRejectionReason('');
        await fetchRequests();
      }
    } catch (err) {
      alert('Error updating request status.');
    } finally {
      setActionProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER CARD ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-400/40">
            <Megaphone className="w-6 h-6 text-amber-600" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#021838]">
                Advertisement & Sponsorship Management
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                PRO MARKETPLACE
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Review collaborator advertisement requests, manage live billboards, configure multi-image placements, and control scheduling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchAds();
              fetchRequests();
            }}
            className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading || reqLoading ? 'animate-spin' : ''}`} />
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

      {/* ── ANALYTICS CARDS (SECTION 5.A) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Ads</p>
          <p className="text-2xl font-black text-[#021838]">{stats.totalAds}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/20">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live & Active</p>
          <p className="text-2xl font-black text-emerald-700">{stats.activeAds}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/20">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Requests</p>
          <p className="text-2xl font-black text-amber-700">{stats.pendingRequests}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-black text-blue-700">{stats.totalRequests}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paused Ads</p>
          <p className="text-2xl font-black text-gray-700">{stats.pausedAds}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expired Ads</p>
          <p className="text-2xl font-black text-gray-500">{stats.expiredAds}</p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── NAVIGATION TABS: LIVE ADS vs COLLABORATOR REQUESTS ── */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ADS')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ADS'
                ? 'bg-[#021838] text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            Live Advertisements ({ads.length})
          </button>
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'REQUESTS'
                ? 'bg-[#021838] text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            <span>Collaborator Requests ({requests.length})</span>
            {stats.pendingRequests > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#021838] font-black text-[10px]">
                {stats.pendingRequests} New
              </span>
            )}
          </button>
        </div>

        {activeTab === 'ADS' && (
          <div className="flex items-center gap-2">
            <select
              value={filterPlacement}
              onChange={(e) => setFilterPlacement(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 outline-none"
            >
              <option value="ALL">All Placements</option>
              <option value="HOMEPAGE_FEATURED">Homepage Hero</option>
              <option value="DISCOVER_SHOPS">Discover Shops</option>
              <option value="SPECIAL_OFFERS">Special Offers</option>
              <option value="CATEGORY_PAGE">Category Pages</option>
              <option value="SHOP_PAGE">Shop Pages</option>
            </select>
          </div>
        )}
      </div>

      {/* ── TAB 1: LIVE ADVERTISEMENTS LIST ── */}
      {activeTab === 'ADS' && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Advertisements...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Megaphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#021838]">No Advertisements in this Placement</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  Create a custom advertisement or approve a collaborator request to publish live promotions.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="px-5 py-2.5 bg-[#0052CC] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
              >
                + Create Advertisement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad) => {
                const imgCount = ad.images ? ad.images.length : 0;
                return (
                  <div
                    key={ad._id}
                    className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
                      ad.status === 'ACTIVE' ? 'border-blue-200 hover:border-blue-400' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Top Preview Card */}
                      <div className="relative h-48 bg-gray-950 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.images?.[0] || '/images/hero_banner.png'}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md text-white border"
                            style={{
                              backgroundColor: `${ad.accentColor || '#FFB800'}40`,
                              borderColor: ad.accentColor || '#FFB800',
                            }}
                          >
                            {ad.placement}
                          </span>

                          <button
                            onClick={() => handleToggleAdStatus(ad)}
                            className="cursor-pointer"
                          >
                            <AdvertisementStatusBadge status={ad.status} />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="text-[10px] font-black uppercase text-[#FFB800] tracking-wider">
                            {ad.businessName || ad.shopName} • {ad.category}
                          </p>
                          <h3 className="text-base font-black truncate">{ad.title}</h3>
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                          {ad.description || ad.tagline}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-[#0052CC]" />
                            <span>{ad.highlightStat || '50K+ Monthly Shoppers'}</span>
                          </span>

                          <span className="text-[11px] font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                            {imgCount} Image{imgCount > 1 ? 's' : ''} (Auto {imgCount}-Layout)
                          </span>

                          {ad.offerPill && (
                            <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              {ad.offerPill}
                            </span>
                          )}

                          <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Sort: {ad.displayOrder}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50/50">
                      <Link
                        href={ad.destinationUrl || '/virtual-shops'}
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
                          onClick={() => handleDeleteAd(ad._id, ad.title)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Ad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: COLLABORATOR AD REQUESTS LIST (SECTION 5.B) ── */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          {reqLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <Inbox className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-black text-[#021838]">No Advertisement Requests Received Yet</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Collaborators can submit advertisement requests at{' '}
                <Link href="/advertise-with-us" className="text-[#0052CC] font-bold underline" target="_blank">
                  /advertise-with-us
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                    <div className="flex items-center gap-3">
                      {req.logo ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={req.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold text-sm shrink-0">
                          <Store className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-gray-900">{req.businessName}</h3>
                          <AdvertisementStatusBadge status={req.status} />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          Ref: <strong className="font-mono text-[#0052CC]">{req.trackingCode}</strong> • Category: {req.category} • Location: {req.shopLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setPublishPlacement(req.preferredPlacement || 'HOMEPAGE_FEATURED');
                          setReviewModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      >
                        Review & Publish
                      </button>
                    </div>
                  </div>

                  {/* Pitch & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-8 space-y-2">
                      <p className="font-black text-sm text-[#0052CC]">{req.advertisementTitle}</p>
                      <p className="text-gray-700 leading-relaxed font-medium">{req.description}</p>
                      {req.productsToPromote && (
                        <p className="text-gray-500">
                          <strong>Products to Promote:</strong> {req.productsToPromote}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-4 bg-gray-50 p-3 rounded-xl space-y-1.5 border border-gray-200">
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-gray-400" />
                        <span>Owner: <strong>{req.ownerName}</strong></span>
                      </p>
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Phone: <strong>{req.phone}</strong></span>
                      </p>
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate">Email: {req.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Submitted Images Strip */}
                  {req.images && req.images.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-gray-500 mb-1.5">
                        Submitted Media ({req.images.length} Photos):
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {req.images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-20 h-16 rounded-xl overflow-hidden border border-gray-300 shrink-0 bg-black"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE / EDIT AD MODAL (WITH DYNAMIC IMAGE MANAGEMENT) ── */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Fixed Header */}
            <div className="p-5 border-b border-gray-200 shrink-0 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-50 text-[#0052CC] rounded-xl border border-blue-100">
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-[#021838]">
                    {editingAd ? 'Edit Commercial Advertisement' : 'Create New Advertisement'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload multiple device images, configure dynamic layout, and select placement.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="admin-ad-form" onSubmit={handleSaveAd} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    Advertisement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="e.g. Ceylon Organic Spice Merchants"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    Shop / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adBusinessName}
                    onChange={(e) => setAdBusinessName(e.target.value)}
                    placeholder="e.g. Ruhunu Organic Spice Co."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Placement Placement</label>
                  <select
                    value={adPlacement}
                    onChange={(e) => setAdPlacement(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                  >
                    <option value="HOMEPAGE_FEATURED">Homepage Featured Billboard</option>
                    <option value="DISCOVER_SHOPS">Discover Shops Section</option>
                    <option value="SPECIAL_OFFERS">Special Offers Section</option>
                    <option value="CATEGORY_PAGE">Category Pages</option>
                    <option value="SHOP_PAGE">Shop Storefront Pages</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Category</label>
                  <input
                    type="text"
                    value={adCategory}
                    onChange={(e) => setAdCategory(e.target.value)}
                    placeholder="e.g. Ceylon Spices & Agri Export"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Aspect Ratio Mode</label>
                  <select
                    value={adAspectRatio}
                    onChange={(e) => setAdAspectRatio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                  >
                    <option value="AUTO">Auto Dynamic Aspect Ratio</option>
                    <option value="POSTER">Poster / Flyer (No Text Cropping)</option>
                    <option value="LANDSCAPE">Landscape (16:9)</option>
                    <option value="SQUARE">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-gray-800 mb-1">
                  Description / Tagline <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="e.g. Export-grade Alba Ceylon Cinnamon & Cardamom delivered fresh across the island and worldwide."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none focus:border-[#0052CC]"
                />
              </div>

              {/* DYNAMIC IMAGE MANAGEMENT SECTION (SECTION 5.D) */}
              <div className="border-2 border-dashed border-[#0052CC]/40 rounded-2xl p-4 bg-blue-50/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-black text-sm text-[#021838] flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[#0052CC]" />
                      <span>Promotional Images ({adImages.length}) — Dynamic Layout Engine</span>
                    </label>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Layout automatically adapts: 1 Image (Banner) • 2 Images (Split) • 3 Images (3-Card) • 4 Images (2x2 Grid) • 5+ Images (Carousel).
                    </p>
                  </div>

                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImages ? 'Compressing...' : 'Upload Photos'}</span>
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

                {/* Uploaded Images List with Reorder Up / Down & Delete Controls */}
                {adImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {adImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl border border-gray-300 bg-white shadow-xs gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-14 h-12 rounded-lg overflow-hidden border border-gray-200 bg-black shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-black text-gray-900 block">
                              Photo #{idx + 1} {idx === 0 ? '(Hero / Featured)' : ''}
                            </span>
                            <span className="text-[10px] text-gray-400">Position {idx + 1} of {adImages.length}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveImageUp(idx)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown(idx)}
                            disabled={idx === adImages.length - 1}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeIndividualImage(idx)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Offer Pill, Highlight & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Special Offer Pill</label>
                  <input
                    type="text"
                    value={adOfferPill}
                    onChange={(e) => setAdOfferPill(e.target.value)}
                    placeholder="e.g. 🔥 20% OFF On Spices"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Highlight Bullet</label>
                  <input
                    type="text"
                    value={adHighlightStat}
                    onChange={(e) => setAdHighlightStat(e.target.value)}
                    placeholder="e.g. 50K+ Monthly Shoppers"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Trust Rating</label>
                  <input
                    type="text"
                    value={adRating}
                    onChange={(e) => setAdRating(e.target.value)}
                    placeholder="e.g. 4.9 ★ Verified Partner"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  />
                </div>
              </div>

              {/* CTA & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">CTA Button Text</label>
                  <select
                    value={adCtaText}
                    onChange={(e) => setAdCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  >
                    <option value="Visit Shop">Visit Shop</option>
                    <option value="Explore Collection">Explore Collection</option>
                    <option value="View Offers">View Offers</option>
                    <option value="Shop Now">Shop Now</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Destination Target Link</label>
                  <input
                    type="text"
                    value={adDestinationUrl}
                    onChange={(e) => setAdDestinationUrl(e.target.value)}
                    placeholder="e.g. /shops/ruhunu or /virtual-shops"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Scheduling: Start & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-gray-800 mb-1">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={adStartDate}
                    onChange={(e) => setAdStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">End Date (Auto-Expires)</label>
                  <input
                    type="date"
                    value={adEndDate}
                    onChange={(e) => setAdEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black text-gray-800 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={adDisplayOrder}
                    onChange={(e) => setAdDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 outline-none"
                  />
                </div>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdModalOpen(false)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="admin-ad-form"
                disabled={savingAd || uploadingImages}
                className="px-6 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {savingAd ? 'Saving...' : editingAd ? 'Update Advertisement' : 'Publish Advertisement Live'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEW & PUBLISH REQUEST MODAL (SECTION 5.B) ── */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 shrink-0 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-[#0052CC] rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-[#021838]">Review Collaborator Request</h3>
                  <p className="text-xs text-gray-500">Ref: {selectedRequest.trackingCode} • {selectedRequest.businessName}</p>
                </div>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs font-sans">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <p><strong>Business Name:</strong> {selectedRequest.businessName}</p>
                <p><strong>Owner / Contact:</strong> {selectedRequest.ownerName} ({selectedRequest.phone} • {selectedRequest.email})</p>
                <p><strong>Title:</strong> {selectedRequest.advertisementTitle}</p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
                <p><strong>Requested Placement:</strong> {selectedRequest.preferredPlacement}</p>
              </div>

              <div>
                <label className="block font-black text-gray-800 mb-1">
                  Assign Placement for Live Publishing
                </label>
                <select
                  value={publishPlacement}
                  onChange={(e) => setPublishPlacement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                >
                  <option value="HOMEPAGE_FEATURED">Homepage Featured Billboard (Hero)</option>
                  <option value="DISCOVER_SHOPS">Discover Shops & Marketplace Section</option>
                  <option value="SPECIAL_OFFERS">Special Offers Section</option>
                  <option value="CATEGORY_PAGE">Category Promotion</option>
                  <option value="SHOP_PAGE">Store Page Showcase</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-gray-800 mb-1">
                  Rejection Reason / Admin Feedback (If Rejecting)
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide feedback to the collaborator if rejecting or asking for revisions..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectRequest}
                disabled={actionProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Reject Request
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveAndPublishRequest}
                  disabled={actionProcessing}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {actionProcessing ? 'Publishing...' : 'Approve & Publish Live'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
