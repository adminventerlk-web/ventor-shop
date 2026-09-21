import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Product from '@/models/Product';
import Category from '@/models/Category';

async function findCategorySafely(catId: any) {
  if (!catId) return null;
  const idStr = typeof catId === 'object' ? (catId._id || catId.slug || String(catId)) : String(catId).trim();
  
  if (mongoose.Types.ObjectId.isValid(idStr)) {
    const cat = await Category.findOne({ $or: [{ _id: idStr }, { slug: idStr }] } as any);
    if (cat) return cat;
  }
  
  let cat = await Category.findOne({ slug: idStr.toLowerCase() });
  if (cat) return cat;

  const cleanedSlug = idStr.replace(/^cat_/, '').replace(/_\d+$/, '').toLowerCase();
  if (cleanedSlug && cleanedSlug !== idStr.toLowerCase()) {
    cat = await Category.findOne({ slug: cleanedSlug });
    if (cat) return cat;
  }

  try {
    cat = (await Category.collection.findOne({ _id: idStr as any })) as any;
    if (cat) return cat;
  } catch {}

  try {
    cat = (await Category.collection.findOne({ slug: idStr.toLowerCase() })) as any;
    if (cat) return cat;
  } catch {}

  try {
    cat = await Category.findOne({ name: new RegExp('^' + idStr + '$', 'i') });
    if (cat) return cat;
  } catch {}

  // Fallback: search by matching string representation of _id or slug
  try {
    const all = await Category.find({}).lean();
    const matched = all.find((c: any) => String(c._id) === idStr || String(c.slug).toLowerCase() === idStr.toLowerCase());
    if (matched) return matched;
  } catch {}

  return null;
}

// 1. GET: Fetch all products for admin grid
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure Category model is explicitly evaluated in Mongoose schema registry
    const _ = Category;

    let products = await Product.find()
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    // Map unpopulated string category IDs if any exist
    const allCategories = await Category.find({}).lean();
    const catMap = new Map();
    allCategories.forEach((c: any) => {
      catMap.set(String(c._id), c);
      if (c.slug) catMap.set(c.slug, c);
    });

    products = products.map((p: any) => {
      if (!p.categoryId || typeof p.categoryId === 'string') {
        const catIdStr = String(p.categoryId || '');
        const matchedCat = catMap.get(catIdStr) || catMap.get(catIdStr.replace(/^cat_/, '').replace(/_\d+$/, ''));
        p.categoryId = matchedCat
          ? { _id: String(matchedCat._id), name: matchedCat.name, slug: matchedCat.slug }
          : { _id: catIdStr, name: 'General', slug: 'general' };
      } else if (p.categoryId && typeof p.categoryId === 'object') {
        p.categoryId = {
          _id: String(p.categoryId._id || p.categoryId.id || ''),
          name: p.categoryId.name,
          slug: p.categoryId.slug,
        };
      }
      return p;
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// 2. POST: Create a new product
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      images,
      retailPrice,
      communityPrice,
      wholesalePrice,
      stock,
      lowStockThreshold,
      wholesaleMinQty,
      categoryId,
      isActive,
      isFeatured,
      isBestSeller,
      isNewArrival,
      bulkPricing,
      eligibleCustomerTypes,
    } = body;

    const targetCatId = typeof categoryId === 'object' && categoryId ? (categoryId._id || categoryId.slug) : categoryId;
    if (!name || !slug || !sku || !description || retailPrice === undefined || !targetCatId || String(targetCatId).trim() === '') {
      return NextResponse.json({ error: 'Please fill in all required fields (Name, Slug, SKU, Description, Retail Price, and Category)' }, { status: 400 });
    }

    // Verify category exists
    const categoryExists = await findCategorySafely(targetCatId);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Selected Category does not exist in database' }, { status: 400 });
    }

    // Ensure slug uniqueness automatically if collision occurs
    let finalSlug = slug.trim().toLowerCase();
    const slugExists = await Product.findOne({ slug: finalSlug });
    if (slugExists) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Ensure SKU uniqueness automatically if collision occurs
    let finalSku = sku.trim().toUpperCase();
    const skuExists = await Product.findOne({ sku: finalSku });
    if (skuExists) {
      finalSku = `${finalSku}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newProduct = await Product.create({
      name: name.trim(),
      slug: finalSlug,
      sku: finalSku,
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      images: images || [],
      retailPrice: parseFloat(retailPrice),
      communityPrice: communityPrice !== undefined ? parseFloat(communityPrice) : parseFloat(retailPrice),
      wholesalePrice: wholesalePrice !== undefined ? parseFloat(wholesalePrice) : parseFloat(retailPrice),
      stock: parseInt(stock) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      wholesaleMinQty: wholesaleMinQty !== undefined ? parseInt(wholesaleMinQty) : 1,
      categoryId: categoryExists._id,
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      isBestSeller: isBestSeller ?? false,
      isNewArrival: isNewArrival ?? false,
      bulkPricing: bulkPricing || [],
      eligibleCustomerTypes: eligibleCustomerTypes || ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

// 3. PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId,
      name,
      slug,
      sku,
      description,
      shortDescription,
      images,
      retailPrice,
      communityPrice,
      wholesalePrice,
      stock,
      lowStockThreshold,
      wholesaleMinQty,
      categoryId,
      isActive,
      isFeatured,
      isBestSeller,
      isNewArrival,
      bulkPricing,
      eligibleCustomerTypes,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let product: any = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      try {
        product = await Product.collection.findOne({ _id: productId as any });
      } catch {}
    }
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify slug uniqueness if slug changed
    if (slug && slug.trim().toLowerCase() !== product.slug) {
      let finalSlug = slug.trim().toLowerCase();
      const slugExists = await Product.findOne({ slug: finalSlug });
      if (slugExists && slugExists._id.toString() !== product._id.toString()) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
      product.slug = finalSlug;
    }

    if (sku && sku.trim().toUpperCase() !== product.sku) {
      let finalSku = sku.trim().toUpperCase();
      const skuExists = await Product.findOne({ sku: finalSku });
      if (skuExists && skuExists._id.toString() !== product._id.toString()) {
        finalSku = `${finalSku}-${Math.floor(100 + Math.random() * 900)}`;
      }
      product.sku = finalSku;
    }

    const updateData: any = {};
    if (categoryId) {
      const categoryExists = await findCategorySafely(categoryId);
      if (!categoryExists) {
        return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
      }
      updateData.categoryId = categoryExists._id;
    }

    if (name) updateData.name = name.trim();
    if (sku) updateData.sku = sku.trim().toUpperCase();
    if (description) updateData.description = description.trim();
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription.trim();
    if (images) updateData.images = images;
    if (retailPrice !== undefined) updateData.retailPrice = parseFloat(retailPrice);
    if (communityPrice !== undefined) updateData.communityPrice = parseFloat(communityPrice);
    if (wholesalePrice !== undefined) updateData.wholesalePrice = parseFloat(wholesalePrice);
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold) || 5;
    if (wholesaleMinQty !== undefined) updateData.wholesaleMinQty = parseInt(wholesaleMinQty) || 1;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller;
    if (isNewArrival !== undefined) updateData.isNewArrival = isNewArrival;
    if (bulkPricing) updateData.bulkPricing = bulkPricing;
    if (eligibleCustomerTypes) updateData.eligibleCustomerTypes = eligibleCustomerTypes;

    await Product.collection.updateOne({ _id: product._id }, { $set: updateData });

    const updatedProduct = await Product.findOne({ _id: product._id }).populate('categoryId', 'name slug').lean();

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct || product,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// 4. DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
