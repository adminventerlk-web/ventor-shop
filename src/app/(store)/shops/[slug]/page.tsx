import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShopStorefrontClient from '@/components/storefront/ShopStorefrontClient';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import { getInMemoryShopBySlug, getAllInMemoryShops } from '@/lib/shops/inMemoryShops';
import { fallbackProducts } from '@/lib/data/fallbackData';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase().trim();

  let shopName = 'Verified Partner Store';
  let description = 'Shop quality goods directly from certified merchants on VENTERSHOP.';

  const memShop = getInMemoryShopBySlug(normalizedSlug);
  if (memShop) {
    shopName = memShop.shopName;
    description = memShop.description;
  }

  return {
    title: `${shopName} | VENTERSHOP Sri Lanka`,
    description: description,
  };
}

export async function generateStaticParams() {
  const memShops = getAllInMemoryShops();
  return memShops.map((s) => ({ slug: s.slug }));
}

export default async function ShopDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase().trim();

  let shop: any = null;
  let products: any[] = [];

  try {
    await connectToDatabase();
    const dbShop = await Shop.findOne({ slug: normalizedSlug, status: 'APPROVED' });
    if (dbShop) {
      shop = JSON.parse(JSON.stringify(dbShop));

      const dbProducts = await Product.find({
        $or: [
          { shopSlug: normalizedSlug },
          { vendorId: dbShop.ownerId },
          { shopName: dbShop.shopName },
        ],
        isActive: true,
      }).sort({ createdAt: -1 });

      if (dbProducts && dbProducts.length > 0) {
        products = JSON.parse(JSON.stringify(dbProducts));
      }
    }
  } catch (dbErr) {
    console.warn('DB error in /shops/[slug] page:', dbErr);
  }

  if (!shop) {
    const memShop = getInMemoryShopBySlug(normalizedSlug);
    if (memShop && memShop.status === 'APPROVED') {
      shop = memShop;
    }
  }

  if (!shop) {
    notFound();
  }

  // 1. Check in-memory vendor products if DB returned none
  if (products.length === 0 && (global as any).globalVendorProducts) {
    for (const list of (global as any).globalVendorProducts.values()) {
      if (Array.isArray(list)) {
        const matches = list.filter(
          (p: any) =>
            p.shopSlug?.toLowerCase() === normalizedSlug ||
            p.shopName?.toLowerCase() === shop.shopName?.toLowerCase() ||
            String(p.vendorId) === String(shop.ownerId)
        );
        products.push(...matches);
      }
    }
  }

  // 2. Check fallbackProducts with case-insensitive matching
  if (products.length === 0) {
    products = fallbackProducts.filter(
      (p: any) =>
        p.shopSlug?.toLowerCase() === normalizedSlug ||
        p.shopName?.toLowerCase() === shop.shopName?.toLowerCase() ||
        String(p.vendorId) === String(shop.ownerId)
    );
  }

  // 3. Final safety fallback: show some curated products (without mutating slug!)
  if (products.length === 0) {
    products = fallbackProducts.slice(0, 4).map((p: any) => ({
      ...p,
      shopSlug: shop.slug,
      shopName: shop.shopName,
      vendorId: shop.ownerId,
    }));
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FC]">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin" /></div>}>
          <ShopStorefrontClient shop={shop} initialProducts={products} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

