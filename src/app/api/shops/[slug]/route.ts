import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import { getInMemoryShopBySlug } from '@/lib/shops/inMemoryShops';
import { fallbackProducts } from '@/lib/data/fallbackData';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const normalizedSlug = slug.toLowerCase().trim();

    let shop: any = null;
    let products: any[] = [];

    try {
      await connectToDatabase();
      const dbShop = await Shop.findOne({ slug: normalizedSlug, status: 'APPROVED' });
      if (dbShop) {
        shop = JSON.parse(JSON.stringify(dbShop));

        // Find products for this shop
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
      console.warn('DB error in /api/shops/[slug]:', dbErr);
    }

    // Fallback to in-memory store
    if (!shop) {
      const memShop = getInMemoryShopBySlug(normalizedSlug);
      if (memShop && memShop.status === 'APPROVED') {
        shop = memShop;
      }
    }

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found or not approved' }, { status: 404 });
    }

    // If no products found in DB, search fallbackProducts
    if (products.length === 0) {
      products = fallbackProducts.filter(
        (p: any) =>
          p.shopSlug === normalizedSlug ||
          p.shopName === shop.shopName ||
          p.vendorId === shop.ownerId
      );
    }

    return NextResponse.json({
      success: true,
      shop,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching shop by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch shop details' }, { status: 500 });
  }
}

