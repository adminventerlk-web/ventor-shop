'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Edit2,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  Eye,
  Award,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IDonationRecord {
  _id: string;
  title: string;
  amount: number;
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY' | 'ORPHANAGE';
  beneficiary: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  status: 'COMPLETED' | 'ACTIVE';
  featured: boolean;
  createdAt: string;
}

const CATEGORIES = [
  'EDUCATION',
  'AGRICULTURE',
  'HEALTHCARE',
  'EMERGENCY_RELIEF',
  'COMMUNITY',
  'ORPHANAGE',
];

const PRESET_IMAGES = [
  { label: 'School / Education', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Farming', url: 'https://images.unsplash.com/photo-1592417817098-8f3d691068c2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Medical Treatment', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Community Aid', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminDonationsPage() {
  const [records, setRecords] = useState<IDonationRecord[]>([]);
  const [stats, setStats] = useState({ totalDonated: 0, totalCauses: 0, beneficiariesCount: '500+' });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY' | 'ORPHANAGE'>('EDUCATION');
  const [beneficiary, setBeneficiary] = useState('');
  const [location, setLocation] = useState('Jaffna, Northern Province');
  const [date, setDate] = useState('November 2026');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [badge, setBadge] = useState('100% Platform Revenue Share');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/donations/showcase');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load donation records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCategory('EDUCATION');
    setBeneficiary('');
    setLocation('Jaffna, Northern Province');
    setDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setDescription('');
    setImageUrl(PRESET_IMAGES[0].url);
    setBadge('100% Platform Revenue Share');
    setFeedback(null);
    setModalOpen(true);
  };

  const openEditModal = (rec: IDonationRecord) => {
    setEditingId(rec._id);
    setTitle(rec.title);
    setAmount(String(rec.amount));
    setCategory(rec.category);
    setBeneficiary(rec.beneficiary);
    setLocation(rec.location);
    setDate(rec.date);
    setDescription(rec.description);
    setImageUrl(rec.imageUrl || PRESET_IMAGES[0].url);
    setBadge(rec.badge || '100% Platform Revenue Share');
    setFeedback(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount.trim() || !beneficiary.trim()) {
      setFeedback({ type: 'error', text: 'Please fill in Title, Amount, and Beneficiary.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      if (editingId) {
        // Update
        const res = await fetch('/api/donations/showcase', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            updates: {
              title: title.trim(),
              amount: Number(amount),
              category,
              beneficiary: beneficiary.trim(),
              location: location.trim(),
              date: date.trim(),
              description: description.trim(),
              imageUrl: imageUrl.trim(),
              badge: badge.trim(),
            },
          }),
        });

        if (res.ok) {
          setFeedback({ type: 'success', text: 'Donation record updated successfully!' });
          setTimeout(() => {
            setModalOpen(false);
            fetchRecords();
          }, 600);
        } else {
          const d = await res.json();
          setFeedback({ type: 'error', text: d.error || 'Failed to update record.' });
        }
      } else {
        // Create
        const res = await fetch('/api/donations/showcase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            amount: Number(amount),
            category,
            beneficiary: beneficiary.trim(),
            location: location.trim(),
            date: date.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            badge: badge.trim(),
          }),
        });

        if (res.ok) {
          setFeedback({ type: 'success', text: 'New donation recorded! It is now live on the storefront showcase.' });
          setTimeout(() => {
            setModalOpen(false);
            fetchRecords();
          }, 800);
        } else {
          const d = await res.json();
          setFeedback({ type: 'error', text: d.error || 'Failed to save donation.' });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, causeTitle: string) => {
    if (!confirm(`Are you sure you want to remove the donation record: "${causeTitle}"?`)) return;

    try {
      const res = await fetch(`/api/donations/showcase?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchRecords();
      } else {
        alert('Failed to delete donation record.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.beneficiary.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);

    const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full text-white" style={{ backgroundColor: '#010e24' }}>
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0052CC]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Donations & Community Impact Showcase
            </h1>
          </div>
          <p className="text-xs text-blue-200/70 mt-1 max-w-2xl">
            Manage Venterprise’s verified community donations. When you add what was donated, for whom, and how much, it automatically showcases on the homepage for customer transparency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#community-donations-showcase"
            target="_blank"
            className="px-4 py-2 bg-[#021838] hover:bg-[#032352] border border-blue-700/60 rounded-xl text-xs font-bold text-blue-200 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#FFB800]" />
            <span>View Live Showcase</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg cursor-pointer transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record New Donation</span>
          </button>
        </div>
      </div>

      {/* ── Metric Analytics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-[#021838] border border-emerald-500/40 space-y-1 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">Total Donated by Venterprise</span>
            <Coins className="w-5 h-5 text-[#FFB800]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(stats.totalDonated)}
          </p>
          <p className="text-[10px] text-gray-400 font-medium">100% platform-funded revenue giveback</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#021838] border border-blue-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">Total Causes Supported</span>
            <Award className="w-5 h-5 text-[#FFB800]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.totalCauses} Verified Causes
          </p>
          <p className="text-[10px] text-gray-400 font-medium">Education, Farmers & Medical Relief</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#021838] border border-blue-900/60 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">Beneficiaries Impacted</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.beneficiariesCount}
          </p>
          <p className="text-[10px] text-gray-400 font-medium">Islandwide Sri Lankan families</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-[#021838] rounded-2xl p-4 border border-blue-900/60 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-blue-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cause, beneficiary, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-blue-300 font-bold shrink-0">Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white outline-none focus:border-emerald-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={fetchRecords}
            title="Refresh"
            className="p-2 rounded-xl bg-[#01142F] hover:bg-white/10 text-blue-300 border border-blue-900 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Recorded Donations List ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-[#021838] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-[#021838] border border-blue-900/60 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <HeartHandshake className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-black text-white">No Donation Records Found</h3>
          <p className="text-xs text-blue-200/70">
            Click &ldquo;+ Record New Donation&rdquo; to add your first community donation showcase.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            + Record Donation Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec._id}
              className="bg-[#021838] border border-blue-900/80 rounded-2xl p-5 hover:border-emerald-500/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg group"
            >
              <div className="flex items-start gap-4">
                {/* Photo Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-900 shrink-0 border border-white/10 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      rec.imageUrl ||
                      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={rec.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-bold text-[#FFB800]">
                    Verified
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FFB800]" />
                      <span>{rec.date}</span>
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FFB800]" />
                      <span>{rec.location}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-blue-200/80 line-clamp-2 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs text-gray-300 font-bold">
                    <span className="text-blue-400">Beneficiary:</span>
                    <span className="text-white font-extrabold">{rec.beneficiary}</span>
                  </div>
                </div>
              </div>

              {/* Amount Badge & Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-blue-900/60">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Amount Donated
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400">
                    {formatCurrency(rec.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(rec)}
                    className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(rec._id, rec.title)}
                    className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal to Record / Edit Donation ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#021838] border border-emerald-500/50 rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingId ? 'Edit Donation Record' : 'Record New Completed Donation'}
                  </h3>
                  <p className="text-xs text-blue-200/70">
                    Add donation details to showcase on the live Venterprise storefront.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title / Cause */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-200 block">
                  Donation Cause / Title * (edhukku)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free School Books & Stationery Distribution for 150 Students"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Amount Donated & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Amount Donated in LKR * (evalo donate pannanga)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-black text-emerald-400">LKR</span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 250000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-emerald-300 font-black outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Cause Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white outline-none focus:border-emerald-500 cursor-pointer font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Beneficiary & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Beneficiary / Recipient Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vadamarachchi Rural Primary School Students"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaffna, Northern Province"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              {/* Date & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Date Donated *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-200 block">
                    Verification Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Platform Revenue Share"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Photo Image URL + Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-200 block">
                  Donation Photo / Proof Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-bold">Quick Presets:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        imageUrl === img.url
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description / Impact Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-200 block">
                  Impact Story / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail what was purchased or distributed, who was supported, and the outcome..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-900 rounded-xl text-xs text-white placeholder-blue-300/40 outline-none focus:border-emerald-500 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-900/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingId ? 'Update Record' : 'Save & Showcase Live'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
