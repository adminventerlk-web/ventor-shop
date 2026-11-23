import React, { Suspense } from 'react';
import { Metadata } from 'next';
import VendorGuard from '@/components/vendor/VendorGuard';

export const metadata: Metadata = {
  title: 'Vendor Seller Portal - VENTERPRISE',
  description: 'Manage your storefront, upload products with custom variants, and track incoming orders.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorGuard>
      <Suspense
        fallback={
          <div className="h-full w-full min-h-[400px] flex items-center justify-center bg-[#010e24]">
            <div className="w-8 h-8 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </VendorGuard>
  );
}

