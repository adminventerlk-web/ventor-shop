import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { fallbackProducts } from '@/lib/data/fallbackData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    let products: any[] = [];
    let categoriesList: any[] = [];

    try {
      await connectToDatabase();
      const _ = Category;

      // 1. Fetch categories
      const dbCategories = await Category.find({}).sort({ name: 1 }).lean();
      const catMap = new Map();
      dbCategories.forEach((c: any) => {
        catMap.set(String(c._id), c);
        if (c.slug) catMap.set(c.slug, c);
      });

      // 2. Build query for active & featured products
      const query: any = { isActive: true, isFeatured: true };

      if (categorySlug && categorySlug !== 'all') {
        const catDoc = await Category.findOne({ slug: categorySlug });
        if (catDoc) {
          query.$or = [
            { categoryId: catDoc._id },
            { categoryId: String(catDoc._id) },
            { categoryId: categorySlug },
          ];
        } else {
          query.categoryId = categorySlug;
        }
      }

      const dbProducts = await Product.find(query)
        .populate('categoryId', 'name slug')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(30)
        .lean();

      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p: any) => {
          let catObj = p.categoryId;
          if (!catObj || typeof catObj === 'string') {
            const catIdStr = String(catObj || '');
            const matched = catMap.get(catIdStr);
            catObj = matched
              ? { _id: String(matched._id), name: matched.name, slug: matched.slug }
              : { _id: catIdStr || 'general', name: 'General', slug: 'general' };
          } else {
            catObj = {
              _id: String(catObj._id || catObj.id || ''),
              name: catObj.name,
              slug: catObj.slug,
            };
          }

          // Pick badge
          let badge: { label: string; type: 'best_seller' | 'popular' | 'new' } = {
            label: 'Featured',
            type: 'popular',
          };
          if (p.isBestSeller) {
            badge = { label: 'Best Seller', type: 'best_seller' };
          } else if (p.isNewArrival) {
            badge = { label: 'New Arrival', type: 'new' };
          }

          const img =
            Array.isArray(p.images) && p.images.length > 0 && p.images[0]
              ? p.images[0]
              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

          return {
            _id: String(p._id),
            name: p.name,
            slug: p.slug,
            badge,
            description: p.shortDescription || p.description || '',
            price: p.retailPrice || 0,
            rating: 5,
            reviewsCount: 48,
            image: img,
            category: catObj,
            shopName: p.shopName || null,
          };
        });
      }

      // Collect categories present in featured products
      const categoryCounts = new Map<string, { _id: string; name: string; slug: string; count: number }>();
      products.forEach((p) => {
        const cat = p.category;
        if (cat && cat.slug) {
          if (!categoryCounts.has(cat.slug)) {
            categoryCounts.set(cat.slug, { _id: cat._id, name: cat.name, slug: cat.slug, count: 0 });
          }
          categoryCounts.get(cat.slug)!.count += 1;
        }
      });
      categoriesList = Array.from(categoryCounts.values());
    } catch (dbErr) {
      console.warn('Database error fetching featured products:', dbErr);
    }

    // 3. Fallback if no DB featured products exist
    if (products.length === 0) {
      products = fallbackProducts.slice(0, 10).map((fp: any, idx: number) => ({
        _id: String(fp._id || `fallback-${idx}`),
        name: fp.name,
        slug: fp.slug || `prod-${idx}`,
        badge: { label: 'Best Seller', type: 'best_seller' as const },
        description: fp.shortDescription || fp.description || '',
        price: fp.retailPrice || fp.price || 1500,
        rating: 5,
        reviewsCount: 120,
        image: fp.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
        category: { _id: 'cat-groceries', name: 'Groceries', slug: 'groceries' },
        shopName: null,
      }));
    }

    return NextResponse.json({
      success: true,
      categories: categoriesList,
      products,
    });
  } catch (error: any) {
    console.error('Error in /api/products/featured:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}
