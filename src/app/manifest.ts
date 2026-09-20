import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VENTERSHOP - Premium Multi-Category E-Commerce & Global Export',
    short_name: 'VENTERSHOP',
    description: 'Your Trusted Online Store for Quality Products, Rani Animal Feed, Groceries, and Ceylon Exports.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1A2A4A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
