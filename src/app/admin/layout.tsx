import React, { Suspense } from 'react';
import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata: Metadata = {
  title: 'Admin Control Center - VENTERSHOP',
  description: 'Manage products, orders, customers, vouchers, and storefront configurations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <Suspense
        fallback={
          <div className="h-full w-full min-h-[400px] flex items-center justify-center">
            <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </AdminGuard>
  );
}
