import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ShopContent from '@/components/storefront/ShopContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Shop All Categories - Groceries, Feed, Books & Electronics',
  description: 'Explore the complete VENTERSHOP catalog: fresh groceries, Ceylon spices, Rani animal feed, Tamil & English books, stationery, mobile devices, and daily household items.',
  keywords: ['Shop Online Sri Lanka', 'Buy Groceries', 'Rani Animal Feed', 'Buy Books Sri Lanka', 'Electronics Catalog'],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Categories - VENTERSHOP',
    description: 'Explore the complete VENTERSHOP catalog: fresh groceries, Ceylon spices, Rani animal feed, Tamil & English books, stationery, mobile devices, and daily household items.',
    url: 'https://ventershop.vercel.app/shop',
    images: [{ url: '/images/hero_banner.png' }],
  },
};

export default function ShopPage() {
  const shopCatalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VENTERSHOP Multi-Category Catalog',
    url: 'https://ventershop.vercel.app/shop',
    description: 'Complete inventory catalog of groceries, livestock feed, stationery, literature, and electronics.',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <JsonLd data={shopCatalogJsonLd} />
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 mt-2">Loading catalog...</p>
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
