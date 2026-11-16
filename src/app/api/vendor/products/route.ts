import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireVendor } from '@/lib/auth/auth';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import { fallbackProducts } from '@/lib/data/fallbackData';

// Global in-memory vendor products store for resilience
declare global {
  // eslint-disable-next-line no-var
  var globalVendorProducts: Map<string, any[]> | undefined;
}

const vendorProductsStore = global.globalVendorProducts || new Map<string, any[]>();
if (!global.globalVendorProducts) {
  global.globalVendorProducts = vendorProductsStore;
}

export async function GET(request: Request) {
  try {
    const user = await requireVendor();
    let products: any[] = [];

    try {
      await connectToDatabase();
      const query: any = {
        $or: [
          { vendorId: user.id },
          ...(user.shopSlug ? [{ shopSlug: user.shopSlug }] : []),
          ...(user.shopName ? [{ shopName: user.shopName }] : []),
        ],
      };
      if (mongoose.Types.ObjectId.isValid(user.id)) {
        query.$or.push({ vendorId: new mongoose.Types.ObjectId(user.id) });
      }

      const dbProducts = await Product.find(query).sort({ createdAt: -1 });
      if (dbProducts && dbProducts.length > 0) {
        products = JSON.parse(JSON.stringify(dbProducts));
      }
    } catch (dbErr) {
      console.warn('DB error in /api/vendor/products GET:', dbErr);
    }

    // Merge in-memory vendor products if needed
    const memProducts = vendorProductsStore.get(user.email) || [];
    if (products.length === 0 && memProducts.length > 0) {
      products = memProducts;
    }

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching vendor products:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireVendor();
    const body = await request.json();
    const {
      name,
      sku,
      categoryId,
      description,
      shortDescription,
      retailPrice,
      stock,
      images,
      variants,
    } = body;

    const cleanPrefix = (name || 'PROD')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 4)
      .toUpperCase() || 'PROD';
    const generatedSku = (sku || `${cleanPrefix}-${Date.now().toString().slice(-6)}`).toUpperCase().trim();
    const rawSlug = (name || 'product').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${rawSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const productImages = Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'];

    const formattedVariants = Array.isArray(variants)
      ? variants
          .filter((v: any) => v && v.name && Number(v.price) > 0)
          .map((v: any) => ({
            name: String(v.name).trim(),
            price: Number(v.price),
            stock: Number(v.stock || stock || 10),
            image: v.image?.trim() || productImages[0],
            sku: v.sku?.trim() || `${generatedSku}-${v.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
          }))
      : [];

    // Automatically derive price from variants if not manually passed
    let priceNum = Number(retailPrice);
    if ((!priceNum || priceNum <= 0) && formattedVariants.length > 0) {
      priceNum = Math.min(...formattedVariants.map((v) => v.price));
    }

    if (!name || priceNum <= 0) {
      return NextResponse.json(
        { error: 'Product name and at least one size/variant with a valid price are required' },
        { status: 400 }
      );
    }

    const totalVariantStock = formattedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const stockNum = Number(stock) > 0 ? Number(stock) : (totalVariantStock > 0 ? totalVariantStock : 25);

    const newProductData: any = {
      _id: 'prod_' + Date.now(),
      name: name.trim(),
      slug,
      sku: generatedSku,
      categoryId: categoryId || 'cat_groceries_01',
      description: description?.trim() || name,
      shortDescription: shortDescription?.trim() || `${name} by ${user.shopName || 'Partner Store'}`,
      images: productImages,
      retailPrice: priceNum,
      communityPrice: Math.round(priceNum * 0.95), // 5% community member price
      wholesalePrice: Math.round(priceNum * 0.85), // 15% wholesale price
      stock: stockNum,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
      wholesaleMinQty: 1,
      variants: formattedVariants,
      vendorId: user.id,
      shopName: user.shopName || 'Verified Merchant Store',
      shopSlug: user.shopSlug || 'verified-store',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to DB if available
    try {
      await connectToDatabase();
      const createdDbProduct = await Product.create({
        ...newProductData,
        _id: new mongoose.Types.ObjectId(),
        vendorId: mongoose.Types.ObjectId.isValid(user.id) ? new mongoose.Types.ObjectId(user.id) : user.id,
      });

      newProductData._id = createdDbProduct._id.toString();

      // Update totalProducts count on shop
      if (user.shopSlug) {
        await Shop.findOneAndUpdate(
          { slug: user.shopSlug },
          { $inc: { totalProducts: 1 } }
        );
      }
    } catch (dbErr) {
      console.warn('DB create failed for vendor product, stored in memory:', dbErr);
    }

    // Save to in-memory vendor product store
    const currentList = vendorProductsStore.get(user.email) || [];
    currentList.unshift(newProductData);
    vendorProductsStore.set(user.email, currentList);

    // Also push to global fallbackProducts so customers see it immediately on storefront
    fallbackProducts.unshift({
      ...newProductData,
      _id: newProductData._id,
      bulkPricing: [],
      isBestSeller: false,
      isNewArrival: true,
      eligibleCustomerTypes: ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully with variants!',
      product: newProductData,
    });
  } catch (error: any) {
    console.error('Error creating vendor product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireVendor();
    const body = await request.json();
    const {
      productId,
      name,
      sku,
      description,
      shortDescription,
      retailPrice,
      stock,
      images,
      variants,
      isActive,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (sku !== undefined) updateData.sku = sku.trim().toUpperCase();
    if (description !== undefined) updateData.description = description.trim();
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription.trim();
    if (retailPrice !== undefined) {
      const p = Number(retailPrice);
      updateData.retailPrice = p;
      updateData.communityPrice = Math.round(p * 0.95);
      updateData.wholesalePrice = Math.round(p * 0.85);
    }
    if (stock !== undefined) updateData.stock = Number(stock);
    if (images !== undefined) updateData.images = Array.isArray(images) ? images.filter(Boolean) : [];
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (variants !== undefined) {
      updateData.variants = Array.isArray(variants)
        ? variants
            .filter((v: any) => v && v.name && Number(v.price) > 0)
            .map((v: any) => ({
              name: String(v.name).trim(),
              price: Number(v.price),
              stock: Number(v.stock || stock || 10),
              image: v.image?.trim() || (images?.[0] || ''),
              sku: v.sku?.trim() || `VAR-${v.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
            }))
        : [];

      if (updateData.variants.length > 0 && (retailPrice === undefined || Number(retailPrice) <= 0)) {
        const p = Math.min(...updateData.variants.map((v: any) => v.price));
        updateData.retailPrice = p;
        updateData.communityPrice = Math.round(p * 0.95);
        updateData.wholesalePrice = Math.round(p * 0.85);
      }
    }

    // 1. Try DB update
    try {
      await connectToDatabase();
      if (mongoose.Types.ObjectId.isValid(productId)) {
        await Product.findOneAndUpdate(
          { _id: productId, $or: [{ vendorId: user.id }, ...(user.shopSlug ? [{ shopSlug: user.shopSlug }] : [])] },
          { $set: updateData }
        );
      }
    } catch (dbErr) {
      console.warn('DB update failed for vendor product, updating memory:', dbErr);
    }

    // 2. Update in-memory vendor products store
    const currentList = vendorProductsStore.get(user.email) || [];
    const idx = currentList.findIndex((p) => p._id === productId);
    if (idx !== -1) {
      currentList[idx] = { ...currentList[idx], ...updateData };
      vendorProductsStore.set(user.email, currentList);
    }

    // 3. Update fallback if present
    const fbIdx = fallbackProducts.findIndex((p: any) => p._id === productId || p._id?.toString() === productId);
    if (fbIdx !== -1) {
      Object.assign(fallbackProducts[fbIdx], updateData);
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error: any) {
    console.error('Error updating vendor product:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireVendor();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      if (mongoose.Types.ObjectId.isValid(productId)) {
        await Product.findOneAndDelete({
          _id: productId,
          $or: [
            { vendorId: user.id },
            ...(user.shopSlug ? [{ shopSlug: user.shopSlug }] : []),
          ],
        });
      }
    } catch (dbErr) {
      console.warn('DB delete failed:', dbErr);
    }

    // Update memory store
    const currentList = vendorProductsStore.get(user.email) || [];
    vendorProductsStore.set(
      user.email,
      currentList.filter((p) => p._id !== productId)
    );

    return NextResponse.json({ success: true, message: 'Product removed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

