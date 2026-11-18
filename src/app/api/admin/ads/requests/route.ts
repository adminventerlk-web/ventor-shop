import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { requireAdmin } from '@/lib/auth/auth';
import AdvertisementRequest from '@/models/AdvertisementRequest';
import Advertisement from '@/models/Advertisement';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search?.trim()) {
      const q = search.trim();
      query.$or = [
        { businessName: { $regex: q, $options: 'i' } },
        { ownerName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { trackingCode: { $regex: q, $options: 'i' } },
        { advertisementTitle: { $regex: q, $options: 'i' } },
      ];
    }

    const requests = await AdvertisementRequest.find(query).sort({ createdAt: -1 }).lean();
    const all = await AdvertisementRequest.find().lean();

    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'PENDING').length,
      underReview: all.filter((r) => r.status === 'UNDER_REVIEW').length,
      approved: all.filter((r) => r.status === 'APPROVED' || r.status === 'ACTIVE').length,
      rejected: all.filter((r) => r.status === 'REJECTED').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      requests: requests || [],
    });
  } catch (err: any) {
    console.error('Error in /api/admin/ads/requests GET:', err);
    return NextResponse.json(
      { error: err.message || 'Unauthorized or server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const body = await request.json();
    const { requestId, status, adminFeedback, action, placement, ctaText } = body;

    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
    }

    const reqDoc = await AdvertisementRequest.findById(requestId);
    if (!reqDoc) {
      return NextResponse.json({ error: 'Advertisement request not found' }, { status: 404 });
    }

    // 1. Quick Action: APPROVE AND PUBLISH
    if (action === 'APPROVE_AND_PUBLISH') {
      reqDoc.status = 'APPROVED';
      if (adminFeedback) reqDoc.adminFeedback = adminFeedback.trim();
      await reqDoc.save();

      // Create live advertisement in Advertisement collection
      const newAd = await Advertisement.create({
        requestId: reqDoc._id,
        businessName: reqDoc.businessName,
        shopName: reqDoc.businessName,
        shopLogo: reqDoc.logo || '',
        title: reqDoc.advertisementTitle,
        description: reqDoc.description,
        tagline: reqDoc.description,
        images: reqDoc.images && reqDoc.images.length > 0 ? reqDoc.images : ['/images/hero_banner.png'],
        featuredImage: reqDoc.images?.[0] || '',
        destinationUrl: reqDoc.destinationUrl || '/virtual-shops',
        ctaText: ctaText || 'Visit Shop',
        ctaLink: reqDoc.destinationUrl || '/virtual-shops',
        category: reqDoc.category || 'General Store',
        shopCategory: reqDoc.category || 'General Store',
        placement: placement || reqDoc.preferredPlacement || 'HOMEPAGE_FEATURED',
        displayOrder: 0,
        startDate: reqDoc.requestedStartDate,
        endDate: reqDoc.requestedEndDate,
        badge: 'Official Verified Partner',
        offerPill: '🔥 Special Promotion',
        rating: '4.9 ★ Verified Partner',
        status: 'ACTIVE',
        isActive: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Request approved and published live as an advertisement!',
        request: reqDoc,
        ad: newAd,
      });
    }

    // 2. Standard status/feedback update
    if (status) {
      reqDoc.status = status;
    }
    if (adminFeedback !== undefined) {
      reqDoc.adminFeedback = adminFeedback.trim();
    }
    await reqDoc.save();

    return NextResponse.json({
      success: true,
      message: `Request status updated to ${reqDoc.status}.`,
      request: reqDoc,
    });
  } catch (err: any) {
    console.error('Error in /api/admin/ads/requests PATCH:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');

    if (!requestId) {
      return NextResponse.json({ error: 'id parameter is required' }, { status: 400 });
    }

    await AdvertisementRequest.findByIdAndDelete(requestId);
    return NextResponse.json({ success: true, message: 'Request deleted successfully' });
  } catch (err: any) {
    console.error('Error in /api/admin/ads/requests DELETE:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete request' },
      { status: 500 }
    );
  }
}
