'use client';

import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, UserCheck, UserX, RefreshCw } from 'lucide-react';

interface IPendingRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  communityId: { _id: string; name: string; membershipCode: string } | null;
  communityJoinDate: string;
  communityStatus: string;
}

export default function AdminCommunitiesPage() {
  const [pendingRequests, setPendingRequests] = useState<IPendingRequest[]>([]);
  const [approvedMembers, setApprovedMembers] = useState<IPendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/communities?pending=true');
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data.pendingRequests || []);
        setApprovedMembers(data.approvedMembers || []);
      }
    } catch (e) {
      console.error('Failed to load V2CC members data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMembershipAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId + action);
    try {
      const res = await fetch('/api/admin/communities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        await loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update membership');
      }
    } catch (e) {
      alert('Error processing membership action');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="h-48 bg-white rounded-xl border border-gray-150 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-xs font-semibold">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase">
              V2CC-PMS Members Administration
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Review and verify registered V2CC-PMS Community Members. Once verified by Admin, members become eligible for single-use V2CC community vouchers.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setLoading(true); loadData(); }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-full sm:w-fit shadow-2xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pending' ? 'bg-[#E53935] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>V2CC Pending ({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'approved' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verified V2CC ({approvedMembers.length})</span>
        </button>
      </div>

      {/* PENDING REQUESTS TAB */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 font-medium">
            <strong>Pending V2CC Registrations:</strong> Users who select &quot;Register as V2CC Member&quot; during sign up appear here. Review and approve them so they gain official V2CC Community Member status and voucher redemption eligibility.
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-400" />
              <p className="font-bold text-sm text-gray-700">No pending V2CC membership requests.</p>
              <p className="text-xs text-gray-500">All registered members have been processed.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-amber-50/70 text-amber-900 uppercase font-bold border-b border-amber-100">
                    <th className="p-4">Customer Name & Email</th>
                    <th className="p-4">Program</th>
                    <th className="p-4">Request Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {pendingRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[#101A2D] text-sm">{req.firstName} {req.lastName}</p>
                        <p className="text-xs text-gray-500">{req.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#1A2A4A] bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md text-xs border border-blue-200">
                          V2CC-PMS Community Member
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {req.communityJoinDate
                          ? new Date(req.communityJoinDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
                          : 'Recently'}
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-black text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          PENDING VERIFICATION
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleMembershipAction(req._id, 'approve')}
                            disabled={actionLoading === req._id + 'approve'}
                            className="flex items-center gap-1.5 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{actionLoading === req._id + 'approve' ? 'Approving...' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleMembershipAction(req._id, 'reject')}
                            disabled={actionLoading === req._id + 'reject'}
                            className="flex items-center gap-1.5 py-2 px-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{actionLoading === req._id + 'reject' ? 'Rejecting...' : 'Reject'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VERIFIED V2CC MEMBERS TAB */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 font-medium">
            <strong>Verified V2CC Community Members:</strong> These members have been approved by Admin and are eligible to apply the V2CC Community Voucher (1-time use) during checkout.
          </div>

          {approvedMembers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-gray-300" />
              <p className="font-bold text-sm text-gray-700">No verified V2CC members yet.</p>
              <p className="text-xs text-gray-500">Approve pending registrations to see them here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-emerald-50/70 text-emerald-900 uppercase font-bold border-b border-emerald-100">
                    <th className="p-4">V2CC Member Name & Email</th>
                    <th className="p-4">Membership Program</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {approvedMembers.map((mem) => (
                    <tr key={mem._id} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[#101A2D] text-sm">{mem.firstName} {mem.lastName}</p>
                        <p className="text-xs text-gray-500">{mem.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#1A2A4A] bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md text-xs border border-blue-200">
                          V2CC-PMS Community Member
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-black text-[10px] inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> VERIFIED V2CC MEMBER
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
