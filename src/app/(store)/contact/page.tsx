import React from 'react';
import { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us - Customer Support & B2B Inquiries',
  description: 'Get in touch with VENTERPRISE support desk for order help, wholesale B2B applications, export queries, and community voucher assistance.',
  keywords: ['Contact VENTERPRISE', 'Venterprise Phone', 'Support Desk', 'B2B Wholesale Inquiry', 'Export Inquiry Sri Lanka'],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us - VENTERPRISE',
    description: 'Get in touch with VENTERPRISE support desk for order help, wholesale B2B applications, export queries, and community voucher assistance.',
    url: 'https://venterprise.vercel.app/contact',
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact VENTERPRISE',
    url: 'https://venterprise.vercel.app/contact',
    description: 'Contact customer support, B2B wholesale team, and export desk at VENTERPRISE.',
    mainEntity: {
      '@type': 'Organization',
      name: 'VENTERPRISE',
      telephone: '+1-800-555-0199',
      email: 'support@venterprise.com',
    },
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactClient />
    </>
  );
}
