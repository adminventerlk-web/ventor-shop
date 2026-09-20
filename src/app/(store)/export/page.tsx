import React from 'react';
import { Metadata } from 'next';
import ExportClient from '@/components/export/ExportClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Global Export Portal - Direct Wholesale Shipping from Sri Lanka',
  description: 'Source authentic Ceylon spices, tea, Rani animal feed, and groceries directly from Sri Lanka with FCL/LCL sea freight & priority air cargo solutions.',
  keywords: ['Sri Lanka Export', 'Ceylon Spices Export', 'Rani Animal Feed Bulk Export', 'Commercial Importers', 'FOB CIF Pricing', 'Ceylon Tea Wholesale'],
  alternates: {
    canonical: '/export',
  },
  openGraph: {
    title: 'Global Export Portal - VENTERSHOP Sri Lanka',
    description: 'Source authentic Ceylon spices, tea, Rani animal feed, and groceries directly from Sri Lanka with FCL/LCL sea freight & priority air cargo solutions.',
    url: 'https://ventershop.vercel.app/export',
    images: [{ url: '/images/sri_lankan_exports.jpg' }],
  },
};

export default function ExportPage() {
  const exportJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'VENTERSHOP Global Export Portal',
    serviceType: 'International Freight & Wholesale Supply',
    provider: {
      '@type': 'Organization',
      name: 'VENTERSHOP',
      url: 'https://ventershop.vercel.app',
    },
    areaServed: ['Canada', 'United Kingdom', 'United States', 'Australia', 'United Arab Emirates', 'Europe'],
    description: 'Bulk commercial exports of Ceylon spices, tea, Rani animal feed, and FMCG products from Sri Lanka.',
  };

  return (
    <>
      <JsonLd data={exportJsonLd} />
      <ExportClient />
    </>
  );
}
