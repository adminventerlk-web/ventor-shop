import React from 'react';
import { Metadata } from 'next';
import LoginClient from '@/components/auth/LoginClient';

export const metadata: Metadata = {
  title: 'Sign In / Account Registration - VENTERPRISE',
  description: 'Log in securely or create your VENTERPRISE account to manage orders, access community discount vouchers, and process wholesale orders.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
