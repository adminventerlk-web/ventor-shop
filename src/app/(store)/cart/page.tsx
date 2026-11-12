import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartContentClient from '@/components/cart/CartContentClient';

export const metadata: Metadata = {
  title: 'Your Cart - VENTERSHOP',
  description: 'View your selected products, apply voucher codes, and check out.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] [&>header]:bg-none! [&>header]:bg-inherit! [&_main_button]:focus-visible:outline-3 [&_main_button]:focus-visible:outline-offset-3 [&_main_button]:focus-visible:outline-[#0759D6] [&_main_a]:focus-visible:outline-3 [&_main_a]:focus-visible:outline-offset-3 [&_main_a]:focus-visible:outline-[#0759D6] motion-reduce:[&_main_*]:transition-none! motion-reduce:[&_main_*]:animate-none!">
      <Header />
      <main className="flex-grow pt-6 pb-12 sm:pt-8 lg:pt-4">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#0759D6] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 mt-2">Loading your cart...</p>
            </div>
          }
        >
          <CartContentClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
