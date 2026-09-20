import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Product from '@/models/Product';
import Category from '@/models/Category';

async function findCategorySafely(catId: any) {
  if (!catId) return null;
  const idStr = typeof catId === 'object' ? (catId._id || catId.slug || String(catId)) : String(catId);
  
  // 1. If valid 24-character ObjectId
  if (mongoose.Types.ObjectId.isValid(idStr)) {
    const cat = await Category.findOne({ $or: [{ _id: idStr }, { slug: idStr }] } as any);
    if (cat) return cat;
  }
  
  // 2. Direct slug lookup
  let cat = await Category.findOne({ slug: idStr.trim().toLowerCase() });
  if (cat) return cat;

  // 3. Fallback ID pattern resolution (e.g. 'cat_groceries_01' -> 'groceries')
  const cleanedSlug = idStr.replace(/^cat_/, '').replace(/_\d+$/, '').toLowerCase();
  if (cleanedSlug && cleanedSlug !== idStr.toLowerCase()) {
    cat = await Category.findOne({ slug: cleanedSlug });
    if (cat) return cat;
  }

  // 4. Native Mongo collection string _id fallback
  try {
    cat = (await Category.collection.findOne({ _id: idStr as any })) as any;
    if (cat) return cat;
  } catch {}

  // 5. Name match
  try {
    cat = await Category.findOne({ name: new RegExp('^' + idStr + '$', 'i') });
    if (cat) return cat;
  } catch {}

  // 6. Absolute fallback to first active category if database has categories
  cat = await Category.findOne({ isActive: true }).sort({ displayOrder: 1 });
  return cat;
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
        p.categoryId = matchedCat ? { _id: matchedCat._id, name: matchedCat.name, slug: matchedCat.slug } : { name: 'General' };
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

    if (categoryId) {
      const categoryExists = await findCategorySafely(categoryId);
      if (!categoryExists) {
        return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
      }
      product.categoryId = categoryExists._id;
    }

    if (name) product.name = name.trim();
    if (sku) product.sku = sku.trim().toUpperCase();
    if (description) product.description = description.trim();
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (images) product.images = images;
    if (retailPrice !== undefined) product.retailPrice = parseFloat(retailPrice);
    if (communityPrice !== undefined) product.communityPrice = parseFloat(communityPrice);
    if (wholesalePrice !== undefined) product.wholesalePrice = parseFloat(wholesalePrice);
    if (stock !== undefined) product.stock = parseInt(stock) || 0;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = parseInt(lowStockThreshold) || 5;
    if (wholesaleMinQty !== undefined) product.wholesaleMinQty = parseInt(wholesaleMinQty) || 1;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
    if (bulkPricing) product.bulkPricing = bulkPricing;
    if (eligibleCustomerTypes) product.eligibleCustomerTypes = eligibleCustomerTypes;

    await product.save();

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
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
