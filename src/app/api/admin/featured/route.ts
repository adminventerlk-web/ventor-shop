import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Product from '@/models/Product';
import Category from '@/models/Category';

const MAX_FEATURED_PER_CATEGORY = 10;

// 1. GET: Fetch categories with their featured products and counts
export async function GET() {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Evaluate Category schema
    const _ = Category;

    const categories = await Category.find({}).sort({ name: 1 }).lean();
    const allProducts = await Product.find({})
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    // Map unpopulated string category IDs if any exist
    const catMap = new Map();
    categories.forEach((c: any) => {
      catMap.set(String(c._id), c);
      if (c.slug) catMap.set(c.slug, c);
    });

    const sanitizedProducts = allProducts.map((p: any) => {
      let catObj = p.categoryId;
      if (!catObj || typeof catObj === 'string') {
        const catIdStr = String(catObj || '');
        const matched = catMap.get(catIdStr) || catMap.get(catIdStr.replace(/^cat_/, '').replace(/_\d+$/, ''));
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

      return {
        _id: String(p._id),
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        retailPrice: p.retailPrice,
        images: p.images || [],
        stock: p.stock || 0,
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured ?? false,
        categoryId: catObj,
        vendorId: p.vendorId ? String(p.vendorId) : null,
        shopName: p.shopName || null,
        source: p.vendorId ? 'vendor' : 'admin',
      };
    });

    // Group counts by category
    const categoryStats: Record<string, { total: number; featured: number }> = {};
    categories.forEach((c: any) => {
      categoryStats[String(c._id)] = { total: 0, featured: 0 };
    });

    sanitizedProducts.forEach((p: any) => {
      const catId = String(p.categoryId?._id || '');
      if (!categoryStats[catId]) {
        categoryStats[catId] = { total: 0, featured: 0 };
      }
      categoryStats[catId].total += 1;
      if (p.isFeatured) {
        categoryStats[catId].featured += 1;
      }
    });

    return NextResponse.json({
      success: true,
      maxAllowedPerCategory: MAX_FEATURED_PER_CATEGORY,
      categories: categories.map((c: any) => ({
        _id: String(c._id),
        name: c.name,
        slug: c.slug,
        stats: categoryStats[String(c._id)] || { total: 0, featured: 0 },
      })),
      products: sanitizedProducts,
    });
  } catch (error: any) {
    console.error('Error fetching admin featured products:', error);
    return NextResponse.json({ error: 'Failed to fetch featured data' }, { status: 500 });
  }
}

// 2. PATCH: Toggle isFeatured status with 10 products per category limit enforcement
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, isFeatured } = body;

    if (!productId || typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request. "productId" and "isFeatured" (boolean) are required.' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // If enabling featured, check maximum 10 limit for this category
    if (isFeatured) {
      const catId = product.categoryId;
      const catQuery: any[] = [{ categoryId: catId }];
      if (mongoose.Types.ObjectId.isValid(String(catId))) {
        catQuery.push({ categoryId: new mongoose.Types.ObjectId(String(catId)) });
        catQuery.push({ categoryId: String(catId) });
      }

      const currentFeaturedCount = await Product.countDocuments({
        _id: { $ne: product._id },
        isFeatured: true,
        $or: catQuery,
      });

      if (currentFeaturedCount >= MAX_FEATURED_PER_CATEGORY) {
        return NextResponse.json(
          {
            error: `Category limit reached! A maximum of ${MAX_FEATURED_PER_CATEGORY} products can be featured in this category. Please unfeature another product first.`,
          },
          { status: 400 }
        );
      }
    }

    product.isFeatured = isFeatured;
    await product.save();

    return NextResponse.json({
      success: true,
      message: isFeatured ? 'Product added to Featured list.' : 'Product removed from Featured list.',
      productId: String(product._id),
      isFeatured: product.isFeatured,
    });
  } catch (error: any) {
    console.error('Error updating product featured status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update featured status' },
      { status: 500 }
    );
  }
}
