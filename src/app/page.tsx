import React, { Suspense } from 'react';
import styles from './page.module.css';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Hero from '@/components/storefront/Hero';
import VirtualShops from '@/components/storefront/VirtualShops';
import ShopByCategory from '@/components/storefront/ShopByCategory';
import PromoBanners from '@/components/storefront/PromoBanners';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import WhyShopBanner from '@/components/storefront/WhyShopBanner';
import InternationalBuyers from '@/components/storefront/InternationalBuyers';
import TrustBadges from '@/components/storefront/TrustBadges';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'VENTERSHOP - Premium Multi-Category E-Commerce & Ceylon Export | Sri Lanka',
  description: 'Free Fast Delivery on Orders over LKR 7,500. Premium Groceries, Rani Animal Feed, Ceylon Spices, Books, Electronics, and Direct Commercial Exports.',
  keywords: [
    'VENTERSHOP Sri Lanka',
    'Online Groceries Sri Lanka',
    'Rani Animal Feed',
    'Ceylon Spices Export',
    'Books & Stationery Sri Lanka',
    'V2CC Community Vouchers',
    'Multi-Category Online Store',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VENTERSHOP - Premium Multi-Category E-Commerce & Ceylon Export',
    description: 'Free Fast Delivery on Orders over LKR 7,500. Premium Groceries, Rani Animal Feed, Ceylon Spices, Books, Electronics, and Direct Commercial Exports.',
    url: 'https://ventershop.vercel.app',
    images: [{ url: '/images/hero_banner.webp', width: 1200, height: 630, alt: 'VENTERSHOP Home' }],
  },
};

export default function HomePage() {
  return (
    <div className={`${styles.homepage} flex flex-col min-h-screen w-full overflow-x-hidden font-sans antialiased text-xs font-semibold`} style={{ gap: 0 }}>
      {/* 1. Navigation Header - Direct Render for Instant First Paint */}
      <Header />

      {/* 2. Hero Banner Section + Location Strip - Direct Render with Priority Image */}
      <Hero />

      {/* 3. Shop By Category (8 Categories Grid) */}
      <Suspense fallback={<div className="h-48 bg-transparent animate-pulse" />}>
        <ShopByCategory />
      </Suspense>

      {/* 4. Featured Products Showcase */}
      <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
        <FeaturedProducts />
      </Suspense>

      {/* 5. Community Gift Vouchers */}
      <Suspense fallback={<div className="h-44 bg-transparent animate-pulse" />}>
        <PromoBanners />
      </Suspense>

      {/* 6. Virtual Shops / Shop Categories */}
      <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
        <VirtualShops />
      </Suspense>

      {/* 8. Why Shop With VenterShop? Banner */}
      <Suspense fallback={<div className="h-40 bg-transparent animate-pulse" />}>
        <WhyShopBanner />
      </Suspense>

      {/* International Buyers */}
      <Suspense fallback={<div className="h-64 bg-transparent animate-pulse" />}>
        <InternationalBuyers />
      </Suspense>

      {/* 9. 5-Column Trust Badges */}
      <Suspense fallback={<div className="h-28 bg-transparent animate-pulse" />}>
        <TrustBadges />
      </Suspense>

      {/* 10. Global Footer */}
      <Footer />
    </div>
  );
}
