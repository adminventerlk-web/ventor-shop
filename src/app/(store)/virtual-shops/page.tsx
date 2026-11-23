import React from 'react';
import { Metadata } from 'next';
import VirtualShopsClient from '@/components/virtual-shops/VirtualShopsClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Virtual Specialty Shops - Supermarket, Books, Electronics & Fashion',
  description: 'Explore specialized virtual shops at VENTERPRISE: Virtual Supermarket, Virtual Book Lab, Shoe Shop, Phone Center, and Fashion Store.',
  keywords: ['Virtual Shops', 'Virtual Supermarket', 'Virtual Book Lab', 'Online Grocery Sri Lanka', 'Specialty Shopping'],
  alternates: {
    canonical: '/virtual-shops',
  },
  openGraph: {
    title: 'Virtual Specialty Shops - VENTERPRISE',
    description: 'Explore specialized virtual shops at VENTERPRISE: Virtual Supermarket, Virtual Book Lab, Shoe Shop, Phone Center, and Fashion Store.',
    url: 'https://venterprise.vercel.app/virtual-shops',
    images: [{ url: '/images/hero_banner.png' }],
  },
};

export default function VirtualShopsPage() {
  const virtualShopsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'VENTERPRISE Virtual Specialty Marketplace',
    url: 'https://venterprise.vercel.app/virtual-shops',
    description: 'Specialized virtual shop storefronts for groceries, books, footwear, mobile devices, and electronics.',
  };

  return (
    <>
      <JsonLd data={virtualShopsJsonLd} />
      <VirtualShopsClient />
    </>
  );
}
