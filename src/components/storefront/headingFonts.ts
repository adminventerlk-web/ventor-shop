import localFont from 'next/font/local';

export const heroHeadingFont = localFont({
  src: [
    { path: './fonts/PlayfairDisplay-Regular.ttf', weight: '500', style: 'normal' },
    { path: './fonts/PlayfairDisplay-Italic.ttf', weight: '500', style: 'italic' },
  ],
  variable: '--font-hero-heading',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const categoryHeadingFont = localFont({
  src: './fonts/DMSans-Regular.ttf',
  weight: '600',
  style: 'normal',
  variable: '--font-category-heading',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});
