'use client';

import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  Mail,
  User,
  RefreshCw,
  Award,
  ToggleLeft,
  ToggleRight,
  Plus,
  Home,
  Users,
  X,
  Edit2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IStudentVoucherData {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  institution: string;
  studentIdNumber?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  voucherAmount: number;
  discountCode: string;
  appliedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  adminNotes?: string;
}

interface ICommunityProgramVoucherData {
  _id: string;
  title: string;
  supportedBy: string;
  communityType: 'FAMILY_SUPPORT' | 'V2CC_PMS' | 'WHOLESALE' | 'GENERAL';
  voucherCode: string;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
}

export default function AdminVouchersPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'community'>('student');

  // Student Vouchers State
  const [vouchers, setVouchers] = useState<IStudentVoucherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Community Program Vouchers State
  const [communityVouchers, setCommunityVouchers] = useState<ICommunityProgramVoucherData[]>([]);
  const [commLoading, setCommLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Edit/Create Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: 'Family Support Voucher',
    supportedBy: 'TMSAP Project of V2CC',
    communityType: 'FAMILY_SUPPORT',
    voucherCode: 'FAMILY-V2CC',
    voucherAmount: 3000,
    status: 'OFF',
    noticeMessage:
      'Community household onboarding and verification are in progress. This voucher program will be activated for enrolled member families shortly.',
  });

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vouchers');
      if (res.ok) {
        const data = await res.json();
        setVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error('Failed to fetch student vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityVouchers = async () => {
    setCommLoading(true);
    try {
      const res = await fetch('/api/vouchers/community');
      if (res.ok) {
        const data = await res.json();
        setCommunityVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error('Failed to fetch community vouchers:', err);
    } finally {
      setCommLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchCommunityVouchers();
  }, []);

  const handleUpdateStatus = async (
    voucherId: string,
    action: 'APPROVE' | 'REJECT' | 'MARK_USED',
    amount: number = 2500
  ) => {
    setProcessingId(voucherId);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId, action, voucherAmount: amount }),
      });

      if (res.ok) {
        await fetchVouchers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error while updating status');
    } finally {
      setProcessingId(null);
    }
  };

  // Toggle Community Program Voucher Status ON / OFF
  const handleToggleCommunityStatus = async (voucherId: string, currentStatus: 'ON' | 'OFF') => {
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    setTogglingId(voucherId);
    try {
      const res = await fetch('/api/vouchers/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId, status: newStatus }),
      });

      if (res.ok) {
        await fetchCommunityVouchers();
      } else {
        alert('Failed to toggle status');
      }
    } catch (err) {
      alert('Network error while toggling status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaveCommunityVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vouchers/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...formData,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingId(null);
        await fetchCommunityVouchers();
      } else {
        alert('Failed to save community voucher');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.studentIdNumber && v.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  const pendingCount = vouchers.filter((v) => v.status === 'PENDING').length;
  const verifiedCount = vouchers.filter((v) => v.status === 'VERIFIED').length;
  const rejectedCount = vouchers.filter((v) => v.status === 'REJECTED').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#801414] flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Vouchers & Community Program Management
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Manage Student Gift Voucher approvals and toggle Community Supporter Program Cards (ON/OFF).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchVouchers();
            fetchCommunityVouchers();
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading || commLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-2xl border">
        <button
          onClick={() => setActiveTab('student')}
          className={`py-3 px-6 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'student'
              ? 'border-[#801414] text-[#801414]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          🎓 Student Vouchers ({pendingCount} Pending)
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`py-3 px-6 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'community'
              ? 'border-[#801414] text-[#801414]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          🤝 Community Supporter Vouchers (ON/OFF Control)
        </button>
      </div>

      {/* TAB 1: STUDENT VOUCHERS VERIFICATION */}
      {activeTab === 'student' && (
        <div className="space-y-6">
          
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
              <p className="text-gray-500 font-bold uppercase text-[10px]">Total Applications</p>
              <p className="text-2xl font-black text-gray-900">{vouchers.length}</p>
            </div>
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-amber-700">
                <p className="font-bold uppercase text-[10px]">Pending Verification</p>
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-amber-800">{pendingCount}</p>
            </div>
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-emerald-700">
                <p className="font-bold uppercase text-[10px]">Verified & Approved</p>
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-emerald-800">{verifiedCount}</p>
            </div>
            <div className="bg-red-50/70 p-5 rounded-2xl border border-red-200/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-red-700">
                <p className="font-bold uppercase text-[10px]">Rejected</p>
                <XCircle className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-red-800">{rejectedCount}</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, email, school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#801414] text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-colors cursor-pointer shrink-0 ${
                    statusFilter === st
                      ? 'bg-[#801414] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st} {st === 'PENDING' && pendingCount > 0 ? `(${pendingCount})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <div className="inline-block w-7 h-7 border-3 border-[#801414] border-t-transparent rounded-full animate-spin mb-2" />
                <p>Loading student voucher applications...</p>
              </div>
            ) : filteredVouchers.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-2">
                <Award className="w-10 h-10 mx-auto opacity-40 text-gray-400" />
                <p className="font-bold text-sm">No student voucher applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 font-extrabold">Student Info</th>
                      <th className="py-3 px-4 font-extrabold">Institution / School</th>
                      <th className="py-3 px-4 font-extrabold">Voucher Details</th>
                      <th className="py-3 px-4 font-extrabold">Status</th>
                      <th className="py-3 px-4 font-extrabold">Applied Date</th>
                      <th className="py-3 px-4 font-extrabold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredVouchers.map((item) => {
                      const isPending = item.status === 'PENDING';
                      const isVerified = item.status === 'VERIFIED';
                      const isRejected = item.status === 'REJECTED';

                      return (
                        <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-4 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-black text-gray-900">{item.userName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{item.userEmail}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-start gap-2">
                              <Building2 className="w-3.5 h-3.5 text-[#0055D4] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-extrabold text-gray-900">{item.institution}</p>
                                {item.studentIdNumber && (
                                  <p className="text-[10px] text-gray-500 font-medium">
                                    ID: {item.studentIdNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-black text-[#801414] text-sm">
                              {formatCurrency(item.voucherAmount)}
                            </p>
                            <span className="inline-block bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-extrabold">
                              {item.discountCode}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3" />
                                <span>PENDING VERIFICATION</span>
                              </span>
                            )}
                            {isVerified && (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>VERIFIED & APPROVED</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-red-200">
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span>REJECTED</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-gray-500 text-[11px] font-medium">
                            {new Date(item.appliedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(item._id, 'APPROVE', 2500)}
                                    disabled={processingId === item._id}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                                    <span>Verify & Approve</span>
                                  </button>

                                  <button
                                    onClick={() => handleUpdateStatus(item._id, 'REJECT')}
                                    disabled={processingId === item._id}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <XCircle className="w-3.5 h-3.5 inline mr-1" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {isVerified && (
                                <button
                                  onClick={() => handleUpdateStatus(item._id, 'REJECT')}
                                  disabled={processingId === item._id}
                                  className="px-2.5 py-1 text-red-600 hover:underline font-bold text-[11px] cursor-pointer"
                                >
                                  Revoke Approval
                                </button>
                              )}

                              {isRejected && (
                                <button
                                  onClick={() => handleUpdateStatus(item._id, 'APPROVE', 2500)}
                                  disabled={processingId === item._id}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                                  <span>Re-Approve</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY PROGRAM VOUCHERS ON/OFF CONTROLS */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase">
                Community Supporter Voucher Program Cards
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Toggle status (ON/OFF) to activate community vouchers dynamically on Homepage & Vouchers Page.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: 'Family Support Voucher',
                  supportedBy: 'TMSAP Project of V2CC',
                  communityType: 'FAMILY_SUPPORT',
                  voucherCode: 'FAMILY-V2CC',
                  voucherAmount: 3000,
                  status: 'OFF',
                  noticeMessage:
                    'Community household onboarding and verification are in progress. This voucher program will be activated for enrolled member families shortly.',
                });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#801414] hover:bg-[#600e0e] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Community Program Voucher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityVouchers.map((cv) => {
              const isOn = cv.status === 'ON';
              return (
                <div
                  key={cv._id}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all space-y-4 shadow-md ${
                    isOn ? 'border-emerald-500/80 shadow-emerald-500/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                          isOn ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Home className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900">{cv.title}</h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          Supported by <strong className="text-emerald-700">{cv.supportedBy}</strong>
                        </p>
                      </div>
                    </div>

                    {/* ON / OFF Toggle Switch */}
                    <button
                      onClick={() => handleToggleCommunityStatus(cv._id, cv.status)}
                      disabled={togglingId === cv._id}
                      className={`px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                        isOn
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {isOn ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-white" />
                          <span>STATUS: ON</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-500" />
                          <span>STATUS: OFF</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Voucher Code:</span>
                      <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {cv.voucherCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Voucher Value:</span>
                      <span className="font-black text-[#801414] text-sm">
                        {formatCurrency(cv.voucherAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Community Target:</span>
                      <span className="font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded text-[10px]">
                        {cv.communityType}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setEditingId(cv._id);
                        setFormData({
                          title: cv.title,
                          supportedBy: cv.supportedBy,
                          communityType: cv.communityType,
                          voucherCode: cv.voucherCode,
                          voucherAmount: cv.voucherAmount,
                          status: cv.status,
                          noticeMessage: cv.noticeMessage || '',
                        });
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Program Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Create Community Voucher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base uppercase tracking-tight">
                {editingId ? 'Edit Community Program Voucher' : 'Add New Community Program Voucher'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommunityVoucher} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Family Support Voucher"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Supported By (Project / Supporter Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TMSAP Project of V2CC"
                  value={formData.supportedBy}
                  onChange={(e) => setFormData({ ...formData, supportedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAMILY-V2CC"
                    value={formData.voucherCode}
                    onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Amount (LKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3000"
                    value={formData.voucherAmount}
                    onChange={(e) => setFormData({ ...formData, voucherAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Target Community Type</label>
                  <select
                    value={formData.communityType}
                    onChange={(e) => setFormData({ ...formData, communityType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="FAMILY_SUPPORT">Family Support</option>
                    <option value="V2CC_PMS">V2CC-PMS Member</option>
                    <option value="WHOLESALE">Wholesale Buyer</option>
                    <option value="GENERAL">General Community</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Status (ON / OFF)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="OFF">OFF (Launching Soon)</option>
                    <option value="ON">ON (Active Now)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Program Status Notice Message</label>
                <textarea
                  rows={2}
                  value={formData.noticeMessage}
                  onChange={(e) => setFormData({ ...formData, noticeMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#801414] hover:bg-[#600e0e] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Community Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
