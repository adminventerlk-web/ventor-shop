'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
}: BrandLogoProps) {
  // Height options for responsive scaling
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2 group select-none py-0.5">
      <img
        src="/images/logo.png"
        alt="VENTERSHOP Logo"
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs`}
      />
    </Link>
  );
}

