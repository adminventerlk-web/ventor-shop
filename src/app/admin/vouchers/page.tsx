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
  Edit,
  Trash2,
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
  voucherAmount?: number;
  discountCode?: string;
  isRedeemed?: boolean;
  appliedAt: string;
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
  voucherAmount?: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
  usedCount?: number;
  createdAt?: string;
}

export default function AdminVouchersPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'community'>('student');
  const [vouchers, setVouchers] = useState<IStudentVoucherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'PENDING' | 'VERIFIED' | 'USED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Student Program Master Status Toggle
  const [studentProgramActive, setStudentProgramActive] = useState(true);

  // Manual Issue Student Voucher Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueName, setIssueName] = useState('');
  const [issueEmail, setIssueEmail] = useState('');
  const [issueInstitution, setIssueInstitution] = useState('VENTERPRISE Student Program');
  const [issueCode, setIssueCode] = useState('');
  const [issueDiscountType, setIssueDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [issueDiscountValue, setIssueDiscountValue] = useState<number>(15);
  const [issueNotes, setIssueNotes] = useState('');
  const [issueStatus, setIssueStatus] = useState<'VERIFIED' | 'ISSUED'>('VERIFIED');
  const [issuing, setIssuing] = useState(false);

  // Edit Student Voucher Modal State (CRUD)
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentInstitution, setEditStudentInstitution] = useState('');
  const [editStudentIdNumber, setEditStudentIdNumber] = useState('');
  const [editStudentCode, setEditStudentCode] = useState('');
  const [editStudentDiscountType, setEditStudentDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [editStudentDiscountValue, setEditStudentDiscountValue] = useState<number>(15);
  const [editStudentStatus, setEditStudentStatus] = useState<'ISSUED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED'>('VERIFIED');
  const [editStudentNotes, setEditStudentNotes] = useState('');
  const [savingStudentEdit, setSavingStudentEdit] = useState(false);

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
    setIssueStatus('VERIFIED');
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
          autoVerify: issueStatus === 'VERIFIED',
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

  const handleOpenEditStudentModal = (v: IStudentVoucherData) => {
    setEditingStudentId(v._id);
    setEditStudentName(v.userName || '');
    setEditStudentEmail(v.userEmail || '');
    setEditStudentInstitution(v.institution || 'VENTERPRISE Student Program');
    setEditStudentIdNumber(v.studentIdNumber || '');
    setEditStudentCode(v.discountCode || '');
    setEditStudentDiscountType(v.discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED');
    setEditStudentDiscountValue(v.discountValue || (v.discountType === 'PERCENTAGE' ? 15 : 2500));
    setEditStudentStatus(v.status);
    setEditStudentNotes(v.adminNotes || '');
    setEditStudentModalOpen(true);
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;
    setSavingStudentEdit(true);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: editingStudentId,
          studentFullName: editStudentName.trim(),
          studentEmail: editStudentEmail.trim(),
          institution: editStudentInstitution.trim(),
          studentIdNumber: editStudentIdNumber.trim(),
          discountCode: editStudentCode.trim().toUpperCase(),
          discountType: editStudentDiscountType,
          discountValue: Number(editStudentDiscountValue),
          status: editStudentStatus,
          adminNotes: editStudentNotes.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditStudentModalOpen(false);
        await fetchVouchers();
      } else {
        alert(data.error || 'Failed to update student voucher');
      }
    } catch {
      alert('Network error while updating student voucher');
    } finally {
      setSavingStudentEdit(false);
    }
  };

  const handleDeleteStudentVoucher = async (voucherId: string) => {
    if (!confirm('Are you sure you want to permanently delete this student voucher?')) return;
    try {
      const res = await fetch(`/api/admin/vouchers?voucherId=${voucherId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchVouchers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete student voucher');
      }
    } catch {
      alert('Network error while deleting voucher');
    }
  };

  const handleToggleStudentStatus = async (item: IStudentVoucherData) => {
    const nextStatus = item.status === 'VERIFIED' ? 'ISSUED' : 'VERIFIED';
    setVouchers((prev) =>
      prev.map((v) => (v._id === item._id ? { ...v, status: nextStatus } : v))
    );
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId: item._id, action: 'TOGGLE_STATUS' }),
      });
      if (res.ok) {
        await fetchVouchers();
      } else {
        await fetchVouchers();
        alert('Failed to toggle status');
      }
    } catch {
      await fetchVouchers();
      alert('Network error toggling status');
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
    setCommunityVouchers((prev) =>
      prev.map((item) => (item._id === cv._id ? { ...item, status: nextStatus } : item))
    );
    try {
      const res = await fetch('/api/vouchers/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId: cv._id, status: nextStatus }),
      });
      if (res.ok) {
        await fetchCommunityVouchers();
      } else {
        await fetchCommunityVouchers();
        alert('Failed to toggle community voucher status');
      }
    } catch {
      await fetchCommunityVouchers();
      alert('Failed to toggle community voucher status');
    }
  };

  const handleDeleteCommunityVoucher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this community voucher?')) return;
    try {
      const res = await fetch(`/api/vouchers/community?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCommunityVouchers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete community voucher');
      }
    } catch {
      alert('Network error deleting community voucher');
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

  // Real V2CC Voucher (excludes any old family voucher)
  const activeV2ccVoucher =
    communityVouchers.find((v) => v.voucherCode === 'V2CC-COMMUNITY' || v.communityType === 'V2CC_PMS') ||
    communityVouchers[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-xs font-semibold">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'student' ? 'bg-red-50 text-[#801414]' : 'bg-blue-50 text-[#0759D6]'
            }`}
          >
            {activeTab === 'student' ? <GraduationCap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              {activeTab === 'student' ? 'Student Vouchers Management' : 'V2CC Community Vouchers Management'}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {activeTab === 'student'
                ? 'Review student voucher applications, grant percentage (%) or fixed amount (LKR) discounts, issue, edit, and manage verification codes.'
                : 'Configure V2CC-PMS member vouchers, toggle availability ON/OFF, and set discount percentages or amounts for verified community members.'}
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

      {/* TAB-SPECIFIC TOGGLE BANNER */}
      {/* 1. STUDENT TAB BANNER (V2CC toggle is hidden here!) */}
      {activeTab === 'student' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                studentProgramActive ? 'bg-red-50 text-[#801414] border border-red-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm text-gray-900">Student Voucher Program</span>
                <span className="font-mono font-black text-xs bg-gray-100 text-[#801414] px-2 py-0.5 rounded border border-gray-200">
                  VENTERPRISE-STUDENTS
                </span>
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {vouchers.length} Total Issued / Applied
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Normal customers / students can redeem vouchers at checkout with Full Name + Code. Admin can toggle individual vouchers or issue new ones below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-700">Student Program:</span>
            <button
              type="button"
              onClick={() => setStudentProgramActive(!studentProgramActive)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#801414] focus:ring-offset-2 ${
                studentProgramActive ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={studentProgramActive}
              title="Toggle Student Voucher Program status"
            >
              <span className="sr-only">Toggle Student Voucher Program</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  studentProgramActive ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                studentProgramActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {studentProgramActive ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      )}

      {/* 2. COMMUNITY TAB BANNER (Shows only on Community Tab!) */}
      {activeTab === 'community' && activeV2ccVoucher && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                activeV2ccVoucher.status === 'ON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm text-gray-900">{activeV2ccVoucher.title}</span>
                <span className="font-mono font-black text-xs bg-gray-100 text-[#0759D6] px-2 py-0.5 rounded border border-gray-200">
                  {activeV2ccVoucher.voucherCode}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeV2ccVoucher.discountType === 'PERCENTAGE'
                    ? `${activeV2ccVoucher.discountValue || 10}% OFF`
                    : formatCurrency(activeV2ccVoucher.discountValue || activeV2ccVoucher.voucherAmount || 0)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Displays on Homepage & Vouchers page. Admin can toggle ON/OFF anytime. Only Admin-verified V2CC-PMS members can redeem this (single-use).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-700">Community Voucher:</span>
            <button
              type="button"
              onClick={() => handleToggleCommunityStatus(activeV2ccVoucher)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0759D6] focus:ring-offset-2 ${
                activeV2ccVoucher.status === 'ON' ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={activeV2ccVoucher.status === 'ON'}
              title="Click to toggle Community Voucher ON/OFF"
            >
              <span className="sr-only">Toggle Community Voucher</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  activeV2ccVoucher.status === 'ON' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                activeV2ccVoucher.status === 'ON' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {activeV2ccVoucher.status}
            </span>
          </div>
        </div>
      )}

      {/* V2CC COMMUNITY VOUCHERS MANAGEMENT TAB */}
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
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer shrink-0 transition-colors ${
                        cv.status === 'ON'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                      title="Click to toggle ON/OFF"
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

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openCommModal(cv)}
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCommunityVoucher(cv._id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDENT VOUCHERS MANAGEMENT TAB */}
      {activeTab === 'student' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <span className="text-gray-500 uppercase font-extrabold text-[10px] tracking-wider">Total Applications</span>
              <span className="text-2xl font-black text-gray-900 mt-2">{vouchers.length}</span>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-amber-800 uppercase font-extrabold text-[10px] tracking-wider">Pending Verification</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-black text-amber-700 mt-2">{pendingCount}</span>
            </div>
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-emerald-800 uppercase font-extrabold text-[10px] tracking-wider">Verified & Approved</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-emerald-700 mt-2">{verifiedCount}</span>
            </div>
            <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-red-800 uppercase font-extrabold text-[10px] tracking-wider">Rejected</span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-2xl font-black text-red-700 mt-2">{rejectedCount}</span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, email, school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#801414] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
              {(['ALL', 'ISSUED', 'PENDING', 'VERIFIED', 'USED', 'REJECTED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    statusFilter === filter ? 'bg-[#801414] text-white shadow-2xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter} {filter === 'PENDING' && pendingCount > 0 && `(${pendingCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Student Vouchers Table */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              Loading student voucher applications...
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              No student voucher records found.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 uppercase font-black text-[10px] tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Student Info</th>
                    <th className="py-3 px-4">Institution / School</th>
                    <th className="py-3 px-4">Voucher Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4 text-right">Actions (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700 text-xs">
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
                                <p className="text-[10px] text-gray-500 font-medium">ID: {item.studentIdNumber}</p>
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
                              <span>MANUAL ISSUED</span>
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
                              <span>USED (REDEEMED)</span>
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
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Pending Approve / Reject */}
                            {isPending && (
                              <>
                                <button
                                  onClick={() => openApproveModal(item)}
                                  disabled={processingId === item._id}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                                  title="Approve Voucher"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(item._id, 'REJECT')}
                                  disabled={processingId === item._id}
                                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                                  title="Reject Voucher"
                                >
                                  <XCircle className="w-3.5 h-3.5 inline mr-1" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {/* Status Quick Toggle (Active vs Issued) */}
                            {(isIssued || isVerified) && (
                              <button
                                onClick={() => handleToggleStudentStatus(item)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                                  isVerified
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200'
                                }`}
                                title="Click to toggle status between VERIFIED and ISSUED"
                              >
                                <Power className="w-3 h-3" />
                                <span>{isVerified ? 'ON' : 'OFF'}</span>
                              </button>
                            )}

                            {/* Edit Button (Pencil) */}
                            <button
                              onClick={() => handleOpenEditStudentModal(item)}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit Student Voucher"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button (Trash) */}
                            <button
                              onClick={() => handleDeleteStudentVoucher(item._id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors cursor-pointer"
                              title="Delete Student Voucher"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
      )}

      {/* STUDENT VOUCHER APPROVE MODAL */}
      {approveModalVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
                <div>
                  <h3 className="font-black text-base uppercase text-gray-900">Approve Student Voucher</h3>
                  <p className="text-[11px] text-gray-500">Configure discount offer and assign code.</p>
                </div>
              </div>
              <button
                onClick={() => setApproveModalVoucher(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
            </div>

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
                  <span className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-[#0055D4]" />
                    Percentage (%)
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Calculates a % cut off student cart total</span>
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
                  <span className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#801414]" />
                    Fixed Amount (LKR)
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Deducts a direct cash subsidy in LKR</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {approvalDiscountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Fixed Voucher Value (LKR) *'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={approvalDiscountType === 'PERCENTAGE' ? 100 : 100000}
                  required
                  value={approvalDiscountValue}
                  onChange={(e) => setApprovalDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Issued Voucher Code *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={approvalDiscountCode}
                    onChange={(e) => setApprovalDiscountCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-black text-blue-700 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setApprovalDiscountCode(`STU-${Math.floor(10000 + Math.random() * 90000)}`)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Admin Notes (Optional)</label>
              <textarea
                rows={2}
                value={approvalAdminNotes}
                onChange={(e) => setApprovalAdminNotes(e.target.value)}
                placeholder="e.g. Verified student details against school roster."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

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
                <span>Confirm Approval</span>
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
                <p className="text-[11px] text-gray-500">Create a voucher code for a student or student group.</p>
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
                  placeholder="Leave blank to verify on claim"
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

            {/* Status Toggle in Modal */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div>
                <span className="font-bold text-xs text-gray-800 block">Voucher Status</span>
                <span className="text-[10px] text-gray-500">Toggle ON to immediately activate / approve this voucher.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIssueStatus(issueStatus === 'VERIFIED' ? 'ISSUED' : 'VERIFIED')}
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    issueStatus === 'VERIFIED' ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={issueStatus === 'VERIFIED'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      issueStatus === 'VERIFIED' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    issueStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {issueStatus === 'VERIFIED' ? 'ON (ACTIVE)' : 'OFF (ISSUED)'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Admin Notes (Optional)</label>
              <textarea
                rows={2}
                value={issueNotes}
                onChange={(e) => setIssueNotes(e.target.value)}
                placeholder="Optional notes regarding this student voucher"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

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

      {/* EDIT STUDENT VOUCHER MODAL (CRUD) */}
      {editStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveStudentEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base uppercase text-gray-900">Edit Student Voucher</h3>
                <p className="text-[11px] text-gray-500">Update voucher details, discount amount, code or status.</p>
              </div>
              <button type="button" onClick={() => setEditStudentModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Voucher Code *</label>
                <input
                  type="text"
                  required
                  value={editStudentCode}
                  onChange={(e) => setEditStudentCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-black text-xs uppercase text-blue-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Institution / School</label>
                <input
                  type="text"
                  value={editStudentInstitution}
                  onChange={(e) => setEditStudentInstitution(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEditStudentDiscountType('PERCENTAGE')}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  editStudentDiscountType === 'PERCENTAGE' ? 'border-[#801414] bg-red-50/50 text-[#801414]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setEditStudentDiscountType('FIXED')}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-black cursor-pointer ${
                  editStudentDiscountType === 'FIXED' ? 'border-[#801414] bg-red-50/50 text-[#801414]' : 'border-gray-200 text-gray-600'
                }`}
              >
                Fixed Amount (LKR)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {editStudentDiscountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (LKR)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={editStudentDiscountType === 'PERCENTAGE' ? 100 : 100000}
                  value={editStudentDiscountValue}
                  onChange={(e) => setEditStudentDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status</label>
                <select
                  value={editStudentStatus}
                  onChange={(e) => setEditStudentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value="VERIFIED">VERIFIED & APPROVED (ON)</option>
                  <option value="ISSUED">ISSUED (AWAITING CLAIM)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="USED">USED (REDEEMED)</option>
                  <option value="REJECTED">REJECTED (OFF)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Admin Notes</label>
              <textarea
                rows={2}
                value={editStudentNotes}
                onChange={(e) => setEditStudentNotes(e.target.value)}
                placeholder="Internal memo or notes"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <button type="button" onClick={() => setEditStudentModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={savingStudentEdit} className="px-5 py-2 bg-[#801414] text-white rounded-xl text-xs font-black cursor-pointer">
                {savingStudentEdit ? 'Saving...' : 'Save Changes'}
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
