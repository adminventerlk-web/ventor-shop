import React from 'react';
import { AdRequestStatus } from '@/models/AdvertisementRequest';
import { AdStatus } from '@/models/Advertisement';

interface Props {
  status: AdRequestStatus | AdStatus | string;
}

export default function AdvertisementStatusBadge({ status }: Props) {
  const s = (status || '').toUpperCase();

  switch (s) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-300 text-[10px] font-black uppercase tracking-wider">
          <span>Approved</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 text-[10px] font-black uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Pending</span>
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-300 text-[10px] font-black uppercase tracking-wider">
          <span>Under Review</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-300 text-[10px] font-black uppercase tracking-wider">
          <span>Rejected</span>
        </span>
      );
    case 'PAUSED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-black uppercase tracking-wider">
          <span>Paused</span>
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-black uppercase tracking-wider">
          <span>Expired</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
          {s}
        </span>
      );
  }
}
