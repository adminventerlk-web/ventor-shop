import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Category from '@/models/Category';
import Product from '@/models/Product';

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

// 1. POST: Create a new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, icon, image, displayOrder, isActive } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check slug uniqueness automatically
    let finalSlug = slug.trim().toLowerCase();
    const slugExists = await Category.findOne({ slug: finalSlug });
    if (slugExists) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      icon: icon || 'Layers',
      image: image || '',
      displayOrder: parseInt(displayOrder) || 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

// 2. PUT: Update an existing category
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { categoryId, name, slug, icon, image, displayOrder, isActive } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await findCategorySafely(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (icon) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder) || 0;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check slug uniqueness if it changed
    if (slug && slug.trim().toLowerCase() !== category.slug) {
      let finalSlug = slug.trim().toLowerCase();
      const slugExists = await Category.findOne({ slug: finalSlug });
      if (slugExists && String(slugExists._id) !== String(category._id)) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
      updateData.slug = finalSlug;
    }

    await Category.collection.updateOne({ _id: category._id }, { $set: updateData });

    const updatedCategory = await Category.findOne({ _id: category._id }).lean();

    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory || category,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

// 3. DELETE: Delete a category (with safety check)
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await findCategorySafely(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Safety Constraint: Check if active products belong to this category
    const productsCount = await Product.countDocuments({
      $or: [{ categoryId: category._id }, { categoryId: category.slug }, { categoryId: categoryId }]
    });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category "${category.name}". ${productsCount} product(s) are categorized under it. Re-assign or delete those products first.` },
        { status: 400 }
      );
    }

    await Category.deleteOne({ _id: category._id });

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
