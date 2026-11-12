'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';
import { featuredProductStyles as styles } from './FeaturedProducts.styles';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  badge: { label: string; type: 'best_seller' | 'popular' | 'new' };
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

const DEFAULT_FEATURED: ProductItem[] = [
  {
    _id: 'ceylon-black-tea-500g',
    name: 'Ceylon Black Tea 500g',
    slug: 'ceylon-black-tea-500g',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Pure Ceylon single origin tea',
    price: 8.90,
    rating: 5,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'ceylon-cinnamon-sticks-250g',
    name: 'Ceylon Cinnamon Sticks',
    slug: 'ceylon-cinnamon-sticks-250g',
    badge: { label: 'Popular Export', type: 'popular' },
    description: 'Authentic Alba grade cinnamon',
    price: 9.80,
    rating: 5,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'ponni-rice-5kg',
    name: 'Ponni Rice 5kg',
    slug: 'ponni-rice-5kg',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Premium quality steamed rice',
    price: 12.50,
    rating: 5,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-chicken-feed-10kg',
    name: 'RANI Chicken Feed 10kg',
    slug: 'rani-chicken-feed-10kg',
    badge: { label: 'Popular', type: 'popular' },
    description: 'High nutrition poultry feed',
    price: 11.50,
    rating: 5,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'organic-virgin-coconut-oil-500ml',
    name: 'Virgin Coconut Oil 500ml',
    slug: 'organic-virgin-coconut-oil-500ml',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Cold pressed organic coconut oil',
    price: 7.20,
    rating: 5,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-cow-feed-25kg',
    name: 'RANI Cow Feed 25kg',
    slug: 'rani-cow-feed-25kg',
    badge: { label: 'Popular Feed', type: 'popular' },
    description: 'Complete nutrient feed for cows',
    price: 23.50,
    rating: 5,
    reviewsCount: 87,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'whole-spices-pack-1kg',
    name: 'Organic Whole Spices Pack',
    slug: 'whole-spices-pack-1kg',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'Assorted premium aromatic spices',
    price: 15.40,
    rating: 5,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'sun-flower-oil-1l',
    name: 'Sun Flower Oil 1L',
    slug: 'sun-flower-oil-1l',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure sunflower oil',
    price: 4.50,
    rating: 5,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'wireless-headphones',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'High quality sound & bass',
    price: 24.90,
    rating: 5,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'soft-blankets',
    name: 'Soft Blankets',
    slug: 'soft-blankets',
    badge: { label: 'Popular', type: 'popular' },
    description: 'Warm & comfortable fleece',
    price: 18.90,
    rating: 5,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'traditional-handloom-bedsheet',
    name: 'Ceylon Handloom Bedsheet',
    slug: 'traditional-handloom-bedsheet',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure cotton handcrafted',
    price: 22.00,
    rating: 5,
    reviewsCount: 99,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'stainless-kitchen-set',
    name: 'Stainless Cookware Set',
    slug: 'stainless-kitchen-set',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'Durable multi-piece cookware',
    price: 45.00,
    rating: 5,
    reviewsCount: 43,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FeaturedProducts() {
  const { language } = useTranslation();
  const { addToCart } = useCart();
  const [products] = useState<ProductItem[]>(DEFAULT_FEATURED);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    section.dataset.motion = 'ready';
    const observer = new IntersectionObserver((entries) => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        const card = entry.target as HTMLElement;
        card.style.setProperty('--entrance-delay', index * 100 + 'ms');
        card.dataset.entered = 'true';
        observer.unobserve(card);
      });
    }, { threshold: 0.12 });
    section.querySelectorAll('[data-product-card]').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod._id, 1);
  };

  return (
    <section ref={sectionRef} id="featured-products" aria-labelledby="featured-products-heading" className={styles.section}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headingGroup}>
            <div>
              <h2 id="featured-products-heading" className={styles.heading}>
                {language === 'ta' ? 'சிறப்பு தயாரிப்புகள்' : language === 'si' ? 'විශේෂිත නිෂ්පාදන' : 'FEATURED PRODUCTS'}
              </h2>
              <p className={styles.subtitle}>
                {language === 'ta' ? 'அதிகமாக விற்பனையாகும் மற்றும் சிறந்த சலுகைகள்' : 'Best selling products & top quality imports'}
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className={styles.viewAll}
          >
            <span>{language === 'ta' ? 'அனைத்து தயாரிப்புகளும்' : 'View All Products'} →</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {products.slice(0, 8).map((prod, index) => {
            const isBestSeller = prod.badge.type === 'best_seller';
            const isPopular = prod.badge.type === 'popular';
            return (
              <div key={prod._id} data-product-card className={styles.entrance}
                style={{ '--product-index': index } as React.CSSProperties}>
                <div className={styles.floating}>
                  <article className={styles.card} aria-label={prod.name}>
                    <div className={styles.media}>
                      <Link href={`/product/${prod.slug}`} className={styles.imageLink}>
                        {/* Preserve the existing remote images and fallback. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={prod.image} alt={prod.name} width={400} height={400}
                          onError={(e) => {
                            const fallback = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                            if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                          }}
                          className={styles.image} loading="lazy" />
                      </Link>
                      <span className={`${styles.badge} ${isBestSeller ? styles.bestSeller : isPopular ? styles.popular : styles.newArrival}`}>
                        {prod.badge.label}
                      </span>
                    </div>
                    <div className={styles.details}>
                      <Link href={`/product/${prod.slug}`} className={styles.name}>{prod.name}</Link>
                      <p className={styles.description}>{prod.description}</p>
                      <div className={styles.rating} aria-label={`${prod.rating} out of 5 stars, ${prod.reviewsCount} reviews`}>
                        <Star size={14} aria-hidden="true" />
                        <span>{prod.rating.toFixed(1)}</span>
                        <span className={styles.reviewCount}>({prod.reviewsCount})</span>
                      </div>
                      <div className={styles.purchase}>
                        <p className={styles.price}>{formatCurrency(prod.price)}</p>
                        <button type="button" onClick={(e) => handleAddToCart(e, prod)}
                          className={styles.addButton} aria-label={`Add ${prod.name} to cart`}>
                          <ShoppingCart size={16} aria-hidden="true" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
