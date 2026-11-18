'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  Plus,
  RefreshCw,
  X,
  Send,
  AlertCircle,
  GraduationCap,
  Sprout,
  Stethoscope,
  Trash2,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IRequest {
  _id: string;
  requestId: string;
  initiativeId: string;
  initiativeTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  nicOrId: string;
  city: string;
  province?: string;
  requestedAmount: number;
  reason: string;
  supportingInfo?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

interface IInitiative {
  _id: string;
  title: string;
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY';
  allocatedAmount: number;
  disbursedAmount: number;
  maxPerApplicant: number;
  description: string;
  eligibility: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  badge?: string;
  applicationCount?: number;
}

export default function AdminDonationsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'initiatives'>('requests');
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [initiatives, setInitiatives] = useState<IInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Initiative Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY'>('COMMUNITY');
  const [newAllocated, setNewAllocated] = useState('');
  const [newMaxPerPerson, setNewMaxPerPerson] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEligibility, setNewEligibility] = useState('');
  const [newBadge, setNewBadge] = useState('Platform Revenue Share');
  const [savingInit, setSavingInit] = useState(false);

  // Status update
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, initRes] = await Promise.all([
        fetch(`/api/donations/requests?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`),
        fetch('/api/donations/initiatives'),
      ]);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests || []);
      }
      if (initRes.ok) {
        const initData = await initRes.json();
        setInitiatives(initData.initiatives || []);
      }
    } catch (err) {
      console.error('Error fetching admin donation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpdateStatus = async (id: string, newStatus: string, adminNotes?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/donations/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, adminNotes }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus as any, ...(adminNotes ? { adminNotes } : {}) } : r))
        );
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAllocated || !newDescription || !newEligibility) {
      alert('Please fill in required fields');
      return;
    }

    setSavingInit(true);
    try {
      const res = await fetch('/api/donations/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          allocatedAmount: Number(newAllocated),
          maxPerApplicant: Number(newMaxPerPerson) || Math.round(Number(newAllocated) / 20),
          description: newDescription,
          eligibility: newEligibility,
          badge: newBadge,
        }),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        setNewTitle('');
        setNewAllocated('');
        setNewMaxPerPerson('');
        setNewDescription('');
        setNewEligibility('');
        fetchData();
      } else {
        alert('Failed to create initiative');
      }
    } catch (err) {
      console.error('Error saving initiative:', err);
    } finally {
      setSavingInit(false);
    }
  };

  const handleDeleteInitiative = async (id: string) => {
    if (!confirm('Are you sure you want to remove this initiative?')) return;
    try {
      const res = await fetch(`/api/donations/initiatives?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInitiatives((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      console.error('Error deleting initiative:', err);
    }
  };

  // Metrics
  const totalAllocated = initiatives.reduce((acc, i) => acc + (i.allocatedAmount || 0), 0);
  const totalDisbursed = initiatives.reduce((acc, i) => acc + (i.disbursedAmount || 0), 0);
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED' || r.status === 'DISBURSED').length;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full text-white" style={{ backgroundColor: '#010e24' }}>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0052CC]/30 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#0052CC]/20 border border-[#0052CC] text-[#FFB800] rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Revenue Donations & Community Aid
              </h1>
            </div>
            <p className="text-xs text-blue-200/70 mt-1">
              Super Admin management for platform revenue-sharing causes and direct applicant assistance requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#021A3E] hover:bg-[#0052CC] border border-[#0052CC]/40 rounded-xl text-xs font-bold transition-all text-blue-100 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0052CC] to-[#003d99] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] border border-[#0052CC] rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Cause / Grant</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              Total Revenue Allocated
            </span>
            <span className="text-lg sm:text-2xl font-black text-[#FFB800] block mt-1">
              {formatCurrency(totalAllocated)}
            </span>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">
              From platform sales
            </span>
          </div>

          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              Total Disbursed Aid
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 block mt-1">
              {formatCurrency(totalDisbursed)}
            </span>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">
              Paid to verified applicants
            </span>
          </div>

          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              Pending Applications
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-400 block mt-1">
              {pendingCount}
            </span>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">
              Requiring Super Admin review
            </span>
          </div>

          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              Active Aid Causes
            </span>
            <span className="text-lg sm:text-2xl font-black text-cyan-400 block mt-1">
              {initiatives.length}
            </span>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">
              Running on Storefront
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-[#0052CC]/30 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-[#0052CC] text-white shadow-md'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Aid Applications ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('initiatives')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'initiatives'
                ? 'bg-[#0052CC] text-white shadow-md'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFB800]" />
            <span>Donation Causes & Funds ({initiatives.length})</span>
          </button>
        </div>

        {/* TAB 1: AID APPLICATIONS / REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#021838] border border-[#0052CC]/30 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#0052CC] text-white'
                        : 'bg-[#01142F] text-gray-400 hover:text-white border border-blue-900/50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search name, phone, ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </form>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-blue-200/70">Loading applications...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-[#021838] border border-[#0052CC]/30 rounded-3xl p-12 text-center">
                <HeartHandshake className="w-12 h-12 text-blue-400/30 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No assistance requests found</h3>
                <p className="text-xs text-blue-200/70 max-w-sm mx-auto mt-1">
                  Applications submitted from the homepage revenue donation banner will appear here for Super Admin approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => {
                  const cleanPhone = req.phone?.replace(/[^0-9]/g, '');
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${req.applicantName}, this is the VENTERSHOP Super Admin regarding your aid application (${req.requestId}) for "${req.initiativeTitle}".`
                  );
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

                  return (
                    <div
                      key={req._id}
                      className="bg-[#021838] border border-[#0052CC]/30 hover:border-[#0052CC]/70 rounded-2xl p-5 transition-all shadow-md space-y-3"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/50">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-sm text-white">
                            {req.requestId}
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-[#0052CC]/25 text-[#FFB800] border border-[#0052CC]/50">
                            {req.initiativeTitle}
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : req.status === 'DISBURSED'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : req.status === 'UNDER_REVIEW'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex items-center gap-2">
                          {cleanPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <a
                            href={`tel:${req.phone}`}
                            className="p-1.5 bg-[#01142F] hover:bg-blue-800 border border-blue-800 text-blue-200 hover:text-white rounded-xl transition-all"
                            title="Call Applicant"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#01142F]/60 rounded-xl p-3 border border-blue-900/40">
                        <div>
                          <span className="text-[10px] text-blue-300 uppercase font-bold block">
                            Applicant Info
                          </span>
                          <p className="font-bold text-white text-sm">{req.applicantName}</p>
                          <p className="text-gray-400">Phone: {req.phone}</p>
                          {req.email && <p className="text-gray-400">Email: {req.email}</p>}
                        </div>

                        <div>
                          <span className="text-[10px] text-blue-300 uppercase font-bold block">
                            Location & ID Verification
                          </span>
                          <p className="text-white">NIC / ID: {req.nicOrId}</p>
                          <p className="text-gray-400">City: {req.city}</p>
                          {req.supportingInfo && (
                            <p className="text-[#FFB800] text-[11px] mt-0.5">{req.supportingInfo}</p>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] text-blue-300 uppercase font-bold block">
                            Requested Grant Aid
                          </span>
                          <p className="text-base font-black text-emerald-400">
                            {formatCurrency(req.requestedAmount)}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            Submitted on {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Reason Statement */}
                      <div className="p-3 bg-[#010e24] rounded-xl border border-blue-900/40 text-xs">
                        <span className="text-[10px] text-blue-300 uppercase font-bold block mb-1">
                          Applicant Statement of Need:
                        </span>
                        <p className="text-gray-200 leading-relaxed italic">&ldquo;{req.reason}&rdquo;</p>
                      </div>

                      {/* Super Admin Status Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-blue-900/50">
                        <div className="flex items-center gap-1.5 text-xs">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">
                            Set Status:
                          </label>
                          <select
                            value={req.status}
                            disabled={updatingId === req._id}
                            onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#01142F] border border-[#0052CC]/60 text-[#FFB800] focus:outline-none focus:border-[#FFB800] cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="UNDER_REVIEW">UNDER REVIEW</option>
                            <option value="APPROVED">APPROVE GRANT</option>
                            <option value="DISBURSED">MARK DISBURSED</option>
                            <option value="REJECTED">REJECT</option>
                          </select>
                          {updatingId === req._id && (
                            <RefreshCw className="w-3 h-3 text-[#FFB800] animate-spin" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req._id, 'APPROVED', 'Approved by Super Admin')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => {
                                  const reasonNote = prompt('Reason for rejection:');
                                  if (reasonNote !== null) {
                                    handleUpdateStatus(req._id, 'REJECTED', reasonNote);
                                  }
                                }}
                                className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {req.status === 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(req._id, 'DISBURSED', 'Funds transferred by Super Admin')}
                              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>Mark Funds Disbursed</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE INITIATIVES */}
        {activeTab === 'initiatives' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiatives.map((init) => (
                <div
                  key={init._id}
                  className="bg-[#021838] border border-[#0052CC]/30 rounded-3xl p-5 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0052CC]/30 text-blue-200 border border-[#0052CC]/50">
                        {init.category}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {init.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{init.title}</h3>
                    <p className="text-xs text-blue-200/70 line-clamp-2">{init.description}</p>

                    <div className="p-3 bg-[#01142F] rounded-xl border border-blue-900/40 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Allocated Budget:</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {formatCurrency(init.allocatedAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Per Person:</span>
                        <span className="font-bold text-[#FFB800] font-mono">
                          {formatCurrency(init.maxPerApplicant)}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400">
                      <strong>Eligibility:</strong> {init.eligibility}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-900/50 flex justify-end">
                    <button
                      onClick={() => handleDeleteInitiative(init._id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Remove Cause"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CREATE INITIATIVE MODAL ── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="bg-[#021838] border border-[#0052CC]/60 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-[#01142F] to-[#021838] border-b border-[#0052CC]/40 flex items-center justify-between">
              <h3 className="font-black text-sm text-white">Create New Revenue Donation Cause</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInitiative} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-blue-200 mb-1">
                  Cause Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rural School Textbook & Library Fund"
                  className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="EDUCATION">EDUCATION</option>
                    <option value="AGRICULTURE">AGRICULTURE</option>
                    <option value="HEALTHCARE">HEALTHCARE</option>
                    <option value="EMERGENCY_RELIEF">EMERGENCY RELIEF</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. 10% Revenue Share"
                    className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">
                    Allocated Budget (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newAllocated}
                    onChange={(e) => setNewAllocated(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">
                    Max Per Person (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaxPerPerson}
                    onChange={(e) => setNewMaxPerPerson(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-200 mb-1">
                  Eligibility Criteria *
                </label>
                <input
                  type="text"
                  required
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="e.g. Students from low-income families pursuing university degrees"
                  className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-200 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Briefly describe what this cause achieves..."
                  className="w-full px-3 py-2 bg-[#01142F] border border-[#0052CC]/50 rounded-xl text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-blue-900/50">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInit}
                  className="px-4 py-2 bg-[#0052CC] hover:bg-[#FFB800] hover:text-[#021838] text-white rounded-xl font-bold cursor-pointer"
                >
                  {savingInit ? 'Saving...' : 'Create Cause'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
