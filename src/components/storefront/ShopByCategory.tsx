'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ShopByCategory.module.css';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ICategoryItem {
  _id?: string;
  title: string;
  slug: string;
  img: string;
}

const CANONICAL_CATEGORIES: ICategoryItem[] = [
  {
    title: 'Fruits &\nVegetables',
    slug: 'groceries',
    img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Kitchen &\nAppliances',
    slug: 'home',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Books &\nStationery',
    slug: 'books',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Clothing &\nFashion',
    slug: 'clothing',
    img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Mobiles &\nElectronics',
    slug: 'electronics',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Pet Care &\nSupplies',
    slug: 'animal-feed',
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Plants &\nGarden',
    slug: 'plants',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Gifts &\nSurprises',
    slug: 'gifts',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
  },
];

const FALLBACK_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

function CategoryItem({ cat, index }: { cat: ICategoryItem; index: number }) {
  const [imgUrl, setImgUrl] = useState(cat.img || FALLBACK_CATEGORY_IMAGE);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const resetTilt = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    cardRef.current?.style.setProperty('--tilt-x', '0deg');
    cardRef.current?.style.setProperty('--tilt-y', '0deg');
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const card = cardRef.current;
      // Measure the un-tilted float layer so rotation never feeds back into the math.
      const rect = card?.parentElement?.getBoundingClientRect();
      if (!card || !rect || !rect.width || !rect.height) return;
      const x = Math.max(-1, Math.min(1, (pointerRef.current.x - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (pointerRef.current.y - rect.top) / rect.height * 2 - 1));
      card.style.setProperty('--tilt-x', (-y * 4).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (x * 4).toFixed(2) + 'deg');
    });
  };
  return (
    <div className={styles.entrance} style={{ '--card-index': index } as React.CSSProperties}>
      <div className={styles.floating}>
        <Link ref={cardRef} href={`/shop?category=${cat.slug}`} className={styles.card}
          onPointerMove={handlePointerMove} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
          <div className={styles.scene}>
            <span className={styles.halo} aria-hidden="true" />
            <span className={styles.backplate} aria-hidden="true" />
            <div className={styles.imageMotion}>
              <div className={styles.imageFrame}>
                {/* Keep the existing remote assets and fallback behavior. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={cat.title.replace('\n', ' ')}
                  onError={() => setImgUrl(FALLBACK_CATEGORY_IMAGE)}
                  className={styles.image} loading="lazy" width={240} height={180} />
              </div>
            </div>
          </div>
          <span className={styles.cardFooter}>
            <span className={styles.label}>{cat.title}</span>
            <span className={styles.cardArrow} aria-hidden="true"><ArrowRight size={20} /></span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function ShopByCategory() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = CANONICAL_CATEGORIES;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    section.dataset.motion = 'ready';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.dataset.entered = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} aria-label="Shop by Category" className={`${styles.section} py-10 sm:py-14 bg-white border-b border-gray-100 overflow-hidden text-xs font-semibold`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Navigation arrows */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={styles.heading}>
              <span>SHOP</span>{' '}<span>BY</span>{' '}<span>CATEGORY</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#0052CC] hover:text-[#0052CC] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#0052CC] hover:text-[#0052CC] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scrolling remains available at smaller widths. */}
        <div className="relative">
          <div
            ref={scrollRef}
            className={styles.track}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, idx) => (
              <CategoryItem key={cat._id || idx} cat={cat} index={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
