import React from 'react';
import { Metadata } from 'next';
import VouchersClient from '@/components/vouchers/VouchersClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Community Gift Vouchers - V2CC Educating Bank & TMSAP Project',
  description: 'Redeem community gift vouchers on VENTERSHOP for educational textbooks, stationery, and family grocery support packages.',
  keywords: ['VenterShop Vouchers', 'Student Gift Voucher', 'V2CC Educating Bank', 'TMSAP Project', 'Sri Lanka Community Discount'],
  alternates: {
    canonical: '/vouchers',
  },
  openGraph: {
    title: 'Community Gift Vouchers - VENTERSHOP',
    description: 'Redeem community gift vouchers on VENTERSHOP for educational textbooks, stationery, and family grocery support packages.',
    url: 'https://ventershop.vercel.app/vouchers',
  },
};

export default function CommunityVouchersPage() {
  const vouchersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'VENTERSHOP Community Gift Vouchers',
    url: 'https://ventershop.vercel.app/vouchers',
    description: 'Subsidized vouchers for educational materials and family essentials supported by V2CC.',
  };

  return (
    <>
      <JsonLd data={vouchersJsonLd} />
      <VouchersClient />
    </>
  );
}
