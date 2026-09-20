import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { fallbackProducts } from '@/lib/data/fallbackData';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ventershop.vercel.app';

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    let product: any = null;

    try {
      await connectToDatabase();
      product = await Product.findOne({ slug, isActive: true });
    } catch {
      product = fallbackProducts.find((p) => p.slug === slug);
    }
    
    if (!product) {
      return {
        title: 'Product Details - VENTERSHOP',
        description: 'Browse quality groceries, animal feed, books, and daily essentials at VENTERSHOP.',
      };
    }

    const description = product.shortDescription || product.description.substring(0, 160);
    const image = product.images && product.images.length > 0 ? product.images[0] : '/images/hero_banner.png';

    return {
      title: `${product.name} | VENTERSHOP Sri Lanka`,
      description: description,
      keywords: [product.name, 'VENTERSHOP Product', 'Online Shopping Sri Lanka', product.sku || 'E-Commerce SKU'],
      alternates: {
        canonical: `/product/${slug}`,
      },
      openGraph: {
        title: product.name,
        description: description,
        url: `${baseUrl}/product/${slug}`,
        siteName: 'VENTERSHOP',
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
      title: 'Product Details - VENTERSHOP',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;

  try {
    await connectToDatabase();
    const productDoc = await Product.findOne({ slug, isActive: true }).populate('categoryId', 'name slug');
    if (productDoc) {
      product = JSON.parse(JSON.stringify(productDoc));
    }
  } catch (dbError) {
    console.warn('Database offline, looking up fallback product for slug:', slug);
  }

  if (!product) {
    product = fallbackProducts.find((p) => p.slug === slug);
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
      name: 'VENTERSHOP',
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
        name: 'VENTERSHOP',
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
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow py-8">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
