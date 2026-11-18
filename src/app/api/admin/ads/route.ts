import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireAdmin } from '@/lib/auth/auth';
import Ad from '@/models/Ad';

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const ads = await Ad.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ads: ads || [] });
  } catch (err: any) {
    console.error('Error in /api/admin/ads GET:', err);
    return NextResponse.json({ error: err.message || 'Unauthorized or server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      shopName,
      shopCategory,
      tagline,
      badge,
      highlightStat,
      images,
      ctaText,
      ctaLink,
      accentColor,
      offerPill,
      rating,
      isActive,
      displayOrder,
    } = body;

    if (!title || !shopName || !tagline) {
      return NextResponse.json(
        { error: 'Title, Shop Name, and Tagline are required fields.' },
        { status: 400 }
      );
    }

    const imagesArray = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'];

    const newAd = await Ad.create({
      title: title.trim(),
      shopName: shopName.trim(),
      shopCategory: shopCategory?.trim() || 'Partner Merchant',
      tagline: tagline.trim(),
      badge: badge?.trim() || 'Verified Partner Spotlight',
      highlightStat: highlightStat?.trim() || 'Featured Shop Partner',
      images: imagesArray,
      ctaText: ctaText?.trim() || 'Visit Partner Store',
      ctaLink: ctaLink?.trim() || '/virtual-shops',
      accentColor: accentColor?.trim() || '#FFB800',
      offerPill: offerPill?.trim() || '🔥 Verified Partner Store',
      rating: rating?.trim() || '4.9 ★ Verified Partner',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (err: any) {
    console.error('Error in /api/admin/ads POST:', err);
    return NextResponse.json({ error: err.message || 'Failed to create ad' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();
    const { adId, ...updates } = body;

    if (!adId) {
      return NextResponse.json({ error: 'adId is required' }, { status: 400 });
    }

    const updatedAd = await Ad.findByIdAndUpdate(adId, updates, { new: true });
    if (!updatedAd) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ad: updatedAd });
  } catch (err: any) {
    console.error('Error in /api/admin/ads PATCH:', err);
    return NextResponse.json({ error: err.message || 'Failed to update ad' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const adId = searchParams.get('id');

    if (!adId) {
      return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    await Ad.findByIdAndDelete(adId);
    return NextResponse.json({ success: true, message: 'Ad deleted successfully' });
  } catch (err: any) {
    console.error('Error in /api/admin/ads DELETE:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete ad' }, { status: 500 });
  }
}
