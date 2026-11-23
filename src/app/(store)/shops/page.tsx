import React from 'react';
import { Metadata } from 'next';
import AllShopsClient from '@/components/shops/AllShopsClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Certified Partner Stores & Merchant Marketplace | VENTERPRISE Sri Lanka',
  description:
    'Browse all certified partner stores and independent sellers on VENTERPRISE. Shop Ceylon spices, organic groceries, stationery, and handcrafted goods with islandwide delivery.',
  keywords: [
    'Partner Stores Sri Lanka',
    'Verified Sellers',
    'Venterprise Marketplace',
    'Ceylon Spices Shops',
    'Virtual Shops',
  ],
  alternates: {
    canonical: '/shops',
  },
  openGraph: {
    title: 'Certified Partner Stores & Merchant Marketplace | VENTERPRISE',
    description:
      'Browse all certified partner stores and independent sellers on VENTERPRISE. Shop Ceylon spices, organic groceries, stationery, and handcrafted goods.',
    url: 'https://venterprise.vercel.app/shops',
    images: [{ url: '/images/hero_banner.webp' }],
  },
};

export default function AllShopsPage() {
  const shopsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VENTERPRISE Certified Partner Stores',
    url: 'https://venterprise.vercel.app/shops',
    description:
      'Certified independent vendor shops on the VENTERPRISE multi-vendor platform.',
  };

  return (
    <>
      <JsonLd data={shopsJsonLd} />
      <AllShopsClient />
    </>
  );
}
