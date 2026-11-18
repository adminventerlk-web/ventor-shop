import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireAdmin } from '@/lib/auth/auth';
import Advertisement from '@/models/Advertisement';
import AdvertisementRequest from '@/models/AdvertisementRequest';

// GET all ads for admin panel with analytics and filtering
export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    if (placement && placement !== 'ALL') {
      query.placement = placement;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search?.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { businessName: { $regex: q, $options: 'i' } },
        { shopName: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    const ads = await Advertisement.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
    const allAds = await Advertisement.find().lean();
    const allRequests = await AdvertisementRequest.find().lean();

    const now = new Date();

    const stats = {
      totalAds: allAds.length,
      activeAds: allAds.filter((a) => a.status === 'ACTIVE').length,
      pausedAds: allAds.filter((a) => a.status === 'PAUSED').length,
      expiredAds: allAds.filter((a) => a.endDate && new Date(a.endDate) < now).length,
      totalRequests: allRequests.length,
      pendingRequests: allRequests.filter((r) => r.status === 'PENDING').length,
      approvedRequests: allRequests.filter((r) => r.status === 'APPROVED').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      ads: ads || [],
    });
  } catch (err: any) {
    console.error('Error in /api/admin/ads GET:', err);
    return NextResponse.json({ error: err.message || 'Unauthorized or server error' }, { status: 500 });
  }
}

// POST: Create a new advertisement manually
export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      businessName,
      shopName,
      shopLogo,
      description,
      tagline,
      images,
      featuredImage,
      destinationUrl,
      ctaText,
      category,
      placement,
      displayOrder,
      startDate,
      endDate,
      offerPill,
      rating,
      badge,
      highlightStat,
      accentColor,
      aspectRatioPreference,
      status,
    } = body;

    const bName = (businessName || shopName || '').trim();
    const adTitle = (title || '').trim();
    const adDesc = (description || tagline || '').trim();

    if (!adTitle || !bName || !adDesc) {
      return NextResponse.json(
        { error: 'Advertisement Title, Business/Shop Name, and Description are required fields.' },
        { status: 400 }
      );
    }

    const imagesArray = Array.isArray(images) && images.length > 0
      ? images
      : ['/images/hero_banner.png'];

    const newAd = await Advertisement.create({
      title: adTitle,
      businessName: bName,
      shopName: bName,
      shopLogo: shopLogo || '',
      description: adDesc,
      tagline: adDesc,
      images: imagesArray,
      featuredImage: featuredImage || imagesArray[0],
      destinationUrl: (destinationUrl || '/virtual-shops').trim(),
      ctaText: (ctaText || 'Visit Shop').trim(),
      ctaLink: (destinationUrl || '/virtual-shops').trim(),
      category: (category || 'General Store').trim(),
      shopCategory: (category || 'General Store').trim(),
      placement: placement || 'HOMEPAGE_FEATURED',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      offerPill: (offerPill || '🔥 Special Promotion').trim(),
      rating: (rating || '4.9 ★ Verified Partner').trim(),
      badge: (badge || 'Official Partner Spotlight').trim(),
      highlightStat: (highlightStat || '50K+ Monthly Shoppers Reached').trim(),
      accentColor: accentColor || '#FFB800',
      aspectRatioPreference: aspectRatioPreference || 'AUTO',
      status: status || 'ACTIVE',
      isActive: status === 'ACTIVE',
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (err: any) {
    console.error('Error in /api/admin/ads POST:', err);
    return NextResponse.json({ error: err.message || 'Failed to create advertisement' }, { status: 500 });
  }
}

// PATCH: Update advertisement, reorder images, update status
export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();
    const { adId, ...updates } = body;

    if (!adId) {
      return NextResponse.json({ error: 'adId is required' }, { status: 400 });
    }

    // Synchronize aliases if passed
    if (updates.businessName) updates.shopName = updates.businessName;
    if (updates.shopName) updates.businessName = updates.shopName;
    if (updates.description) updates.tagline = updates.description;
    if (updates.destinationUrl) updates.ctaLink = updates.destinationUrl;
    if (updates.status) updates.isActive = updates.status === 'ACTIVE';
    if (updates.isActive !== undefined) updates.status = updates.isActive ? 'ACTIVE' : 'PAUSED';

    const updatedAd = await Advertisement.findByIdAndUpdate(adId, updates, { new: true });
    if (!updatedAd) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ad: updatedAd });
  } catch (err: any) {
    console.error('Error in /api/admin/ads PATCH:', err);
    return NextResponse.json({ error: err.message || 'Failed to update advertisement' }, { status: 500 });
  }
}

// DELETE: Delete an advertisement
export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const adId = searchParams.get('id');

    if (!adId) {
      return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    await Advertisement.findByIdAndDelete(adId);
    return NextResponse.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (err: any) {
    console.error('Error in /api/admin/ads DELETE:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete advertisement' }, { status: 500 });
  }
}
