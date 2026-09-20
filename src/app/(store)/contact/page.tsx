import React from 'react';
import { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us - Customer Support & B2B Inquiries',
  description: 'Get in touch with VENTERSHOP support desk for order help, wholesale B2B applications, export queries, and community voucher assistance.',
  keywords: ['Contact VENTERSHOP', 'VenterShop Phone', 'Support Desk', 'B2B Wholesale Inquiry', 'Export Inquiry Sri Lanka'],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us - VENTERSHOP',
    description: 'Get in touch with VENTERSHOP support desk for order help, wholesale B2B applications, export queries, and community voucher assistance.',
    url: 'https://ventershop.vercel.app/contact',
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact VENTERSHOP',
    url: 'https://ventershop.vercel.app/contact',
    description: 'Contact customer support, B2B wholesale team, and export desk at VENTERSHOP.',
    mainEntity: {
      '@type': 'Organization',
      name: 'VENTERSHOP',
      telephone: '+1-800-555-0199',
      email: 'support@ventershop.com',
    },
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactClient />
    </>
  );
}
