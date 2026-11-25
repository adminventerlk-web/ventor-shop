import React from 'react';
import { Metadata } from 'next';
import VouchersClient from '@/components/vouchers/VouchersClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Student Gift Vouchers - V2CC Educating Bank System',
  description: 'Apply and redeem Student Gift Vouchers on VENTERPRISE for textbooks, stationery, and educational study materials.',
  keywords: ['Venterprise Vouchers', 'Student Gift Voucher', 'V2CC Educating Bank', 'Sri Lanka Student Discount'],
  alternates: {
    canonical: '/vouchers',
  },
  openGraph: {
    title: 'Student Gift Vouchers - VENTERPRISE',
    description: 'Apply and redeem Student Gift Vouchers on VENTERPRISE for textbooks, stationery, and educational study materials.',
    url: 'https://venterprise.vercel.app/vouchers',
  },
};

export default function CommunityVouchersPage() {
  const vouchersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'VENTERPRISE Student Gift Vouchers',
    url: 'https://venterprise.vercel.app/vouchers',
    description: 'Subsidized vouchers for educational materials and books supported by V2CC Educating Bank System.',
  };

  return (
    <>
      <JsonLd data={vouchersJsonLd} />
      <VouchersClient />
    </>
  );
}
