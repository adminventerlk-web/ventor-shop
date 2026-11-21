import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth/auth';
import { fallbackProducts, fallbackCategories } from '@/lib/data/fallbackData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categorySlug = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'newest';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;

    try {
      await connectToDatabase();

      // Get active user to determine correct pricing field for filtering/sorting
      const user = await getCurrentUser();
      const customerType = user ? user.customerType : 'NORMAL';

      // 1. Build Query Filter
      const queryFilter: any = { isActive: true };

      // Search query matches name, SKU, or description
      if (q) {
        const searchRegex = new RegExp(q.trim(), 'i');
        queryFilter.$or = [
          { name: searchRegex },
          { sku: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex },
        ];
      }

      // Filter by Category Slug
      if (categorySlug && categorySlug !== 'all') {
        const categoryDoc = await Category.findOne({ slug: categorySlug });
        if (categoryDoc) {
          const catIdStr = String(categoryDoc._id);
          queryFilter.$or = [
            { categoryId: categoryDoc._id },
            { categoryId: catIdStr },
            { categoryId: categorySlug },
          ];
        } else {
          queryFilter.$or = [
            { categoryId: categorySlug },
          ];
        }
      }

      // Filter by Stock Status
      if (inStock === 'true') {
        queryFilter.stock = { $gt: 0 };
      }

      // Determine target price field for this customer type
      let priceField = 'retailPrice';
      if (customerType === 'WHOLESALE') {
        priceField = 'wholesalePrice';
      } else if (customerType === 'COMMUNITY') {
        priceField = 'communityPrice';
      }

      if (minPrice || maxPrice) {
        queryFilter[priceField] = {};
        if (minPrice) {
          queryFilter[priceField].$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          queryFilter[priceField].$lte = parseFloat(maxPrice);
        }
      }

      let sortOptions: any = {};
      if (sort === 'price-asc') {
        sortOptions[priceField] = 1;
      } else if (sort === 'price-desc') {
        sortOptions[priceField] = -1;
      } else if (sort === 'newest') {
        sortOptions.createdAt = -1;
      } else if (sort === 'bestselling') {
        sortOptions.isBestSeller = -1;
        sortOptions.createdAt = -1;
      } else if (sort === 'popular') {
        sortOptions.isFeatured = -1;
        sortOptions.createdAt = -1;
      } else {
        sortOptions.createdAt = -1;
      }

      let query = Product.find(queryFilter)
        .lean()
        .sort(sortOptions);

      if (limit) {
        query = query.limit(limit);
      }

      const dbProducts: any[] = await query;
      if (dbProducts && dbProducts.length > 0) {
        // Build category resolution map to safely populate categoryId without CastError
        const catMap = new Map<string, any>();
        try {
          const categories = await Category.find({}).lean();
          categories.forEach((cat: any) => {
            catMap.set(String(cat._id), { _id: cat._id, name: cat.name, slug: cat.slug });
            catMap.set(cat.slug, { _id: cat._id, name: cat.name, slug: cat.slug });
          });
        } catch {}
        fallbackCategories.forEach((cat: any) => {
          if (!catMap.has(cat._id)) catMap.set(cat._id, cat);
          if (!catMap.has(cat.slug)) catMap.set(cat.slug, cat);
        });

        // Resolve category on each product
        dbProducts.forEach((p: any) => {
          if (p.categoryId) {
            if (typeof p.categoryId === 'object' && p.categoryId.name) {
              // already populated
            } else {
              const key = String(p.categoryId._id || p.categoryId).trim();
              p.categoryId = catMap.get(key) || catMap.get(key.toLowerCase()) || { _id: key, name: 'General', slug: 'general' };
            }
          }
        });

        // Merge in-memory vendor products so vendor items also appear in the main catalog
        if ((global as any).globalVendorProducts) {
          for (const list of (global as any).globalVendorProducts.values()) {
            if (Array.isArray(list)) {
              for (const vp of list) {
                if (!dbProducts.some((p: any) => String(p._id) === String(vp._id) || p.slug === vp.slug)) {
                  let vpCat = vp.categoryId;
                  if (typeof vpCat !== 'object' || !vpCat?.name) {
                    const key = String(vpCat?._id || vpCat || '').trim();
                    vpCat = catMap.get(key) || catMap.get(key.toLowerCase()) || { _id: key, name: 'General', slug: 'general' };
                  }
                  dbProducts.unshift({ ...vp, categoryId: vpCat });
                }
              }
            }
          }
        }

        return NextResponse.json({ products: dbProducts });
      }
    } catch (dbError) {
      console.warn('Database error or offline, serving fallback products:', dbError);
    }

    // Serve fallback products merged with any in-memory vendor products
    let filtered: any[] = [...fallbackProducts];
    if ((global as any).globalVendorProducts) {
      for (const list of (global as any).globalVendorProducts.values()) {
        if (Array.isArray(list)) {
          for (const vp of list) {
            if (!filtered.some((p) => String(p._id) === String(vp._id) || p.slug === vp.slug)) {
              filtered.unshift(vp);
            }
          }
        }
      }
    }

    if (categorySlug && categorySlug !== 'all') {
      filtered = filtered.filter((p) => p.categoryId?.slug === categorySlug);
    }
    if (q) {
      const lowerQ = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.sku.toLowerCase().includes(lowerQ) ||
          p.description.toLowerCase().includes(lowerQ)
      );
    }
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ products: fallbackProducts });
  }
}
