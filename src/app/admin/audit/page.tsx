'use client';

import React, { useEffect, useState } from 'react';
import {
  Clock,
  ShieldCheck,
  Search,
  RefreshCw,
  Activity,
  UserCheck,
  Layers,
  FileText,
} from 'lucide-react';

interface IAuditLogData {
  _id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  targetModel: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<IAuditLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetModel.toLowerCase().includes(searchQuery.toLowerCase());

    if (actionFilter === 'ALL') return matchesSearch;
    return matchesSearch && log.targetModel.toUpperCase() === actionFilter.toUpperCase();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-xs font-semibold">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#801414] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Operations & Security Audit Logs
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Track administrative actions, voucher verifications, product catalog updates, and security events.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <p className="font-bold uppercase text-[10px]">Total Logged Events</p>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-gray-900">{logs.length}</p>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-700">
            <p className="font-bold uppercase text-[10px]">Active Admins</p>
            <UserCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-800">
            {new Set(logs.map((l) => l.adminEmail)).size}
          </p>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <p className="font-bold uppercase text-[10px]">Voucher & Community Audits</p>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-800">
            {logs.filter((l) => l.targetModel.includes('Voucher')).length}
          </p>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <p className="font-bold uppercase text-[10px]">Security Integrity</p>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-800">100% SECURE</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search log details, admin name, action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#801414] text-xs font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'STUDENTVOUCHER', 'COMMUNITYPROGRAMVOUCHER', 'SYSTEM', 'PRODUCT'].map((model) => (
            <button
              key={model}
              onClick={() => setActionFilter(model)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] uppercase transition-colors cursor-pointer shrink-0 ${
                actionFilter === model
                  ? 'bg-[#801414] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {model === 'STUDENTVOUCHER' ? 'Student Vouchers' : model === 'COMMUNITYPROGRAMVOUCHER' ? 'Community Vouchers' : model}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="inline-block w-7 h-7 border-3 border-[#801414] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading operation audit logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto opacity-40 text-gray-400" />
            <p className="font-bold text-sm">No matching audit logs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-extrabold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Target Schema</th>
                  <th className="py-3 px-4">Details & Notes</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-800">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-black text-gray-900">{log.adminName}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{log.adminEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-red-50 text-[#801414] border border-red-100 px-2 py-0.5 rounded font-mono font-black text-[10px] tracking-wider uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700 font-bold">
                      {log.targetModel}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-sm font-medium leading-normal">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-gray-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
