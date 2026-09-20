import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { CartProvider } from '@/lib/cart/CartContext';
import JsonLd from '@/components/seo/JsonLd';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ventershop.vercel.app';

export const viewport: Viewport = {
  themeColor: '#1A2A4A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "VENTERSHOP - Premium Multi-Category E-Commerce & Ceylon Export",
    template: "%s | VENTERSHOP",
  },
  description: "Your trusted online store for high-quality groceries, Rani animal feed, Ceylon spices, books, electronics, daily essentials, and global bulk export from Sri Lanka.",
  keywords: [
    "VENTERSHOP",
    "Online Shopping Sri Lanka",
    "Ceylon Spices Export",
    "Rani Animal Feed",
    "Sri Lankan Groceries",
    "Buy Books Online",
    "V2CC Community Vouchers",
    "Multi-Category E-Commerce",
    "B2B Wholesale Sri Lanka",
    "Virtual Supermarket",
    "Ceylon Tea Export",
  ],
  authors: [{ name: "VENTERSHOP", url: baseUrl }],
  creator: "VENTERSHOP",
  publisher: "VENTERSHOP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "VENTERSHOP",
    title: "VENTERSHOP - Premium Multi-Category E-Commerce & Ceylon Export",
    description: "Discover premium groceries, Rani livestock feed, Ceylon spices, stationery, electronics, and direct international export from Sri Lanka.",
    images: [
      {
        url: "/images/hero_banner.png",
        width: 1200,
        height: 630,
        alt: "VENTERSHOP Online Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VENTERSHOP - Premium Multi-Category E-Commerce & Ceylon Export",
    description: "Discover premium groceries, Rani livestock feed, Ceylon spices, stationery, electronics, and direct international export from Sri Lanka.",
    images: ["/images/hero_banner.png"],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VENTERSHOP',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.svg`,
    description: 'Premier multi-category e-commerce and international export platform.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0199',
      contactType: 'customer service',
      availableLanguage: ['English', 'Tamil'],
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VENTERSHOP',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
