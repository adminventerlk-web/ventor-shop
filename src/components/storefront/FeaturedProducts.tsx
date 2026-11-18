'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Star, Sparkles, Store } from 'lucide-react';
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
  category?: { _id: string; name: string; slug: string };
  shopName?: string | null;
}

interface ICategoryTab {
  _id: string;
  name: string;
  slug: string;
  count?: number;
}

const DEFAULT_FEATURED: ProductItem[] = [
  {
    _id: 'ceylon-black-tea-500g',
    name: 'Ceylon Black Tea 500g',
    slug: 'ceylon-black-tea-500g',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Pure Ceylon single origin tea',
    price: 1850,
    rating: 5,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'tea', name: 'Ceylon Tea & Spices', slug: 'ceylon-spices' },
  },
  {
    _id: 'ceylon-cinnamon-sticks-250g',
    name: 'Ceylon Cinnamon Sticks',
    slug: 'ceylon-cinnamon-sticks-250g',
    badge: { label: 'Popular Export', type: 'popular' },
    description: 'Authentic Alba grade cinnamon',
    price: 2450,
    rating: 5,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'spices', name: 'Ceylon Spices', slug: 'ceylon-spices' },
  },
  {
    _id: 'ponni-rice-5kg',
    name: 'Ponni Rice 5kg',
    slug: 'ponni-rice-5kg',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Premium quality steamed rice',
    price: 1250,
    rating: 5,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'groceries', name: 'Groceries', slug: 'groceries' },
  },
  {
    _id: 'rani-chicken-feed-10kg',
    name: 'RANI Chicken Feed 10kg',
    slug: 'rani-chicken-feed-10kg',
    badge: { label: 'Popular', type: 'popular' },
    description: 'High nutrition poultry feed',
    price: 3600,
    rating: 5,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'feed', name: 'Rani Animal Feed', slug: 'animal-feed' },
  },
  {
    _id: 'organic-virgin-coconut-oil-500ml',
    name: 'Virgin Coconut Oil 500ml',
    slug: 'organic-virgin-coconut-oil-500ml',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Cold pressed organic coconut oil',
    price: 1450,
    rating: 5,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'groceries', name: 'Groceries', slug: 'groceries' },
  },
  {
    _id: 'rani-cow-feed-25kg',
    name: 'RANI Cow Feed 25kg',
    slug: 'rani-cow-feed-25kg',
    badge: { label: 'Popular Feed', type: 'popular' },
    description: 'Complete nutrient feed for cows',
    price: 5800,
    rating: 5,
    reviewsCount: 87,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'feed', name: 'Rani Animal Feed', slug: 'animal-feed' },
  },
  {
    _id: 'whole-spices-pack-1kg',
    name: 'Organic Whole Spices Pack',
    slug: 'whole-spices-pack-1kg',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'Assorted premium aromatic spices',
    price: 3200,
    rating: 5,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'spices', name: 'Ceylon Spices', slug: 'ceylon-spices' },
  },
  {
    _id: 'traditional-handloom-bedsheet',
    name: 'Ceylon Handloom Bedsheet',
    slug: 'traditional-handloom-bedsheet',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure cotton handcrafted',
    price: 4500,
    rating: 5,
    reviewsCount: 99,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    category: { _id: 'handloom', name: 'Handloom & Crafts', slug: 'handloom' },
  },
];

export default function FeaturedProducts() {
  const { language } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_FEATURED);
  const [categories, setCategories] = useState<ICategoryTab[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch dynamic super-admin selected featured products
  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await fetch('/api/products/featured');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live featured products, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // Motion observer
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
  }, [selectedCategory, products]);

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod._id, 1, undefined, prod.price, {
      name: prod.name,
      image: prod.image,
      price: prod.price,
    });
  };

  // Filter products by selected category (Max 10 per category)
  const displayedProducts = (
    selectedCategory === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category?.slug === selectedCategory ||
            p.category?._id === selectedCategory ||
            p.category?.name.toLowerCase() === selectedCategory.toLowerCase()
        )
  ).slice(0, 10);

  return (
    <section ref={sectionRef} id="featured-products" aria-labelledby="featured-products-heading" className={styles.section}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headingGroup}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded-md bg-amber-500/15 text-amber-700">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0052CC]">
                  {language === 'ta' ? 'நிர்வாகியின் சிறப்பு தேர்வு' : 'Super Admin Curated'}
                </span>
              </div>
              <h2 id="featured-products-heading" className={styles.heading}>
                {language === 'ta' ? 'சிறப்பு தயாரிப்புகள்' : language === 'si' ? 'විශේෂිත නිෂ්පාදන' : 'FEATURED PRODUCTS'}
              </h2>
              <p className={styles.subtitle}>
                {language === 'ta'
                  ? 'பிரிவு வாரியாக சிறந்த தயாரிப்புகள் • அதிகபட்சம் 10 தயாரிப்புகள்'
                  : 'Curated category highlights • Up to 10 top products per category'}
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

        {/* Category Filter Tabs (if categories exist) */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#021838] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Featured ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug || cat._id}
                onClick={() => setSelectedCategory(cat.slug || cat._id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === (cat.slug || cat._id)
                    ? 'bg-[#0052CC] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      selectedCategory === (cat.slug || cat._id)
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid (Max 10) */}
        <div className={styles.grid}>
          {displayedProducts.map((prod, index) => {
            const isBestSeller = prod.badge.type === 'best_seller';
            const isPopular = prod.badge.type === 'popular';
            return (
              <div key={prod._id} data-product-card className={styles.entrance}
                style={{ '--product-index': index } as React.CSSProperties}>
                <div className={styles.floating}>
                  <article className={styles.card} aria-label={prod.name}>
                    <div className={styles.media}>
                      <Link href={`/product/${prod.slug}`} className={styles.imageLink}>
                        {/* Preserve remote images and fallback */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          width={400}
                          height={400}
                          onError={(e) => {
                            const fallback = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                            if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                          }}
                          className={styles.image}
                          loading="lazy"
                        />
                      </Link>
                      <span className={`${styles.badge} ${isBestSeller ? styles.bestSeller : isPopular ? styles.popular : styles.newArrival}`}>
                        {prod.badge.label}
                      </span>
                    </div>
                    <div className={styles.details}>
                      {/* Shop Name if from partner merchant */}
                      {prod.shopName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 line-clamp-1 mb-0.5">
                          <Store className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{prod.shopName}</span>
                        </div>
                      )}
                      <Link href={`/product/${prod.slug}`} className={styles.name}>{prod.name}</Link>
                      <p className={styles.description}>{prod.description}</p>
                      <div className={styles.rating} aria-label={`${prod.rating} out of 5 stars, ${prod.reviewsCount} reviews`}>
                        <Star size={14} aria-hidden="true" />
                        <span>{prod.rating.toFixed(1)}</span>
                        <span className={styles.reviewCount}>({prod.reviewsCount})</span>
                      </div>
                      <div className={styles.purchase}>
                        <p className={styles.price}>{formatCurrency(prod.price)}</p>
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, prod)}
                          className={styles.addButton}
                          aria-label={`Add ${prod.name} to cart`}
                        >
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