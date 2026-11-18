import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Advertisement from '@/models/Advertisement';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const category = searchParams.get('category');
    const now = new Date();

    const query: any = {
      $or: [
        { status: 'ACTIVE' },
        { isActive: true },
      ],
    };

    // Filter by placement if specified
    if (placement && placement !== 'ALL') {
      query.placement = placement;
    }

    // Filter by category if specified
    if (category && category !== 'ALL') {
      query.$or = [{ category }, { shopCategory: category }];
    }

    // Filter scheduled/expired ads:
    // 1. If startDate is set, must be in the past or now
    // 2. If endDate is set, must be in the future or now
    query.$and = [
      {
        $or: [
          { startDate: { $exists: false } },
          { startDate: null },
          { startDate: { $lte: now } },
        ],
      },
      {
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: now } },
        ],
      },
    ];

    const ads = await Advertisement.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: ads ? ads.length : 0,
      ads: ads || [],
    });
  } catch (err: any) {
    console.error('Error in /api/ads GET:', err);
    return NextResponse.json({ success: true, count: 0, ads: [] }, { status: 200 });
  }
}
