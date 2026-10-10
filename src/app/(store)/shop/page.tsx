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
    url: 'https://www.ventershop.com/shop',
    images: [{ url: '/images/hero_banner.png' }],
  },
};

export default function ShopPage() {
  const shopCatalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VENTERSHOP Multi-Category Catalog',
    url: 'https://www.ventershop.com/shop',
    description: 'Complete inventory catalog of groceries, livestock feed, stationery, literature, and electronics.',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <JsonLd data={shopCatalogJsonLd} />
      <Header />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-black text-[#1A2A4A] mb-4">Shop All Categories</h1>
              <p className="text-xs text-gray-500 mb-6 font-semibold">
                Explore groceries, Ceylon spices, Rani animal feed, books, and electronics.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-64 p-4 border border-gray-200 animate-pulse" />
                ))}
              </div>
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
