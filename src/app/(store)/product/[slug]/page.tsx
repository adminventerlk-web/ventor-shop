import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { fallbackProducts, fallbackCategories } from '@/lib/data/fallbackData';
import JsonLd from '@/components/seo/JsonLd';

// Always SSR — never statically generate so vendor products are always found
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://venterprise.vercel.app';

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    let product: any = null;

    try {
      await connectToDatabase();
      product = await Product.findOne({
        $or: [
          { slug },
          { slug: slug.toLowerCase() },
          { slug: new RegExp(`^${slug}$`, 'i') },
        ],
      }).lean();
    } catch {}

    if (!product) {
      product = fallbackProducts.find((p) => p.slug === slug);
    }
    if (!product && (global as any).globalVendorProducts) {
      for (const list of (global as any).globalVendorProducts.values()) {
        if (Array.isArray(list)) {
          const found = list.find((p: any) => p.slug === slug);
          if (found) { product = found; break; }
        }
      }
    }
    
    if (!product) {
      return {
        title: 'Product Details - VENTERPRISE',
        description: 'Browse quality groceries, animal feed, books, and daily essentials at VENTERPRISE.',
      };
    }

    const description = product.shortDescription || product.description.substring(0, 160);
    const image = product.images && product.images.length > 0 ? product.images[0] : '/images/hero_banner.png';

    return {
      title: `${product.name} | VENTERPRISE Sri Lanka`,
      description: description,
      keywords: [product.name, 'VENTERPRISE Product', 'Online Shopping Sri Lanka', product.sku || 'E-Commerce SKU'],
      alternates: {
        canonical: `/product/${slug}`,
      },
      openGraph: {
        title: product.name,
        description: description,
        url: `${baseUrl}/product/${slug}`,
        siteName: 'VENTERPRISE',
        images: [{ url: image, alt: product.name }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: 'Product Details - VENTERPRISE',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;

  try {
    await connectToDatabase();

    // Use lean() and case-insensitive matching to avoid CastError when categoryId is a string (vendor products)
    const productDoc = await Product.findOne({
      $or: [
        { slug },
        { slug: slug.toLowerCase() },
        { slug: new RegExp(`^${slug}$`, 'i') },
      ],
    }).lean();
    if (productDoc) {
      product = JSON.parse(JSON.stringify(productDoc));

      // Safely resolve category — won't throw on string IDs
      if (product.categoryId) {
        try {
          const catId = typeof product.categoryId === 'object'
            ? String(product.categoryId._id || product.categoryId)
            : String(product.categoryId);

          let cat: any = null;
          if (catId.match(/^[a-f\d]{24}$/i)) {
            cat = await Category.findById(catId).lean();
          }
          if (!cat) cat = await Category.findOne({ slug: catId.toLowerCase() }).lean();
          if (!cat) {
            cat = fallbackCategories.find(
              (c: any) => c._id === catId || c.slug === catId.toLowerCase()
            );
          }
          if (cat) {
            product.categoryId = { _id: String(cat._id), name: cat.name, slug: cat.slug };
          } else {
            product.categoryId = { _id: catId, name: 'General', slug: 'general' };
          }
        } catch {}
      }
    }
  } catch (dbError) {
    console.warn('Database error on product detail page for slug:', slug, dbError);
  }

  if (!product) {
    product = fallbackProducts.find((p) => p.slug === slug);
  }

  // Check in-memory vendor products (resilience for memory-only products)
  if (!product && (global as any).globalVendorProducts) {
    for (const list of (global as any).globalVendorProducts.values()) {
      if (Array.isArray(list)) {
        const found = list.find((p: any) => p.slug === slug);
        if (found) { product = found; break; }
      }
    }
  }

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [`${baseUrl}/images/hero_banner.png`],
    description: product.description || product.shortDescription,
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: 'VENTERPRISE',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: 'LKR',
      price: product.retailPrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'VENTERPRISE',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${baseUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${baseUrl}/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <Header />
      <main className="flex-grow py-8">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
