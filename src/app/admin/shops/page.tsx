'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Tag,
  AlertCircle,
  RefreshCw,
  Building2,
  Calendar,
} from 'lucide-react';

interface IAdminShop {
  _id: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  shopName: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  address?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  rating?: number;
  totalProducts?: number;
  createdAt: string;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<IAdminShop[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalShop, setRejectModalShop] = useState<IAdminShop | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shops');
      if (res.ok) {
        const data = await res.json();
        setShops(data.shops || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load shops:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleAction = async (shopId: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    setActionLoading(shopId);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/shops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, action, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg({
          type: 'success',
          text: action === 'APPROVE' ? 'Shop approved successfully! Vendor notified via email.' : 'Shop application rejected. Vendor notified.',
        });
        setRejectModalShop(null);
        setRejectionReason('');
        await fetchShops();
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to update shop status.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShops = shops.filter((s) => {
    const matchesTab = activeTab === 'ALL' || s.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.shopName.toLowerCase().includes(q) ||
      s.ownerName.toLowerCase().includes(q) ||
      s.ownerEmail.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#010e24] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0052CC]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#0052CC]/20 border border-[#0052CC] text-[#FFB800] rounded-xl">
                <Store className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Shop Approvals & Vendor Management
              </h1>
            </div>
            <p className="text-xs text-blue-200/70 mt-1">
              Super Admin verification portal. Only approved shops can list products and sell on the marketplace.
            </p>
          </div>

          <button
            onClick={fetchShops}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-[#021A3E] hover:bg-[#0052CC] border border-[#0052CC]/40 rounded-xl text-xs font-bold transition-all text-blue-100 hover:text-white cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/15 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Total Shops</span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.total}</p>
          </div>

          <div
            onClick={() => setActiveTab('PENDING')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              activeTab === 'PENDING'
                ? 'bg-[#FFB800]/15 border-[#FFB800] ring-1 ring-[#FFB800]/50'
                : 'bg-[#021838] border-[#FFB800]/40 hover:border-[#FFB800]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFB800]">Pending Review</span>
              {stats.pending > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#FFB800] mt-1">{stats.pending}</p>
          </div>

          <div
            onClick={() => setActiveTab('APPROVED')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/50'
                : 'bg-[#021838] border-emerald-500/40 hover:border-emerald-500'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Approved & Live</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{stats.approved}</p>
          </div>

          <div
            onClick={() => setActiveTab('REJECTED')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              activeTab === 'REJECTED'
                ? 'bg-red-500/15 border-red-500 ring-1 ring-red-500/50'
                : 'bg-[#021838] border-red-500/40 hover:border-red-500'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">Rejected</span>
            <p className="text-2xl sm:text-3xl font-black text-red-400 mt-1">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#021838] border border-[#0052CC]/30 rounded-xl overflow-x-auto">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#0052CC] text-white shadow-xs'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'ALL' && `All (${stats.total})`}
                {tab === 'PENDING' && `Pending (${stats.pending})`}
                {tab === 'APPROVED' && `Approved (${stats.approved})`}
                {tab === 'REJECTED' && `Rejected (${stats.rejected})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" />
            <input
              type="text"
              placeholder="Search shops by name, city, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#021838] border border-[#0052CC]/30 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>

        {/* Shops List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-blue-200/70 font-semibold">Loading shops from marketplace registry...</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="bg-[#021838] border border-[#0052CC]/20 rounded-2xl p-12 text-center">
            <Store className="w-12 h-12 text-blue-400/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No shops found</h3>
            <p className="text-xs text-blue-200/60 mt-1 max-w-sm mx-auto">
              {activeTab === 'PENDING'
                ? 'Great! There are no shop registrations currently pending review.'
                : 'No shops match your current filter or search query.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShops.map((shop) => {
              const isPending = shop.status === 'PENDING';
              const isApproved = shop.status === 'APPROVED';
              const isRejected = shop.status === 'REJECTED';
              const isActionProcessing = actionLoading === shop._id;

              return (
                <div
                  key={shop._id}
                  className={`bg-[#021838] border rounded-2xl p-5 sm:p-6 transition-all ${
                    isPending
                      ? 'border-[#FFB800]/50 hover:border-[#FFB800] bg-gradient-to-r from-[#021838] to-[#042456]'
                      : isApproved
                      ? 'border-emerald-500/30 hover:border-emerald-500/60'
                      : 'border-red-500/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Shop Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-white">{shop.shopName}</h2>
                        
                        {/* Status Badge */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40">
                            <Clock className="w-3 h-3" />
                            Pending Super Admin Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved & Verified
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0052CC]/30 text-blue-200 border border-[#0052CC]/40">
                          <Tag className="w-3 h-3" />
                          {shop.category}
                        </span>
                      </div>

                      <p className="text-xs text-blue-100/90 leading-relaxed max-w-3xl">
                        {shop.description}
                      </p>

                      {/* Owner & Location Details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[11px] text-blue-200/80">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <strong>Owner:</strong> {shop.ownerName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          <a href={`mailto:${shop.ownerEmail}`} className="hover:underline text-blue-300">
                            {shop.ownerEmail}
                          </a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                          <a href={`tel:${shop.ownerPhone}`} className="hover:underline font-bold text-[#FFB800]">
                            {shop.ownerPhone}
                          </a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {shop.city} {shop.address ? `• ${shop.address}` : ''}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Applied: {new Date(shop.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Rejection reason if present */}
                      {isRejected && shop.rejectionReason && (
                        <div className="mt-2 text-xs bg-red-950/40 border border-red-800/60 rounded-xl p-2.5 text-red-200">
                          <strong className="text-red-400">Rejection Reason:</strong> {shop.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-blue-900/40">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleAction(shop._id, 'APPROVE')}
                            disabled={isActionProcessing}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isActionProcessing ? 'Approving...' : 'Approve Store'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setRejectModalShop(shop);
                              setRejectionReason('');
                            }}
                            disabled={isActionProcessing}
                            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 disabled:bg-gray-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <>
                          <Link
                            href={`/shops/${shop.slug}`}
                            target="_blank"
                            className="px-3.5 py-2 bg-[#0052CC] hover:bg-[#003893] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Store Page</span>
                          </Link>

                          <button
                            onClick={() => {
                              setRejectModalShop(shop);
                              setRejectionReason('Store deactivated by administrator.');
                            }}
                            disabled={isActionProcessing}
                            className="px-3 py-1.5 text-xs text-red-300 hover:text-red-100 hover:underline cursor-pointer"
                          >
                            Revoke / Deactivate
                          </button>
                        </>
                      )}

                      {isRejected && (
                        <button
                          onClick={() => handleAction(shop._id, 'APPROVE')}
                          disabled={isActionProcessing}
                          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-Approve Shop</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rejection Modal */}
        {rejectModalShop && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#021838] border border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-black text-base text-white">
                  Reject Shop Application: {rejectModalShop.shopName}
                </h3>
              </div>

              <p className="text-xs text-blue-200/80 leading-relaxed">
                Provide a reason for rejecting this shop. An email notification will be sent automatically to{' '}
                <strong className="text-white">{rejectModalShop.ownerEmail}</strong>.
              </p>

              <div>
                <label className="text-[11px] font-bold text-blue-200 block mb-1">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Incomplete business verification, outside supported shipping area..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/30 outline-none focus:border-red-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalShop(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(rejectModalShop._id, 'REJECT', rejectionReason)}
                  disabled={actionLoading === rejectModalShop._id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white cursor-pointer shadow-lg"
                >
                  {actionLoading === rejectModalShop._id ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

