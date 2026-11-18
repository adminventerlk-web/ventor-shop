'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Eye } from 'lucide-react';

interface AdvertisementImageGalleryProps {
  images: string[];
  title: string;
  aspectRatioPreference?: 'AUTO' | 'POSTER' | 'LANDSCAPE' | 'SQUARE';
  accentColor?: string;
}

export default function AdvertisementImageGallery({
  images,
  title,
  aspectRatioPreference = 'AUTO',
  accentColor = '#FFB800',
}: AdvertisementImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');

  const count = images ? images.length : 0;
  if (count === 0) return null;

  const openLightbox = (url: string) => {
    setLightboxImg(url);
    setLightboxOpen(true);
  };

  // Determine container aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatioPreference) {
      case 'POSTER':
        return 'aspect-[3/4]';
      case 'SQUARE':
        return 'aspect-square';
      case 'LANDSCAPE':
        return 'aspect-[16/9]';
      case 'AUTO':
      default:
        return 'aspect-[4/3]';
    }
  };

  // ──────────────────────────────────────────────
  // 1 IMAGE: Large Premium Promotional Banner
  // ──────────────────────────────────────────────
  if (count === 1) {
    return (
      <div className="relative group overflow-hidden rounded-2xl bg-gray-950 border border-white/10 shadow-lg">
        <div className={`w-full ${getAspectClass()} relative overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Quick Lightbox Zoom Button */}
          <button
            type="button"
            onClick={() => openLightbox(images[0])}
            className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
            title="View Full Resolution"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        {lightboxModal(lightboxOpen, lightboxImg, title, () => setLightboxOpen(false))}
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // 2 IMAGES: Balanced Two-Column Split Layout
  // ──────────────────────────────────────────────
  if (count === 2) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2.5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-2xl bg-gray-950 border border-white/10 shadow-md aspect-[4/3]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${title} photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <button
                type="button"
                onClick={() => openLightbox(img)}
                className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        {lightboxModal(lightboxOpen, lightboxImg, title, () => setLightboxOpen(false))}
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // 3 IMAGES: Attractive Three-Card Layout (1 Large Hero + 2 Stacked)
  // ──────────────────────────────────────────────
  if (count === 3) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2.5">
          {/* Main Hero (7 cols) */}
          <div className="col-span-7 relative group overflow-hidden rounded-2xl bg-gray-950 border border-white/10 shadow-md aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={`${title} main`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-black uppercase tracking-wider text-white">
              Featured
            </span>
            <button
              type="button"
              onClick={() => openLightbox(images[0])}
              className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2 Stacked Cards (5 cols) */}
          <div className="col-span-5 grid grid-rows-2 gap-2.5">
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden rounded-xl bg-gray-950 border border-white/10 shadow-xs h-full aspect-[4/2.5] sm:aspect-auto"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${title} secondary ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => openLightbox(img)}
                  className="absolute bottom-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {lightboxModal(lightboxOpen, lightboxImg, title, () => setLightboxOpen(false))}
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // 4 IMAGES: Professional 2x2 Grid
  // ──────────────────────────────────────────────
  if (count === 4) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl bg-gray-950 border border-white/10 shadow-xs aspect-[4/3]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${title} grid ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white/80">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => openLightbox(img)}
                className="absolute bottom-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Eye className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {lightboxModal(lightboxOpen, lightboxImg, title, () => setLightboxOpen(false))}
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // 5+ IMAGES: Responsive Interactive Carousel & Thumbnail Strip
  // ──────────────────────────────────────────────
  const activeImage = images[activeIdx] || images[0];

  return (
    <div className="space-y-2.5">
      {/* Featured Active Display */}
      <div className="relative group overflow-hidden rounded-2xl bg-gray-950 border border-white/10 shadow-xl aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeImage}
          src={activeImage}
          alt={`${title} ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 animate-fadeIn"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-black text-white border border-white/20">
          {activeIdx + 1} / {count}
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() => setActiveIdx((prev) => (prev - 1 + count) % count)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setActiveIdx((prev) => (prev + 1) % count)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
          aria-label="Next photo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => openLightbox(activeImage)}
          className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Interactive Thumbnail Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`relative w-14 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
              activeIdx === idx
                ? 'scale-105 shadow-md'
                : 'border-white/20 opacity-60 hover:opacity-100'
            }`}
            style={{ borderColor: activeIdx === idx ? accentColor : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightboxModal(lightboxOpen, lightboxImg, title, () => setLightboxOpen(false))}
    </div>
  );
}

// Reusable Lightbox Modal
function lightboxModal(isOpen: boolean, imgUrl: string, title: string, onClose: () => void) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={title}
          className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
        />
        <p className="text-xs font-bold text-white/80 mt-3 text-center">{title}</p>
      </div>
    </div>
  );
}
