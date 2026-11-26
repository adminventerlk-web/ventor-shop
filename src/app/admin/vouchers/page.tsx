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
  X,
  Percent,
  Tag,
  Plus,
  Users,
  Power,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IStudentVoucherData {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  institution: string;
  studentIdNumber?: string;
  phone?: string;
  gradeOrYear?: string;
  status: 'ISSUED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  discountType?: 'FIXED' | 'PERCENTAGE';
  discountValue?: number;
  voucherAmount: number;
  discountCode: string;
  isRedeemed?: boolean;
  appliedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  adminNotes?: string;
}

interface ICommunityVoucherData {
  _id: string;
  title: string;
  supportedBy: string;
  communityType: string;
  voucherCode: string;
  discountType?: 'FIXED' | 'PERCENTAGE';
  discountValue?: number;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
  usedCount?: number;
}

export default function AdminVouchersPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'community'>('student');

  // Student Vouchers State
  const [vouchers, setVouchers] = useState<IStudentVoucherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Manual Issue Student Voucher Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueName, setIssueName] = useState('');
  const [issueEmail, setIssueEmail] = useState('');
  const [issueInstitution, setIssueInstitution] = useState('VENTERPRISE Student Program');
  const [issueCode, setIssueCode] = useState('');
  const [issueDiscountType, setIssueDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [issueDiscountValue, setIssueDiscountValue] = useState<number>(15);
  const [issueNotes, setIssueNotes] = useState('');
  const [issueAutoVerify, setIssueAutoVerify] = useState(false);
  const [issuing, setIssuing] = useState(false);

  // Community Vouchers State
  const [communityVouchers, setCommunityVouchers] = useState<ICommunityVoucherData[]>([]);
  const [commLoading, setCommLoading] = useState(false);
  const [commModalOpen, setCommModalOpen] = useState(false);
  const [editingCommId, setEditingCommId] = useState<string | null>(null);
  const [commTitle, setCommTitle] = useState('V2CC Community Member Voucher');
  const [commSupportedBy, setCommSupportedBy] = useState('V2CC-PMS Community Program');
  const [commCode, setCommCode] = useState('V2CC-COMMUNITY');
  const [commDiscountType, setCommDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [commDiscountValue, setCommDiscountValue] = useState<number>(10);
  const [commStatus, setCommStatus] = useState<'ON' | 'OFF'>('ON');
  const [commNotice, setCommNotice] = useState('');
  const [savingComm, setSavingComm] = useState(false);

  // Student Approval Modal State
  const [approveModalVoucher, setApproveModalVoucher] = useState<IStudentVoucherData | null>(null);
  const [approvalDiscountType, setApprovalDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [approvalDiscountValue, setApprovalDiscountValue] = useState<number>(15);
  const [approvalDiscountCode, setApprovalDiscountCode] = useState<string>('');
  const [approvalAdminNotes, setApprovalAdminNotes] = useState<string>('');

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

  useEffect(() => {
    fetchVouchers();
    fetchCommunityVouchers();
  }, []);

  const handleOpenIssueModal = () => {
    setIssueName('');
    setIssueEmail('');
    setIssueInstitution('VENTERPRISE Student Program');
    setIssueCode(`STU-${Math.floor(10000 + Math.random() * 90000)}`);
    setIssueDiscountType('PERCENTAGE');
    setIssueDiscountValue(15);
    setIssueNotes('');
    setIssueAutoVerify(false);
    setIssueModalOpen(true);
  };

  const handleCreateStudentVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentFullName: issueName.trim(),
          studentEmail: issueEmail.trim(),
          institution: issueInstitution.trim(),
          discountCode: issueCode.trim().toUpperCase(),
          discountType: issueDiscountType,
          discountValue: Number(issueDiscountValue),
          adminNotes: issueNotes.trim(),
          autoVerify: issueAutoVerify,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIssueModalOpen(false);
        await fetchVouchers();
      } else {
        alert(data.error || 'Failed to issue student voucher');
      }
    } catch {
      alert('Network error while issuing student voucher');
    } finally {
      setIssuing(false);
    }
  };

  const openCommModal = (cv?: ICommunityVoucherData) => {
    if (cv) {
      setEditingCommId(cv._id);
      setCommTitle(cv.title);
      setCommSupportedBy(cv.supportedBy);
      setCommCode(cv.voucherCode);
      setCommDiscountType(cv.discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED');
      setCommDiscountValue(cv.discountValue ?? cv.voucherAmount ?? 10);
      setCommStatus(cv.status);
      setCommNotice(cv.noticeMessage || '');
    } else {
      setEditingCommId(null);
      setCommTitle('V2CC Community Member Voucher');
      setCommSupportedBy('V2CC-PMS Community Program');
      setCommCode(`V2CC-${Math.floor(1000 + Math.random() * 9000)}`);
      setCommDiscountType('PERCENTAGE');
      setCommDiscountValue(10);
      setCommStatus('ON');
      setCommNotice('Exclusive one-time voucher for verified V2CC Community Members.');
    }
    setCommModalOpen(true);
  };

  const handleSaveCommunityVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingComm(true);
    try {
      const res = await fetch('/api/vouchers/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCommId,
          title: commTitle.trim(),
          supportedBy: commSupportedBy.trim(),
          communityType: 'V2CC_PMS',
          voucherCode: commCode.trim().toUpperCase(),
          discountType: commDiscountType,
          discountValue: Number(commDiscountValue),
          status: commStatus,
          noticeMessage: commNotice.trim(),
        }),
      });
      if (res.ok) {
        setCommModalOpen(false);
        await fetchCommunityVouchers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save community voucher');
      }
    } catch {
      alert('Network error saving community voucher');
    } finally {
      setSavingComm(false);
    }
  };

  const handleToggleCommunityStatus = async (cv: ICommunityVoucherData) => {
    const nextStatus = cv.status === 'ON' ? 'OFF' : 'ON';
    try {
      const res = await fetch('/api/vouchers/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId: cv._id, status: nextStatus }),
      });
      if (res.ok) await fetchCommunityVouchers();
    } catch {
      alert('Failed to toggle community voucher status');
    }
  };

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

  const openApproveModal = (v: IStudentVoucherData) => {
    setApproveModalVoucher(v);
    const dtype = v.discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED';
    setApprovalDiscountType(dtype);
    setApprovalDiscountValue(v.discountValue || (dtype === 'PERCENTAGE' ? 15 : 2500));
    setApprovalDiscountCode(
      v.discountCode && v.discountCode !== 'PENDING_APPROVAL' && v.discountCode !== 'STUDENT-V2CC'
        ? v.discountCode
        : `STU-${Math.floor(10000 + Math.random() * 90000)}`
    );
    setApprovalAdminNotes(v.adminNotes || '');
  };

  const handleConfirmApproval = async () => {
    if (!approveModalVoucher) return;
    setProcessingId(approveModalVoucher._id);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: approveModalVoucher._id,
          action: 'APPROVE',
          discountType: approvalDiscountType,
          discountValue: Number(approvalDiscountValue),
          discountCode: approvalDiscountCode.trim().toUpperCase(),
          adminNotes: approvalAdminNotes.trim(),
        }),
      });

      if (res.ok) {
        setApproveModalVoucher(null);
        await fetchVouchers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to approve voucher');
      }
    } catch {
      alert('Network error while approving voucher');
    } finally {
      setProcessingId(null);
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
              Student Vouchers Management
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Review student voucher applications, grant percentage (%) or fixed amount (LKR) discounts, and issue verification codes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'student' ? (
            <button
              onClick={handleOpenIssueModal}
              className="px-4 py-2 bg-[#801414] hover:bg-[#640f0f] text-white rounded-xl flex items-center gap-2 font-black cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Student Voucher</span>
            </button>
          ) : (
            <button
              onClick={() => openCommModal()}
              className="px-4 py-2 bg-[#0759D6] hover:bg-[#0544a6] text-white rounded-xl flex items-center gap-2 font-black cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add V2CC Community Voucher</span>
            </button>
          )}
          <button
            onClick={() => { fetchVouchers(); fetchCommunityVouchers(); }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || commLoading) ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Section Tabs: Student Vouchers vs V2CC Community Vouchers */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-full sm:w-fit shadow-2xs">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'student' ? 'bg-[#801414] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student Vouchers ({vouchers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'community' ? 'bg-[#0759D6] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>V2CC Community Vouchers ({communityVouchers.length})</span>
        </button>
      </div>

      {/* V2CC COMMUNITY VOUCHERS MANAGEMENT */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 font-medium">
            <strong>V2CC Community Member Vouchers:</strong> Only users who register as V2CC Members and are verified by Admin under{' '}
            <span className="font-bold underline">V2CC-PMS Members</span> can redeem these vouchers. Each member can use a voucher <strong>only once</strong>.
          </div>

          {commLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              Loading V2CC Community Vouchers...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityVouchers.map((cv) => (
                <div key={cv._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">{cv.supportedBy}</span>
                      <h3 className="text-base font-black text-gray-900">{cv.title}</h3>
                      <p className="text-[11px] text-gray-500 mt-1">{cv.noticeMessage}</p>
                    </div>
                    <button
                      onClick={() => handleToggleCommunityStatus(cv)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer shrink-0 ${
                        cv.status === 'ON'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{cv.status}</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 border border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Code</span>
                      <span className="font-mono font-black text-sm text-[#0759D6]">{cv.voucherCode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Offer Value</span>
                      <span className="font-black text-sm text-[#801414]">
                        {cv.discountType === 'PERCENTAGE'
                          ? `${cv.discountValue || 10}% OFF`
                          : formatCurrency(cv.discountValue || cv.voucherAmount || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Used Count</span>
                      <span className="font-black text-sm text-gray-800">{cv.usedCount || 0} members</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => openCommModal(cv)}
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Edit Amount / Percentage / Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDENT VOUCHERS VERIFICATION & WORKFLOW */}
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
              {['ALL', 'ISSUED', 'PENDING', 'VERIFIED', 'USED', 'REJECTED'].map((st) => (
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
                <table className="w-full text-left border-collapse min-w-[720px]">
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
                      const isIssued = item.status === 'ISSUED';
                      const isPending = item.status === 'PENDING';
                      const isVerified = item.status === 'VERIFIED';
                      const isUsed = item.status === 'USED';
                      const isRejected = item.status === 'REJECTED';

                      return (
                        <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-4 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-black text-gray-900">
                                {item.userName || <span className="italic text-gray-400">Unclaimed (Manual Code)</span>}
                              </span>
                            </div>
                            {item.userEmail && (
                              <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span>{item.userEmail}</span>
                              </div>
                            )}
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
                              {item.discountType === 'PERCENTAGE'
                                ? `${item.discountValue || 0}% OFF`
                                : formatCurrency(item.discountValue || item.voucherAmount || 0)}
                            </p>
                            {item.discountCode && (
                              <span className="inline-block bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-extrabold mt-0.5">
                                {item.discountCode}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {isIssued && (
                              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-200">
                                <Tag className="w-3 h-3" />
                                <span>MANUAL ISSUED (AWAITING CLAIM)</span>
                              </span>
                            )}
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
                            {isUsed && (
                              <span className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-gray-300">
                                <CheckCircle className="w-3 h-3 text-gray-600" />
                                <span>USED (REDEEMED ONCE)</span>
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
                                    onClick={() => openApproveModal(item)}
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
                                  onClick={() => openApproveModal(item)}
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

      {/* Student Voucher Approval Modal (Percentage OR Fixed Amount) */}
      {approveModalVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-gray-200 text-gray-900 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight text-gray-900">
                    Approve Student Voucher
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Configure offer type (Percentage or Fixed Amount) and issue code.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApproveModalVoucher(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Student Name:</span>
                <span className="font-black text-gray-900">{approveModalVoucher.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Email:</span>
                <span className="font-semibold text-gray-700">{approveModalVoucher.userEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Institution:</span>
                <span className="font-bold text-blue-700">{approveModalVoucher.institution}</span>
              </div>
              {approveModalVoucher.studentIdNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Student / Admission ID:</span>
                  <span className="font-mono font-bold text-gray-900">{approveModalVoucher.studentIdNumber}</span>
                </div>
              )}
              {approveModalVoucher.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Contact Phone:</span>
                  <span className="font-bold text-gray-800">{approveModalVoucher.phone}</span>
                </div>
              )}
              {approveModalVoucher.gradeOrYear && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px]">Grade / Year:</span>
                  <span className="font-semibold text-gray-800">{approveModalVoucher.gradeOrYear}</span>
                </div>
              )}
            </div>

            {/* Offer Type Selection (Percentage OR Fixed Amount - Mutually Exclusive) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                Select Offer Type (Choose One) *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setApprovalDiscountType('PERCENTAGE');
                    if (!approvalDiscountValue || approvalDiscountValue > 100) {
                      setApprovalDiscountValue(15);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    approvalDiscountType === 'PERCENTAGE'
                      ? 'border-[#0055D4] bg-blue-50/60 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-[#0055D4]" />
                      Percentage (%)
                    </span>
                    <input
                      type="radio"
                      name="discountType"
                      checked={approvalDiscountType === 'PERCENTAGE'}
                      onChange={() => {}}
                      className="accent-[#0055D4]"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Calculates a % cut off student cart total
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setApprovalDiscountType('FIXED');
                    if (!approvalDiscountValue || approvalDiscountValue <= 100) {
                      setApprovalDiscountValue(2500);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    approvalDiscountType === 'FIXED'
                      ? 'border-[#801414] bg-red-50/60 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#801414]" />
                      Fixed Amount (LKR)
                    </span>
                    <input
                      type="radio"
                      name="discountType"
                      checked={approvalDiscountType === 'FIXED'}
                      onChange={() => {}}
                      className="accent-[#801414]"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Deducts a direct cash subsidy in LKR
                  </span>
                </button>
              </div>
            </div>

            {/* Value Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {approvalDiscountType === 'PERCENTAGE'
                    ? 'Discount Percentage (%) *'
                    : 'Fixed Voucher Value (LKR) *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={approvalDiscountType === 'PERCENTAGE' ? 100 : 100000}
                    required
                    value={approvalDiscountValue}
                    onChange={(e) => setApprovalDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-900 pr-10"
                    placeholder={approvalDiscountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 2500'}
                  />
                  <span className="absolute right-3 top-2 text-xs font-black text-gray-400">
                    {approvalDiscountType === 'PERCENTAGE' ? '%' : 'LKR'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Issued Voucher Code *
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={approvalDiscountCode}
                    onChange={(e) => setApprovalDiscountCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-black text-blue-700 tracking-wider uppercase"
                    placeholder="STU-XXXXX"
                  />
                  <button
                    type="button"
                    title="Generate New Code"
                    onClick={() => setApprovalDiscountCode(`STU-${Math.floor(10000 + Math.random() * 90000)}`)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Admin Notes (Optional, internal or verification memo)
              </label>
              <textarea
                rows={2}
                value={approvalAdminNotes}
                onChange={(e) => setApprovalAdminNotes(e.target.value)}
                placeholder="e.g. Student ID verified against university enrollment list."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setApproveModalVoucher(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={processingId === approveModalVoucher._id || !approvalDiscountValue || !approvalDiscountCode}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {processingId === approveModalVoucher._id
                    ? 'Approving...'
                    : `Approve (${approvalDiscountType === 'PERCENTAGE' ? `${approvalDiscountValue}%` : `LKR ${approvalDiscountValue}`})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ISSUE STUDENT VOUCHER MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateStudentVoucher} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base uppercase text-gray-900">Issue Manual Student Voucher</h3>
                <p className="text-[11px] text-gray-500">Create a single-use voucher code for specific students.</p>
              </div>
              <button type="button" onClick={() => setIssueModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Code *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={issueCode}
                    onChange={(e) => setIssueCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-black text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setIssueCode(`STU-${Math.floor(10000 + Math.random() * 90000)}`)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Student Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave blank to verify when student claims"
                  value={issueName}
                  onChange={(e) => setIssueName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setIssueDiscountType('PERCENTAGE'); setIssueDiscountValue(15); }}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  issueDiscountType === 'PERCENTAGE' ? 'border-[#801414] bg-red-50/50 text-[#801414]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => { setIssueDiscountType('FIXED'); setIssueDiscountValue(2500); }}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  issueDiscountType === 'FIXED' ? 'border-[#801414] bg-red-50/50 text-[#801414]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Fixed Amount (LKR)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {issueDiscountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (LKR)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={issueDiscountType === 'PERCENTAGE' ? 100 : 100000}
                  value={issueDiscountValue}
                  onChange={(e) => setIssueDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Institution / Program</label>
                <input
                  type="text"
                  value={issueInstitution}
                  onChange={(e) => setIssueInstitution(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            {issueName.trim() && (
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={issueAutoVerify}
                  onChange={(e) => setIssueAutoVerify(e.target.checked)}
                />
                <span>Pre-Verify immediately for {issueName.trim()}</span>
              </label>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <button type="button" onClick={() => setIssueModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={issuing} className="px-5 py-2 bg-[#801414] text-white rounded-xl text-xs font-black cursor-pointer">
                {issuing ? 'Issuing...' : 'Issue Voucher'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT V2CC COMMUNITY VOUCHER MODAL */}
      {commModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveCommunityVoucher} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base uppercase text-gray-900">
                  {editingCommId ? 'Edit V2CC Community Voucher' : 'Add V2CC Community Voucher'}
                </h3>
                <p className="text-[11px] text-gray-500">One-time use for verified V2CC Community Members.</p>
              </div>
              <button type="button" onClick={() => setCommModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Title *</label>
                <input
                  type="text"
                  required
                  value={commTitle}
                  onChange={(e) => setCommTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Code *</label>
                <input
                  type="text"
                  required
                  value={commCode}
                  onChange={(e) => setCommCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-black text-xs uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setCommDiscountType('PERCENTAGE'); setCommDiscountValue(10); }}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  commDiscountType === 'PERCENTAGE' ? 'border-[#0759D6] bg-blue-50 text-[#0759D6]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => { setCommDiscountType('FIXED'); setCommDiscountValue(3000); }}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  commDiscountType === 'FIXED' ? 'border-[#0759D6] bg-blue-50 text-[#0759D6]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Fixed Amount (LKR)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {commDiscountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (LKR)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={commDiscountType === 'PERCENTAGE' ? 100 : 100000}
                  value={commDiscountValue}
                  onChange={(e) => setCommDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status</label>
                <select
                  value={commStatus}
                  onChange={(e) => setCommStatus(e.target.value as 'ON' | 'OFF')}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value="ON">ON (Active for Verified V2CC Members)</option>
                  <option value="OFF">OFF (Disabled)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Description / Notice</label>
              <textarea
                rows={2}
                value={commNotice}
                onChange={(e) => setCommNotice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <button type="button" onClick={() => setCommModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={savingComm} className="px-5 py-2 bg-[#0759D6] text-white rounded-xl text-xs font-black cursor-pointer">
                {savingComm ? 'Saving...' : 'Save Community Voucher'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
