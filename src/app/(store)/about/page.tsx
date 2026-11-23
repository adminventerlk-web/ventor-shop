import React from 'react';
import { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - Our Story, Mission & Values',
  description: 'Learn about VENTERPRISE, Sri Lanka\'s premier multi-category e-commerce platform offering groceries, Rani animal feed, books, electronics, and global bulk export.',
  keywords: ['About VENTERPRISE', 'Venterprise Story', 'Sri Lanka E-Commerce', 'Bilingual Store', 'V2CC Community'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us - VENTERPRISE',
    description: 'Learn about VENTERPRISE, Sri Lanka\'s premier multi-category e-commerce platform offering groceries, Rani animal feed, books, electronics, and global export.',
    url: 'https://venterprise.vercel.app/about',
    images: [{ url: '/images/storefront_3d.jpg' }],
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About VENTERPRISE',
    url: 'https://venterprise.vercel.app/about',
    description: 'Learn about VENTERPRISE, Sri Lanka\'s premier multi-category e-commerce platform.',
    mainEntity: {
      '@type': 'Organization',
      name: 'VENTERPRISE',
      foundingDate: '2026',
      description: 'Multi-category retail and commercial export provider.',
    },
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutClient />
    </>
  );
}
